"""Configuration management for AI Failure Analyzer Service."""

import os
import tempfile
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Application configuration."""

    # OpenAI Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4")
    OPENAI_TEMPERATURE: float = float(os.getenv("OPENAI_TEMPERATURE", "0.2"))

    # GitHub Configuration
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    GITHUB_ORG: str = os.getenv(
        "GITHUB_ORG", ""
    )  # Your GitHub username or organization name
    GITHUB_API_URL: str = "https://api.github.com"

    # Repository Configuration
    CLONE_DIRECTORY: str = os.getenv(
        "CLONE_DIRECTORY", os.path.join(tempfile.gettempdir(), "ai-analyzer-repos")
    )

    # Safety Configuration
    MAX_FILES_TO_MODIFY: int = int(os.getenv("MAX_FILES_TO_MODIFY", "3"))
    ALLOWED_FILE_PATTERNS: List[str] = [
        "requirements.txt",
        "Dockerfile",
        "pipeline.yml",
        ".github/workflows/*.yml",
        "build.gradle",
        "pom.xml",
        "package.json",
        "setup.py",
        "pyproject.toml",
    ]

    # Application Configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    SERVICE_PORT: int = int(os.getenv("SERVICE_PORT", "8000"))

    @classmethod
    def validate(cls) -> None:
        """Validate required configuration."""
        if not cls.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is required")
        if not cls.GITHUB_TOKEN:
            raise ValueError("GITHUB_TOKEN is required")
        # GITHUB_ORG is optional - it's informational only

        # Create clone directory if it doesn't exist
        os.makedirs(cls.CLONE_DIRECTORY, exist_ok=True)


# Note: Config validation is called in main.py when the app starts
# Not validating on import to allow for testing and configuration inspection
