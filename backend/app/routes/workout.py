from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from uuid import uuid4
from app.models.database import get_database
from app.models.schemas import WorkoutLogSchema
from app.utils.auth import get_current_user

router = APIRouter(prefix="/workout", tags=["workout logging"])


@router.post("/")
async def log_workout(
    workout: WorkoutLogSchema,
    current_user: str = Depends(get_current_user),
):
    """
    Log a workout for the current user
    
    Args:
        workout: Workout details (exercise, sets, reps, weight, duration)
        current_user: Authenticated user ID
    
    Returns:
        Success message with saved workout ID
    """
    try:
        db = get_database()
        today = datetime.utcnow().strftime("%Y-%m-%d")
        
        # Create workout entry
        workout_entry = {
            "id": str(uuid4()),
            "exercise": workout.exercise,
            "sets": workout.sets,
            "reps": workout.reps,
            "weight": workout.weight,
            "duration": workout.duration,
            "date": datetime.utcnow().isoformat(),
        }
        
        # Update or create daily log
        daily_log = await db["daily_logs"].find_one({
            "user_id": current_user,
            "date": today
        })
        
        if daily_log:
            # Append to existing day
            result = await db["daily_logs"].update_one(
                {"user_id": current_user, "date": today},
                {"$push": {"workouts": workout_entry}}
            )
        else:
            # Create new day
            result = await db["daily_logs"].insert_one({
                "user_id": current_user,
                "date": today,
                "workouts": [workout_entry],
                "nutrition": {"totalCalories": 0, "items": []},
                "createdAt": datetime.utcnow(),
            })
        
        return {
            "message": "Workout logged successfully",
            "workoutId": workout_entry["id"],
            "date": today
        }
    
    except Exception as e:
        print(f"Error logging workout: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to log workout"
        )
