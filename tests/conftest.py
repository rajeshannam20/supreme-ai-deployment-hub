"""
Pytest configuration and fixtures for the FastAPI application tests.
"""

import pytest
import os
from cryptography.fernet import Fernet

# Set up test environment BEFORE importing application modules
# Generate a proper Fernet key for testing
test_key = Fernet.generate_key().decode()
os.environ["ENCRYPTION_KEY"] = test_key
os.environ["JWT_SECRET"] = "test-secret-key-for-testing-only"

from fastapi.testclient import TestClient
from src.main import app
from src.auth.token_utils import create_token


@pytest.fixture(scope="session")
def test_client():
    """Create a test client for the FastAPI application."""
    return TestClient(app)


@pytest.fixture(scope="session")
def admin_token():
    """Create an admin JWT token for testing authenticated endpoints."""
    return create_token("admin")


@pytest.fixture(scope="session")
def user_token():
    """Create a regular user JWT token for testing authenticated endpoints."""
    return create_token("testuser")


@pytest.fixture(scope="session")
def auth_headers_admin(admin_token):
    """Create headers with admin authorization token."""
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture(scope="session")
def auth_headers_user(user_token):
    """Create headers with user authorization token."""
    return {"Authorization": f"Bearer {user_token}"}
