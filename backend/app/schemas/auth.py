from pydantic import BaseModel, EmailStr


class GoogleAuthRequest(BaseModel):
    credential: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    user_level: str
    email_verified: bool
    name: str | None = None
    picture: str | None = None
    given_name: str | None = None
    family_name: str | None = None
    profile_description: str | None = None
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    state: str | None = None
    pin: str | None = None
    phone_number: str | None = None
    country: str | None = None


class UserAddressUpdate(BaseModel):
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    state: str | None = None
    pin: str | None = None
    phone_number: str | None = None
    country: str | None = None
    profile_description: str | None = None


class GoogleAuthResponse(BaseModel):
    user: UserOut
    access_token: str
    token_type: str = "bearer"
