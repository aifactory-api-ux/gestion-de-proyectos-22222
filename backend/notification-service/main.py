from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.shared.db import get_db
from backend.shared.models import Notification
from backend.notification_service.schemas import NotificationCreate
from backend.notification_service import crud
from backend.notification_service.dependencies import get_current_user

app = FastAPI(title="Notification Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "notification-service", "version": "1.0.0"}


@app.get("/api/notifications", response_model=List[Notification])
async def get_notifications(
    type: Optional[str] = Query(None),
    read: Optional[bool] = Query(None),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notifications = crud.get_notifications(db, current_user.id, type, read)
    return notifications


@app.post("/api/notifications", response_model=Notification, status_code=status.HTTP_201_CREATED)
async def create_notification(
    notification_create: NotificationCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notification = crud.create_notification(db, notification_create)
    return notification


@app.patch("/api/notifications/{notification_id}/read", response_model=Notification)
async def mark_notification_as_read(
    notification_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notification = crud.mark_as_read(db, notification_id, current_user.id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification


@app.delete("/api/notifications/{notification_id}")
async def delete_notification(
    notification_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = crud.delete_notification(db, notification_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"detail": "Notification deleted"}