# app/v1/chat/service.py
from app.db.models import ChatSession, Session
import uuid

def retrive_user_sessions(db, username:str):
    sessions = Session.objects(username=username)

    # Serialize the sessions into a list of dictionaries
    session_list = [
        {
            "id": str(session.id),
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
