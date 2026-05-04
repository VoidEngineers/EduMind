"""Configuration management for Self-Healing Webhook Service."""

import os
import tempfile
from typing import List
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration."""

    # OpenAI Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4")
    OPENAI_TEMPERATURE: float = float(os.getenv("OPENAI_TEMPERATURE", "0.2"))

    # GitHub Configuration
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    GITHUB_API_URL: str = "https://api.github.com"
    GITHUB_TIMEOUT: int = int(os.getenv("GITHUB_TIMEOUT", "30"))

    # Repository Configuration
    CLONE_DIRECTORY: str = os.getenv(
        "CLONE_DIRECTORY", 
        os.path.join(tempfile.gettempdir(), "self-healing-webhook")
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
    SERVICE_HOST: str = os.getenv("SERVICE_HOST", "0.0.0.0")

    # Webhook Security (optional API key)
    WEBHOOK_SECRET: str = os.getenv("WEBHOOK_SECRET", "")

    @classmethod
    def validate(cls) -> None:
        """Validate required configuration."""
        missing = []
        
        if not cls.OPENAI_API_KEY:
            missing.append("OPENAI_API_KEY")
        if not cls.GITHUB_TOKEN:
            missing.append("GITHUB_TOKEN")
            
        if missing:
            raise ValueError(
                f"Missing required environment variables: {', '.join(missing)}"
            )

        os.makedirs(cls.CLONE_DIRECTORY, exist_ok=True)
