from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Listing(Base):
    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    owner_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    subcategories: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    brand: Mapped[str | None] = mapped_column(String(255), nullable=True)
    condition: Mapped[str] = mapped_column(String(50), nullable=False, default="good")
    purchase_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    daily_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    weekly_price: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    monthly_price: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    deposit_amount: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    min_duration: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    locality: Mapped[str | None] = mapped_column(String(100), nullable=True)
    pin: Mapped[str | None] = mapped_column(String(20), nullable=True)
    handover: Mapped[str] = mapped_column(String(20), nullable=False, default="pickup")
    delivery_radius: Mapped[int | None] = mapped_column(Integer, nullable=True)
    delivery_fee: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    photo_urls: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    rules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    blocked_dates: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    status: Mapped[str] = mapped_column(
        String(40), nullable=False, default="approval_in_progress", server_default="approval_in_progress"
    )
    is_public: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    owner = relationship("User", back_populates="listings")
