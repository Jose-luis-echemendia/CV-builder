cv-generator/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── dependencies.py            # get_db, get_user_id (lee X-User-Id header)
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py              # Settings: DB_URL, REDIS_URL, MINIO_*, SECRET_KEY
│   │   ├── security.py            # ← tu módulo (require_api_key / require_admin_key)
│   │   ├── database.py            # SQLAlchemy async engine + AsyncSession
│   │   ├── redis.py               # Redis client (aioredis)
│   │   ├── minio.py               # MinIO client + upload/presign helpers
│   │   └── exceptions.py          # CVNotFound, TemplateNotFound, PDFGenerationError…
│   │
│   ├── models/                    # SQLAlchemy ORM — solo dominio CV
│   │   ├── __init__.py
│   │   ├── base.py                # DeclarativeBase + TimestampMixin (created_at/updated_at)
│   │   ├── personal_info.py       # PersonalInfo  (1-1 con user_id externo)
│   │   ├── project.py             # Project
│   │   ├── project_section.py     # ProjectSection  (descripción + tag)
│   │   ├── skill.py               # Skill + SkillCategory
│   │   ├── cv_template.py         # CVTemplate  (nombre, preview_url, ruta jinja2)
│   │   ├── cv.py                  # CV  (cabecera: título, job_target, estado…)
│   │   └── cv_composition.py      # CVProject · CVSection · CVSkill  (selección)
│   │
│   ├── schemas/                   # Pydantic v2
│   │   ├── __init__.py
│   │   ├── common.py              # Pagination, MessageResponse, UUIDModel
│   │   ├── personal_info.py
│   │   ├── project.py
│   │   ├── project_section.py
│   │   ├── skill.py
│   │   ├── cv_template.py
│   │   └── cv.py                  # CVCreate · CVRead · CVBuildRequest · CVStatusRead
│   │
│   ├── repositories/
│   │   ├── __init__.py
│   │   ├── base.py                # BaseRepository[Model] — CRUD genérico async
│   │   ├── personal_info_repo.py
│   │   ├── project_repo.py
│   │   ├── skill_repo.py
│   │   ├── cv_template_repo.py
│   │   └── cv_repo.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── personal_info_service.py
│   │   ├── project_service.py
│   │   ├── skill_service.py
│   │   ├── cv_template_service.py
│   │   ├── cv_service.py          # ensambla datos → dispara tarea Celery
│   │   └── pdf_service.py         # Jinja2 render → WeasyPrint → MinIO upload
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py          # agrega todos los sub-routers
│   │       ├── personal_info.py   # GET/PUT  /me/personal-info
│   │       ├── projects.py        # CRUD     /projects  +  /projects/{id}/sections
│   │       ├── skills.py          # CRUD     /skills    +  /skills/categories
│   │       ├── cv_templates.py    # GET      /templates  (admin: POST/DELETE)
│   │       └── cvs.py             # CRUD     /cvs
│   │                              # POST     /cvs/{id}/build
│   │                              # GET      /cvs/{id}/status
│   │                              # GET      /cvs/{id}/download  (presigned URL)
│   │
│   └── workers/
│       ├── __init__.py
│       ├── celery_app.py          # Celery instance + config
│       ├── beat_schedule.py       # cleanup_expired_pdfs cada 24 h
│       └── tasks/
│           ├── __init__.py
│           ├── pdf_tasks.py       # @shared_task generate_cv_pdf(cv_id, user_id)
│           └── cleanup_tasks.py   # elimina PDFs expirados de MinIO + marca CV
│
├── cv_templates/                  # Plantillas Jinja2 para generación PDF
│   ├── modern/
│   │   ├── template.html.j2
│   │   └── style.css
│   ├── classic/
│   │   ├── template.html.j2
│   │   └── style.css
│   └── minimal/
│       ├── template.html.j2
│       └── style.css
│
├── migrations/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│
├── tests/
│   ├── conftest.py                # fixtures: async client, test DB, fake user_id header
│   ├── factories/
│   │   ├── project_factory.py
│   │   ├── skill_factory.py
│   │   └── cv_factory.py
│   └── test_api/
│       ├── test_personal_info.py
│       ├── test_projects.py
│       ├── test_skills.py
│       ├── test_cvs.py
│       └── test_pdf_generation.py
│
├── docker/
│   ├── Dockerfile                 # API
│   └── Dockerfile.worker          # Celery worker + beat
│
├── docker-compose.yml
├── pyproject.toml
├── alembic.ini
└── .env.example