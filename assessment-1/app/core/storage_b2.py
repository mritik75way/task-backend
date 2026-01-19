import boto3
from fastapi import UploadFile
from app.core.config import settings
from botocore.config import Config

config = Config(
    signature_version="s3v4",
)


class B2Storage:
    def __init__(self):
        self.client = boto3.client(
            "s3",
            endpoint_url=settings.B2_ENDPOINT,
            aws_access_key_id=settings.B2_ACCESS_KEY,
            aws_secret_access_key=settings.B2_SECRET_KEY,
            config=config,
        )

    def upload(self, file: UploadFile, path: str) -> str:
        file.file.seek(0)
        self.client.upload_fileobj(
            file.file,
            settings.B2_BUCKET,
            path,
            ExtraArgs={
                "ContentType": file.content_type,
                "ContentDisposition": f'attachment; filename="{file.filename}"'
            },
        )
        return path

    def delete(self, path: str):
        self.client.delete_object(
            Bucket=settings.B2_BUCKET,
            Key=path,
        )

    def get_download_url(self, path: str) -> str:
        return self.client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": settings.B2_BUCKET,
                "Key": path,
            },
            ExpiresIn=3600,  # 1 hour
        )
