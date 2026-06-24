import httpx
from openai import AsyncOpenAI
from app.config import settings
from loguru import logger

openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

CLINICAL_STYLE = (
    "medical illustration style, clean white background, labeled diagram, "
    "clinical textbook quality, high detail, anatomically accurate, no watermarks, no text logos"
)


async def generate_image(prompt: str, image_type: str) -> bytes:
    """Generate clinical image using DALL-E 3 and return raw bytes."""
    enhanced = f"{prompt}. Style: {CLINICAL_STYLE}. Type: {image_type} diagram."
    try:
        response = await openai_client.images.generate(
            model=settings.OPENAI_IMAGE_MODEL,
            prompt=enhanced,
            size="1024x1024",
            quality="hd",
            n=1,
        )
        image_url = response.data[0].url
        async with httpx.AsyncClient() as client:
            img_response = await client.get(image_url)
            return img_response.content
    except Exception as e:
        logger.error(f"DALL-E 3 image generation failed: {e}")
        raise
