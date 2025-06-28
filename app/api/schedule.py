"""
FastAPI router for Schedule endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.schedule import ScheduleCreate, ScheduleUpdate, ScheduleResponse
from app.crud import schedule as crud_schedule

router = APIRouter()


@router.get("/", response_model=List[ScheduleResponse])
def get_schedules(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all schedules with pagination"""
    schedules = crud_schedule.get_schedules(db, skip=skip, limit=limit)
    return schedules


@router.get("/{schedule_id}", response_model=ScheduleResponse)
def get_schedule(
    schedule_id: int,
    db: Session = Depends(get_db)
):
    """Get a single schedule by ID"""
    schedule = crud_schedule.get_schedule(db, schedule_id=schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )
    return schedule


@router.post("/", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_schedule(
    schedule: ScheduleCreate,
    db: Session = Depends(get_db)
):
    """Create a new schedule"""
    return crud_schedule.create_schedule(db=db, schedule=schedule)


@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(
    schedule_id: int,
    schedule_update: ScheduleUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing schedule"""
    schedule = crud_schedule.update_schedule(
        db=db, 
        schedule_id=schedule_id, 
        schedule_update=schedule_update
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )
    return schedule


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db)
):
    """Delete a schedule"""
    success = crud_schedule.delete_schedule(db=db, schedule_id=schedule_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )
    return None