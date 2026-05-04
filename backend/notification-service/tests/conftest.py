import os
import sys
import contextlib
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

@contextlib.asynccontextmanager
async def noop_lifespan(app):
    yield

app.router.lifespan_context = noop_lifespan

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