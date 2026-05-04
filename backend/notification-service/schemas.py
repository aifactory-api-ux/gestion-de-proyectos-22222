from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


class NotificationCreate(BaseModel):
    type: Literal["budget_deviation", "milestone", "forecast_change", "ai_message"]
    title: str
    message: str
    user_id: int