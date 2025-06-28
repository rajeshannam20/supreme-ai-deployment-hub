"""
CRUD operations for Schedule model
"""

from sqlalchemy.orm import Session
from app.models.schedule import Schedule
from app.schemas.schedule import ScheduleCreate, ScheduleUpdate
from typing import List, Optional


def get_schedule(db: Session, schedule_id: int) -> Optional[Schedule]:
    """Get a single schedule by ID"""
    return db.query(Schedule).filter(Schedule.id == schedule_id).first()


def get_schedules(db: Session, skip: int = 0, limit: int = 100) -> List[Schedule]:
    """Get a list of schedules with pagination"""
    return db.query(Schedule).offset(skip).limit(limit).all()


def create_schedule(db: Session, schedule: ScheduleCreate) -> Schedule:
    """Create a new schedule"""
    db_schedule = Schedule(
        title=schedule.title,
        description=schedule.description,
        start_time=schedule.start_time,
        end_time=schedule.end_time
    )
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule


def update_schedule(db: Session, schedule_id: int, schedule_update: ScheduleUpdate) -> Optional[Schedule]:
    """Update an existing schedule"""
    db_schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not db_schedule:
        return None
    
    # Update only provided fields
    update_data = schedule_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_schedule, field, value)
    
    db.commit()
    db.refresh(db_schedule)
    return db_schedule


def delete_schedule(db: Session, schedule_id: int) -> bool:
    """Delete a schedule"""
    db_schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not db_schedule:
        return False
    
    db.delete(db_schedule)
    db.commit()
    return True