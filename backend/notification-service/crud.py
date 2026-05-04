from sqlalchemy.orm import Session
from backend.shared.models import NotificationModel
from backend.notification_service.schemas import NotificationCreate
from typing import List, Optional


def get_notifications(
    db: Session,
    user_id: int,
    type_filter: Optional[str] = None,
    read_filter: Optional[bool] = None
) -> List[NotificationModel]:
    query = db.query(NotificationModel).filter(NotificationModel.user_id == user_id)

    if type_filter:
        query = query.filter(NotificationModel.type == type_filter)
    if read_filter is not None:
        query = query.filter(NotificationModel.read == read_filter)

    return query.order_by(NotificationModel.created_at.desc()).all()


def create_notification(db: Session, notification_create: NotificationCreate) -> NotificationModel:
    db_notification = NotificationModel(
        type=notification_create.type,
        title=notification_create.title,
        message=notification_create.message,
        user_id=notification_create.user_id,
        read=False
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


def mark_as_read(db: Session, notification_id: int, user_id: int) -> Optional[NotificationModel]:
    notification = db.query(NotificationModel).filter(
        NotificationModel.id == notification_id,
        NotificationModel.user_id == user_id
    ).first()
    if notification:
        notification.read = True
        db.commit()
        db.refresh(notification)
    return notification


def delete_notification(db: Session, notification_id: int, user_id: int) -> bool:
    notification = db.query(NotificationModel).filter(
        NotificationModel.id == notification_id,
        NotificationModel.user_id == user_id
    ).first()
    if notification:
        db.delete(notification)
        db.commit()
        return True
    return False