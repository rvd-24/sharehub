from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.backend.app.core.auth import get_current_user
from backend.backend.app.db import get_db
from backend.backend.app.models.listing import Listing
from backend.backend.app.models.user import User
from backend.backend.app.schemas.listing import ListingCreate, ListingOut, ListingUpdate

router = APIRouter(prefix="/api/listings", tags=["listings"])


def _serialize_listing(listing: Listing) -> ListingOut:
    return ListingOut(
        id=listing.id,
        owner_id=listing.owner_id,
        owner_name=listing.owner.name if listing.owner else None,
        title=listing.title,
        description=listing.description,
        category=listing.category,
        subcategories=listing.subcategories or [],
        brand=listing.brand,
        condition=listing.condition,
        purchase_year=listing.purchase_year,
        daily_price=float(listing.daily_price),
        weekly_price=float(listing.weekly_price) if listing.weekly_price is not None else None,
        monthly_price=float(listing.monthly_price) if listing.monthly_price is not None else None,
        deposit_amount=float(listing.deposit_amount) if listing.deposit_amount is not None else None,
        min_duration=listing.min_duration,
        city=listing.city,
        locality=listing.locality,
        pin=listing.pin,
        handover=listing.handover,
        delivery_radius=listing.delivery_radius,
        delivery_fee=float(listing.delivery_fee) if listing.delivery_fee is not None else None,
        photo_urls=listing.photo_urls or [],
        rules=listing.rules or [],
        blocked_dates=listing.blocked_dates or [],
        status=listing.status,
        is_public=listing.is_public,
        created_at=listing.created_at,
        updated_at=listing.updated_at,
    )


@router.get("", response_model=list[ListingOut])
async def list_public_listings(
    category: str | None = Query(default=None),
    q: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
) -> list[ListingOut]:
    statement = (
        select(Listing)
        .options(selectinload(Listing.owner))
        .where(Listing.status == "approved")
        .order_by(Listing.created_at.desc())
    )

    if category:
        statement = statement.where(Listing.category == category)

    if q:
        term = f"%{q.lower()}%"
        statement = statement.where(
            or_(
                func.lower(Listing.title).like(term),
                func.lower(Listing.category).like(term),
                func.lower(Listing.city).like(term),
                func.lower(func.coalesce(Listing.locality, "")).like(term),
            )
        )

    result = await db.execute(statement)
    listings = result.scalars().unique().all()
    return [_serialize_listing(listing) for listing in listings]


@router.get("/mine", response_model=list[ListingOut])
async def list_my_listings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ListingOut]:
    result = await db.execute(
        select(Listing)
        .options(selectinload(Listing.owner))
        .where(Listing.owner_id == current_user.id)
        .order_by(Listing.updated_at.desc())
    )
    listings = result.scalars().unique().all()
    return [_serialize_listing(listing) for listing in listings]


@router.post("", response_model=ListingOut, status_code=status.HTTP_201_CREATED)
async def create_listing(
    payload: ListingCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ListingOut:
    payload_data = payload.model_dump(exclude={"is_public"})
    listing = Listing(
        owner_id=current_user.id,
        status="approval_in_progress",
        is_public=False,
        **payload_data,
    )
    db.add(listing)
    await db.flush()          # assigns listing.id before the object is expired
    new_id = listing.id
    await db.commit()
    result = await db.execute(
        select(Listing)
        .options(selectinload(Listing.owner))
        .where(Listing.id == new_id)
    )
    created_listing = result.scalar_one()
    return _serialize_listing(created_listing)


@router.put("/{listing_id}", response_model=ListingOut)
async def update_listing(
    listing_id: int,
    payload: ListingUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ListingOut:
    listing = await db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")

    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can update only your listings.")

    for field, value in payload.model_dump(exclude_unset=True).items():
        if field == "is_public":
            continue
        setattr(listing, field, value)

    await db.commit()
    result = await db.execute(
        select(Listing)
        .options(selectinload(Listing.owner))
        .where(Listing.id == listing_id)
    )
    updated_listing = result.scalar_one()
    return _serialize_listing(updated_listing)