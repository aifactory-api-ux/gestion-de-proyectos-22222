from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.shared.db import get_db, create_tables
from backend.shared.models import ChatMessage
from backend.chat_service.schemas import ChatMessageCreate
from backend.chat_service import crud
from backend.chat_service.dependencies import get_current_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield

app = FastAPI(title="Chat Service", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "chat-service", "version": "1.0.0"}


@app.get("/api/chat/messages", response_model=List[ChatMessage])
async def get_messages(
    project_id: Optional[int] = Query(None),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages = crud.get_messages(db, project_id)
    return messages


@app.post("/api/chat/messages", response_model=ChatMessage, status_code=status.HTTP_201_CREATED)
async def create_message(
    message_create: ChatMessageCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    message = crud.create_message(db, message_create, current_user.id)
    return message