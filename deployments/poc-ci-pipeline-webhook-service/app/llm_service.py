"""LLM service using OpenAI Chat Completions over HTTP (no openai SDK — avoids import / Responses issues)."""

import json
import logging
from typing import Any, Dict

import requests

from app.config import Config
from app.models import LLMAnalysis, ParsedError

logger = logging.getLogger(__name__)

OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions"
OPENAI_TIMEOUT_SEC = 120.0

# Plain "gpt-4" / "gpt-4-0613" often 404 on default keys; map to a widely available chat model.
_LEGACY_CHAT_MODELS = frozenset({"gpt-4", "gpt-4-0613"})


def _raise_for_openai_status(http: requests.Response) -> None:
    """Raise RuntimeError with OpenAI's error body; never rely on generic HTTPError text alone."""
    if http.ok:
        return
    code: str | None = None
    message = f"HTTP {http.status_code}"
    detail_log: Any = message
    try:
        body = http.json()
        detail_log = body
        err = body.get("error")
        if isinstance(err, dict):
            code = err.get("code") or err.get("type")
            if err.get("message"):
                message = str(err["message"])
    except Exception:
        message = (http.text or "")[:800] or message
        detail_log = message

    logger.error("OpenAI chat.completions HTTP %s: %s", http.status_code, detail_log)

    suffix = ""
    if code == "insufficient_quota":
        suffix = (
            " Billing: https://platform.openai.com/account/billing — add credits or a "
            "payment method, or use an API key from an org with an active plan."
        )

    if code:
        raise RuntimeError(f"OpenAI ({code}): {message}.{suffix}")
    raise RuntimeError(f"OpenAI: {message}.{suffix}")


class LLMService:
    """POST /v1/chat/completions — same idea as `client.chat.completions.create` without the SDK."""

    def __init__(self) -> None:
        self.api_key = Config.OPENAI_API_KEY
        self.model = Config.OPENAI_MODEL.strip()
        if self.model.lower() in {m.lower() for m in _LEGACY_CHAT_MODELS}:
            logger.info(
                "OPENAI_MODEL=%s is often unavailable; using gpt-4o for chat completions",
                self.model,
            )
            self.model = "gpt-4o"
        self.temperature = Config.OPENAI_TEMPERATURE

    def generate_fix(
        self,
        error_log: str,
        parsed_error: ParsedError,
        relevant_files: Dict[str, str],
        repo_name: str,
        branch: str,
    ) -> LLMAnalysis:
        """
        Generate a fix for the pipeline failure using LLM.

        Args:
            error_log: Raw error log
            parsed_error: Parsed error information
            relevant_files: Dictionary of file paths to their content
            repo_name: Repository name
            branch: Branch name

        Returns:
            LLMAnalysis with fix details

        Raises:
            Exception: If LLM call fails
        """
        logger.info(f"Generating fix using {self.model}")

        system_prompt = self._build_system_prompt()
        user_prompt = self._build_user_prompt(
            error_log, parsed_error, relevant_files, repo_name, branch
        )

        try:
            payload: Dict[str, Any] = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": self.temperature,
                "response_format": {"type": "json_object"},
            }
            http = requests.post(
                OPENAI_CHAT_COMPLETIONS_URL,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=OPENAI_TIMEOUT_SEC,
            )
            _raise_for_openai_status(http)

            data = http.json()
            content = (data.get("choices") or [{}])[0].get("message", {}).get("content")
            if not content or not str(content).strip():
                raise ValueError("OpenAI response missing choices[0].message.content")

            content = str(content).strip()
            logger.info(f"Received LLM response: {len(content)} characters")

            fix_data = json.loads(content)

            llm_analysis = LLMAnalysis(
                root_cause=fix_data.get("root_cause", "Unknown"),
                suggested_fix=fix_data.get("summary", fix_data.get("patch", "")),
                severity=fix_data.get("severity", "medium"),
                affected_components=fix_data.get("affected_components", []),
            )

            logger.info(f"Analysis complete: {llm_analysis.severity} severity")

            return llm_analysis

        except Exception as e:
            logger.error(f"LLM service error: {str(e)}")
            raise

    def _build_system_prompt(self) -> str:
        """Build system prompt for LLM."""
        return """You are a senior DevOps engineer and expert software developer.

Your task is to analyze CI/CD pipeline failures and provide precise, minimal fixes.

Guidelines:
1. Analyze the error log carefully to identify the root cause
2. Review the repository files to understand the context
3. Suggest the minimal change required to fix the issue
4. Provide fixes ONLY for these file types:
   - requirements.txt
   - Dockerfile
   - pipeline.yml / workflow files
   - build.gradle
   - pom.xml
   - package.json
   - setup.py
   - pyproject.toml

5. Generate a unified diff patch in standard format
6. Keep changes minimal and focused
7. Do not modify application code unless absolutely necessary

You MUST respond with valid JSON in this exact format:
{
  "root_cause": "Clear explanation of what caused the failure",
  "files_to_modify": ["file1.txt", "file2.txt"],
  "patch": "unified diff format patch",
  "summary": "Brief summary of the fix"
}"""

    def _build_user_prompt(
        self,
        error_log: str,
        parsed_error: ParsedError,
        relevant_files: Dict[str, str],
        repo_name: str,
        branch: str,
    ) -> str:
        """Build user prompt with error context."""
        files_map: Dict[str, str] = (
            relevant_files if isinstance(relevant_files, dict) else {}
        )
        files_context = "\n\n".join(
            [
                f"### File: {path}\n```\n{content[:2000]}\n```"  # Limit content length
                for path, content in files_map.items()
            ]
        )

        prompt = f"""A CI/CD pipeline failed for repository: {repo_name} (branch: {branch})

## Error Log:
```
{error_log[:2000]}  
```

## Parsed Error Details:
- Error Type: {parsed_error.error_type}
- Missing Module: {parsed_error.missing_module or 'N/A'}
- File Path: {parsed_error.file_path or 'N/A'}
- Line Number: {parsed_error.line_number or 'N/A'}
- Keywords: {', '.join(parsed_error.keywords)}

## Repository Files:
{files_context}

## Task:
1. Identify the root cause of the pipeline failure
2. Determine which files need to be modified (maximum 3 files)
3. Generate a unified diff patch to fix the issue
4. Provide a brief summary of the fix

## Requirements:
- Only modify configuration/dependency files
- Keep changes minimal
- Ensure the patch is in valid unified diff format
- The patch should be ready to apply with `git apply`

Remember to respond with valid JSON only."""

        return prompt
