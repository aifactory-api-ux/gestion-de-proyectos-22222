from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Literal
from datetime import date, datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import declarative_base, relationship
import enum

Base = declarative_base()


class UserRole(str, enum.Enum):
    admin = "admin"
    manager = "manager"
    viewer = "viewer"


class ProjectStatus(str, enum.Enum):
    on_track = "on_track"
    at_risk = "at_risk"
    delayed = "delayed"
    completed = "completed"


class NotificationType(str, enum.Enum):
    budget_deviation = "budget_deviation"
    milestone = "milestone"
    forecast_change = "forecast_change"
    ai_message = "ai_message"


class MessageSender(str, enum.Enum):
    user = "user"
    ai = "ai"


class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.viewer, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class ProjectModel(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    budget = Column(Float, nullable=False)
    executed = Column(Float, default=0.0, nullable=False)
    forecast = Column(Float, default=0.0, nullable=False)
    status = Column(SQLEnum(ProjectStatus), default=ProjectStatus.on_track, nullable=False)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=False)


class NotificationModel(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(SQLEnum(NotificationType), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    read = Column(Boolean, default=False, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)


class ChatMessageModel(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender = Column(SQLEnum(MessageSender), nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)


class User(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: Literal["admin", "manager", "viewer"]
    is_active: bool

    class Config:
        from_attributes = True


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


class Project(BaseModel):
    id: int
    name: str
    description: Optional[str]
    start_date: date
    end_date: date
    budget: float
    executed: float
    forecast: float
    status: Literal["on_track", "at_risk", "delayed", "completed"]
    manager_id: int

    class Config:
        from_attributes = True


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str]
    start_date: date
    end_date: date
    budget: float
    manager_id: int


class ProjectUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    start_date: Optional[date]
    end_date: Optional[date]
    budget: Optional[float]
    executed: Optional[float]
    forecast: Optional[float]
    status: Optional[Literal["on_track", "at_risk", "delayed", "completed"]]
    manager_id: Optional[int]


class KPI(BaseModel):
    total_budget: float
    total_executed: float
    total_deviation: float
    total_forecast: float


class TrendPoint(BaseModel):
    date: date
    planned: float
    executed: float


class Notification(BaseModel):
    id: int
    type: Literal["budget_deviation", "milestone", "forecast_change", "ai_message"]
    title: str
    message: str
    created_at: datetime
    read: bool
    user_id: int

    class Config:
        from_attributes = True


class NotificationCreate(BaseModel):
    type: Literal["budget_deviation", "milestone", "forecast_change", "ai_message"]
    title: str
    message: str
    user_id: int


class ChatMessage(BaseModel):
    id: int
    sender: Literal["user", "ai"]
    message: str
    timestamp: datetime
    project_id: Optional[int]

    class Config:
        from_attributes = True


class ChatMessageCreate(BaseModel):
    message: str
    project_id: Optional[int]