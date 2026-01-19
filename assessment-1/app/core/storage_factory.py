from app.core.config import settings
from app.core.storage_local import LocalStorage
from app.core.storage_b2 import B2Storage


def get_storage():
    if settings.STORAGE_BACKEND == "b2":
        return B2Storage()

    return LocalStorage()
