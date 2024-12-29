# app/v1/chat/service.py
from app.db.models import ChatSession

def create_chat_session(db, title: str):
    db_chat = ChatSession(title=title)
    db_chat.save()  # Save the chat session in MongoDB
    return db_chat

def get_chat_sessions(db):
    return ChatSession.objects()  # Fetch all chat sessions from MongoDB
