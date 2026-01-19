from abc import ABC, abstractmethod
from fastapi import UploadFile

MAX_FILE_SIZE  = 50 * 1024 * 1024
DEFAULT_USER_QUOTA = 5 * 1024 * 1024 * 1024


class StorageProvider(ABC):

    @abstractmethod
    def upload(self, file: UploadFile, path: str) -> str:
        pass

    @abstractmethod
    def delete(self, path: str):
        pass

    @abstractmethod
    def get_download_url(self, path: str) -> str:
        pass
