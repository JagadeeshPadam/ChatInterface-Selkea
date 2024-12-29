# app/v1/chat/routes.py
from fastapi import APIRouter, Depends
from app.v1.chat.service import create_chat_session, get_chat_sessions
from app.db.database import get_db
from app.db.models import ChatSession

chat_router = APIRouter()

@chat_router.post("/chat")
def create_chat(title: str, db=Depends(get_db)):
    return create_chat_session(db, title)

@chat_router.get("/chats")
def get_chats(db=Depends(get_db)):
    return get_chat_sessions(db)
