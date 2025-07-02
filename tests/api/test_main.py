import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    json_response = response.json()
    assert "name" in json_response
    assert "version" in json_response
    assert "docs" in json_response
    assert "health" in json_response
    assert json_response["name"] == "Model Control Panel API"
    assert json_response["version"] == "1.0.0"


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    json_response = response.json()
    assert "status" in json_response
    assert json_response["status"] == "ok"
    assert "version" in json_response


# Remove the old tests that reference non-existent endpoints
# def test_process_agent_request():
#     test_request = {
#         "prompt": "test prompt",
#         "context": {}
#     }
#     response = client.post("/agent/process", json=test_request)
#     assert response.status_code == 200
#     assert "response" in response.json()
#     assert "status" in response.json()

# @pytest.mark.parametrize("invalid_request", [
#     {"context": {}},  # missing prompt
#     {"prompt": "test"},  # missing context
#     {},  # empty request
# ])
# def test_process_agent_request_validation(invalid_request):
#     response = client.post("/agent/process", json=invalid_request)
#     assert response.status_code == 422  # validation error
