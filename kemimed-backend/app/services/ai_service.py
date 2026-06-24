from openai import AsyncOpenAI
from app.config import settings
from loguru import logger
from typing import AsyncGenerator

# DeepSeek uses OpenAI-compatible API
deepseek_client = AsyncOpenAI(
    api_key=settings.DEEPSEEK_API_KEY,
    base_url=settings.DEEPSEEK_BASE_URL,
)

openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def chat_stream(messages: list, system_prompt: str) -> AsyncGenerator[str, None]:
    """Stream response from DeepSeek. Falls back to GPT-4o on failure."""
    try:
        stream = await deepseek_client.chat.completions.create(
            model=settings.DEEPSEEK_MODEL,
            messages=[{"role": "system", "content": system_prompt}] + messages,
            stream=True,
            max_tokens=4096,
            temperature=0.7,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta
    except Exception as e:
        logger.error(f"DeepSeek stream failed: {e}. Falling back to GPT-4o")
        stream = await openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": system_prompt}] + messages,
            stream=True,
            max_tokens=4096,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta


async def chat_complete(messages: list, system_prompt: str, json_mode: bool = False) -> str:
    """Non-streaming DeepSeek call. Falls back to GPT-4o."""
    kwargs = {"response_format": {"type": "json_object"}} if json_mode else {}
    try:
        response = await deepseek_client.chat.completions.create(
            model=settings.DEEPSEEK_MODEL,
            messages=[{"role": "system", "content": system_prompt}] + messages,
            max_tokens=8192,
            temperature=0.3 if json_mode else 0.7,
            **kwargs,
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"DeepSeek complete failed: {e}. Falling back to GPT-4o")
        return await chat_complete_fallback(messages, system_prompt, json_mode)


async def chat_complete_fallback(messages: list, system_prompt: str, json_mode: bool = False) -> str:
    kwargs = {"response_format": {"type": "json_object"}} if json_mode else {}
    response = await openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": system_prompt}] + messages,
        max_tokens=4096,
        **kwargs,
    )
    return response.choices[0].message.content


def build_tutor_prompt(discipline: str, mode: str, topic: str = "") -> str:
    return f"""You are Dr. Core, the AI clinical lecturer for KemiMed™ by Kemirix Health Technologies.

Discipline mode: {discipline}
Teaching mode: {mode}
Topic focus: {topic if topic else "open"}

Your role:
- TEACH from first principles, not just explain
- BUILD knowledge systematically stage by stage
- EVALUATE rigorously after each stage like a real university examiner
- IDENTIFY knowledge gaps and correct them immediately
- USE clinical examples, drug names, mechanisms, and real patient scenarios

Teaching structure:
1. Introduce concept from first principles
2. Build up to clinical application
3. Ask a clinical MCQ or case question
4. Evaluate answer — correct or explain misconception
5. Move to next stage

Always include:
- Bold key terms
- 💎 Clinical pearls
- Exam-relevant mnemonics when applicable
- "This appears in exams as..." when relevant
- Drug names, doses, mechanisms when relevant

Discipline-specific framing:
- pharmacy: focus on DDI, PK/PD, clinical pharmacy, drug monitoring
- medicine: focus on differential diagnosis, clinical reasoning, SOAP
- nursing: focus on care plans, drug admin, patient safety
- mls: focus on lab values, reference ranges, interpretation
- physiotherapy: focus on anatomy, movement, rehabilitation

You are world-class. Be rigorous but encouraging. Never be vague."""
