from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import UserResponseSchema, UserSettingsUpdateSchema
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
            proteinGoal=user.get("proteinGoal", 150),
            carbsGoal=user.get("carbsGoal", 200),
            fiberGoal=user.get("fiberGoal", 25),
            workoutStreak=user.get("workoutStreak", 0),
            createdAt=user.get("createdAt"),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch user profile: {str(e)}"
        )


@router.put("/settings", response_model=UserResponseSchema)
async def update_user_settings(
    settings: UserSettingsUpdateSchema,
    current_user_id: str = Depends(get_current_user)
):
    """
    Update current user's settings (name, nutrition goals)
    
    Args:
        settings: UserSettingsUpdateSchema with fields to update
        current_user_id: Current authenticated user ID
    
    Returns:
        Updated UserResponseSchema
    """
    db = get_database()
    
    try:
        # Build update dictionary with only non-None values
        update_data = {}
        if settings.username is not None:
            update_data["username"] = settings.username
        if settings.dailyCalorieGoal is not None:
            update_data["dailyCalorieGoal"] = settings.dailyCalorieGoal
        if settings.proteinGoal is not None:
            update_data["proteinGoal"] = settings.proteinGoal
        if settings.carbsGoal is not None:
            update_data["carbsGoal"] = settings.carbsGoal
        if settings.fiberGoal is not None:
            update_data["fiberGoal"] = settings.fiberGoal
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No settings to update"
            )
        
        # Update user in database
        result = await db["users"].find_one_and_update(
            {"_id": ObjectId(current_user_id)},
            {"$set": update_data},
            return_document=True
        )
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponseSchema(
            id=str(result["_id"]),
            email=result["email"],
            username=result["username"],
            dailyCalorieGoal=result.get("dailyCalorieGoal", 2000),
            proteinGoal=result.get("proteinGoal", 150),
            carbsGoal=result.get("carbsGoal", 200),
            fiberGoal=result.get("fiberGoal", 25),
            workoutStreak=result.get("workoutStreak", 0),
            createdAt=result.get("createdAt"),
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user settings: {str(e)}"
        )
