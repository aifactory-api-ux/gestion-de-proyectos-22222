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

from backend.shared.models import Base, UserModel
from backend.project_service.main import app
from backend.project_service import crud
from backend.shared.db import get_db
from backend.project_service.dependencies import get_current_user

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
    user.email = "manager@example.com"
    user.full_name = "Test Manager"
    user.role = "manager"
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
        assert data["service"] == "project-service"


class TestProjects:
    def test_get_projects_empty(self, client):
        response = client.get("/api/projects")
        assert response.status_code == 200
        assert response.json() == []

    def test_get_projects_with_data(self, client):
        db = TestingSession()
        manager = UserModel(
            email="manager@example.com",
            full_name="Test Manager",
            hashed_password="hashed",
            role="manager",
            is_active=True
        )
        db.add(manager)
        db.commit()

        from backend.shared.models import ProjectModel, ProjectStatus
        project = ProjectModel(
            name="Test Project",
            description="Test Description",
            start_date="2024-01-01",
            end_date="2024-12-31",
            budget=100000.0,
            executed=50000.0,
            forecast=95000.0,
            status=ProjectStatus.on_track,
            manager_id=1
        )
        db.add(project)
        db.commit()
        db.close()

        response = client.get("/api/projects")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Test Project"

    def test_get_projects_filter_by_status(self, client):
        db = TestingSession()
        manager = UserModel(
            email="manager@example.com",
            full_name="Test Manager",
            hashed_password="hashed",
            role="manager",
            is_active=True
        )
        db.add(manager)
        db.commit()

        from backend.shared.models import ProjectModel, ProjectStatus
        project = ProjectModel(
            name="On Track Project",
            description="Test",
            start_date="2024-01-01",
            end_date="2024-12-31",
            budget=100000.0,
            executed=50000.0,
            forecast=95000.0,
            status=ProjectStatus.on_track,
            manager_id=1
        )
        db.add(project)
        db.commit()
        db.close()

        response = client.get("/api/projects?status=on_track")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["status"] == "on_track"

    def test_create_project(self, client):
        response = client.post("/api/projects", json={
            "name": "New Project",
            "description": "Description",
            "start_date": "2024-01-01",
            "end_date": "2024-12-31",
            "budget": 50000.0,
            "manager_id": 1
        })
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "New Project"
        assert data["budget"] == 50000.0

    def test_get_project_by_id(self, client):
        db = TestingSession()
        manager = UserModel(
            email="manager@example.com",
            full_name="Test Manager",
            hashed_password="hashed",
            role="manager",
            is_active=True
        )
        db.add(manager)
        db.commit()

        from backend.shared.models import ProjectModel, ProjectStatus
        project = ProjectModel(
            name="Test Project",
            description="Test",
            start_date="2024-01-01",
            end_date="2024-12-31",
            budget=100000.0,
            executed=0.0,
            forecast=100000.0,
            status=ProjectStatus.on_track,
            manager_id=1
        )
        db.add(project)
        db.commit()
        project_id = project.id
        db.close()

        response = client.get(f"/api/projects/{project_id}")
        assert response.status_code == 200
        assert response.json()["name"] == "Test Project"

    def test_get_project_not_found(self, client):
        response = client.get("/api/projects/99999")
        assert response.status_code == 404

    def test_update_project(self, client):
        db = TestingSession()
        manager = UserModel(
            email="manager@example.com",
            full_name="Test Manager",
            hashed_password="hashed",
            role="manager",
            is_active=True
        )
        db.add(manager)
        db.commit()

        from backend.shared.models import ProjectModel, ProjectStatus
        project = ProjectModel(
            name="Test Project",
            description="Test",
            start_date="2024-01-01",
            end_date="2024-12-31",
            budget=100000.0,
            executed=0.0,
            forecast=100000.0,
            status=ProjectStatus.on_track,
            manager_id=1
        )
        db.add(project)
        db.commit()
        project_id = project.id
        db.close()

        response = client.patch(f"/api/projects/{project_id}", json={
            "executed": 30000.0,
            "forecast": 110000.0
        })
        assert response.status_code == 200
        data = response.json()
        assert data["executed"] == 30000.0

    def test_delete_project(self, client):
        db = TestingSession()
        manager = UserModel(
            email="manager@example.com",
            full_name="Test Manager",
            hashed_password="hashed",
            role="manager",
            is_active=True
        )
        db.add(manager)
        db.commit()

        from backend.shared.models import ProjectModel, ProjectStatus
        project = ProjectModel(
            name="Test Project",
            description="Test",
            start_date="2024-01-01",
            end_date="2024-12-31",
            budget=100000.0,
            executed=0.0,
            forecast=100000.0,
            status=ProjectStatus.on_track,
            manager_id=1
        )
        db.add(project)
        db.commit()
        project_id = project.id
        db.close()

        response = client.delete(f"/api/projects/{project_id}")
        assert response.status_code == 200
        assert response.json()["detail"] == "Project deleted"

    def test_delete_project_not_found(self, client):
        response = client.delete("/api/projects/99999")
        assert response.status_code == 404


class TestKPIs:
    def test_get_kpis_empty(self, client):
        response = client.get("/api/kpis")
        assert response.status_code == 200
        data = response.json()
        assert data["total_budget"] == 0.0
        assert data["total_executed"] == 0.0

    def test_get_kpis_with_projects(self, client):
        db = TestingSession()
        manager = UserModel(
            email="manager@example.com",
            full_name="Test Manager",
            hashed_password="hashed",
            role="manager",
            is_active=True
        )
        db.add(manager)
        db.commit()

        from backend.shared.models import ProjectModel, ProjectStatus
        project = ProjectModel(
            name="Test Project",
            description="Test",
            start_date="2024-01-01",
            end_date="2024-12-31",
            budget=100000.0,
            executed=50000.0,
            forecast=95000.0,
            status=ProjectStatus.on_track,
            manager_id=1
        )
        db.add(project)
        db.commit()
        db.close()

        response = client.get("/api/kpis")
        assert response.status_code == 200
        data = response.json()
        assert data["total_budget"] == 100000.0
        assert data["total_executed"] == 50000.0
        assert data["total_deviation"] == 50000.0


class TestProjectTrend:
    def test_get_project_trend(self, client):
        db = TestingSession()
        manager = UserModel(
            email="manager@example.com",
            full_name="Test Manager",
            hashed_password="hashed",
            role="manager",
            is_active=True
        )
        db.add(manager)
        db.commit()

        from backend.shared.models import ProjectModel, ProjectStatus
        project = ProjectModel(
            name="Test Project",
            description="Test",
            start_date="2024-01-01",
            end_date="2024-12-31",
            budget=120000.0,
            executed=30000.0,
            forecast=115000.0,
            status=ProjectStatus.on_track,
            manager_id=1
        )
        db.add(project)
        db.commit()
        project_id = project.id
        db.close()

        response = client.get(f"/api/projects/{project_id}/trend")
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        assert "date" in data[0]
        assert "planned" in data[0]
        assert "executed" in data[0]

    def test_get_project_trend_not_found(self, client):
        response = client.get("/api/projects/99999/trend")
        assert response.status_code == 200
        assert response.json() == []


class TestCrud:
    def test_create_project_crud(self):
        db = TestingSession()
        manager = UserModel(
            email="manager@example.com",
            full_name="Test Manager",
            hashed_password="hashed",
            role="manager",
            is_active=True
        )
        db.add(manager)
        db.commit()

        from backend.project_service.schemas import ProjectCreate
        project = crud.create_project(db, ProjectCreate(
            name="CRUD Test Project",
            description="Test",
            start_date="2024-01-01",
            end_date="2024-12-31",
            budget=75000.0,
            manager_id=1
        ))
        assert project.name == "CRUD Test Project"
        assert project.executed == 0.0
        db.close()

    def test_get_project_by_id_crud(self):
        db = TestingSession()
        manager = UserModel(
            email="manager@example.com",
            full_name="Test Manager",
            hashed_password="hashed",
            role="manager",
            is_active=True
        )
        db.add(manager)
        db.commit()

        from backend.project_service.schemas import ProjectCreate
        project = crud.create_project(db, ProjectCreate(
            name="CRUD Test Project",
            description="Test",
            start_date="2024-01-01",
            end_date="2024-12-31",
            budget=75000.0,
            manager_id=1
        ))
        found = crud.get_project_by_id(db, project.id)
        assert found is not None
        assert found.name == "CRUD Test Project"
        db.close()

    def test_update_project_crud(self):
        db = TestingSession()
        manager = UserModel(
            email="manager@example.com",
            full_name="Test Manager",
            hashed_password="hashed",
            role="manager",
            is_active=True
        )
        db.add(manager)
        db.commit()

        from backend.project_service.schemas import ProjectCreate, ProjectUpdate
        project = crud.create_project(db, ProjectCreate(
            name="CRUD Test Project",
            description="Test",
            start_date="2024-01-01",
            end_date="2024-12-31",
            budget=75000.0,
            manager_id=1
        ))
        updated = crud.update_project(db, project.id, ProjectUpdate(executed=25000.0))
        assert updated.executed == 25000.0
        db.close()

    def test_delete_project_crud(self):
        db = TestingSession()
        manager = UserModel(
            email="manager@example.com",
            full_name="Test Manager",
            hashed_password="hashed",
            role="manager",
            is_active=True
        )
        db.add(manager)
        db.commit()

        from backend.project_service.schemas import ProjectCreate
        project = crud.create_project(db, ProjectCreate(
            name="CRUD Test Project",
            description="Test",
            start_date="2024-01-01",
            end_date="2024-12-31",
            budget=75000.0,
            manager_id=1
        ))
        result = crud.delete_project(db, project.id)
        assert result is True
        assert crud.get_project_by_id(db, project.id) is None
        db.close()