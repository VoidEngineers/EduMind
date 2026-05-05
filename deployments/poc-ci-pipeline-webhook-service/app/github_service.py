"""GitHub service for creating issues and managing alerts."""

import logging
from typing import Dict, Any, Optional

import requests

from app.config import Config
from app.models import GitHubIssueResult

logger = logging.getLogger(__name__)


class GitHubService:
    """Service for interacting with GitHub Issues API."""

    def __init__(self):
        """Initialize GitHub service."""
        self.token = Config.GITHUB_TOKEN
        self.api_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        self.assignee = Config.ASSIGNEE_GITHUB_ISSUE

    def create_issue(
        self,
        repo_name: str,
        service_name: str,
        error_log: str,
        root_cause: str,
        suggested_fix: str,
        severity: str = "medium",
        environment: str = "production",
    ) -> GitHubIssueResult:
        """
        Create a GitHub issue for the alert.

        Args:
            repo_name: Repository name in format 'org/repo'
            service_name: Service name where alert originated
            error_log: Original error log
            root_cause: LLM analysis of root cause
            suggested_fix: Suggested steps to fix
            severity: Alert severity level
            environment: Environment (production/staging/development)

        Returns:
            GitHubIssueResult with issue details

        Raises:
            Exception: If issue creation fails
        """
        logger.info(f"Creating GitHub issue for {repo_name} ({service_name})")

        # Build issue title and body
        issue_title = f"[Alert] Error detected in {service_name}"
        issue_body = self._build_issue_body(
            service_name, error_log, root_cause, suggested_fix, environment
        )

        # API endpoint
        url = f"{self.api_url}/repos/{repo_name}/issues"

        # Build payload
        payload = {
            "title": issue_title,
            "body": issue_body,
            "labels": self._get_labels(severity),
        }

        # Add assignee if configured
        if self.assignee:
            payload["assignees"] = [self.assignee]
            logger.info(f"Assigning issue to @{self.assignee}")

        try:
            # Make API request
            response = requests.post(
                url, headers=self.headers, json=payload, timeout=30
            )

            if response.status_code == 403:
                logger.error(f"GitHub 403 Forbidden - Body: {response.text}")
                logger.error(f"GitHub 403 Headers: {dict(response.headers)}")
                logger.error("GitHub API rate limited or authentication failed")
                raise Exception(f"GitHub API access denied: {response.text}")

            if response.status_code == 404:
                logger.error(f"Repository not found: {repo_name}")
                raise Exception(f"Repository not found: {repo_name}")

            response.raise_for_status()

            # Parse response
            issue_data = response.json()
            issue_number = issue_data["number"]
            issue_url = issue_data["html_url"]

            logger.info(f"Successfully created issue #{issue_number}: {issue_url}")

            return GitHubIssueResult(
                issue_number=issue_number,
                issue_url=issue_url,
                assigned_to=self.assignee,
            )

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create issue: {str(e)}")
            if hasattr(e, "response") and e.response is not None:
                logger.error(f"Response: {e.response.text}")
            raise

    def create_issue_with_body(
        self,
        repo_name: str,
        title: str,
        body: str,
        severity: str = "medium",
    ) -> GitHubIssueResult:
        """
        Create a GitHub issue with a custom title and body.

        Args:
            repo_name: Repository name in format 'org/repo'
            title: Issue title
            body: Issue body (markdown)
            severity: Alert severity level

        Returns:
            GitHubIssueResult with issue details

        Raises:
            Exception: If issue creation fails
        """
        logger.info(f"Creating GitHub issue for {repo_name}")

        url = f"{self.api_url}/repos/{repo_name}/issues"
        payload = {
            "title": title,
            "body": body,
            "labels": self._get_labels(severity),
        }

        if self.assignee:
            payload["assignees"] = [self.assignee]
            logger.info(f"Assigning issue to @{self.assignee}")

        try:
            response = requests.post(
                url,
                headers=self.headers,
                json=payload,
                timeout=Config.TIMEOUT_FOR_GITHUB,
            )

            if response.status_code == 403:
                logger.error(f"GitHub 403 Forbidden - Body: {response.text}")
                logger.error(f"GitHub 403 Headers: {dict(response.headers)}")
                logger.error("GitHub API rate limited or authentication failed")
                raise Exception(f"GitHub API access denied: {response.text}")

            if response.status_code == 404:
                logger.error(f"Repository not found: {repo_name}")
                raise Exception(f"Repository not found: {repo_name}")

            response.raise_for_status()

            issue_data = response.json()
            issue_number = issue_data["number"]
            issue_url = issue_data["html_url"]

            logger.info(f"Successfully created issue #{issue_number}: {issue_url}")

            return GitHubIssueResult(
                issue_number=issue_number,
                issue_url=issue_url,
                assigned_to=self.assignee,
            )

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create issue: {str(e)}")
            if hasattr(e, "response") and e.response is not None:
                logger.error(f"Response: {e.response.text}")
            raise

    def _build_issue_body(
        self,
        service_name: str,
        error_log: str,
        root_cause: str,
        suggested_fix: str,
        environment: str,
    ) -> str:
        """Build issue body with markdown formatting."""
        # Truncate error log if too long
        max_error_length = 2000
        truncated_error = (
            error_log
            if len(error_log) <= max_error_length
            else f"{error_log[:max_error_length]}..."
        )

        issue_body = f"""## Alert Details

**Service:** {service_name}  
**Environment:** {environment}  
**Timestamp:** *Auto-generated at alert time*

## Error Log

```
{truncated_error}
```

## Root Cause Analysis (AI)

{root_cause}

## Suggested Fix

{suggested_fix}

## Action Items

- [ ] Review the error and root cause analysis
- [ ] Implement the suggested fix
- [ ] Run tests to verify the fix
- [ ] Update documentation if needed
- [ ] Close this issue once resolved

---

*This issue was automatically created by the Alert-to-Issue automation service.*
"""
        return issue_body

    def _get_labels(self, severity: str) -> list:
        """Get labels based on severity."""
        labels = ["alert", "automated"]

        # Add severity labels
        severity_map = {
            "low": "severity/low",
            "medium": "severity/medium",
            "high": "severity/high",
            "critical": "severity/critical",
        }

        if severity in severity_map:
            labels.append(severity_map[severity])

        return labels

    def check_rate_limit(self) -> Dict[str, Any]:
        """
        Check GitHub API rate limit status.

        Returns:
            Rate limit information

        Raises:
            Exception: If API call fails
        """
        url = f"{self.api_url}/rate_limit"

        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()

            data = response.json()
            remaining = data["rate"]["remaining"]
            limit = data["rate"]["limit"]
            reset_time = data["rate"]["reset"]

            logger.info(f"GitHub API: {remaining}/{limit} requests remaining")

            return {"remaining": remaining, "limit": limit, "reset_time": reset_time}

        except Exception as e:
            logger.warning(f"Could not check rate limit: {str(e)}")
            return {}

    def get_repository_info(self, repo_name: str) -> Dict[str, Any]:
        """
        Get repository information from GitHub.

        Args:
            repo_name: Repository name in format 'org/repo'

        Returns:
            Repository information dictionary

        Raises:
            Exception: If API call fails
        """
        url = f"{self.api_url}/repos/{repo_name}"

        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            response.raise_for_status()
            return response.json()

        except Exception as e:
            logger.error(f"Failed to get repository info: {str(e)}")
            raise
