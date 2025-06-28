"""
User CRUD operations
"""
import uuid
from typing import Dict, Optional
from datetime import datetime

from models.user import User
from schemas.user import UserCreate
from core.security import get_password_hash

# In-memory storage for users (replace with database in production)
users_db: Dict[str, User] = {}

def create_user(user_create: UserCreate) -> User:
    """Create a new user"""
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_create.password)
    
    user = User(
        id=user_id,
        email=user_create.email,
        hashed_password=hashed_password,
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    users_db[user_id] = user
    return user

def get_user_by_email(email: str) -> Optional[User]:
    """Get user by email"""
    for user in users_db.values():
        if user.email == email:
            return user
    return None

def get_user_by_id(user_id: str) -> Optional[User]:
    """Get user by ID"""
    return users_db.get(user_id)

def authenticate_user(email: str, password: str) -> Optional[User]:
    """Authenticate user with email and password"""
    from core.security import verify_password
    
    user = get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user