

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
    timestamp = DateTimeField(default=datetime.utcnow)
    
class Session(Document):
    session_id = StringField(unique=True, required=True)
    username = StringField(required=True)
    title = StringField()
    created_at = DateTimeField(default=datetime.utcnow)
    messages = ListField(EmbeddedDocumentField(QueryMessage))  # List of messages
    



# Pydantic schemas for request validation
class SignInRequest(BaseModel):
    username: str
    password: str

class QueryRequest(BaseModel):
    message: str
    session_id: str
    username: str

class SessionRequest(BaseModel):
    username: str

class SessionUpdateRequest(BaseModel):
    session_id: str
    title: str
    username: str

class ChatsRequest(BaseModel):
    session_id: str
    username: str