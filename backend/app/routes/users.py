from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import UserResponseSchema
from app.core.dependencies import get_current_user
from app.models.database import get_database
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponseSchema)
async def get_current_user_profile(current_user_id: str = Depends(get_current_user)):
    """
    Get current authenticated user's profile
    
    Returns:
        UserResponseSchema with user data
    """
    db = get_database()
    
    try:
        # Find user by ID
        user = await db["users"].find_one({"_id": ObjectId(current_user_id)})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponseSchema(
            id=str(user["_id"]),
            email=user["email"],
            username=user["username"],
            dailyCalorieGoal=user.get("dailyCalorieGoal", 2000),
            workoutStreak=user.get("workoutStreak", 0),
            createdAt=user.get("createdAt"),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch user profile: {str(e)}"
        )
