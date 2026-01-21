from pydantic import BaseModel
from uuid import UUID
from typing import List


class ShareFileRequest(BaseModel):
    user_ids: List[UUID]
    permission: str = "view"
