from sqlalchemy.orm import Session
from backend.shared.models import ChatMessageModel, MessageSender
from backend.chat_service.schemas import ChatMessageCreate
from typing import List, Optional


def get_messages(db: Session, project_id: Optional[int] = None) -> List[ChatMessageModel]:
    query = db.query(ChatMessageModel)
    if project_id is not None:
        query = query.filter(ChatMessageModel.project_id == project_id)
    return query.order_by(ChatMessageModel.timestamp.asc()).all()


def create_message(db: Session, message_create: ChatMessageCreate, sender_id: int) -> ChatMessageModel:
    db_message = ChatMessageModel(
        sender=MessageSender.user,
        message=message_create.message,
        project_id=message_create.project_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    ai_response = ChatMessageModel(
        sender=MessageSender.ai,
        message=f"AI response to: {message_create.message}",
        project_id=message_create.project_id
    )
    db.add(ai_response)
    db.commit()
    db.refresh(ai_response)

    return db_message