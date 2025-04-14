
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from typing import Dict, Any

# Initialize FastAPI app
app = FastAPI(
    title="Devonn AI API",
    description="API for Devonn AI agent services",
    version="1.0.0"
)

# Get environment configuration
ENVIRONMENT = os.environ.get("ENVIRONMENT", "development")


@app.get("/")
async def root():
    return {
        "message": "Welcome to Devonn AI API",
        "version": "1.0.0",
        "environment": ENVIRONMENT
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": ENVIRONMENT
    }


class AgentRequest(BaseModel):
    prompt: str
    context: Dict[str, Any] = {}


@app.post("/agent/process")
async def process_agent_request(request: AgentRequest):
    try:
        # Placeholder for actual agent logic
        # In a real implementation, this would call your agent processing code
        
        return {
            "response": f"Processed: {request.prompt}",
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
