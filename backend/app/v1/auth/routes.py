# from fastapi import APIRouter, Depends, HTTPException
# from app.v1.auth.service import signup_user, get_user
# from app.db.database import get_db
# from app.db.models import User, SignInRequest # Import the Pydantic schemas
# from sqlalchemy.orm import Session

# auth_router = APIRouter()

# @auth_router.post("/signup")
# def signup(request: SignInRequest , db: Session = Depends(get_db)):
#     user = signup_user(db, request.username, request.password)
#     if user:
#         return user
#     raise HTTPException(status_code=400, detail="Username already taken")

# @auth_router.post("/signin")
# def get_user_route(request: SignInRequest, db: Session = Depends(get_db)):
#     return get_user(db, request.username, request.password)


# app/auth/routes.py
from fastapi import APIRouter, Depends, HTTPException
from app.v1.auth.service import signup_user, get_user
from app.db.database import get_db
from app.db.models import User, SignInRequest
from mongoengine import connect

auth_router = APIRouter()

@auth_router.post("/signup")
def signup(request: SignInRequest, db=Depends(get_db)):
    user = signup_user(db, request.username, request.password)
    if user:
        return user
    raise HTTPException(status_code=400, detail="Username already taken")

@auth_router.post("/signin")
def get_user_route(request: SignInRequest, db=Depends(get_db)):
    return get_user(db, request.username, request.password)
