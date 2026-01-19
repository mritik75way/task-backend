from fastapi import HTTPException
from app.core.storage import MAX_FILE_SIZE


def validate_file_size(size: int):
    if size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File size limit exceeded",
        )


def validate_storage_quota(user, file_size: int):
    if user.storage_used + file_size > user.storage_limit:
        raise HTTPException(
            status_code=413,
            detail="Storage quota exceeded",
        )
