import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))

os.environ['AUTH_JWT_SECRET'] = 'test_secret_key_for_testing_only'

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from unittest.mock import MagicMock

from backend.shared.models import Base, UserModel, ChatMessageModel, MessageSender
from backend.chat_service.main import app
from backend.chat_service import crud
from backend.chat_service.schemas import ChatMessageCreate
from backend.shared.db import get_db
from backend.chat_service.dependencies import get_current_user

engine = create_engine('sqlite://', connect_args={'check_same_thread': False}, poolclass=StaticPool)
TestingSession = sessionmaker(bind=engine)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def mock_user():
    user = MagicMock()
    user.id = 1
    user.email = "test@example.com"
    user.full_name = "Test User"
    user.role = "viewer"
    user.is_active = True
    return user

@pytest.fixture
def client(mock_user):
    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    async def override_get_current_user():
        return mock_user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()


class TestHealthCheck:
    def test_health_check(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "chat-service"


class TestChatMessages:
    def test_get_messages_empty(self, client):
        response = client.get("/api/chat/messages")
        assert response.status_code == 200
        assert response.json() == []

    def test_get_messages_with_data(self, client):
        db = TestingSession()
        user = UserModel(
            email="test@example.com",
            full_name="Test User",
            hashed_password="hashed",
            role="viewer",
            is_active=True
        )
        db.add(user)
        db.commit()

        message = ChatMessageModel(
            sender=MessageSender.user,
            message="Hello AI",
            project_id=None
        )
        db.add(message)
        db.commit()
        db.close()

        response = client.get("/api/chat/messages")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1

    def test_get_messages_filter_by_project(self, client):
        db = TestingSession()
        user = UserModel(
            email="test@example.com",
            full_name="Test User",
            hashed_password="hashed",
            role="viewer",
            is_active=True
        )
        db.add(user)
        db.commit()

        message1 = ChatMessageModel(sender=MessageSender.user, message="Message 1", project_id=1)
        message2 = ChatMessageModel(sender=MessageSender.user, message="Message 2", project_id=2)
        db.add(message1)
        db.add(message2)
        db.commit()
        db.close()

        response = client.get("/api/chat/messages?project_id=1")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["project_id"] == 1

    def test_create_message(self, client):
        response = client.post("/api/chat/messages", json={
            "message": "Test message",
            "project_id": None
        })
        assert response.status_code == 201
        data = response.json()
        assert data["message"] == "Test message"
        assert data["sender"] == "user"

    def test_create_message_with_project(self, client):
        response = client.post("/api/chat/messages", json={
            "message": "Project message",
            "project_id": 1
        })
        assert response.status_code == 201
        data = response.json()
        assert data["message"] == "Project message"
        assert data["project_id"] == 1


class TestCrud:
    def test_get_messages_crud(self):
        db = TestingSession()
        messages = crud.get_messages(db, None)
        assert messages == []
        db.close()

    def test_create_message_crud(self):
        db = TestingSession()
        message = crud.create_message(db, ChatMessageCreate(
            message="CRUD test message",
            project_id=None
        ), sender_id=1)
        assert message.message == "CRUD test message"
        assert message.sender == MessageSender.user
        db.close()

    def test_get_messages_with_project_filter(self):
        db = TestingSession()
        message = crud.create_message(db, ChatMessageCreate(
            message="Project message",
            project_id=5
        ), sender_id=1)

        messages = crud.get_messages(db, 5)
        assert len(messages) == 1
        assert messages[0].project_id == 5
        db.close()

    def test_get_messages_no_project_filter(self):
        db = TestingSession()
        crud.create_message(db, ChatMessageCreate(
            message="Message with project",
            project_id=1
        ), sender_id=1)
        crud.create_message(db, ChatMessageCreate(
            message="Message without project",
            project_id=None
        ), sender_id=1)

        messages = crud.get_messages(db, None)
        assert len(messages) == 4
        db.close()