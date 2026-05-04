# DEVELOPMENT PLAN: gestion de proyectos 22222

## 1. ARCHITECTURE OVERVIEW

**Architecture:**  
- Microservicios backend en Python 3.11 (FastAPI), PostgreSQL 15, frontend en React 18 (Vite + TypeScript), Docker para orquestación, siguiendo la estructura y contratos de SPEC.md y los documentos de arquitectura HLD/LLD.
- Cada microservicio tiene su propio Dockerfile y puerto, con modelos y utilidades compartidas en `backend/shared/`.
- Frontend desacoplado, consume APIs REST de los servicios backend.
- Infraestructura orquestada con `docker-compose.yml`, healthchecks, variables de entorno validadas, y scripts de arranque automatizados.

**Componentes principales:**
- **Backend:**  
  - `auth-service` (8001): autenticación y gestión de usuarios.
  - `project-service` (8002): gestión de proyectos y KPIs.
  - `notification-service` (8003): notificaciones.
  - `chat-service` (8004): chat y mensajes.
  - `shared/`: modelos Pydantic, utilidades, seguridad, conexión DB.
  - `alembic/`: migraciones de base de datos.
- **Frontend:**  
  - React 18 + Vite + TypeScript, estructura modular, consumo de APIs, dashboards y reportería.
- **Infraestructura:**  
  - Docker Compose, .env.example, run.sh, documentación, healthchecks, dependencias entre servicios.

**Modelos y contratos:**  
- Todos los modelos (User, Project, Notification, ChatMessage, etc.) y enums definidos en SPEC.md se centralizan en `backend/shared/models.py` y sus equivalentes TypeScript en `frontend/src/types.ts`.
- API endpoints y rutas exactamente como en SPEC.md, sin agregar ni omitir ninguno.

**Folder structure (extracto):**
```
.
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .dockerignore
├── README.md
├── run.sh
├── docs/
│   └── architecture.md
├── backend/
│   ├── shared/
│   │   ├── models.py
│   │   ├── db.py
│   │   ├── security.py
│   │   └── __init__.py
│   ├── auth-service/
│   │   ├── main.py
│   │   ├── crud.py
│   │   ├── schemas.py
│   │   ├── dependencies.py
│   │   ├── Dockerfile
│   │   └── __init__.py
│   ├── project-service/
│   │   ├── main.py
│   │   ├── crud.py
│   │   ├── schemas.py
│   │   ├── dependencies.py
│   │   ├── Dockerfile
│   │   └── __init__.py
│   ├── notification-service/
│   │   ├── main.py
│   │   ├── crud.py
│   │   ├── schemas.py
│   │   ├── dependencies.py
│   │   ├── Dockerfile
│   │   └── __init__.py
│   ├── chat-service/
│   │   ├── main.py
│   │   ├── crud.py
│   │   ├── schemas.py
│   │   ├── dependencies.py
│   │   ├── Dockerfile
│   │   └── __init__.py
│   └── alembic/
│       ├── env.py
│       ├── script.py.mako
│       └── versions/
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       └── types.ts
```

## 2. ACCEPTANCE CRITERIA

1. El sistema permite la autenticación y autorización de usuarios, gestión de proyectos, notificaciones y chat, cumpliendo exactamente los contratos de API y modelos definidos en SPEC.md.
2. El frontend React consume los endpoints REST de los microservicios, mostrando dashboards interactivos y reportería en tiempo real, con latencia de carga inferior a 2 segundos.
3. El despliegue local con `./run.sh` levanta todos los servicios, con healthchecks y dependencias, y la aplicación es accesible en `http://localhost:<frontend-port>`, cumpliendo los requisitos de seguridad, performance y estructura definidos.

---

## TEAM SCOPE (MANDATORY — PARSED BY THE PIPELINE)
- **Role:** role-tl (technical_lead)
- **Role:** role-be (backend_developer)
- **Role:** role-fe (frontend_developer)
- **Role:** role-devops (devops_support)

---

## 3. EXECUTABLE ITEMS

---

### ITEM 1: Foundation — shared types, interfaces, DB schemas, config
**Goal:** Crear todos los modelos compartidos, utilidades, configuración y contratos de datos para backend y frontend. Incluye modelos Pydantic/SQLAlchemy, interfaces TypeScript, configuración de entorno, utilidades y esquema SQL inicial.
**Files to create:**
- backend/shared/models.py (create) — Todos los modelos Pydantic y SQLAlchemy (User, Project, Notification, ChatMessage, enums, etc.) según SPEC.md.
- backend/shared/db.py (create) — SQLAlchemy base, sesión, engine, conexión a PostgreSQL.
- backend/shared/security.py (create) — Utilidades JWT, hashing de contraseñas.
- backend/shared/__init__.py (create)
- backend/shared/config.py (create) — Validación de variables de entorno, constantes compartidas.
- backend/alembic/env.py (create) — Configuración de Alembic para migraciones.
- backend/alembic/script.py.mako (create) — Plantilla de scripts de migración.
- backend/alembic/versions/ (create) — Carpeta para scripts de migración.
- frontend/src/types.ts (create) — Todas las interfaces y enums TypeScript según SPEC.md.
**Dependencies:** None
**Validation:**  
- Ejecutar `alembic revision --autogenerate -m "init"` y `alembic upgrade head` para crear el esquema inicial en PostgreSQL.
- Importar modelos y utilidades desde otros servicios y frontend sin errores de importación.
**Role:** role-tl (technical_lead)

---

### ITEM 2: Auth Service — User registration, login, JWT, RBAC
**Goal:** Implementar el microservicio de autenticación y gestión de usuarios, incluyendo endpoints de registro, login, obtención de usuario actual, validación JWT y RBAC.
**Files to create:**
- backend/auth-service/main.py (create) — FastAPI app, rutas `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/health`.
- backend/auth-service/crud.py (create) — Lógica CRUD de usuarios.
- backend/auth-service/schemas.py (create) — Modelos Pydantic de usuario y token.
- backend/auth-service/dependencies.py (create) — Dependencias de autenticación y autorización.
- backend/auth-service/Dockerfile (create) — Multi-stage build, usuario no-root, EXPOSE 8001, CMD: `uvicorn main:app --host 0.0.0.0 --port 8001`.
- backend/auth-service/__init__.py (create)
**Dependencies:** Item 1
**Validation:**  
- Levantar el servicio y probar `/api/auth/register`, `/api/auth/login`, `/api/auth/me` con JWT y roles.
- `/health` responde con `{status, service, version}`.
**Role:** role-be (backend_developer)

---

### ITEM 3: Project Service — Project CRUD, KPIs, trend analytics
**Goal:** Implementar el microservicio de gestión de proyectos, incluyendo endpoints CRUD de proyectos, KPIs y tendencias, con validación de roles y performance.
**Files to create:**
- backend/project-service/main.py (create) — FastAPI app, rutas `/api/projects`, `/api/projects/{id}`, `/api/projects/{id}/trend`, `/api/kpis`, `/health`.
- backend/project-service/crud.py (create) — Lógica CRUD de proyectos y KPIs.
- backend/project-service/schemas.py (create) — Modelos Pydantic de proyectos, KPIs, tendencias.
- backend/project-service/dependencies.py (create) — Dependencias de autenticación y autorización.
- backend/project-service/Dockerfile (create) — Multi-stage build, usuario no-root, EXPOSE 8002, CMD: `uvicorn main:app --host 0.0.0.0 --port 8002`.
- backend/project-service/__init__.py (create)
**Dependencies:** Item 1
**Validation:**  
- Levantar el servicio y probar `/api/projects`, `/api/projects/{id}`, `/api/projects/{id}/trend`, `/api/kpis` con JWT y roles.
- `/health` responde correctamente.
**Role:** role-be (backend_developer)

---

### ITEM 4: Notification Service — Notification CRUD, read/unread, filtering
**Goal:** Implementar el microservicio de notificaciones, incluyendo endpoints para listar, crear, marcar como leídas y eliminar notificaciones, con filtros y seguridad.
**Files to create:**
- backend/notification-service/main.py (create) — FastAPI app, rutas `/api/notifications`, `/api/notifications/{id}/read`, `/api/notifications/{id}`, `/health`.
- backend/notification-service/crud.py (create) — Lógica CRUD de notificaciones.
- backend/notification-service/schemas.py (create) — Modelos Pydantic de notificaciones.
- backend/notification-service/dependencies.py (create) — Dependencias de autenticación y autorización.
- backend/notification-service/Dockerfile (create) — Multi-stage build, usuario no-root, EXPOSE 8003, CMD: `uvicorn main:app --host 0.0.0.0 --port 8003`.
- backend/notification-service/__init__.py (create)
**Dependencies:** Item 1
**Validation:**  
- Levantar el servicio y probar `/api/notifications`, `/api/notifications/{id}/read`, `/api/notifications/{id}` con JWT y roles.
- `/health` responde correctamente.
**Role:** role-be (backend_developer)

---

### ITEM 5: Chat Service — Chat message CRUD, project context
**Goal:** Implementar el microservicio de chat, incluyendo endpoints para listar y crear mensajes de chat, filtrado por proyecto, con seguridad y performance.
**Files to create:**
- backend/chat-service/main.py (create) — FastAPI app, rutas `/api/chat/messages`, `/health`.
- backend/chat-service/crud.py (create) — Lógica CRUD de mensajes de chat.
- backend/chat-service/schemas.py (create) — Modelos Pydantic de mensajes de chat.
- backend/chat-service/dependencies.py (create) — Dependencias de autenticación y autorización.
- backend/chat-service/Dockerfile (create) — Multi-stage build, usuario no-root, EXPOSE 8004, CMD: `uvicorn main:app --host 0.0.0.0 --port 8004`.
- backend/chat-service/__init__.py (create)
**Dependencies:** Item 1
**Validation:**  
- Levantar el servicio y probar `/api/chat/messages` (GET/POST) con JWT y roles.
- `/health` responde correctamente.
**Role:** role-be (backend_developer)

---

### ITEM 6: Frontend — React app, dashboards, API integration
**Goal:** Implementar la aplicación frontend en React 18 + Vite + TypeScript, consumiendo los endpoints REST, mostrando dashboards interactivos, reportería, login, gestión de proyectos, notificaciones y chat, siguiendo el contrato UI/UX aprobado.
**Files to create:**
- frontend/package.json (create) — Dependencias y scripts.
- frontend/tsconfig.json (create) — Configuración TypeScript.
- frontend/vite.config.ts (create) — Configuración Vite.
- frontend/Dockerfile (create) — Multi-stage build, usuario no-root, EXPOSE 5173, CMD: `npm run preview`.
- frontend/public/index.html (create) — Entry point HTML.
- frontend/src/main.tsx (create) — Entry point React.
- frontend/src/App.tsx (create) — Layout principal, rutas.
- frontend/src/types.ts (create) — Interfaces y enums (declarado en Item 1, pero implementado aquí).
**Dependencies:** Item 1
**Validation:**  
- Levantar el frontend, consumir APIs backend, login, dashboards y reportería funcionales, latencia <2s.
- Acceso a la app en `http://localhost:5173` (o puerto configurado).
**Role:** role-fe (frontend_developer)

---

### ITEM 7: Infrastructure & Deployment (REQUIRED — PROJECT MUST RUN)
**Goal:** Orquestar todos los servicios y frontend con Docker Compose, healthchecks, dependencias, variables de entorno, documentación y script de arranque automatizado.
**Files to create:**
- docker-compose.yml (create) — Todos los servicios, healthchecks, depends_on, puertos, build context correcto.
- .env.example (create) — Todas las variables de entorno documentadas.
- .gitignore (create) — Ignorar node_modules, dist, .env, __pycache__, *.pyc, logs.
- .dockerignore (create) — Ignorar node_modules, .git, dist, logs.
- run.sh (create) — Script de arranque: valida Docker, build, espera healthy, imprime URL.
- README.md (create) — Prerrequisitos, instrucciones de uso, endpoints, troubleshooting.
- docs/architecture.md (create) — Diagrama de arquitectura y descripción de componentes.
**Dependencies:** Items 1–6
**Validation:**  
- Ejecutar `./run.sh` y verificar que todos los servicios estén healthy, frontend accesible, APIs funcionales.
**Role:** role-devops (devops_support)

---