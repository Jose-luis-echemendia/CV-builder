from fastapi.routing import APIRoute


# --- UTILIDAD PARA INICIAR LA APP ---
def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"
