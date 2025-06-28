"""
User data model
"""
from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class User(BaseModel):
    """User model"""
    id: str
    email: str
    hashed_password: str
    is_active: bool = True
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True