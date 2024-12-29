# # app/database.py
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# from .models import Base

# DATABASE_URL = "postgresql://postgres:River@localhost:5433/mydatabase"

# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # Create the database tables if they do not exist
# def init_db():
#     Base.metadata.create_all(bind=engine)

# # Dependency to get DB session
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()



# app/database.py
# app/db/database.py
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import Depends
from app.db.models import User, ChatSession
from bson import ObjectId
import mongoengine

# MongoDB URI (use the URI you provided in main.py)
MONGO_URI = "mongodb+srv://selkea:River%406730@cluster0.wc5cw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "mydatabase"

client: AsyncIOMotorClient = None

# Dependency to get the MongoDB database client
async def get_db():
    global client
    if client is None:
        client = AsyncIOMotorClient(MONGO_URI)
        mongoengine.connect(db=DATABASE_NAME, host=MONGO_URI)
    return client[DATABASE_NAME]

# Dependency to ensure a clean connection when shutdown
def close_db():
    if client:
        client.close()

