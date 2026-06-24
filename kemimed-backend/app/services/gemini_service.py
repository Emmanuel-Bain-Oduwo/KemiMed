from google import genai
from google.genai import types
from app.config import settings
from loguru import logger

client = genai.Client(api_key=settings.GEMINI_API_KEY)

VOICE_MAP = {
    "DrCore": "Kore",
    "Amara": "Puck",
    "Prof": "Charon",
}


async def transcribe_audio(audio_bytes: bytes, mime_type: str) -> str:
    """Transcribe audio using Gemini STT."""
    try:
        response = await client.aio.models.generate_content(
            model=settings.GEMINI_STT_MODEL,
            contents=[
                types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
                "Transcribe this audio exactly. Return only the transcript text.",
            ],
        )
        return response.text
    except Exception as e:
        logger.error(f"Gemini STT failed: {e}")
        raise


async def text_to_speech(text: str, voice_name: str = "DrCore") -> bytes:
    """Convert text to speech using Gemini TTS."""
    voice = VOICE_MAP.get(voice_name, "Kore")
    try:
        response = client.models.generate_content(
            model=settings.GEMINI_TTS_MODEL,
            contents=text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice)
                    )
                ),
            ),
        )
        return response.candidates[0].content.parts[0].inline_data.data
    except Exception as e:
        logger.error(f"Gemini TTS failed: {e}")
        raise


async def analyze_image(image_bytes: bytes, mime_type: str, prompt: str) -> str:
    """Analyze image using Gemini Vision."""
    try:
        response = await client.aio.models.generate_content(
            model=settings.GEMINI_VISION_MODEL,
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                prompt,
            ],
        )
        return response.text
    except Exception as e:
        logger.error(f"Gemini Vision failed: {e}")
        raise
