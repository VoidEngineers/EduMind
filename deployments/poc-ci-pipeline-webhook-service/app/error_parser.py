"""Error log parser for extracting failure information."""

import re
import logging
from typing import Optional

from app.models import ParsedError

logger = logging.getLogger(__name__)


class ErrorParser:
    """Parse error logs to extract meaningful information."""

    # Common error patterns
    PYTHON_ERROR_PATTERN = r"(\w+Error):\s*(.+)"
    MODULE_NOT_FOUND_PATTERN = r"ModuleNotFoundError:\s*No module named ['\"](\w+)['\"]"
    FILE_NOT_FOUND_PATTERN = r"FileNotFoundError:\s*\[Errno \d+\]\s*(.+)"
    IMPORT_ERROR_PATTERN = r"ImportError:\s*(.+)"
    SYNTAX_ERROR_PATTERN = r"SyntaxError:\s*(.+)"
    ATTRIBUTE_ERROR_PATTERN = r"AttributeError:\s*(.+)"
    TYPE_ERROR_PATTERN = r"TypeError:\s*(.+)"
    VALUE_ERROR_PATTERN = r"ValueError:\s*(.+)"

    # File and line number pattern
    FILE_LINE_PATTERN = r'File "(.+)", line (\d+)'

    # Docker/Container errors
    DOCKER_ERROR_PATTERN = r"(docker|container).*error:\s*(.+)"

    # Gradle/Maven errors
    BUILD_ERROR_PATTERN = r"BUILD FAILED|Build failed|compilation failed"

    @classmethod
    def parse(cls, error_log: str) -> ParsedError:
        """
        Parse error log and extract structured information.

        Args:
            error_log: Raw error log string

        Returns:
            ParsedError object with extracted information
        """
        logger.info("Parsing error log...")

        error_type = cls._extract_error_type(error_log)
        missing_module = cls._extract_missing_module(error_log)
        file_path, line_number = cls._extract_file_and_line(error_log)
        keywords = cls._extract_keywords(error_log)
        failing_step = cls._extract_failing_step(error_log)

        parsed_error = ParsedError(
            error_type=error_type,
            missing_module=missing_module,
            file_path=file_path,
            line_number=line_number,
            keywords=keywords,
            failing_step=failing_step,
        )

        logger.info(f"Parsed error: type={error_type}, module={missing_module}")

        return parsed_error

    @classmethod
    def _extract_error_type(cls, error_log: str) -> str:
        """Extract the type of error."""
        # Try Python error pattern
        match = re.search(cls.PYTHON_ERROR_PATTERN, error_log)
        if match:
            return match.group(1)

        # Try build error
        if re.search(cls.BUILD_ERROR_PATTERN, error_log, re.IGNORECASE):
            return "BuildError"

        # Try Docker error
        match = re.search(cls.DOCKER_ERROR_PATTERN, error_log, re.IGNORECASE)
        if match:
            return "DockerError"

        return "UnknownError"

    @classmethod
    def _extract_missing_module(cls, error_log: str) -> Optional[str]:
        """Extract missing module name if ModuleNotFoundError."""
        match = re.search(cls.MODULE_NOT_FOUND_PATTERN, error_log)
        if match:
            return match.group(1)

        # Also check for import errors
        if "cannot import name" in error_log.lower():
            match = re.search(
                r"cannot import name ['\"](\w+)['\"]", error_log, re.IGNORECASE
            )
            if match:
                return match.group(1)

        return None

    @classmethod
    def _extract_file_and_line(
        cls, error_log: str
    ) -> tuple[Optional[str], Optional[int]]:
        """Extract file path and line number."""
        match = re.search(cls.FILE_LINE_PATTERN, error_log)
        if match:
            file_path = match.group(1)
            line_number = int(match.group(2))
            return file_path, line_number

        return None, None

    @classmethod
    def _extract_keywords(cls, error_log: str) -> list[str]:
        """Extract relevant keywords from error log."""
        keywords = []

        # Extract error type
        error_type = cls._extract_error_type(error_log)
        if error_type and error_type != "UnknownError":
            keywords.append(error_type)

        # Extract missing module
        missing_module = cls._extract_missing_module(error_log)
        if missing_module:
            keywords.append(missing_module)

        # Common keywords
        keyword_patterns = [
            r"\b(failed|failure|error|exception)\b",
            r"\b(missing|not found|undefined)\b",
            r"\b(syntax|import|attribute|type|value)\b",
            r"\b(docker|container|image)\b",
            r"\b(build|compile|dependency)\b",
        ]

        for pattern in keyword_patterns:
            matches = re.findall(pattern, error_log, re.IGNORECASE)
            keywords.extend([m.lower() for m in matches])

        # Remove duplicates and return
        return list(set(keywords))

    @classmethod
    def _extract_failing_step(cls, error_log: str) -> Optional[str]:
        """Extract the failing step from error log."""
        # Look for common CI/CD step markers
        step_patterns = [
            r"Step (\d+/\d+)",
            r"##\[error\](.+)",
            r"FAILED (.+)",
            r"ERROR in (.+)",
            r"\[(.+)\] FAILED",
        ]

        for pattern in step_patterns:
            match = re.search(pattern, error_log)
            if match:
                return match.group(1).strip()

        return None
