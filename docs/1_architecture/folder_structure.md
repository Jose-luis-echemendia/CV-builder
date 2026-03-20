/home/jose/Escritorio/Work/CV-builder/backend
├── alembic.ini
├── app
│   ├── admin.py
│   ├── alembic
│   │   ├── env.py
│   │   ├── migrations
│   │   │   └── 6bec4302ec7e_25_12_27_init_db.py
│   │   ├── README
│   │   └── script.py.mako
│   ├── api
│   │   ├── deps.py
│   │   └── v1
│   │       ├── router.py
│   │       └── routes
│   │           ├── cvs.py
│   │           ├── cv_templates.py
│   │           ├── health.py
│   │           ├── personal_info.py
│   │           ├── projects.py
│   │           ├── skills.py
│   │           └── utils.py
│   ├── backend_pre_start.py
│   ├── core
│   │   ├── beat_schedule.py
│   │   ├── cache.py
│   │   ├── celery.py
│   │   ├── config.py
│   │   ├── db.py
│   │   ├── logging.py
│   │   ├── redis.py
│   │   ├── s3.py
│   │   └── security.py
│   ├── custom_types
│   ├── enums.py
│   ├── exceptions
│   │   └── exceptions.py
│   ├── feature_flags.py
│   ├── logs.py
│   ├── main.py
│   ├── middlewares
│   │   ├── common.py
│   │   └── rate_limit.py
│   ├── models
│   │   ├── app_setting.py
│   │   ├── common.py
│   │   ├── cv_composition.py
│   │   ├── cv.py
│   │   ├── cv_template.py
│   │   ├── personal_info.py
│   │   ├── project.py
│   │   ├── project_section.py
│   │   └── skill.py
│   ├── repositories
│   │   ├── base.py
│   │   ├── cv_composition.py
│   │   ├── cv.py
│   │   ├── cv_template.py
│   │   ├── personal_info.py
│   │   ├── project.py
│   │   ├── project_section.py
│   │   └── skill.py
│   ├── schemas
│   │   ├── cv_composition.py
│   │   ├── cv.py
│   │   ├── cv_template.py
│   │   ├── personal_info.py
│   │   ├── project.py
│   │   ├── project_section.py
│   │   ├── skill.py
│   │   └── utils.py
│   ├── seed
│   │   ├── data_settings.py
│   │   ├── main.py
│   │   ├── README.md
│   │   └── seeders.py
│   ├── seed_data.py
│   ├── services
│   │   ├── common.py
│   │   ├── cv.py
│   │   ├── cv_template.py
│   │   ├── pdf.py
│   │   ├── personal_info.py
│   │   ├── project.py
│   │   ├── settings.py
│   │   └── skill.py
│   ├── sync_docs.py
│   ├── tasks
│   │   ├── cleanup.py
│   │   ├── maintenance.py
│   │   └── pdf.py
│   ├── templates
│   │   ├── cv
│   │   │   ├── classic
│   │   │   ├── minimal
│   │   │   └── modern
│   │   └── email
│   │       ├── build
│   │       │   ├── new_account.html
│   │       │   ├── reset_password.html
│   │       │   └── test_email.html
│   │       └── src
│   │           ├── new_account.mjml
│   │           ├── reset_password.mjml
│   │           └── test_email.mjml
│   ├── tests_pre_start.py
│   └── utils
│       ├── cache.py
│       ├── email.py
│       └── generators.py
├── backend_tree.txt
├── docker
│   ├── Dockerfile
│   └── Dockerfile.dev
├── docs
│   ├── commands.md
│   ├── db.md
│   └── migrations.md
├── poetry.lock
├── pyproject.toml
├── README.md
├── scripts
│   ├── format.sh
│   ├── lint.sh
│   ├── make_bucket_public.py
│   ├── prestart.sh
│   ├── start-celery-beat.sh
│   ├── start-celery-worker.sh
│   ├── test.sh
│   ├── tests-start.sh
│   ├── test_statistics_endpoints.sh
│   ├── validate_docs_config.sh
│   ├── verify_migration_order.sh
│   └── verify_prestart_dependencies.sh
├── tests
│   ├── api
│   │   └── routes
│   ├── conftest.py
│   ├── crud
│   ├── scripts
│   │   ├── test_backend_pre_start.py
│   │   └── test_test_pre_start.py
│   ├── services
│   │   ├── test_common.py
│   │   └── test_settings_service.py
│   └── utils
│       └── utils.py
└── uv.lock

36 directories, 112 files
