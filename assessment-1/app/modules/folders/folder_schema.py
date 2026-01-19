from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class FolderCreate(BaseModel):
    name: str
    parent_id: Optional[UUID] = None


class FolderResponse(BaseModel):
    id: UUID
    name: str
    parent_id: Optional[UUID]
    created_at: datetime

    class Config:
        orm_mode = True
