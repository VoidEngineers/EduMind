"""Configuration management for Alert-to-Issue Webhook Service."""

import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration."""

    # OpenAI Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    # Chat Completions (see OpenAI docs). gpt-4o is widely available; override in .env if needed.
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o").strip()
    OPENAI_TEMPERATURE: float = float(os.getenv("OPENAI_TEMPERATURE", "0.2"))

    # GitHub Configuration
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    GITHUB_ASSIGNEE: str = os.getenv("GITHUB_ASSIGNEE", "copilot")
    GITHUB_TIMEOUT: int = int(os.getenv("GITHUB_TIMEOUT", "30"))

    # Application Configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    SERVICE_PORT: int = int(os.getenv("SERVICE_PORT", "8000"))
    SERVICE_HOST: str = os.getenv("SERVICE_HOST", "0.0.0.0")

    # Webhook Security (optional)
    # WEBHOOK_SECRET: shared secret; caller must send X-Webhook-Signature = HMAC-SHA256(secret, raw body).hexdigest()
    WEBHOOK_SECRET: str = os.getenv("WEBHOOK_SECRET", "")
    # WEBHOOK_API_KEY: static token for clients that cannot compute HMAC (e.g. Grafana custom header)
    WEBHOOK_API_KEY: str = os.getenv("WEBHOOK_API_KEY", "")

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
