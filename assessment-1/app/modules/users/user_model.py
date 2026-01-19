import uuid
from sqlalchemy import Column, String, DateTime, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.storage import DEFAULT_USER_QUOTA
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    storage_used = Column(BigInteger, default=0)
    storage_limit = Column(BigInteger, default=DEFAULT_USER_QUOTA)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
