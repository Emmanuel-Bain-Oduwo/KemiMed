from typing import Any


def success(data: Any = None, message: str = "Success") -> dict:
    return {"success": True, "data": data, "message": message}


def error(message: str, code: int = 400) -> dict:
    return {"success": False, "error": message, "code": code}
