from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta

from backend.shared.db import get_db
from backend.shared.security import create_access_token
from backend.auth_service.schemas import UserCreate, UserLogin, Token, User
from backend.auth_service import crud
from backend.auth_service.dependencies import get_current_user

app = FastAPI(title="Auth Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "auth-service", "version": "1.0.0"}


@app.post("/api/auth/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user_create: UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_email(db, user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    user = crud.create_user(db, user_create)
    return user


@app.post("/api/auth/login", response_model=Token)
async def login(user_login: UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(minutes=60)
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/api/auth/me", response_model=User)
async def get_me(current_user = Depends(get_current_user)):
    return current_user