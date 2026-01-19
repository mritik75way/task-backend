from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, List


class FileResponse(BaseModel):
    id: UUID
    name: str
    size: int   
    content_type: str
    folder_id: Optional[UUID]
    created_at: datetime

    class Config:
        orm_mode = True


class FileListResponse(BaseModel):
    total: int
    items: List[FileResponse]
