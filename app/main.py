"""
Vercel entry point for FastAPI application.
This module imports and exposes the FastAPI app from the src directory.
"""

import sys
import os

# Add the src directory to the Python path
src_path = os.path.join(os.path.dirname(__file__), "..", "src")
sys.path.insert(0, src_path)

# Import the FastAPI app from src.main module
import src.main as src_main

app = src_main.app

# This is the app instance that Vercel will use
# The app is already configured with all routes, middleware, etc. in src/main.py
