"""
Schedule SQLAlchemy model
"""

from sqlalchemy import Column, Integer, String, DateTime
from app.db.base import Base
from datetime import datetime


class Schedule(Base):
    """
    Schedule model with id, title, description, start_time, and end_time fields
    """
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)