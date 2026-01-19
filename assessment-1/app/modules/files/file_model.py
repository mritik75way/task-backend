import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base

class File(Base):
    __tablename__ = "files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name = Column(String, nullable=False)

    size = Column(Integer, nullable=False)

    content_type = Column(String, nullable=False)

    path = Column(String, nullable=False)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    is_shared = Column(Boolean, default=False)

    share_token = Column(String, unique=True, nullable=True)

    folder_id = Column(UUID(as_uuid=True), ForeignKey("folders.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    folder = relationship("Folder", back_populates="files")
