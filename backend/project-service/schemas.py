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