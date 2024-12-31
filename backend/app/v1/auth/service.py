
from app.db.models import User
from fastapi import HTTPException
from core.security import get_password_hash, verify_password

def signup_user(db, username: str, password: str):
    # Check if user already exists
    existing_user = User.objects(username=username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists.")

    # Hash the password before saving
    hashed_password = get_password_hash(password)
    db_user = User(username=username, hashed_password=hashed_password)
    db_user.save()
    return db_user

def get_user(db, username: str, password: str):
    # Find user by username
    user = User.objects(username=username).first()
    if user and verify_password(password, user.hashed_password):
        return user
    else:
        raise HTTPException(status_code=400, detail="Invalid username or password")