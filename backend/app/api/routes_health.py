from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health")
def health() -> dict[str, object]:
    return {"ok": True, "service": "sharehub-backend-fastapi"}
