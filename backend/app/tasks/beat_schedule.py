"""
app/workers/beat_schedule.py

Re-exporta el BEAT_SCHEDULE desde app.core.beat_schedule.

¿Por qué este archivo existe si el schedule ya está en core?
  - celery_app.py importa desde app.tasks.beat_schedule (convención Celery)
  - app.core.beat_schedule es donde editamos el schedule (single source of truth)
  - Este módulo es solo un puente para mantener ambas convenciones

Si necesitas agregar tareas de scraping al schedule, hazlo directamente
en app.core.beat_schedule — no aquí.
"""

from app.core.beat_schedule import BEAT_SCHEDULE  # noqa: F401

__all__ = ["BEAT_SCHEDULE"]
