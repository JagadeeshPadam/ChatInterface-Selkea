# app/v1/chat/routes.py
from fastapi import APIRouter, Depends
from app.v1.chat.service import retrive_user_sessions, create_user_session, update_user_session, retrive_user_session_chat
from app.db.database import get_db
from app.db.models import ChatSession, SessionRequest, SessionUpdateRequest, ChatsRequest

chat_router = APIRouter()

@chat_router.post("/create_session")
def create_session(request:SessionRequest, db=Depends(get_db)):
    Session_id = create_user_session(request.username, db)
    return {"session_id": Session_id}

@chat_router.post("/update_session")
def update_session(request:SessionUpdateRequest, db=Depends(get_db)):
    return update_user_session(request.session_id, request.username, request.title, db)

@chat_router.post("/session")
def retrive_sessions(request:SessionRequest, db=Depends(get_db)):
    sessions = retrive_user_sessions(db, request.username)
    return {'session':sessions}

@chat_router.post("/session_chats")
def retrive_session_chat(request:ChatsRequest, db=Depends(get_db)):
    messages = retrive_user_session_chat(request.session_id, request.username, db)
    # print(messages)
    return {'messages':messages}