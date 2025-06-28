"""
Pydantic schemas for Schedule input/output validation
"""

from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class ScheduleBase(BaseModel):
    """Base schema for Schedule with common fields"""
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime


class ScheduleCreate(ScheduleBase):
    """Schema for creating a new Schedule"""
    pass


class ScheduleUpdate(BaseModel):
    """Schema for updating an existing Schedule"""
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None


class ScheduleResponse(ScheduleBase):
    """Schema for Schedule responses"""
    id: int
    
    model_config = ConfigDict(from_attributes=True)