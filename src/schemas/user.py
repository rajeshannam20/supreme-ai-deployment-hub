"""
User schemas for API requests and responses
"""
from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    """Base user schema"""
    email: str

class UserCreate(UserBase):
    """Schema for user creation"""
    password: str

class UserLogin(BaseModel):
    """Schema for user login"""
    email: str
    password: str

class UserResponse(UserBase):
    """Schema for user response (without password)"""
    id: str
    is_active: bool
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    """Schema for token response"""
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """Schema for token data"""
    email: Optional[str] = None