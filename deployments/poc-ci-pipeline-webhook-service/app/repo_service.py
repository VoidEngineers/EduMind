"""Repository service for Git operations."""

import os
import shutil
import logging
import requests
from datetime import datetime
from typing import Optional
from pathlib import Path

import git
from git import Repo, GitCommandError

from app.config import Config

logger = logging.getLogger(__name__)


class RepoService:
    """Service for managing Git repository operations."""

    def __init__(self):
        """Initialize repository service."""
        self.clone_dir = Config.CLONE_DIRECTORY
        os.makedirs(self.clone_dir, exist_ok=True)

    def _validate_github_token(self, repo_name: str) -> None:
        """Validate GitHub token has access to repository.

        Args:
            repo_name: Repository name in format 'org/repo'

        Raises:
            ValueError: If token is invalid or lacks permissions
        """
        headers = {
            "Authorization": f"token {Config.GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json",
        }

        try:
            # Check token validity and repo access
            response = requests.get(
                f"{Config.GITHUB_API_URL}/repos/{repo_name}",
                headers=headers,
                timeout=10,
            )

            if response.status_code == 401:
                raise ValueError(
                    "GitHub token is invalid or expired. "
                    "Please check your GITHUB_TOKEN in .env file."
                )
            elif response.status_code == 404:
                raise ValueError(
                    f"Repository '{repo_name}' not found or token doesn't have access. "
                    "For private repos, ensure your token has 'repo' scope."
                )
            elif response.status_code == 403:
                raise ValueError(
                    "GitHub token doesn't have sufficient permissions. "
                    "Ensure your token has 'repo' scope (full control of private repositories). "
                    "For fine-grained tokens, grant 'Read and Write' access to Contents and Pull Requests."
                )
            elif response.status_code != 200:
                raise ValueError(
                    f"GitHub API returned unexpected status {response.status_code}: {response.text}"
                )

            # Check if token has push access
            repo_data = response.json()
            if not repo_data.get("permissions", {}).get("push", False):
                raise ValueError(
                    f"GitHub token doesn't have write access to '{repo_name}'. "
                    "This service needs to create branches and pull requests. "
                    "Please use a token with 'repo' scope or grant write access."
                )

            logger.info(f"GitHub token validated successfully for {repo_name}")

        except requests.RequestException as e:
            raise ValueError(f"Failed to validate GitHub token: {str(e)}")

    def clone_repository(
        self, repo_name: str, branch: str, commit_hash: Optional[str] = None
    ) -> Repo:
        """
        Clone a repository and checkout specific branch/commit.

        Args:
            repo_name: Repository name in format 'org/repo'
            branch: Branch name to checkout
            commit_hash: Optional specific commit to checkout

        Returns:
            GitPython Repo object

        Raises:
            ValueError: If token validation or permissions fail
            Exception: If clone or checkout fails
        """
        logger.info(f"Cloning repository: {repo_name}, branch: {branch}")

        # Validate GitHub token first
        logger.info("Validating GitHub token permissions...")
        self._validate_github_token(repo_name)

        # Create unique directory for this repo
        repo_path = self._get_repo_path(repo_name)

        # Remove existing directory if present
        if os.path.exists(repo_path):
            logger.info(f"Removing existing repo at {repo_path}")
            shutil.rmtree(repo_path)

        # Construct clone URL
        clone_url = f"https://{Config.GITHUB_TOKEN}@github.com/{repo_name}.git"

        try:
            # Clone repository
            repo = Repo.clone_from(
                clone_url, repo_path, branch=branch, depth=1  # Shallow clone for speed
            )

            logger.info(f"Successfully cloned {repo_name} to {repo_path}")

            # Checkout specific commit if provided
            if commit_hash:
                logger.info(f"Checking out commit: {commit_hash}")
                repo.git.checkout(commit_hash)

            return repo

        except GitCommandError as e:
            error_msg = str(e)
            if "403" in error_msg or "not granted" in error_msg:
                raise ValueError(
                    f"GitHub authentication failed for {repo_name}. "
                    "Your GITHUB_TOKEN doesn't have write access. "
                    "Please ensure your token has 'repo' scope. "
                    "See DEPLOYMENT.md for token setup instructions."
                )
            elif "404" in error_msg:
                raise ValueError(
                    f"Repository '{repo_name}' not found. "
                    "Please check the repository name and ensure your token has access."
                )
            else:
                logger.error(f"Git command failed: {error_msg}")
                raise
        except Exception as e:
            logger.error(f"Failed to clone repository: {str(e)}")
            raise

    def create_fix_branch(self, repo: Repo) -> str:
        """
        Create a new branch for the fix.

        Args:
            repo: GitPython Repo object

        Returns:
            Branch name created
        """
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        branch_name = f"ai-fix/pipeline-error-{timestamp}"

        logger.info(f"Creating new branch: {branch_name}")

        try:
            # Create and checkout new branch
            new_branch = repo.create_head(branch_name)
            new_branch.checkout()

            logger.info(f"Successfully created and checked out branch: {branch_name}")
            return branch_name

        except Exception as e:
            logger.error(f"Failed to create branch: {str(e)}")
            raise

    def get_relevant_files(
        self, repo: Repo, file_patterns: Optional[list[str]] = None
    ) -> dict[str, str]:
        """
        Get content of relevant files from repository.

        Args:
            repo: GitPython Repo object
            file_patterns: Optional list of file patterns to include

        Returns:
            Dictionary mapping file paths to their content
        """
        logger.info("Fetching relevant files from repository")

        if file_patterns is None:
            file_patterns = Config.ALLOWED_FILE_PATTERNS

        repo_path = Path(repo.working_dir)
        relevant_files = {}

        # Common configuration files to always include
        common_files = [
            "requirements.txt",
            "Dockerfile",
            "docker-compose.yml",
            "package.json",
            "pom.xml",
            "build.gradle",
            "setup.py",
            "pyproject.toml",
        ]

        # Add workflow files
        workflow_dir = repo_path / ".github" / "workflows"
        if workflow_dir.exists():
            for workflow_file in workflow_dir.glob("*.yml"):
                try:
                    content = workflow_file.read_text(encoding="utf-8")
                    rel_path = workflow_file.relative_to(repo_path)
                    relevant_files[str(rel_path)] = content
                except Exception as e:
                    logger.warning(f"Could not read {workflow_file}: {str(e)}")

        # Add common configuration files
        for file_name in common_files:
            file_path = repo_path / file_name
            if file_path.exists():
                try:
                    content = file_path.read_text(encoding="utf-8")
                    relevant_files[file_name] = content
                except Exception as e:
                    logger.warning(f"Could not read {file_name}: {str(e)}")

        logger.info(f"Found {len(relevant_files)} relevant files")
        return relevant_files

    def _get_repo_path(self, repo_name: str) -> str:
        """Get local path for repository."""
        # Replace '/' with '-' for directory name
        safe_name = repo_name.replace("/", "-")
        return os.path.join(self.clone_dir, safe_name)

    def cleanup_repository(self, repo_name: str) -> None:
        """
        Clean up cloned repository.

        Args:
            repo_name: Repository name in format 'org/repo'
        """
        repo_path = self._get_repo_path(repo_name)

        if os.path.exists(repo_path):
            logger.info(f"Cleaning up repository at {repo_path}")
            try:
                shutil.rmtree(repo_path)
            except Exception as e:
                logger.warning(f"Failed to cleanup repository: {str(e)}")
