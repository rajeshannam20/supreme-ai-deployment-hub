
import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add src path for imports
sys.path.append('/home/runner/work/supreme-ai-deployment-hub/supreme-ai-deployment-hub/src')
sys.path.append('/home/runner/work/supreme-ai-deployment-hub/supreme-ai-deployment-hub')

from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "version" in data
    assert data["name"] == "Model Control Panel API"

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

