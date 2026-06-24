import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.database import get_db
from app.models.study_room import StudyRoom
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.utils.response import success

router = APIRouter()


class RoomCreate(BaseModel):
    name: str
    deck_id: str | None = None


@router.get("")
async def list_rooms(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudyRoom).where(StudyRoom.members.contains([str(current_user.id)])).order_by(StudyRoom.created_at.desc()))
    rooms = result.scalars().all()
    return success([{"id": str(r.id), "name": r.name, "member_count": len(r.members or []), "is_active": r.is_active} for r in rooms])


@router.post("")
async def create_room(body: RoomCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    room = StudyRoom(
        name=body.name,
        created_by=current_user.id,
        deck_id=uuid.UUID(body.deck_id) if body.deck_id else None,
        members=[str(current_user.id)],
    )
    db.add(room)
    await db.flush()
    await db.refresh(room)
    return success({"id": str(room.id), "name": room.name}, "Room created")


@router.get("/{room_id}")
async def get_room(room_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudyRoom).where(StudyRoom.id == uuid.UUID(room_id)))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return success({"id": str(room.id), "name": room.name, "members": room.members, "deck_id": str(room.deck_id) if room.deck_id else None, "is_active": room.is_active})


@router.post("/{room_id}/join")
async def join_room(room_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudyRoom).where(StudyRoom.id == uuid.UUID(room_id)))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    members = list(room.members or [])
    if str(current_user.id) not in members:
        members.append(str(current_user.id))
        room.members = members
        await db.flush()
    return success(message="Joined room")


@router.post("/{room_id}/leave")
async def leave_room(room_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudyRoom).where(StudyRoom.id == uuid.UUID(room_id)))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    members = [m for m in (room.members or []) if m != str(current_user.id)]
    room.members = members
    await db.flush()
    return success(message="Left room")


@router.delete("/{room_id}")
async def delete_room(room_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudyRoom).where(StudyRoom.id == uuid.UUID(room_id), StudyRoom.created_by == current_user.id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=403, detail="Not authorized or room not found")
    await db.delete(room)
    return success(message="Room deleted")
