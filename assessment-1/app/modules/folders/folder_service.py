from sqlalchemy.orm import Session
from uuid import UUID
import os
from fastapi import HTTPException, status

from app.modules.folders.folder_model import Folder
from app.modules.folders.folder_schema import FolderCreate

def create_folder(db: Session, data: FolderCreate, user_id) -> Folder:
    folder = Folder(
        name=data.name,
        parent_id=data.parent_id,
        user_id=user_id
    )
    db.add(folder)
    db.commit()
    db.refresh(folder)
    return folder

def list_folders(db: Session, user_id, parent_id=None):
    query = db.query(Folder).filter(Folder.user_id == user_id)

    if parent_id:
        query = query.filter(Folder.parent_id == parent_id)
    else:
        query = query.filter(Folder.parent_id.is_(None))

    return query.all()

def _collect_files(folder: Folder):
    files = list(folder.files)

    for subfolder in folder.subfolders:
        files.extend(_collect_files(subfolder))

    return files

def delete_folder(db: Session, folder_id, user_id):
    folder = db.query(Folder).filter(Folder.id==user_id).filter(Folder.id == folder_id).first()

    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Folder not found",
        )

    files = _collect_files(folder)

    for file in files:
        if os.path.exists(file.path):
            os.remove(file.path)

    db.delete(folder)
    db.commit()


    
