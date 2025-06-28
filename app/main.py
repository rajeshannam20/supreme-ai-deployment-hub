"""
App main module - Database initialization
"""

from app.db.base import Base
from app.db.session import engine
from app.models import schedule  # Import to register the models


def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    create_tables()
    print("Database tables created successfully!")