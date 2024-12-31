from app.db.models import User
from fastapi import HTTPException
from core.security import get_password_hash, verify_password

def signup_user(db, username: str, password: str):
    existing_user = User.objects(username=username).first()# Find user by username
    print(existing_user)
    if existing_user:
        return None
    db_user = User(username=username, hashed_password=password)
    db_user.save()  # Save the user to MongoDB
    return db_user

def get_user(db, username: str, password: str):
    user = User.objects(username=username).first()  # Find user by username
    print(user.hashed_password)
    print(password)
    if user and password == user.hashed_password:
        return user
    else: 
        raise HTTPException(status_code=400, detail="Invalid username or password")
