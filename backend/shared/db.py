import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../.."))

from backend.shared.models import Base

POSTGRES_HOST = os.getenv("POSTGRES_HOST", "db")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "gestion_proyectos")
POSTGRES_USER = os.getenv("POSTGRES_USER", "gp_admin")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "supersecret")

DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public') AND typname IN ('userrole', 'projectstatus', 'notificationtype', 'messagesender')"))
        existing_types = {row[0] for row in result}

        for type_name, type_values in [
            ('userrole', ('admin', 'manager', 'viewer')),
            ('projectstatus', ('on_track', 'at_risk', 'delayed', 'completed')),
            ('notificationtype', ('budget_deviation', 'milestone', 'forecast_change', 'ai_message')),
            ('messagesender', ('user', 'ai'))
        ]:
            if type_name not in existing_types:
                values_str = ', '.join(f"'{v}'" for v in type_values)
                conn.execute(text(f"CREATE TYPE {type_name} AS ENUM ({values_str})"))
        conn.commit()
    Base.metadata.create_all(bind=engine, checkfirst=True)