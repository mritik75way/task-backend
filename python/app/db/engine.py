from sqlmodel import create_engine
from core.config import get_settings

settings = get_settings()

engine = create_engine(settings.DATABASE_URL, echo=settings.DEBUG)

