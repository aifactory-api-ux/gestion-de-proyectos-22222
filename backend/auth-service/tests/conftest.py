import os
import sys
import contextlib

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))

os.environ['AUTH_JWT_SECRET'] = 'test_secret_key_for_testing_only'
os.environ['POSTGRES_HOST'] = 'localhost'
os.environ['POSTGRES_PORT'] = '5432'
os.environ['POSTGRES_DB'] = 'test_db'
os.environ['POSTGRES_USER'] = 'test_user'
os.environ['POSTGRES_PASSWORD'] = 'test_password'

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.shared.models import Base
from backend.auth_service.main import app
from backend.shared.db import get_db, create_tables

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
def client():
    def override_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = override_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def db_session():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()