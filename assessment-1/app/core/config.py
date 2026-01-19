from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    STORAGE_BACKEND: str = "local"
    B2_ACCESS_KEY: str | None = None
    B2_SECRET_KEY: str | None = None
    B2_BUCKET: str | None = None
    B2_ENDPOINT: str | None = None


    class Config:
        env_file = ".env"


settings = Settings()
