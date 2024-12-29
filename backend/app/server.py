# # app/main.py
# import os
# from fastapi import FastAPI
# from alembic import command
# from alembic.config import Config as AlembicConfig
# from fastapi.concurrency import asynccontextmanager
# from app.db.database import init_db
# from fastapi.staticfiles import StaticFiles
# from app.v1.auth.routes import auth_router
# from app.v1.chat.routes import chat_router
# from app.v1.query.routes import query_router
# from starlette.middleware.cors import CORSMiddleware



# app = FastAPI()

# # Define allowed origins
# origins = [
#     "http://localhost",
#     "http://localhost:5173",  # If you're running a frontend on this port
#     "https://yourfrontenddomain.com",  # Add your frontend domain here
# ]

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,  # List of allowed origins
#     allow_credentials=True,  # Allow cookies to be sent
#     allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
#     allow_headers=["*"],  # Allow all headers
# )

# # Initialize the database
# init_db()

# # Include routes for both services
# app.include_router(auth_router, prefix="/auth", tags=["auth"])
# app.include_router(chat_router, prefix="/chat", tags=["chat"])
# app.include_router(query_router, prefix="/query", tags=["query"])

# def run_migrations():
#     # Create Alembic configuration
#     script_location = os.path.join(os.path.dirname(__file__), 'alembic')
#     alembic_cfg = AlembicConfig(os.path.join(script_location, 'alembic.ini'))
#     alembic_cfg.set_main_option('script_location', script_location)
    
#     # Generate new migration script
#     command.revision(alembic_cfg, autogenerate=True, message="Auto migration")
    
#     # Apply the migrations
#     command.upgrade(alembic_cfg, 'head')

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Update DB models
#     run_migrations()
#     yield
#     # Clean up the ML models and release the resources
#     # ml_models.clear()

# # Root endpoint
# @app.get("/")
# async def root():
#     return {"message": "welcome to selkea ai!"}



# app/main.py
# app/main.py
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.v1.auth.routes import auth_router
from app.v1.chat.routes import chat_router
from app.v1.query.routes import query_router
from starlette.middleware.cors import CORSMiddleware
from app.db.database import get_db, close_db
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

# Define allowed origins
origins = [
    "http://localhost",
    "http://localhost:5173",  # If you're running a frontend on this port
    "https://yourfrontenddomain.com",  # Add your frontend domain here
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Allow cookies to be sent
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include routes for both services
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(chat_router, prefix="/chat", tags=["chat"])
app.include_router(query_router, prefix="/query", tags=["query"])

# Ensure connection to MongoDB and close it on shutdown
@app.on_event("startup")
async def connect_to_db():
    try:
        # Just ensure the connection happens via the dependency injection mechanism
        db = await get_db()
        print("Database connected successfully.")
    except Exception as e:
        print(f"Error connecting to the database: {e}")

@app.on_event("shutdown")
async def disconnect_from_db():
    close_db()
    print("Database connection closed.")

@app.get("/")
async def root():
    return {"message": "welcome to selkea ai!"}
