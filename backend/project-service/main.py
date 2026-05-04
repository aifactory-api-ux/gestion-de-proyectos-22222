from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.shared.db import get_db, create_tables
from backend.project_service.schemas import ProjectCreate, ProjectUpdate, KPI, TrendPoint
from backend.project_service import crud
from backend.project_service.dependencies import get_current_user
from backend.shared.models import Project


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield

app = FastAPI(title="Project Service", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "project-service", "version": "1.0.0"}


@app.get("/api/projects", response_model=List[Project])
async def get_projects(
    status: Optional[str] = Query(None),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    projects = crud.get_projects(db, status)
    return projects


@app.post("/api/projects", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_create: ProjectCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = crud.create_project(db, project_create)
    return project


@app.get("/api/projects/{project_id}", response_model=Project)
async def get_project(
    project_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.patch("/api/projects/{project_id}", response_model=Project)
async def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = crud.update_project(db, project_id, project_update)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.delete("/api/projects/{project_id}")
async def delete_project(
    project_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = crud.delete_project(db, project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"detail": "Project deleted"}


@app.get("/api/projects/{project_id}/trend", response_model=List[TrendPoint])
async def get_project_trend(
    project_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trend = crud.get_project_trend(db, project_id)
    return trend


@app.get("/api/kpis", response_model=KPI)
async def get_kpis(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_kpis(db)