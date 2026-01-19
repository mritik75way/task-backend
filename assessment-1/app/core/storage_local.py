import os
import shutil
from fastapi import UploadFile

from app.core.storage import StorageProvider

UPLOAD_DIR = "storage"

class LocalStorage(StorageProvider):

    def upload(self, file: UploadFile, path: str) -> str:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        full_path = os.path.join(UPLOAD_DIR, path)

        with open(full_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return full_path

    def delete(self, path: str):
        if os.path.exists(path):
            os.remove(path)

    def get_download_url(self, path: str) -> str:
        return path
