from fastapi import APIRouter, Depends, HTTPException, status
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import create_access_token, get_current_user
from app.core.config import get_settings
from app.db import get_db
from app.models.user import User
from app.schemas.auth import GoogleAuthRequest, GoogleAuthResponse, UserAddressUpdate, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])
settings = get_settings()


def _serialize_user(user: User) -> UserOut:
    return UserOut(
        id=user.id,
        email=user.email,
        user_level=user.user_level,
        email_verified=user.email_verified,
        name=user.name,
        picture=user.picture,
        given_name=user.given_name,
        family_name=user.family_name,
        profile_description=user.profile_description,
        address_line1=user.address_line1,
        address_line2=user.address_line2,
        city=user.city,
        state=user.state,
        pin=user.pin,
        phone_number=user.phone_number,
        country=user.country,
    )


@router.post("/google", response_model=GoogleAuthResponse)
async def auth_google(payload: GoogleAuthRequest, db: AsyncSession = Depends(get_db)) -> GoogleAuthResponse:
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server is missing GOOGLE_CLIENT_ID.",
        )

    try:
        token_info = id_token.verify_oauth2_token(
            payload.credential,
            google_requests.Request(),
            settings.google_client_id,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google token verification failed.",
        ) from exc

    user_id = token_info.get("sub")
    email = token_info.get("email")
    if not user_id or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token payload.",
        )

    user = await db.get(User, user_id)
    if not user:
        user = User(id=user_id, email=email)
        db.add(user)

    user.email = email
    user.email_verified = bool(token_info.get("email_verified", False))
    user.name = token_info.get("name")
    user.picture = token_info.get("picture")
    user.given_name = token_info.get("given_name")
    user.family_name = token_info.get("family_name")

    await db.commit()
    await db.refresh(user)

    return GoogleAuthResponse(
        user=_serialize_user(user),
        access_token=create_access_token(user.id),
    )


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)) -> UserOut:
    return _serialize_user(current_user)


@router.put("/me/address", response_model=UserOut)
async def update_my_address(
    payload: UserAddressUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserOut:
    updates = payload.model_dump(exclude_unset=True)

    if "address_line1" in updates:
        current_user.address_line1 = payload.address_line1.strip() if payload.address_line1 else None
    if "address_line2" in updates:
        current_user.address_line2 = payload.address_line2.strip() if payload.address_line2 else None
    if "city" in updates:
        current_user.city = payload.city.strip() if payload.city else None
    if "state" in updates:
        current_user.state = payload.state.strip() if payload.state else None
    if "pin" in updates:
        current_user.pin = payload.pin.strip() if payload.pin else None
    if "phone_number" in updates:
        current_user.phone_number = payload.phone_number.strip() if payload.phone_number else None
    if "country" in updates:
        current_user.country = payload.country.strip() if payload.country else None
    if "profile_description" in updates:
        current_user.profile_description = payload.profile_description.strip() if payload.profile_description else None

    await db.commit()
    await db.refresh(current_user)
    return _serialize_user(current_user)
