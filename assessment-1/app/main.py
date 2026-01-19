from fastapi import FastAPI

from app.core.database import Base, engine
from app.modules.folders.folder_router import router as folder_router
from app.modules.files.file_router import router as file_router, public_router
from app.modules.users.user_router import router as user_router

app = FastAPI(
    title="File Sharing and Storage Service",
    description="Cloud-based backend for file storage and sharing",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)

app.include_router(user_router)
app.include_router(folder_router)
app.include_router(file_router)
app.include_router(public_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
