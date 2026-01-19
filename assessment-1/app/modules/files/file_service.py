from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from typing import Optional, Tuple
import secrets

from app.modules.files.file_model import File
from app.modules.files.file_share_model import FileShare
from app.modules.users.user_model import User
from app.core.storage_factory import get_storage
from app.modules.files.storage_validations import (
    validate_file_size,
    validate_storage_quota,
)

async def upload_file(db, file, user_id, folder_id=None):
    user = db.query(User).filter(User.id == user_id).first()

    contents = await file.read()
    file_size = len(contents)

    validate_file_size(file_size)
    validate_storage_quota(user, file_size)

    storage = get_storage()
    file_id = uuid4()
    path = storage.upload(file, f"{file_id}_{file.filename}")

    db_file = File(
        id=file_id,
        name=file.filename,
        size=file_size,
        content_type=file.content_type,
        path=path,
        folder_id=folder_id,
        user_id=user_id,
    )

    db.add(db_file)
    user.storage_used += file_size
    db.commit()
    db.refresh(db_file)

    return db_file

def list_files(
    db,
    folder_id: Optional[UUID],
    search: Optional[str],
    limit: int,
    offset: int,
    user_id
) -> Tuple[int, list[File]]:
    query = db.query(File).filter(File.user_id == user_id)

    if folder_id:
        query = query.filter(File.folder_id == folder_id)
    else:
        query = query.filter(File.folder_id.is_(None))

    if search:
        query = query.filter(File.name.ilike(f"%{search}%"))

    total = query.count()

    items = (
        query
        .order_by(File.created_at.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )

    return total, items

def get_file_by_id(db: Session, file_id: UUID, user_id) -> File:
    db_file = (
    db.query(File)
    .outerjoin(
        FileShare,
        FileShare.file_id == File.id,
    )
    .filter(
        (File.id == file_id)
        & (
            (File.user_id == user_id)
            | (FileShare.shared_with_user_id == user_id)
        )
    )
    .first()
)

    if not db_file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    return db_file

def delete_file(db, file_id, user_id):
    file = db.query(File).filter(
        File.id == file_id,
        File.user_id == user_id,
    ).first()

    storage = get_storage()
    storage.delete(file.path)

    user = db.query(User).filter(User.id == user_id).first()
    user.storage_used -= file.size

    db.delete(file)
    db.commit()

def share_file(db: Session, file_id: UUID, user_id) -> File:
    db_file = get_file_by_id(db, file_id, user_id)

    if not db_file.is_shared:
        db_file.is_shared = True
        db_file.share_token = secrets.token_urlsafe(32)

        db.commit()
        db.refresh(db_file)

    return db_file

def revoke_share(db: Session, file_id: UUID, user_id):
    db_file = get_file_by_id(db, file_id, user_id)

    db_file.is_shared = False
    db_file.share_token = None

    db.commit()

def get_shared_file(db: Session, token: str) -> File:
    file = (
        db.query(File)
        .filter(File.share_token == token, File.is_shared.is_(True))
        .first()
    )

    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid or expired share link",
        )

    return file

def share_file_with_users(
    db: Session,
    file_id: UUID,
    owner_id: UUID,
    user_ids: list[UUID],
    permission: str,
):
    file = (
        db.query(File)
        .filter(File.id == file_id, File.user_id == owner_id)
        .first()
    )

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    for user_id in user_ids:
        share = FileShare(
            file_id=file_id,
            shared_with_user_id=user_id,
            permission=permission,
        )
        db.add(share)

    db.commit()

def revoke_file_share(
    db: Session,
    file_id: UUID,
    owner_id: UUID,
    target_user_id: UUID,
):
    share = (
        db.query(FileShare)
        .join(File)
        .filter(
            File.id == file_id,
            File.user_id == owner_id,
            FileShare.shared_with_user_id == target_user_id,
        )
        .first()
    )

    if not share:
        raise HTTPException(status_code=404, detail="Share not found")

    db.delete(share)
    db.commit()