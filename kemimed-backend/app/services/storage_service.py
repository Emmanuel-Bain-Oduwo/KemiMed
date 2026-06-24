import boto3
from botocore.config import Config
from app.config import settings
from loguru import logger


def get_r2_client():
    return boto3.client(
        "s3",
        endpoint_url=f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=settings.R2_ACCESS_KEY_ID,
        aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
        config=Config(signature_version="s3v4"),
        region_name="auto",
    )


async def upload_file(file_bytes: bytes, key: str, content_type: str) -> str:
    """Upload bytes to R2 and return the public URL."""
    try:
        client = get_r2_client()
        client.put_object(
            Bucket=settings.R2_BUCKET_NAME,
            Key=key,
            Body=file_bytes,
            ContentType=content_type,
        )
        return f"{settings.R2_PUBLIC_URL}/{key}"
    except Exception as e:
        logger.error(f"R2 upload failed for key={key}: {e}")
        raise


async def delete_file(key: str) -> None:
    """Delete a file from R2."""
    try:
        client = get_r2_client()
        client.delete_object(Bucket=settings.R2_BUCKET_NAME, Key=key)
    except Exception as e:
        logger.error(f"R2 delete failed for key={key}: {e}")
        raise
