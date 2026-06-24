import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.ai_service import chat_stream, build_tutor_prompt
from app.services.gemini_service import transcribe_audio, text_to_speech

router = APIRouter()


@router.websocket("/chat/{session_id}")
async def ws_chat(websocket: WebSocket, session_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            message = data.get("message", "")
            mode = data.get("mode", "teach")
            discipline = data.get("discipline", "pharmacy")

            if not message:
                await websocket.send_json({"type": "error", "content": "Empty message"})
                continue

            system = build_tutor_prompt(discipline, mode)
            async for token in chat_stream([{"role": "user", "content": message}], system):
                await websocket.send_json({"type": "token", "content": token})
            await websocket.send_json({"type": "done", "session_id": session_id})
    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_json({"type": "error", "content": str(e)})
        except Exception:
            pass


@router.websocket("/voice/{session_id}")
async def ws_voice(websocket: WebSocket, session_id: str):
    await websocket.accept()
    try:
        while True:
            audio_bytes = await websocket.receive_bytes()
            try:
                transcript = await transcribe_audio(audio_bytes, "audio/webm")
                await websocket.send_json({"type": "transcript", "text": transcript})

                ai_response = ""
                system = build_tutor_prompt("general", "teach")
                async for token in chat_stream([{"role": "user", "content": transcript}], system):
                    ai_response += token
                    await websocket.send_json({"type": "ai_text", "text": token})

                audio_response = await text_to_speech(ai_response, "DrCore")
                await websocket.send_bytes(audio_response)
            except Exception as e:
                await websocket.send_json({"type": "error", "content": str(e)})
    except WebSocketDisconnect:
        pass
