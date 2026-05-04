from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.shared.models import ProjectModel, NotificationModel, NotificationType
from backend.project_service.schemas import ProjectCreate, ProjectUpdate
from typing import List, Optional
from datetime import date, timedelta


def get_projects(db: Session, status: Optional[str] = None) -> List[ProjectModel]:
    query = db.query(ProjectModel)
    if status:
        query = query.filter(ProjectModel.status == status)
    return query.all()


def get_project_by_id(db: Session, project_id: int) -> Optional[ProjectModel]:
    return db.query(ProjectModel).filter(ProjectModel.id == project_id).first()


def create_project(db: Session, project_create: ProjectCreate) -> ProjectModel:
    db_project = ProjectModel(
        name=project_create.name,
        description=project_create.description,
        start_date=project_create.start_date,
        end_date=project_create.end_date,
        budget=project_create.budget,
        executed=0.0,
        forecast=project_create.budget,
        status="on_track",
        manager_id=project_create.manager_id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def update_project(db: Session, project_id: int, project_update: ProjectUpdate) -> Optional[ProjectModel]:
    db_project = get_project_by_id(db, project_id)
    if not db_project:
        return None

    update_data = project_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)

    if project_update.executed is not None or project_update.forecast is not None:
        deviation = db_project.budget - db_project.executed
        if abs(deviation) > db_project.budget * 0.1:
            notification = NotificationModel(
                type=NotificationType.budget_deviation,
                title="Budget Deviation Alert",
                message=f"Project {db_project.name} has a budget deviation of {deviation:.2f}",
                user_id=db_project.manager_id,
                read=False
            )
            db.add(notification)

    db.commit()
    db.refresh(db_project)
    return db_project


def delete_project(db: Session, project_id: int) -> bool:
    db_project = get_project_by_id(db, project_id)
    if not db_project:
        return False
    db.delete(db_project)
    db.commit()
    return True


def get_kpis(db: Session):
    projects = db.query(ProjectModel).all()
    total_budget = sum(p.budget for p in projects)
    total_executed = sum(p.executed for p in projects)
    total_forecast = sum(p.forecast for p in projects)
    total_deviation = total_budget - total_executed

    return {
        "total_budget": total_budget,
        "total_executed": total_executed,
        "total_deviation": total_deviation,
        "total_forecast": total_forecast
    }


def get_project_trend(db: Session, project_id: int) -> List[dict]:
    db_project = get_project_by_id(db, project_id)
    if not db_project:
        return []

    start = db_project.start_date
    end = db_project.end_date
    total_days = (end - start).days or 1
    daily_planned = db_project.budget / total_days

    trend = []
    current = start
    while current <= end:
        days_elapsed = (current - start).days
        planned = daily_planned * days_elapsed
        executed = min(planned * 0.9, db_project.executed * (days_elapsed / total_days))
        trend.append({
            "date": current,
            "planned": round(planned, 2),
            "executed": round(executed, 2)
        })
        current += timedelta(days=30)

    return trend