"""
Database base class for SQLAlchemy models
"""

from sqlalchemy.ext.declarative import declarative_base

# Create a base class for all SQLAlchemy models
Base = declarative_base()