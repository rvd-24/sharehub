from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

from app.core.config import get_settings

settings = get_settings()

engine = create_async_engine(settings.database_url, future=True)
SessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, autoflush=False, autocommit=False)
Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        await db.close()
