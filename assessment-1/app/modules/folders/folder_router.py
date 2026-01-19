from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional

from app.core.security import get_current_user
from app.core.database import get_db
from app.modules.folders.folder_schema import FolderCreate, FolderResponse
from app.modules.folders.folder_service import create_folder, list_folders, delete_folder

router = APIRouter(prefix="/folders", tags=["Folders"])

@router.post("/", response_model=FolderResponse)
def create(data: FolderCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return create_folder(db, data, user.id)

@router.get("/", response_model=List[FolderResponse])
def list(parent_id: Optional[UUID] = None, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return list_folders(db, user.id, parent_id)

@router.delete("/{folder_id}", status_code=204)
def remove(folder_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    delete_folder(db, folder_id, user.id)
