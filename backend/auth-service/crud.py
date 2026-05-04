from sqlalchemy.orm import Session
from backend.shared.models import UserModel, User
from backend.shared.security import get_password_hash, verify_password
from backend.auth_service.schemas import UserCreate


def get_user_by_email(db: Session, email: str):
    return db.query(UserModel).filter(UserModel.email == email).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(UserModel).filter(UserModel.id == user_id).first()


def create_user(db: Session, user_create: UserCreate) -> UserModel:
    hashed_password = get_password_hash(user_create.password)
    db_user = UserModel(
        email=user_create.email,
        full_name=user_create.full_name,
        hashed_password=hashed_password,
        role="viewer",
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user