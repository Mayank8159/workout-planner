from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import verify_token

security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Dependency to extract and verify user from JWT token
    
    Args:
        credentials: HTTP Bearer token from Authorization header
    
    Returns:
        user_id: The authenticated user's ID
    
    Raises:
        HTTPException: If token is invalid
    """
    token = credentials.credentials
    token_data = verify_token(token)
    user_id = token_data.get("user_id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user_id
