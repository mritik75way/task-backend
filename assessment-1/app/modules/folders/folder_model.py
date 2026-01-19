import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Folder(Base):
    __tablename__ = "folders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)

    parent_id = Column(UUID(as_uuid=True), ForeignKey("folders.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    parent = relationship("Folder", remote_side=[id], backref="subfolders")

    files = relationship("File", back_populates="folder", cascade="all, delete")
