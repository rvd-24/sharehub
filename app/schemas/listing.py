from datetime import datetime

from pydantic import BaseModel, Field


class ListingCreate(BaseModel):
    title: str
    description: str | None = None
    category: str
    subcategories: list[str] = Field(default_factory=list)
    brand: str | None = None
    condition: str = "good"
    purchase_year: int | None = None
    daily_price: float
    weekly_price: float | None = None
    monthly_price: float | None = None
    deposit_amount: float | None = None
    min_duration: int = 1
    city: str
    locality: str | None = None
    pin: str | None = None
    handover: str = "pickup"
    delivery_radius: int | None = None
    delivery_fee: float | None = None
    photo_urls: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    blocked_dates: list[str] = Field(default_factory=list)
    is_public: bool = True


class ListingUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    subcategories: list[str] | None = None
    brand: str | None = None
    condition: str | None = None
    purchase_year: int | None = None
    daily_price: float | None = None
    weekly_price: float | None = None
    monthly_price: float | None = None
    deposit_amount: float | None = None
    min_duration: int | None = None
    city: str | None = None
    locality: str | None = None
    pin: str | None = None
    handover: str | None = None
    delivery_radius: int | None = None
    delivery_fee: float | None = None
    photo_urls: list[str] | None = None
    rules: list[str] | None = None
    blocked_dates: list[str] | None = None
    is_public: bool | None = None


class ListingOut(BaseModel):
    id: int
    owner_id: str
    owner_name: str | None = None
    title: str
    description: str | None = None
    category: str
    subcategories: list[str] = Field(default_factory=list)
    brand: str | None = None
    condition: str
    purchase_year: int | None = None
    daily_price: float
    weekly_price: float | None = None
    monthly_price: float | None = None
    deposit_amount: float | None = None
    min_duration: int
    city: str
    locality: str | None = None
    pin: str | None = None
    handover: str
    delivery_radius: int | None = None
    delivery_fee: float | None = None
    photo_urls: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    blocked_dates: list[str] = Field(default_factory=list)
    status: str
    is_public: bool
    created_at: datetime
    updated_at: datetime