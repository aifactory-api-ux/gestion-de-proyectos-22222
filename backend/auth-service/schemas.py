from pydantic import BaseModel, EmailStr
from typing import Optional
from backend.shared.models import User, UserCreate as SharedUserCreate


class UserRegister(User):
    pass


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None