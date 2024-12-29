# app/v1/query/routes.py
from fastapi import APIRouter, Depends, HTTPException
from app.v1.query.service import process_user_query
from app.db.models import QueryRequest
from app.db.database import get_db

query_router = APIRouter()

@query_router.post("/query")
async def handle_user_query(request: QueryRequest, db=Depends(get_db)):
    """
    Endpoint to handle user queries.
    Expects a query string and returns the processed response.
    """
    try:
        result = process_user_query(request.message,request.session_id,db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
