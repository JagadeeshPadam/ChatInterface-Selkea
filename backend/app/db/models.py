# from datetime import datetime, time
# from sqlalchemy import (
#     Column, String, DateTime, Text, Time, ForeignKey, Integer, Float, Boolean
# )
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import relationship
# import pytz
# from enum import Enum as PyEnum
# from sqlalchemy import Enum
# from pydantic import BaseModel

# Base = declarative_base()

# class User(Base):
#     __tablename__ = "users"
    
#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String, unique=True, index=True)
#     hashed_password = Column(String)
    
#     chats = relationship("ChatSession", back_populates="user")

# class ChatSession(Base):
#     __tablename__ = "chat_sessions"
    
#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"))
#     created_at = Column(String)
    
#     messages = relationship("Message", back_populates="session")
#     user = relationship("User", back_populates="chats")

# class Message(Base):
#     __tablename__ = "messages"
    
#     id = Column(Integer, primary_key=True, index=True)
#     content = Column(Text)
#     is_user = Column(Boolean, default=True)
#     timestamp = Column(String)
#     session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    
#     session = relationship("ChatSession", back_populates="messages")

# class SignInRequest(BaseModel):
#     username: str
#     password: str
    
# class QueryRequest(BaseModel):
#     message: str

# app/models.pyfrom pydantic import BaseModel
from pydantic import BaseModel
from mongoengine import Document, StringField, BooleanField, DateTimeField, ReferenceField, EmbeddedDocument, EmbeddedDocumentField, ListField
from datetime import datetime

# MongoDB model definitions

# First, define the Message class
class Message(Document):
    content = StringField(required=True)
    is_user = BooleanField(default=True)
    timestamp = DateTimeField(default=datetime.utcnow)
    session = ReferenceField('ChatSession', required=True)  # Reference to ChatSession

# Now, define the ChatSession class, which references the Message model
class ChatSession(Document):
    title = StringField(required=True)
    user = ReferenceField('User', required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    messages = ReferenceField(Message, reverse_delete_rule=2)  # Reference to messages

# Finally, define the User class, which references the ChatSession model
class User(Document):
    username = StringField(unique=True, required=True)
    hashed_password = StringField(required=True)
    chats = ReferenceField(ChatSession, reverse_delete_rule=2)  # Reference to ChatSession

class QueryMessage(EmbeddedDocument):
    query = StringField(required=True)
    content = StringField(required=True)
    
class Session(Document):
    session_id = StringField(unique=True, required=True)
    # username = StringField(unique=True, required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    messages = ListField(EmbeddedDocumentField(QueryMessage))  # List of messages
    



# Pydantic schemas for request validation
class SignInRequest(BaseModel):
    username: str
    password: str

class QueryRequest(BaseModel):
    message: str
    session_id: str
