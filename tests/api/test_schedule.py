"""
Tests for Schedule API endpoints
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timezone
import sys
import os

# Add src path for imports
sys.path.append('/home/runner/work/supreme-ai-deployment-hub/supreme-ai-deployment-hub/src')
sys.path.append('/home/runner/work/supreme-ai-deployment-hub/supreme-ai-deployment-hub')

from main import app
from app.db.base import Base
from app.db.session import get_db

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_schedules.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create tables for testing
Base.metadata.create_all(bind=engine)

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_and_teardown():
    """Clean up database before each test"""
    # Clean up the test database
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    # Clean up after test
    Base.metadata.drop_all(bind=engine)

class TestScheduleAPI:
    """Test cases for Schedule API endpoints"""
    
    def test_get_schedules_empty(self):
        """Test getting schedules when none exist"""
        response = client.get("/schedules/")
        assert response.status_code == 200
        assert response.json() == []
    
    def test_create_schedule(self):
        """Test creating a new schedule"""
        schedule_data = {
            "title": "Test Meeting",
            "description": "A test meeting",
            "start_time": "2024-07-01T10:00:00Z",
            "end_time": "2024-07-01T11:00:00Z"
        }
        response = client.post("/schedules/", json=schedule_data)
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == schedule_data["title"]
        assert data["description"] == schedule_data["description"]
        assert "id" in data
        assert data["id"] == 1
    
    def test_get_schedule_by_id(self):
        """Test getting a specific schedule by ID"""
        # First create a schedule
        schedule_data = {
            "title": "Test Meeting",
            "description": "A test meeting",
            "start_time": "2024-07-01T10:00:00Z",
            "end_time": "2024-07-01T11:00:00Z"
        }
        create_response = client.post("/schedules/", json=schedule_data)
        schedule_id = create_response.json()["id"]
        
        # Then get it by ID
        response = client.get(f"/schedules/{schedule_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == schedule_id
        assert data["title"] == schedule_data["title"]
    
    def test_get_nonexistent_schedule(self):
        """Test getting a schedule that doesn't exist"""
        response = client.get("/schedules/999")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
    
    def test_update_schedule(self):
        """Test updating an existing schedule"""
        # First create a schedule
        schedule_data = {
            "title": "Original Meeting",
            "description": "Original description",
            "start_time": "2024-07-01T10:00:00Z",
            "end_time": "2024-07-01T11:00:00Z"
        }
        create_response = client.post("/schedules/", json=schedule_data)
        schedule_id = create_response.json()["id"]
        
        # Update the schedule
        update_data = {
            "title": "Updated Meeting",
            "description": "Updated description"
        }
        response = client.put(f"/schedules/{schedule_id}", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == update_data["title"]
        assert data["description"] == update_data["description"]
        # Original start/end times should remain unchanged (ignoring timezone format differences)
        assert data["start_time"].replace("Z", "").replace("+00:00", "") == schedule_data["start_time"].replace("Z", "").replace("+00:00", "")
        assert data["end_time"].replace("Z", "").replace("+00:00", "") == schedule_data["end_time"].replace("Z", "").replace("+00:00", "")
    
    def test_update_nonexistent_schedule(self):
        """Test updating a schedule that doesn't exist"""
        update_data = {"title": "Updated Meeting"}
        response = client.put("/schedules/999", json=update_data)
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
    
    def test_delete_schedule(self):
        """Test deleting a schedule"""
        # First create a schedule
        schedule_data = {
            "title": "Meeting to Delete",
            "description": "This will be deleted",
            "start_time": "2024-07-01T10:00:00Z",
            "end_time": "2024-07-01T11:00:00Z"
        }
        create_response = client.post("/schedules/", json=schedule_data)
        schedule_id = create_response.json()["id"]
        
        # Delete the schedule
        response = client.delete(f"/schedules/{schedule_id}")
        assert response.status_code == 204
        
        # Verify it's gone
        get_response = client.get(f"/schedules/{schedule_id}")
        assert get_response.status_code == 404
    
    def test_delete_nonexistent_schedule(self):
        """Test deleting a schedule that doesn't exist"""
        response = client.delete("/schedules/999")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
    
    def test_get_multiple_schedules(self):
        """Test getting multiple schedules"""
        # Create multiple schedules
        schedules = [
            {
                "title": "Meeting 1",
                "description": "First meeting",
                "start_time": "2024-07-01T10:00:00Z",
                "end_time": "2024-07-01T11:00:00Z"
            },
            {
                "title": "Meeting 2", 
                "description": "Second meeting",
                "start_time": "2024-07-01T14:00:00Z",
                "end_time": "2024-07-01T15:00:00Z"
            }
        ]
        
        for schedule_data in schedules:
            client.post("/schedules/", json=schedule_data)
        
        # Get all schedules
        response = client.get("/schedules/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        
        # Verify the schedules
        titles = [schedule["title"] for schedule in data]
        assert "Meeting 1" in titles
        assert "Meeting 2" in titles
    
    def test_create_schedule_validation(self):
        """Test schedule creation validation"""
        # Test missing required fields
        invalid_data = {
            "description": "Missing title and times"
        }
        response = client.post("/schedules/", json=invalid_data)
        assert response.status_code == 422
        
        # Test invalid datetime format
        invalid_data = {
            "title": "Test Meeting",
            "start_time": "invalid-date",
            "end_time": "2024-07-01T11:00:00Z"
        }
        response = client.post("/schedules/", json=invalid_data)
        assert response.status_code == 422