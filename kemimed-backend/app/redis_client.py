import redis.asyncio as aioredis
from app.config import settings

redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)

# Cache TTLs (seconds)
TTL_USER_PROFILE = 300        # 5 min
TTL_TOPICS_ALL = 3600         # 1 hour
TTL_QUIZ = 86400              # 24 hours
TTL_REFRESH_TOKEN = 2592000   # 30 days
TTL_AI_SESSION = 3600         # 1 hour


async def get_cached(key: str) -> str | None:
    return await redis.get(key)


async def set_cached(key: str, value: str, ttl: int = 300) -> None:
    await redis.setex(key, ttl, value)


async def delete_cached(key: str) -> None:
    await redis.delete(key)


async def cache_user(user_id: str, user_json: str) -> None:
    await set_cached(f"user:{user_id}", user_json, TTL_USER_PROFILE)


async def get_cached_user(user_id: str) -> str | None:
    return await get_cached(f"user:{user_id}")


async def set_refresh_token(user_id: str, token: str) -> None:
    await set_cached(f"refresh:{user_id}", token, TTL_REFRESH_TOKEN)


async def get_refresh_token(user_id: str) -> str | None:
    return await get_cached(f"refresh:{user_id}")


async def delete_refresh_token(user_id: str) -> None:
    await delete_cached(f"refresh:{user_id}")
