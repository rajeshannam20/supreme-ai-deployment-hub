"""
Tests for authentication endpoints and JWT token functionality.
"""

import pytest
from src.auth.token_utils import create_token, decode_token


def test_create_token():
    """Test JWT token creation."""
    user_id = "testuser"
    token = create_token(user_id)

    assert token is not None
    assert isinstance(token, str)
    assert len(token) > 0


def test_decode_valid_token():
    """Test decoding a valid JWT token."""
    user_id = "testuser"
    token = create_token(user_id)

    payload = decode_token(token)

    assert payload is not None
    assert payload["sub"] == user_id
    assert "exp" in payload
    assert "iat" in payload


def test_decode_invalid_token():
    """Test decoding an invalid JWT token raises HTTPException."""
    from fastapi import HTTPException

    invalid_token = "invalid.token.here"

    with pytest.raises(HTTPException) as exc_info:
        decode_token(invalid_token)

    assert exc_info.value.status_code == 401
    assert "Invalid token" in exc_info.value.detail


def test_admin_keys_list_requires_auth(test_client):
    """Test that listing API keys requires authentication."""
    response = test_client.get("/admin/keys")
    assert response.status_code == 401


def test_admin_keys_list_with_auth(test_client, auth_headers_admin):
    """Test listing API keys with admin authentication."""
    response = test_client.get("/admin/keys", headers=auth_headers_admin)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_admin_keys_list_non_admin_forbidden(test_client, auth_headers_user):
    """Test that non-admin users cannot list API keys."""
    response = test_client.get("/admin/keys", headers=auth_headers_user)
    assert response.status_code == 403
    assert "Only admin users can list keys" in response.json()["detail"]


def test_admin_update_key_requires_auth(test_client):
    """Test that updating API keys requires authentication."""
    response = test_client.put(
        "/admin/keys/TEST_KEY", json={"key": "test-key-value", "service": "TEST_KEY"}
    )
    assert response.status_code == 401


def test_admin_update_key_with_admin_auth(test_client, auth_headers_admin):
    """Test updating API key with admin authentication."""
    response = test_client.put(
        "/admin/keys/TEST_KEY",
        headers=auth_headers_admin,
        json={"key": "test-key-value", "service": "TEST_KEY"},
    )
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["status"] == "success"
    assert "TEST_KEY" in json_response["message"]


def test_admin_update_key_non_admin_forbidden(test_client, auth_headers_user):
    """Test that non-admin users cannot update API keys."""
    response = test_client.put(
        "/admin/keys/TEST_KEY",
        headers=auth_headers_user,
        json={"key": "test-key-value", "service": "TEST_KEY"},
    )
    assert response.status_code == 403
    assert "Only admin users can update keys" in response.json()["detail"]
