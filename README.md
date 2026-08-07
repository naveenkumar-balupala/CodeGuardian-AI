# CodeGuardian AI - Enterprise Platform Foundation

CodeGuardian AI is built with an enterprise-grade modular architecture separating Frontend, Backend, AI Infrastructure, Database Storage, Caching, and Container Orchestration.

---

## Architecture Overview

```
CodeGuardian AI (Root)
├── .github/                 # GitHub Actions CI/CD Workflows
├── docker/                  # Docker container init scripts & setup
├── frontend/                # Next.js 14+ (App Router) + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/             # App router pages & layouts
│   │   ├── components/      # UI components (ui, layout, features)
│   │   ├── hooks/           # React hooks
│   │   ├── lib/             # API client & helpers
│   │   ├── services/        # Service API abstractions
│   │   └── types/           # Shared TypeScript types
├── backend/                 # FastAPI Enterprise Backend
│   ├── app/
│   │   ├── ai/              # AI Engine & LLM Provider abstractions
│   │   ├── api/             # Versioned API routes (v1) & OpenAPI dependencies
│   │   ├── core/            # Config, Logging, Database & Redis managers
│   │   ├── exceptions/      # Custom exception hierarchy & global handlers
│   │   ├── middleware/      # Correlation ID, CORS & Request middleware
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── repositories/    # Generic async repository data access layer
│   │   ├── schemas/         # Pydantic v2 data contracts
│   │   ├── services/        # Business service abstractions
│   │   └── utils/           # Helper utilities
│   ├── alembic/             # Database migrations engine
│   ├── pyproject.toml       # Python package metadata & tool configs
│   └── Dockerfile           # Backend multi-stage production container
└── docker-compose.yml       # Full system container stack
```

---

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Lucide React
- **Backend**: FastAPI, Python 3.11, Pydantic v2, Structlog
- **Database**: PostgreSQL 16 with Async SQLAlchemy 2.0 & Alembic migrations
- **Caching & State**: Redis 7 with `redis-py` async connection management
- **DevOps**: Docker, Docker Compose, GitHub Actions CI/CD

---

## Quickstart

### Running with Docker Compose

1. Copy environment example files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Start all services using Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Access the endpoints:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Backend Healthcheck**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
