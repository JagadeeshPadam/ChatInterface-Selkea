from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
from pathlib import Path

# Load .env file
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    # Google OAuth credentials
    # Other configurations
    SECRET_KEY: str = 'default_secret_key'
    DEBUG: bool = False

    model_config = SettingsConfigDict(env_file=".env")

    # Adding a custom method to validate important fields and throw errors if any are missing
    def validate(self):
        missing_values = []

        if missing_values:
            raise ValueError(f"Missing required configuration values: {', '.join(missing_values)}")

# Initialize settings
settings = Settings()

# Validate the settings
settings.validate()
