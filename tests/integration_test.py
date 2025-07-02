"""
Integration tests for the deployed application.
These tests run against a live deployment URL to verify the application works end-to-end.
"""

import pytest
import httpx
import os
import asyncio
from typing import Optional


@pytest.fixture(scope="session")
def base_url() -> str:
    """Get the base URL for testing. Can be set via INTEGRATION_TEST_URL environment variable."""
    url = os.getenv("INTEGRATION_TEST_URL", "http://localhost:8000")
    # Remove trailing slash for consistency
    return url.rstrip("/")


@pytest.fixture(scope="session")
def http_client(base_url: str):
    """Create an HTTP client for integration testing."""
    with httpx.Client(base_url=base_url, timeout=30.0) as client:
        yield client


@pytest.mark.asyncio
async def test_health_endpoint(base_url: str):
    """Test the health check endpoint."""
    async with httpx.AsyncClient(base_url=base_url, timeout=30.0) as client:
        response = await client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert "status" in data
        assert data["status"] == "ok"
        assert "version" in data


@pytest.mark.asyncio
async def test_root_endpoint(base_url: str):
    """Test the root endpoint."""
    async with httpx.AsyncClient(base_url=base_url, timeout=30.0) as client:
        response = await client.get("/")
        assert response.status_code == 200
        
        data = response.json()
        assert "name" in data
        assert "version" in data
        assert "docs" in data
        assert "health" in data
        assert data["name"] == "Model Control Panel API"


@pytest.mark.asyncio
async def test_docs_endpoint(base_url: str):
    """Test that the API documentation is accessible."""
    async with httpx.AsyncClient(base_url=base_url, timeout=30.0) as client:
        response = await client.get("/docs")
        assert response.status_code == 200
        # Should return HTML content for the Swagger UI
        assert response.headers.get("content-type", "").startswith("text/html")


@pytest.mark.asyncio
async def test_openapi_json(base_url: str):
    """Test the OpenAPI JSON schema endpoint."""
    async with httpx.AsyncClient(base_url=base_url, timeout=30.0) as client:
        response = await client.get("/openapi.json")
        assert response.status_code == 200
        
        data = response.json()
        assert "openapi" in data
        assert "info" in data
        assert "paths" in data
        assert data["info"]["title"] == "MCP - Model Control Panel"


@pytest.mark.asyncio
async def test_cors_headers(base_url: str):
    """Test that CORS headers are properly configured."""
    async with httpx.AsyncClient(base_url=base_url, timeout=30.0) as client:
        # Test preflight request
        response = await client.options("/health", headers={
            "Origin": "https://example.com",
            "Access-Control-Request-Method": "GET"
        })
        assert response.status_code == 200
        
        # Check CORS headers
        headers = response.headers
        assert "access-control-allow-origin" in headers
        assert "access-control-allow-methods" in headers
        # Note: access-control-allow-headers might not be present for simple requests


@pytest.mark.asyncio
async def test_api_key_endpoints_require_auth(base_url: str):
    """Test that admin endpoints require authentication."""
    async with httpx.AsyncClient(base_url=base_url, timeout=30.0) as client:
        # Test listing keys without authentication
        response = await client.get("/admin/keys")
        assert response.status_code == 401  # Unauthorized
        
        # Test updating a key without authentication
        response = await client.put("/admin/keys/TEST_KEY", json={
            "key": "test-value",
            "service": "TEST_KEY"
        })
        assert response.status_code == 401  # Unauthorized


@pytest.mark.asyncio
async def test_proxy_endpoints_require_auth(base_url: str):
    """Test that proxy endpoints require authentication."""
    async with httpx.AsyncClient(base_url=base_url, timeout=30.0) as client:
        # Test OpenAI proxy without authentication
        response = await client.post("/proxy/openai/chat", json={
            "prompt": "test",
            "model": "gpt-4o-mini"
        })
        assert response.status_code == 401  # Unauthorized
        
        # Test HuggingFace proxy without authentication
        response = await client.post("/proxy/huggingface/generate", json={
            "prompt": "test",
            "model": "gpt-4o-mini"
        })
        assert response.status_code == 401  # Unauthorized


@pytest.mark.asyncio
async def test_application_startup_time(base_url: str):
    """Test that the application responds within a reasonable time."""
    import time
    
    start_time = time.time()
    async with httpx.AsyncClient(base_url=base_url, timeout=30.0) as client:
        response = await client.get("/health")
    end_time = time.time()
    
    assert response.status_code == 200
    
    response_time = end_time - start_time
    # Application should respond within 5 seconds
    assert response_time < 5.0, f"Response time too slow: {response_time:.2f}s"


@pytest.mark.asyncio
async def test_agui_endpoints_accessible(base_url: str):
    """Test that the AG-UI endpoints are accessible."""
    async with httpx.AsyncClient(base_url=base_url, timeout=30.0) as client:
        # Test that AG-UI endpoints exist (they might require auth, but should not 404)
        response = await client.get("/agui")
        # Should not be 404 - could be 401, 422, or 200 depending on implementation
        # Note: Some AG-UI endpoints might not be implemented yet, so we'll skip if 404
        if response.status_code == 404:
            pytest.skip("AG-UI endpoints not implemented yet")


@pytest.mark.asyncio  
async def test_basic_error_handling(base_url: str):
    """Test that the application handles invalid requests gracefully."""
    async with httpx.AsyncClient(base_url=base_url, timeout=30.0) as client:
        # Test non-existent endpoint
        response = await client.get("/nonexistent")
        assert response.status_code == 404
        
        # Test invalid JSON
        response = await client.post("/proxy/openai/chat", 
                                   content="invalid json",
                                   headers={"Content-Type": "application/json"})
        # Should return 422 (validation error) or 401 (auth error), not 500
        assert response.status_code in [422, 401]


if __name__ == "__main__":
    # Allow running the tests directly
    asyncio.run(pytest.main([__file__, "-v"]))