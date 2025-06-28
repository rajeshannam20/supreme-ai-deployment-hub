"""
Database session configuration
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
import os

# Database URL - using SQLite for simplicity
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./schedules.db")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Session:
    """
    Database dependency that yields a database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()