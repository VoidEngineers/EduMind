"""LLM service for generating fixes using OpenAI."""

import json
import logging
from typing import Dict

from openai import OpenAI

from app.config import Config
from app.models import LLMResponse, ParsedError

logger = logging.getLogger(__name__)


class LLMService:
    """Service for interacting with OpenAI API to generate fixes."""

    def __init__(self):
        """Initialize LLM service."""
        self.client = OpenAI(api_key=Config.OPENAI_API_KEY)
        self.model = Config.OPENAI_MODEL
        self.temperature = Config.OPENAI_TEMPERATURE

    def generate_fix(
        self,
        error_log: str,
        parsed_error: ParsedError,
        relevant_files: Dict[str, str],
        repo_name: str,
        branch: str,
    ) -> LLMResponse:
        """
        Generate a fix for the pipeline failure using LLM.

        Args:
            error_log: Raw error log
            parsed_error: Parsed error information
            relevant_files: Dictionary of file paths to their content
            repo_name: Repository name
            branch: Branch name

        Returns:
            LLMResponse with fix details

        Raises:
            Exception: If LLM call fails
        """
        logger.info(f"Generating fix using {self.model}")

        # Build context for LLM
        system_prompt = self._build_system_prompt()
        user_prompt = self._build_user_prompt(
            error_log, parsed_error, relevant_files, repo_name, branch
        )

        try:
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=self.temperature,
                response_format={"type": "json_object"},
            )

            # Parse response
            content = response.choices[0].message.content
            logger.info(f"Received LLM response: {len(content)} characters")

            # Parse JSON response
            fix_data = json.loads(content)

            llm_response = LLMResponse(
                root_cause=fix_data.get("root_cause", "Unknown"),
                files_to_modify=fix_data.get("files_to_modify", []),
                patch=fix_data.get("patch", ""),
                summary=fix_data.get("summary", ""),
            )

            logger.info(f"Fix generated for {len(llm_response.files_to_modify)} files")

            return llm_response

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
        # Format relevant files
        files_context = "\n\n".join(
            [
                f"### File: {path}\n```\n{content[:2000]}\n```"  # Limit content length
                for path, content in relevant_files.items()
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
