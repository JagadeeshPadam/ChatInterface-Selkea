# app/v1/chat/service.py
from app.db.models import ChatSession, Session
import uuid
from datetime import datetime

def retrive_user_sessions(db, username:str):
    sessions = Session.objects(username=username)

    # Serialize the sessions into a list of dictionaries
    session_list = [
        {
            "id": str(session.session_id),
            "title":str(session.title)
        }
        for session in sessions
    ]
    return session_list

def update_user_session(session_id: str, username: str, title: str, db):
    # Fetch the session that matches the session_id and username
    session = Session.objects(session_id=session_id, username=username).first()
    
    # Check if the session exists
    if session:
        # Update the title
        session.title = title
        session.save()  # Save the changes to the database
        return {"status": "success", "message": "Session title updated successfully."}
    else:
        # Return an appropriate response if no session is found
        return {"status": "error", "message": "Session not found."}



def create_user_session(username:str, db):
    session_id=str(uuid.uuid4())
    session = Session(username=username, session_id=session_id)
    return session.session_id  # Fetch all chat sessions from MongoDB



def retrive_user_session_chat(session_id: str, username: str, db):
    try:
        # Query the database for the session
        session = Session.objects.get(username=username, session_id=session_id)
        
        # Serialize messages into the desired format
        formatted_messages = []
        for message in session.messages:
            formatted_message = {
                "query": message.query,
                "content": message.content,
                "timestamp": {
                    "$date": message.timestamp.isoformat() + "Z"  # Convert to ISO 8601 with UTC timezone
                }
            }
            formatted_messages.append(formatted_message)
        
        # Print formatted messages
        for msg in formatted_messages:
            print(msg)
        
        return formatted_messages
    except Exception:
        print("Session not found.")
        return []


    