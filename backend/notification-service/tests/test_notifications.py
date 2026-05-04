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

from backend.shared.models import Base, UserModel, NotificationModel, NotificationType
from backend.notification_service.main import app
from backend.notification_service import crud
from backend.notification_service.schemas import NotificationCreate
from backend.shared.db import get_db
from backend.notification_service.dependencies import get_current_user

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
        assert data["service"] == "notification-service"


class TestNotifications:
    def test_get_notifications_empty(self, client):
        response = client.get("/api/notifications")
        assert response.status_code == 200
        assert response.json() == []

    def test_get_notifications_with_data(self, client):
        db = TestingSession()
        notification = NotificationModel(
            type=NotificationType.budget_deviation,
            title="Budget Alert",
            message="Budget exceeded by 15%",
            user_id=1,
            read=False
        )
        db.add(notification)
        db.commit()
        db.close()

        response = client.get("/api/notifications")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["title"] == "Budget Alert"

    def test_get_notifications_filter_by_type(self, client):
        db = TestingSession()
        notification1 = NotificationModel(
            type=NotificationType.budget_deviation,
            title="Budget Alert",
            message="Test",
            user_id=1,
            read=False
        )
        notification2 = NotificationModel(
            type=NotificationType.milestone,
            title="Milestone Alert",
            message="Test",
            user_id=1,
            read=False
        )
        db.add(notification1)
        db.add(notification2)
        db.commit()
        db.close()

        response = client.get("/api/notifications?type=budget_deviation")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["type"] == "budget_deviation"

    def test_get_notifications_filter_by_read(self, client):
        db = TestingSession()
        notification1 = NotificationModel(
            type=NotificationType.budget_deviation,
            title="Unread",
            message="Test",
            user_id=1,
            read=False
        )
        notification2 = NotificationModel(
            type=NotificationType.milestone,
            title="Read",
            message="Test",
            user_id=1,
            read=True
        )
        db.add(notification1)
        db.add(notification2)
        db.commit()
        db.close()

        response = client.get("/api/notifications?read=false")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["read"] is False

    def test_create_notification(self, client):
        response = client.post("/api/notifications", json={
            "type": "budget_deviation",
            "title": "New Alert",
            "message": "Budget deviation detected",
            "user_id": 1
        })
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "New Alert"
        assert data["read"] is False

    def test_mark_notification_as_read(self, client):
        db = TestingSession()
        notification = NotificationModel(
            type=NotificationType.budget_deviation,
            title="To Mark",
            message="Test",
            user_id=1,
            read=False
        )
        db.add(notification)
        db.commit()
        notification_id = notification.id
        db.close()

        response = client.patch(f"/api/notifications/{notification_id}/read")
        assert response.status_code == 200
        data = response.json()
        assert data["read"] is True

    def test_mark_notification_as_read_not_found(self, client):
        response = client.patch("/api/notifications/99999/read")
        assert response.status_code == 404

    def test_delete_notification(self, client):
        db = TestingSession()
        notification = NotificationModel(
            type=NotificationType.budget_deviation,
            title="To Delete",
            message="Test",
            user_id=1,
            read=False
        )
        db.add(notification)
        db.commit()
        notification_id = notification.id
        db.close()

        response = client.delete(f"/api/notifications/{notification_id}")
        assert response.status_code == 200
        assert response.json()["detail"] == "Notification deleted"

    def test_delete_notification_not_found(self, client):
        response = client.delete("/api/notifications/99999")
        assert response.status_code == 404


class TestCrud:
    def test_get_notifications_crud(self):
        db = TestingSession()
        notifications = crud.get_notifications(db, 1, None, None)
        assert notifications == []
        db.close()

    def test_create_notification_crud(self):
        db = TestingSession()
        notification = crud.create_notification(db, NotificationCreate(
            type="milestone",
            title="CRUD Notification",
            message="Test message",
            user_id=1
        ))
        assert notification.title == "CRUD Notification"
        assert notification.read is False
        db.close()

    def test_mark_as_read_crud(self):
        db = TestingSession()
        notification = crud.create_notification(db, NotificationCreate(
            type="budget_deviation",
            title="Test",
            message="Test",
            user_id=1
        ))
        assert notification.read is False

        marked = crud.mark_as_read(db, notification.id, 1)
        assert marked.read is True
        db.close()

    def test_delete_notification_crud(self):
        db = TestingSession()
        notification = crud.create_notification(db, NotificationCreate(
            type="budget_deviation",
            title="Test",
            message="Test",
            user_id=1
        ))
        result = crud.delete_notification(db, notification.id, 1)
        assert result is True

        marked = crud.mark_as_read(db, notification.id, 1)
        assert marked is None
        db.close()

    def test_delete_notification_wrong_user(self):
        db = TestingSession()
        notification = crud.create_notification(db, NotificationCreate(
            type="budget_deviation",
            title="Test",
            message="Test",
            user_id=1
        ))
        result = crud.delete_notification(db, notification.id, 999)
        assert result is False
        db.close()

    def test_filter_by_type_crud(self):
        db = TestingSession()
        crud.create_notification(db, NotificationCreate(
            type="budget_deviation",
            title="Budget",
            message="Test",
            user_id=1
        ))
        crud.create_notification(db, NotificationCreate(
            type="milestone",
            title="Milestone",
            message="Test",
            user_id=1
        ))

        budget_notifications = crud.get_notifications(db, 1, "budget_deviation", None)
        assert len(budget_notifications) == 1
        assert budget_notifications[0].type == NotificationType.budget_deviation
        db.close()

    def test_filter_by_read_crud(self):
        db = TestingSession()
        crud.create_notification(db, NotificationCreate(
            type="budget_deviation",
            title="Unread",
            message="Test",
            user_id=1
        ))
        db = TestingSession()
        notification = NotificationModel(
            type=NotificationType.milestone,
            title="Read",
            message="Test",
            user_id=1,
            read=True
        )
        db.add(notification)
        db.commit()
        db.close()

        unread = crud.get_notifications(db, 1, None, False)
        assert len(unread) == 1
        assert unread[0].read is False
        db.close()