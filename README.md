# gestion de proyectos 22222

Sistema de gestión de proyectos con microservicios backend en FastAPI y frontend en React.

## Arquitectura

- **auth-service** (8001): Autenticación y gestión de usuarios
- **project-service** (8002): Gestión de proyectos y KPIs
- **notification-service** (8003): Notificaciones
- **chat-service** (8004): Chat y mensajes
- **frontend** (5173): Aplicación React

## Prerrequisitos

- Docker 24.x
- Docker Compose 2.x

## Instalación y Uso

1. Clonar el repositorio
2. Ejecutar `./run.sh`
3. Acceder a http://localhost:5173

## Endpoints API

### Auth Service (8001)
- POST `/api/auth/register` - Registro de usuario
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Usuario actual

### Project Service (8002)
- GET `/api/projects` - Listar proyectos
- POST `/api/projects` - Crear proyecto
- GET `/api/projects/{id}` - Obtener proyecto
- PATCH `/api/projects/{id}` - Actualizar proyecto
- DELETE `/api/projects/{id}` - Eliminar proyecto
- GET `/api/projects/{id}/trend` - Tendencia del proyecto
- GET `/api/kpis` - KPIs globales

### Notification Service (8003)
- GET `/api/notifications` - Listar notificaciones
- POST `/api/notifications` - Crear notificación
- PATCH `/api/notifications/{id}/read` - Marcar como leída
- DELETE `/api/notifications/{id}` - Eliminar notificación

### Chat Service (8004)
- GET `/api/chat/messages` - Listar mensajes
- POST `/api/chat/messages` - Enviar mensaje

## Variables de Entorno

Ver `.env.example` para todas las variables disponibles.