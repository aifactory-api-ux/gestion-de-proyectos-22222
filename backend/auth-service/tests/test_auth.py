import pytest
from backend.auth_service.schemas import UserCreate
from backend.auth_service import crud


class TestHealthCheck:
    def test_health_check(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "auth-service"


class TestAuthRegister:
    def test_register_success(self, client):
        response = client.post("/api/auth/register", json={
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        })
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["full_name"] == "Test User"
        assert "id" in data

    def test_register_duplicate_email(self, client):
        client.post("/api/auth/register", json={
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        })
        response = client.post("/api/auth/register", json={
            "email": "test@example.com",
            "full_name": "Another User",
            "password": "password456"
        })
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]

    def test_register_invalid_email(self, client):
        response = client.post("/api/auth/register", json={
            "email": "invalid-email",
            "full_name": "Test User",
            "password": "password123"
        })
        assert response.status_code == 422


class TestAuthLogin:
    def test_login_success(self, client):
        client.post("/api/auth/register", json={
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        })
        response = client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "password123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client):
        client.post("/api/auth/register", json={
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        })
        response = client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]

    def test_login_nonexistent_user(self, client):
        response = client.post("/api/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "password123"
        })
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]


class TestAuthMe:
    def test_get_me_success(self, client):
        client.post("/api/auth/register", json={
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        })
        login_response = client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "password123"
        })
        token = login_response.json()["access_token"]

        response = client.get("/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"

    def test_get_me_no_token(self, client):
        response = client.get("/api/auth/me")
        assert response.status_code == 403

    def test_get_me_invalid_token(self, client):
        response = client.get("/api/auth/me", headers={
            "Authorization": "Bearer invalid_token"
        })
        assert response.status_code == 401


class TestCrud:
    def test_get_user_by_email(self, db_session):
        user = crud.create_user(db_session, UserCreate(
            email="test@example.com",
            full_name="Test User",
            password="password123"
        ))
        result = crud.get_user_by_email(db_session, "test@example.com")
        assert result is not None
        assert result.email == "test@example.com"

    def test_authenticate_user_success(self, db_session):
        crud.create_user(db_session, UserCreate(
            email="test@example.com",
            full_name="Test User",
            password="password123"
        ))
        result = crud.authenticate_user(db_session, "test@example.com", "password123")
        assert result is not None

    def test_authenticate_user_wrong_password(self, db_session):
        crud.create_user(db_session, UserCreate(
            email="test@example.com",
            full_name="Test User",
            password="password123"
        ))
        result = crud.authenticate_user(db_session, "test@example.com", "wrongpassword")
        assert result is None

    def test_authenticate_user_not_found(self, db_session):
        result = crud.authenticate_user(db_session, "nonexistent@example.com", "password123")
        assert result is None