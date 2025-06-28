"""
Simple test script to validate JWT authentication functionality
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from core.security import get_password_hash, verify_password, create_access_token, verify_token
from crud.user import create_user, get_user_by_email, authenticate_user
from schemas.user import UserCreate

def test_password_hashing():
    """Test password hashing and verification"""
    password = "testpassword123"
    hashed = get_password_hash(password)
    
    assert verify_password(password, hashed), "Password verification failed"
    assert not verify_password("wrongpassword", hashed), "Wrong password should not verify"
    print("✓ Password hashing and verification works")

def test_jwt_tokens():
    """Test JWT token creation and verification"""
    data = {"sub": "user123"}
    token = create_access_token(data)
    
    payload = verify_token(token)
    assert payload is not None, "Token verification failed"
    assert payload["sub"] == "user123", "Token payload incorrect"
    print("✓ JWT token creation and verification works")

def test_user_crud():
    """Test user CRUD operations"""
    # Clear any existing users
    from crud.user import users_db
    users_db.clear()
    
    # Create user
    user_create = UserCreate(email="test@example.com", password="testpass123")
    user = create_user(user_create)
    
    assert user.email == "test@example.com", "User email incorrect"
    assert user.id is not None, "User ID not set"
    
    # Get user by email
    found_user = get_user_by_email("test@example.com")
    assert found_user is not None, "User not found by email"
    assert found_user.id == user.id, "Found user ID doesn't match"
    
    # Authenticate user
    auth_user = authenticate_user("test@example.com", "testpass123")
    assert auth_user is not None, "User authentication failed"
    assert auth_user.id == user.id, "Authenticated user ID doesn't match"
    
    # Wrong password should fail
    wrong_auth = authenticate_user("test@example.com", "wrongpass")
    assert wrong_auth is None, "Wrong password should not authenticate"
    
    print("✓ User CRUD operations work")

if __name__ == "__main__":
    print("Running JWT authentication tests...")
    
    try:
        test_password_hashing()
        test_jwt_tokens()
        test_user_crud()
        print("\n🎉 All tests passed! JWT authentication system is working correctly.")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)