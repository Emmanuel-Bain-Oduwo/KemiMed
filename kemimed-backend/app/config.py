from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "KemiMed"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20

    REDIS_URL: str = "redis://localhost:6379"

    DEEPSEEK_API_KEY: str
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"
    DEEPSEEK_MODEL: str = "deepseek-chat"

    GEMINI_API_KEY: str
    GEMINI_TTS_MODEL: str = "gemini-2.5-flash-preview-tts"
    GEMINI_STT_MODEL: str = "gemini-2.0-flash"
    GEMINI_VISION_MODEL: str = "gemini-2.0-flash"

    OPENAI_API_KEY: str
    OPENAI_IMAGE_MODEL: str = "dall-e-3"
    OPENAI_WHISPER_MODEL: str = "whisper-1"

    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY_ID: str = ""
    R2_SECRET_ACCESS_KEY: str = ""
    R2_BUCKET_NAME: str = "kemimed-uploads"
    R2_PUBLIC_URL: str = "https://uploads.kemimed.kemirix.com"

    MAX_IMAGES_PER_USER: int = 10
    MAX_PDFS_PER_USER: int = 10
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_IMAGE_TYPES: str = "image/jpeg,image/png,image/webp,image/gif"
    ALLOWED_PDF_TYPES: str = "application/pdf"
    ALLOWED_AUDIO_TYPES: str = "audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/webm"
    ALLOWED_VIDEO_TYPES: str = "video/mp4,video/webm,video/ogg,video/quicktime"

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    PUBMED_API_KEY: str = ""
    PUBMED_BASE_URL: str = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"

    class Config:
        env_file = ".env"
        extra = "ignore"

    @property
    def allowed_image_types_list(self) -> list[str]:
        return [t.strip() for t in self.ALLOWED_IMAGE_TYPES.split(",")]

    @property
    def allowed_pdf_types_list(self) -> list[str]:
        return [t.strip() for t in self.ALLOWED_PDF_TYPES.split(",")]

    @property
    def allowed_audio_types_list(self) -> list[str]:
        return [t.strip() for t in self.ALLOWED_AUDIO_TYPES.split(",")]

    @property
    def allowed_video_types_list(self) -> list[str]:
        return [t.strip() for t in self.ALLOWED_VIDEO_TYPES.split(",")]

    @property
    def max_file_size_bytes(self) -> int:
        return self.MAX_FILE_SIZE_MB * 1024 * 1024


settings = Settings()
