"""Patch service for applying code changes."""

import os
import logging
from pathlib import Path
from typing import List

from git import Repo

from app.config import Config

logger = logging.getLogger(__name__)


class PatchService:
    """Service for applying patches to repository."""

    @staticmethod
    def apply_patch(repo: Repo, patch: str, files_to_modify: List[str]) -> bool:
        """
        Apply unified diff patch to repository.

        Args:
            repo: GitPython Repo object
            patch: Unified diff patch string
            files_to_modify: List of files that will be modified

        Returns:
            True if patch applied successfully, False otherwise

        Raises:
            ValueError: If safety checks fail
        """
        logger.info("Applying patch to repository")

        # Safety check: validate number of files
        if len(files_to_modify) > Config.MAX_FILES_TO_MODIFY:
            raise ValueError(
                f"Cannot modify {len(files_to_modify)} files. "
                f"Maximum allowed: {Config.MAX_FILES_TO_MODIFY}"
            )

        # Safety check: validate file patterns
        PatchService._validate_files(files_to_modify)

        repo_path = Path(repo.working_dir)

        try:
            # If patch is in unified diff format, try to apply it using git
            if patch.startswith("diff --git") or patch.startswith("---"):
                logger.info("Applying unified diff patch using git apply")
                return PatchService._apply_git_patch(repo, patch)
            else:
                # Parse and apply patch manually
                logger.info("Applying patch manually")
                return PatchService._apply_manual_patch(
                    repo_path, patch, files_to_modify
                )

        except Exception as e:
            logger.error(f"Failed to apply patch: {str(e)}")
            return False

    @staticmethod
    def _apply_git_patch(repo: Repo, patch: str) -> bool:
        """Apply patch using git apply command."""
        repo_path = Path(repo.working_dir)
        patch_file = repo_path / "temp.patch"

        try:
            # Write patch to temporary file
            patch_file.write_text(patch, encoding="utf-8")

            # Apply patch
            repo.git.apply(str(patch_file))

            logger.info("Successfully applied git patch")
            return True

        except Exception as e:
            logger.warning(f"Git apply failed: {str(e)}, trying manual application")
            return False

        finally:
            # Clean up temporary patch file
            if patch_file.exists():
                patch_file.unlink()

    @staticmethod
    def _apply_manual_patch(
        repo_path: Path, patch: str, files_to_modify: List[str]
    ) -> bool:
        """Manually apply patch by parsing the content."""
        # This is a simplified implementation
        # In production, you might want to use a proper patch parsing library

        try:
            # Parse patch content (simplified)
            lines = patch.split("\n")
            current_file = None
            new_content = []

            for line in lines:
                if line.startswith("+++") or line.startswith("---"):
                    # Extract filename
                    parts = line.split()
                    if len(parts) > 1:
                        filename = parts[1].lstrip("ab/")
                        if current_file and new_content:
                            # Write previous file
                            file_path = repo_path / current_file
                            file_path.write_text(
                                "\n".join(new_content), encoding="utf-8"
                            )
                            new_content = []
                        current_file = filename
                elif line.startswith("+") and not line.startswith("+++"):
                    # Addition
                    new_content.append(line[1:])
                elif not line.startswith("-") and not line.startswith("@@"):
                    # Context line
                    new_content.append(line)

            # Write last file
            if current_file and new_content:
                file_path = repo_path / current_file
                file_path.write_text("\n".join(new_content), encoding="utf-8")

            return True

        except Exception as e:
            logger.error(f"Manual patch application failed: {str(e)}")
            return False

    @staticmethod
    def commit_changes(repo: Repo, branch_name: str, summary: str) -> None:
        """
        Commit changes to repository.

        Args:
            repo: GitPython Repo object
            branch_name: Branch name
            summary: Commit message summary
        """
        logger.info("Committing changes")

        try:
            # Stage all changes
            repo.git.add(A=True)

            # Create commit message
            commit_message = (
                f"AI Fix: {summary}\n\n[Automated fix generated by AI Failure Analyzer]"
            )

            # Commit changes
            repo.index.commit(commit_message)

            logger.info(f"Successfully committed changes to {branch_name}")

        except Exception as e:
            logger.error(f"Failed to commit changes: {str(e)}")
            raise

    @staticmethod
    def _validate_files(files_to_modify: List[str]) -> None:
        """
        Validate that files are allowed to be modified.

        Args:
            files_to_modify: List of file paths to modify

        Raises:
            ValueError: If any file is not allowed
        """
        allowed_patterns = Config.ALLOWED_FILE_PATTERNS

        for file_path in files_to_modify:
            file_name = os.path.basename(file_path)

            # Check if file matches any allowed pattern
            is_allowed = False
            for pattern in allowed_patterns:
                # Simple pattern matching
                if "*" in pattern:
                    # Handle wildcard patterns
                    pattern_base = pattern.replace("*", "")
                    if pattern_base in file_path:
                        is_allowed = True
                        break
                elif file_name == pattern or file_path == pattern:
                    is_allowed = True
                    break

            if not is_allowed:
                raise ValueError(
                    f"File '{file_path}' is not in the allowed file list. "
                    f"Allowed patterns: {allowed_patterns}"
                )

        logger.info("All files passed validation")
