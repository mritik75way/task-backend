from fastapi import APIRouter, Depends, UploadFile, File as FastAPIFile, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional
from fastapi.responses import RedirectResponse

from app.core.database import get_db
from app.modules.files.file_schema import FileResponse, FileListResponse
from app.modules.files.fiile_share_schema import ShareFileRequest
from app.modules.files.file_service import (
    list_files, 
    upload_file, 
    get_file_by_id, 
    delete_file, 
    get_shared_file, 
    revoke_share, 
    share_file, 
    share_file_with_users,
    revoke_file_share
)
from app.core.security import get_current_user
from app.core.storage_factory import get_storage

router = APIRouter(prefix="/files", tags=["Files"])

@router.get("/", response_model=FileListResponse)
def list(
    folder_id: Optional[UUID] = None,
    search: Optional[str] = None,
    limit: int = Query(20, le=100),
    offset: int = 0,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total, items = list_files(
        db=db,
        folder_id=folder_id,
        search=search,
        limit=limit,
        offset=offset,
        user_id=user.id
    )

    return {
        "total": total,
        "items": items,
    }

@router.get("/{file_id}/download")
def download(file_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    file = get_file_by_id(db, file_id, user.id)

    storage = get_storage()
    url = storage.get_download_url(file.path)

    return {"download_url": url}

@router.post("/upload", response_model=FileResponse)
async def upload(
    file: UploadFile = FastAPIFile(...),
    folder_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return await upload_file(db, file, user.id, folder_id)

@router.post("/{file_id}/share-user")
def share_with_users(
    file_id: UUID,
    data: ShareFileRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    share_file_with_users(
        db,
        file_id,
        user.id,
        data.user_ids,
        data.permission,
    )
    return {"message": "File shared with users"}

@router.post("/{file_id}/revoke-user")
def revoke_user_share(
    file_id: UUID,
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    revoke_file_share(db, file_id, owner_id=current_user.id, target_user_id=user_id)
    return {"message": "Access revoked"}

@router.post("/{file_id}/share")
def public_share(file_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    file = share_file(db, file_id, user.id)

    return {
        "share_url": f"/share/{file.share_token}"
    }

@router.post("/{file_id}/revoke", status_code=204)
def public_revoke(file_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    revoke_share(db, file_id, user.id)

@router.delete("/{file_id}", status_code=204)
def remove(file_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    delete_file(db, file_id, user.id)

public_router = APIRouter(tags=["Public Share"])

@public_router.get("/share/{token}")
def download_shared(token: str, db: Session = Depends(get_db)):
    file = get_shared_file(db, token)
    storage = get_storage()
    return {"download_url": storage.get_download_url(file.path)}

