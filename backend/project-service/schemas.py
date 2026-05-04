from pydantic import BaseModel
from typing import Optional, Literal
from datetime import date
from backend.shared.models import Project, ProjectCreate as SharedProjectCreate, ProjectUpdate as SharedProjectUpdate


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str]
    start_date: date
    end_date: date
    budget: float
    manager_id: int


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = None
    executed: Optional[float] = None
    forecast: Optional[float] = None
    status: Optional[Literal["on_track", "at_risk", "delayed", "completed"]] = None
    manager_id: Optional[int] = None


class KPI(BaseModel):
    total_budget: float
    total_executed: float
    total_deviation: float
    total_forecast: float


class TrendPoint(BaseModel):
    date: date
    planned: float
    executed: float