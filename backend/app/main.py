from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from backend.backend.app.api.routes_auth import router as auth_router
from backend.backend.app.api.routes_health import router as health_router
from backend.backend.app.api.routes_listings import router as listings_router
from backend.backend.app.core.config import get_settings
from backend.backend.app.db import Base, engine

settings = get_settings()

app = FastAPI(title=settings.app_name)

LISTING_SCHEMA_PATCHES = [
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS subcategories JSON NOT NULL DEFAULT '[]'::json",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS brand VARCHAR(255)",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS condition VARCHAR(50) NOT NULL DEFAULT 'good'",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS purchase_year INTEGER",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS weekly_price NUMERIC(10, 2)",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS monthly_price NUMERIC(10, 2)",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC(10, 2)",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS min_duration INTEGER NOT NULL DEFAULT 1",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS pin VARCHAR(20)",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS handover VARCHAR(20) NOT NULL DEFAULT 'pickup'",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS delivery_radius INTEGER",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC(10, 2)",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS photo_urls JSON NOT NULL DEFAULT '[]'::json",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS rules JSON NOT NULL DEFAULT '[]'::json",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS blocked_dates JSON NOT NULL DEFAULT '[]'::json",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS status VARCHAR(40) NOT NULL DEFAULT 'approval_in_progress'",
    "ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT TRUE",
]

USER_SCHEMA_PATCHES = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS user_level VARCHAR(20) NOT NULL DEFAULT 'user'",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS address_line1 VARCHAR(255)",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS address_line2 VARCHAR(255)",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(120)",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS state VARCHAR(120)",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS pin VARCHAR(20)",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(120)",
]


async def reconcile_development_schema() -> None:
    async with engine.begin() as conn:
        table_exists = await conn.execute(
            text("SELECT to_regclass('public.listings') IS NOT NULL")
        )
        if not table_exists.scalar():
            return

        for statement in LISTING_SCHEMA_PATCHES:
            await conn.execute(text(statement))

        users_table_exists = await conn.execute(
            text("SELECT to_regclass('public.users') IS NOT NULL")
        )
        if users_table_exists.scalar():
            for statement in USER_SCHEMA_PATCHES:
                await conn.execute(text(statement))

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    # For early development. Replace with Alembic migrations before production.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await reconcile_development_schema()


app.include_router(health_router)
app.include_router(auth_router)
app.include_router(listings_router)
