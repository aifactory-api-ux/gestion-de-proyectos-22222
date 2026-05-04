# SPEC.md

## 1. TECHNOLOGY STACK

**Backend:**
- Python 3.11
- FastAPI 0.110.x
- Pydantic 2.x
- SQLAlchemy 2.x
- psycopg2-binary 2.9.x
- Uvicorn 0.29.x
- Alembic 1.13.x

**Database:**
- PostgreSQL 15

**Frontend:**
- React 18.2.x
- Vite 5.x
- TypeScript 5.x
- react-router-dom 6.x
- @tanstack/react-query 5.x
- recharts 2.x (for charts)
- @mui/material 5.x (Material UI for base components)
- @emotion/react 11.x, @emotion/styled 11.x
- dayjs 1.x
- axios 1.x

**Infrastructure:**
- Docker 24.x
- docker-compose 2.x

---

## 2. DATA CONTRACTS

### Python (Pydantic Models)

```python
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Literal
from datetime import date, datetime

class User(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: Literal["admin", "manager", "viewer"]
    is_active: bool

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Project(BaseModel):
    id: int
    name: str
    description: Optional[str]
    start_date: date
    end_date: date
    budget: float
    executed: float
    forecast: float
    status: Literal["on_track", "at_risk", "delayed", "completed"]
    manager_id: int

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str]
    start_date: date
    end_date: date
    budget: float
    manager_id: int

class ProjectUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    start_date: Optional[date]
    end_date: Optional[date]
    budget: Optional[float]
    executed: Optional[float]
    forecast: Optional[float]
    status: Optional[Literal["on_track", "at_risk", "delayed", "completed"]]
    manager_id: Optional[int]

class KPI(BaseModel):
    total_budget: float
    total_executed: float
    total_deviation: float
    total_forecast: float

class TrendPoint(BaseModel):
    date: date
    planned: float
    executed: float

class Notification(BaseModel):
    id: int
    type: Literal["budget_deviation", "milestone", "forecast_change", "ai_message"]
    title: str
    message: str
    created_at: datetime
    read: bool
    user_id: int

class NotificationCreate(BaseModel):
    type: Literal["budget_deviation", "milestone", "forecast_change", "ai_message"]
    title: str
    message: str
    user_id: int

class ChatMessage(BaseModel):
    id: int
    sender: Literal["user", "ai"]
    message: str
    timestamp: datetime
    project_id: Optional[int]

class ChatMessageCreate(BaseModel):
    message: str
    project_id: Optional[int]
```

### TypeScript (Frontend Interfaces)

```typescript
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "manager" | "viewer";
  is_active: boolean;
}

export interface UserCreate {
  email: string;
  full_name: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  start_date: string; // ISO date
  end_date: string;   // ISO date
  budget: number;
  executed: number;
  forecast: number;
  status: "on_track" | "at_risk" | "delayed" | "completed";
  manager_id: number;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  budget: number;
  manager_id: number;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  executed?: number;
  forecast?: number;
  status?: "on_track" | "at_risk" | "delayed" | "completed";
  manager_id?: number;
}

export interface KPI {
  total_budget: number;
  total_executed: number;
  total_deviation: number;
  total_forecast: number;
}

export interface TrendPoint {
  date: string; // ISO date
  planned: number;
  executed: number;
}

export interface Notification {
  id: number;
  type: "budget_deviation" | "milestone" | "forecast_change" | "ai_message";
  title: string;
  message: string;
  created_at: string; // ISO datetime
  read: boolean;
  user_id: number;
}

export interface NotificationCreate {
  type: "budget_deviation" | "milestone" | "forecast_change" | "ai_message";
  title: string;
  message: string;
  user_id: number;
}

export interface ChatMessage {
  id: number;
  sender: "user" | "ai";
  message: string;
  timestamp: string; // ISO datetime
  project_id?: number;
}

export interface ChatMessageCreate {
  message: string;
  project_id?: number;
}
```

---

## 3. API ENDPOINTS

### Auth Service

- **POST /api/auth/register**
  - Request: `UserCreate`
  - Response: `User`

- **POST /api/auth/login**
  - Request: `UserLogin`
  - Response: `Token`

- **GET /api/auth/me**
  - Auth: Bearer JWT
  - Response: `User`

### Project Service

- **GET /api/projects**
  - Auth: Bearer JWT
  - Query: `?status=on_track|at_risk|delayed|completed` (optional)
  - Response: `List[Project]`

- **POST /api/projects**
  - Auth: Bearer JWT
  - Request: `ProjectCreate`
  - Response: `Project`

- **GET /api/projects/{project_id}**
  - Auth: Bearer JWT
  - Response: `Project`

- **PATCH /api/projects/{project_id}**
  - Auth: Bearer JWT
  - Request: `ProjectUpdate`
  - Response: `Project`

- **DELETE /api/projects/{project_id}**
  - Auth: Bearer JWT
  - Response: `{ "detail": "Project deleted" }`

- **GET /api/projects/{project_id}/trend**
  - Auth: Bearer JWT
  - Response: `List[TrendPoint]`

### KPI Service

- **GET /api/kpis**
  - Auth: Bearer JWT
  - Response: `KPI`

### Notification Service

- **GET /api/notifications**
  - Auth: Bearer JWT
  - Query: `?type=budget_deviation|milestone|forecast_change|ai_message` (optional), `?read=true|false` (optional)
  - Response: `List[Notification]`

- **POST /api/notifications**
  - Auth: Bearer JWT
  - Request: `NotificationCreate`
  - Response: `Notification`

- **PATCH /api/notifications/{notification_id}/read**
  - Auth: Bearer JWT
  - Response: `Notification`

- **DELETE /api/notifications/{notification_id}**
  - Auth: Bearer JWT
  - Response: `{ "detail": "Notification deleted" }`

### Chat Service

- **GET /api/chat/messages**
  - Auth: Bearer JWT
  - Query: `?project_id={id}` (optional)
  - Response: `List[ChatMessage]`

- **POST /api/chat/messages**
  - Auth: Bearer JWT
  - Request: `ChatMessageCreate`
  - Response: `ChatMessage`

---

## 4. FILE STRUCTURE

### PORT TABLE

| Service              | Listening Port | Path                        |
|----------------------|---------------|-----------------------------|
| auth-service         | 8001          | backend/auth-service/       |
| project-service      | 8002          | backend/project-service/    |
| notification-service | 8003          | backend/notification-service/ |
| chat-service         | 8004          | backend/chat-service/       |

### SHARED MODULES

| Shared path         | Imported by services                                 |
|---------------------|-----------------------------------------------------|
| backend/shared/     | auth-service, project-service, notification-service, chat-service |

### FILE TREE

```
.
├── docker-compose.yml                # Multi-service orchestration
├── .env.example                     # Template for environment variables
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation
├── run.sh                           # Root startup script
├── backend/
│   ├── shared/                      # Shared Pydantic models, utils, db
│   │   ├── models.py                # Shared Pydantic models
│   │   ├── db.py                    # SQLAlchemy base, session, engine
│   │   ├── security.py              # JWT utils, password hashing
│   │   └── __init__.py
│   ├── auth-service/
│   │   ├── main.py                  # FastAPI app, routes for auth
│   │   ├── crud.py                  # User CRUD logic
│   │   ├── schemas.py               # User Pydantic models
│   │   ├── dependencies.py          # Auth dependencies
│   │   ├── Dockerfile               # Auth service Dockerfile (EXPOSE 8001)
│   │   └── __init__.py
│   ├── project-service/
│   │   ├── main.py                  # FastAPI app, routes for projects/KPIs
│   │   ├── crud.py                  # Project CRUD logic
│   │   ├── schemas.py               # Project Pydantic models
│   │   ├── dependencies.py          # Project dependencies
│   │   ├── Dockerfile               # Project service Dockerfile (EXPOSE 8002)
│   │   └── __init__.py
│   ├── notification-service/
│   │   ├── main.py                  # FastAPI app, routes for notifications
│   │   ├── crud.py                  # Notification CRUD logic
│   │   ├── schemas.py               # Notification Pydantic models
│   │   ├── dependencies.py          # Notification dependencies
│   │   ├── Dockerfile               # Notification service Dockerfile (EXPOSE 8003)
│   │   └── __init__.py
│   ├── chat-service/
│   │   ├── main.py                  # FastAPI app, routes for chat
│   │   ├── crud.py                  # Chat CRUD logic
│   │   ├── schemas.py               # Chat Pydantic models
│   │   ├── dependencies.py          # Chat dependencies
│   │   ├── Dockerfile               # Chat service Dockerfile (EXPOSE 8004)
│   │   └── __init__.py
│   └── alembic/                     # DB migrations (shared)
│       ├── env.py
│       ├── script.py.mako
│       └── versions/
├── frontend/
│   ├── package.json                 # Frontend dependencies
│   ├── tsconfig.json                # TypeScript config
│   ├── vite.config.ts               # Vite config
│   ├── Dockerfile                   # Frontend Dockerfile
│   ├── public/
│   │   └── index.html               # HTML entry point
│   ├── src/
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.tsx                  # App root, router
│   │   ├── api/
│   │   │   ├── client.ts            # Axios instance
│   │   │   ├── auth.ts              # Auth API functions
│   │   │   ├── projects.ts          # Project API functions
│   │   │   ├── notifications.ts     # Notification API functions
│   │   │   └── chat.ts              # Chat API functions
│   │   ├── hooks/
│   │   │   ├── useAuth.ts           # Auth state and actions
│   │   │   ├── useProjects.ts       # Project state and actions
│   │   │   ├── useKpis.ts           # KPI state and actions
│   │   │   ├── useNotifications.ts  # Notification state and actions
│   │   │   └── useChat.ts           # Chat state and actions
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Topbar.tsx
│   │   │   │   └── PageContainer.tsx
│   │   │   ├── kpi/
│   │   │   │   └── KpiCard.tsx
│   │   │   ├── charts/
│   │   │   │   └── PlanVsExecutionChart.tsx
│   │   │   ├── projects/
│   │   │   │   ├── ProjectTable.tsx
│   │   │   │   ├── ProjectStatusBadge.tsx
│   │   │   │   └── ProjectForm.tsx
│   │   │   ├── notifications/
│   │   │   │   ├── NotificationList.tsx
│   │   │   │   ├── NotificationFilters.tsx
│   │   │   │   └── NotificationDetail.tsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatPanel.tsx
│   │   │   │   ├── ChatBubble.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   └── ChatFloatingButton.tsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Tooltip.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   ├── Avatar.tsx
│   │   │   │   └── Dropdown.tsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── NotificationsPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── styles/
│   │   │   ├── tokens.ts            # Design tokens (colors, spacing, etc.)
│   │   │   └── global.css
│   │   └── types/
│   │       ├── models.ts            # TypeScript interfaces (see §2)
│   │       └── index.ts
```

---

## 5. ENVIRONMENT VARIABLES

| Name                        | Type    | Description                                         | Example Value                |
|-----------------------------|---------|-----------------------------------------------------|------------------------------|
| POSTGRES_HOST               | string  | PostgreSQL host                                     | db                           |
| POSTGRES_PORT               | int     | PostgreSQL port                                     | 5432                         |
| POSTGRES_DB                 | string  | PostgreSQL database name                            | gestion_proyectos            |
| POSTGRES_USER               | string  | PostgreSQL username                                 | gp_admin                     |
| POSTGRES_PASSWORD           | string  | PostgreSQL password                                 | supersecret                  |
| AUTH_JWT_SECRET             | string  | JWT secret for auth-service                         | change_this_secret           |
| AUTH_JWT_EXPIRE_MINUTES     | int     | JWT expiration in minutes                           | 60                           |
| FRONTEND_API_URL            | string  | Base URL for backend API (used by frontend)         | http://localhost:8001        |
| PROJECT_API_URL             | string  | Project service API URL                             | http://localhost:8002        |
| NOTIFICATION_API_URL        | string  | Notification service API URL                        | http://localhost:8003        |
| CHAT_API_URL                | string  | Chat service API URL                                | http://localhost:8004        |
| NODE_ENV                    | string  | Frontend environment                                | development                  |
| VITE_PUBLIC_URL             | string  | Public URL for Vite                                 | /                            |

---

## 6. IMPORT CONTRACTS

**Backend:**

- `from backend.shared.models import User, Project, Notification, ChatMessage, KPI, TrendPoint`
- `from backend.shared.db import Base, get_db, SessionLocal`
- `from backend.shared.security import create_access_token, verify_password, get_password_hash`
- `from backend.auth-service.schemas import UserCreate, UserLogin, Token`
- `from backend.project-service.schemas import ProjectCreate, ProjectUpdate`
- `from backend.notification-service.schemas import NotificationCreate`
- `from backend.chat-service.schemas import ChatMessageCreate`

**Frontend:**

- `import { User, UserCreate, UserLogin, Token, Project, ProjectCreate, ProjectUpdate, KPI, TrendPoint, Notification, NotificationCreate, ChatMessage, ChatMessageCreate } from '../types/models'`
- `import { useAuth } from '../hooks/useAuth'`
- `import { useProjects } from '../hooks/useProjects'`
- `import { useKpis } from '../hooks/useKpis'`
- `import { useNotifications } from '../hooks/useNotifications'`
- `import { useChat } from '../hooks/useChat'`
- `import { Button, Card, Table, Modal, Tooltip, Spinner, Skeleton, Avatar, Dropdown } from '../components/ui'`
- `import { Sidebar } from '../components/layout/Sidebar'`
- `import { Topbar } from '../components/layout/Topbar'`
- `import { KpiCard } from '../components/kpi/KpiCard'`
- `import { PlanVsExecutionChart } from '../components/charts/PlanVsExecutionChart'`
- `import { ProjectTable, ProjectStatusBadge, ProjectForm } from '../components/projects'`
- `import { NotificationList, NotificationFilters, NotificationDetail } from '../components/notifications'`
- `import { ChatPanel, ChatBubble, ChatInput, ChatFloatingButton } from '../components/chat'`

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### State Hooks

- `useAuth() → { user, isAuthenticated, loading, error, login, logout, register }`
- `useProjects() → { projects, loading, error, createProject, updateProject, deleteProject, selectedProject, selectProject, trendData, fetchTrend }`
- `useKpis() → { kpis, loading, error, refetch }`
- `useNotifications() → { notifications, loading, error, filters, setFilters, markAsRead, deleteNotification, unreadCount }`
- `useChat() → { messages, loading, error, sendMessage, isAiTyping, openChat, closeChat, chatOpen }`

### Component Props/Inputs

- `Sidebar` props: `{ currentPage: string, onNavigate: (page: string) => void }`
- `Topbar` props: `{ user: User, onLogout: () => void, onSearch: (query: string) => void }`
- `KpiCard` props: `{ label: string, value: number, trend?: "up" | "down" | "neutral", color: string, icon: React.ReactNode }`
- `PlanVsExecutionChart` props: `{ data: TrendPoint[] }`
- `ProjectTable` props: `{ projects: Project[], onSelect: (id: number) => void, onEdit: (id: number) => void, onDelete: (id: number) => void, loading: boolean }`
- `ProjectStatusBadge` props: `{ status: Project["status"] }`
- `ProjectForm` props: `{ initialValues?: ProjectCreate | Project, onSubmit: (data: ProjectCreate | ProjectUpdate) => void, loading: boolean }`
- `NotificationList` props: `{ notifications: Notification[], filters: { type?: Notification["type"], read?: boolean }, onFilterChange: (filters: any) => void, onSelect: (id: number) => void, onMarkAsRead: (id: number) => void, onDelete: (id: number) => void, loading: boolean }`
- `NotificationFilters` props: `{ filters: { type?: Notification["type"], read?: boolean }, onChange: (filters: any) => void }`
- `NotificationDetail` props: `{ notification: Notification, onClose: () => void }`
- `ChatPanel` props: `{ messages: ChatMessage[], onSend: (message: string) => void, loading: boolean, isAiTyping: boolean, onClose: () => void }`
- `ChatBubble` props: `{ message: ChatMessage }`
- `ChatInput` props: `{ onSend: (message: string) => void, loading: boolean }`
- `ChatFloatingButton` props: `{ onClick: () => void, unreadCount: number }`
- `Button` props: `{ children: React.ReactNode, variant?: "primary" | "secondary" | "tertiary" | "icon", onClick: () => void, disabled?: boolean, loading?: boolean, icon?: React.ReactNode }`
- `Card` props: `{ children: React.ReactNode, variant?: "info" | "kpi" | "chart" }`
- `Table` props: `{ columns: any[], data: any[], loading: boolean, onRowClick?: (row: any) => void }`
- `Modal` props: `{ open: boolean, onClose: () => void, title?: string, children: React.ReactNode }`
- `Tooltip` props: `{ title: string, children: React.ReactNode }`
- `Spinner` props: `{ size?: number }`
- `Skeleton` props: `{ width?: number | string, height?: number | string }`
- `Avatar` props: `{ user: User }`
- `Dropdown` props: `{ options: any[], value: any, onChange: (value: any) => void }`

### Pages

- `DashboardPage` uses: `Sidebar`, `Topbar`, `KpiCard[]`, `PlanVsExecutionChart`, `ProjectTable`, `ChatPanel`, `ChatFloatingButton`
- `NotificationsPage` uses: `Sidebar`, `Topbar`, `NotificationList`, `NotificationFilters`, `NotificationDetail`
- `LoginPage` uses: `Card`, `Button`, `TextField`
- `NotFoundPage` uses: `Card`, `Button`

---

## 8. FILE EXTENSION CONVENTION

- All frontend files use `.tsx` (TypeScript React).
- The project is TypeScript-first: all frontend code is `.ts`/`.tsx`.
- Entry point: `/src/main.tsx` as referenced in `public/index.html` via `<script type="module" src="/src/main.tsx"></script>`.
- No `.jsx` or plain `.js` files in frontend.
- All backend Python files use `.py`.
