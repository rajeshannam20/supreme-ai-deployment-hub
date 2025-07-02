from fastapi import FastAPI, Depends, HTTPException, Request, Body
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import httpx
import os
import json

# Import the main FastAPI app from src.main
from src.main import app

# Expose the app instance for Vercel compatibility
# This ensures Vercel can find the FastAPI app instance named 'app'
__all__ = ["app"]

# The app is already configured in src.main with all endpoints, middleware, etc.
# This file serves as the Vercel-compatible entrypoint that exposes the same app instance