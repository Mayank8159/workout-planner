from fastapi import APIRouter
from app.utils.timezone import get_ist_now

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring
    
    Returns:
        Status and timestamp in IST
    """
    return {
        "status": "healthy",
        "timestamp": get_ist_now().isoformat(),
        "timezone": "IST (UTC+5:30)",
        "version": "1.0.0"
    }
