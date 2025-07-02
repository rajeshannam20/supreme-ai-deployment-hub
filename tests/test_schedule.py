"""
Tests for schedule CRUD operations.
"""

import pytest


def test_list_schedules_requires_auth(test_client):
    """Test that listing schedules requires authentication."""
    response = test_client.get("/schedules")
    assert response.status_code == 401


def test_list_schedules_empty(test_client, auth_headers_user):
    """Test listing schedules when none exist."""
    response = test_client.get("/schedules", headers=auth_headers_user)
    assert response.status_code == 200
    assert response.json() == []


def test_create_schedule_requires_auth(test_client):
    """Test that creating a schedule requires authentication."""
    schedule_data = {
        "name": "Test Schedule",
        "description": "A test schedule",
        "cron_expression": "0 0 * * *",
        "enabled": True,
    }
    response = test_client.post("/schedules", json=schedule_data)
    assert response.status_code == 401


def test_create_schedule_success(test_client, auth_headers_user):
    """Test successful schedule creation."""
    schedule_data = {
        "name": "Test Schedule",
        "description": "A test schedule",
        "cron_expression": "0 0 * * *",
        "enabled": True,
    }
    response = test_client.post(
        "/schedules", headers=auth_headers_user, json=schedule_data
    )
    assert response.status_code == 200

    json_response = response.json()
    assert json_response["name"] == schedule_data["name"]
    assert json_response["description"] == schedule_data["description"]
    assert json_response["cron_expression"] == schedule_data["cron_expression"]
    assert json_response["enabled"] == schedule_data["enabled"]
    assert "id" in json_response
    assert "created_at" in json_response
    assert "updated_at" in json_response


def test_create_schedule_minimal(test_client, auth_headers_user):
    """Test creating a schedule with minimal required fields."""
    schedule_data = {"name": "Minimal Schedule", "cron_expression": "0 12 * * *"}
    response = test_client.post(
        "/schedules", headers=auth_headers_user, json=schedule_data
    )
    assert response.status_code == 200

    json_response = response.json()
    assert json_response["name"] == schedule_data["name"]
    assert json_response["cron_expression"] == schedule_data["cron_expression"]
    assert json_response["description"] is None
    assert json_response["enabled"] is True  # Default value


def test_get_schedule_not_found(test_client, auth_headers_user):
    """Test getting a non-existent schedule."""
    response = test_client.get("/schedules/nonexistent", headers=auth_headers_user)
    assert response.status_code == 404
    assert "Schedule not found" in response.json()["detail"]


def test_get_schedule_success(test_client, auth_headers_user):
    """Test getting a specific schedule."""
    # First create a schedule
    schedule_data = {
        "name": "Get Test Schedule",
        "description": "Schedule for get test",
        "cron_expression": "0 6 * * *",
        "enabled": False,
    }
    create_response = test_client.post(
        "/schedules", headers=auth_headers_user, json=schedule_data
    )
    schedule_id = create_response.json()["id"]

    # Now get it
    response = test_client.get(f"/schedules/{schedule_id}", headers=auth_headers_user)
    assert response.status_code == 200

    json_response = response.json()
    assert json_response["id"] == schedule_id
    assert json_response["name"] == schedule_data["name"]


def test_update_schedule_not_found(test_client, auth_headers_user):
    """Test updating a non-existent schedule."""
    schedule_data = {"name": "Updated Schedule", "cron_expression": "0 18 * * *"}
    response = test_client.put(
        "/schedules/nonexistent", headers=auth_headers_user, json=schedule_data
    )
    assert response.status_code == 404


def test_update_schedule_success(test_client, auth_headers_user):
    """Test successful schedule update."""
    # First create a schedule
    original_data = {
        "name": "Original Schedule",
        "description": "Original description",
        "cron_expression": "0 9 * * *",
        "enabled": True,
    }
    create_response = test_client.post(
        "/schedules", headers=auth_headers_user, json=original_data
    )
    schedule_id = create_response.json()["id"]

    # Update it
    updated_data = {
        "name": "Updated Schedule",
        "description": "Updated description",
        "cron_expression": "0 15 * * *",
        "enabled": False,
    }
    response = test_client.put(
        f"/schedules/{schedule_id}", headers=auth_headers_user, json=updated_data
    )
    assert response.status_code == 200

    json_response = response.json()
    assert json_response["id"] == schedule_id
    assert json_response["name"] == updated_data["name"]
    assert json_response["description"] == updated_data["description"]
    assert json_response["cron_expression"] == updated_data["cron_expression"]
    assert json_response["enabled"] == updated_data["enabled"]


def test_delete_schedule_not_found(test_client, auth_headers_user):
    """Test deleting a non-existent schedule."""
    response = test_client.delete("/schedules/nonexistent", headers=auth_headers_user)
    assert response.status_code == 404


def test_delete_schedule_success(test_client, auth_headers_user):
    """Test successful schedule deletion."""
    # First create a schedule
    schedule_data = {"name": "Delete Test Schedule", "cron_expression": "0 22 * * *"}
    create_response = test_client.post(
        "/schedules", headers=auth_headers_user, json=schedule_data
    )
    schedule_id = create_response.json()["id"]

    # Delete it
    response = test_client.delete(
        f"/schedules/{schedule_id}", headers=auth_headers_user
    )
    assert response.status_code == 200

    json_response = response.json()
    assert json_response["status"] == "success"
    assert schedule_id in json_response["message"]

    # Verify it's gone
    get_response = test_client.get(
        f"/schedules/{schedule_id}", headers=auth_headers_user
    )
    assert get_response.status_code == 404


def test_schedule_crud_flow(test_client, auth_headers_user):
    """Test complete CRUD flow for schedules."""
    # Create
    schedule_data = {
        "name": "CRUD Flow Schedule",
        "description": "Testing complete CRUD flow",
        "cron_expression": "0 3 * * 1",
        "enabled": True,
    }
    create_response = test_client.post(
        "/schedules", headers=auth_headers_user, json=schedule_data
    )
    assert create_response.status_code == 200
    schedule_id = create_response.json()["id"]

    # Read (list)
    list_response = test_client.get("/schedules", headers=auth_headers_user)
    assert list_response.status_code == 200
    schedules = list_response.json()
    assert any(s["id"] == schedule_id for s in schedules)

    # Read (single)
    get_response = test_client.get(
        f"/schedules/{schedule_id}", headers=auth_headers_user
    )
    assert get_response.status_code == 200

    # Update
    updated_data = {
        "name": "Updated CRUD Schedule",
        "description": "Updated description",
        "cron_expression": "0 4 * * 2",
        "enabled": False,
    }
    update_response = test_client.put(
        f"/schedules/{schedule_id}", headers=auth_headers_user, json=updated_data
    )
    assert update_response.status_code == 200

    # Delete
    delete_response = test_client.delete(
        f"/schedules/{schedule_id}", headers=auth_headers_user
    )
    assert delete_response.status_code == 200
