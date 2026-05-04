from pydantic import BaseModel
from typing import Optional


class ChatMessageCreate(BaseModel):
    message: str
    project_id: Optional[int] = None