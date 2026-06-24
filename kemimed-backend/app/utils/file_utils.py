import magic
from fastapi import UploadFile, HTTPException
from app.config import settings


async def validate_file(file: UploadFile, allowed_types: list[str], max_size_bytes: int | None = None) -> bytes:
    content = await file.read()
    size = len(content)

    max_bytes = max_size_bytes or settings.max_file_size_bytes
    if size > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size is {settings.MAX_FILE_SIZE_MB}MB."
        )

    # Validate mime type by reading file magic bytes, not trusting client header
    detected_mime = magic.from_buffer(content, mime=True)
    if detected_mime not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {detected_mime}. Allowed: {', '.join(allowed_types)}"
        )

    return content


def get_file_extension(filename: str) -> str:
    if "." in filename:
        return filename.rsplit(".", 1)[-1].lower()
    return ""
