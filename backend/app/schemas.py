from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from .models import PriorityEnum

class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    due_date: Optional[datetime] = None
    priority: PriorityEnum = PriorityEnum.MEDIUM
    category: Optional[str] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(TodoBase):
    title: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[PriorityEnum] = None

class TodoEdit(BaseModel):
    is_editing: bool
    last_modified_by: Optional[str] = None

class TodoResponse(TodoBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_editing: bool = False
    last_modified_by: Optional[str] = None
    version: int = 1
    position: int = 0

    class Config:
        from_attributes = True
