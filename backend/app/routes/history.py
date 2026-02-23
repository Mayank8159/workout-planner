from fastapi import APIRouter, Depends, HTTPException, status
from app.models.database import get_database
from app.models.schemas import DailyHistoryResponseSchema
from app.utils.auth import get_current_user

router = APIRouter(prefix="/data", tags=["history"])


@router.get("/{date}", response_model=DailyHistoryResponseSchema)
async def get_daily_history(
    date: str,
    current_user: str = Depends(get_current_user),
):
    """
    Get all workouts and nutrition data for a specific date
    
    Args:
        date: Date in YYYY-MM-DD format
        current_user: Authenticated user ID
    
    Returns:
        DailyHistoryResponseSchema with workouts and nutrition data
    """
    try:
        # Validate date format
        from datetime import datetime
        try:
            datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid date format. Use YYYY-MM-DD"
            )
        
        db = get_database()
        
        # Get daily log for the user and date
        daily_log = await db["daily_logs"].find_one({
            "user_id": current_user,
            "date": date
        })
        
        if not daily_log:
            # Return empty response for days with no data
            return DailyHistoryResponseSchema(
                workouts=[],
                nutrition={"totalCalories": 0, "items": []}
            )
        
        return DailyHistoryResponseSchema(
            workouts=daily_log.get("workouts", []),
            nutrition=daily_log.get("nutrition", {"totalCalories": 0, "items": []})
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching daily history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch data"
        )


@router.get("/")
async def get_history_range(
    start_date: str,
    end_date: str,
    current_user: str = Depends(get_current_user),
):
    """
    Get all data for a date range
    
    Args:
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
        current_user: Authenticated user ID
    
    Returns:
        List of daily logs for the date range
    """
    try:
        from datetime import datetime, timedelta
        
        # Validate dates
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        
        if start > end:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Start date must be before end date"
            )
        
        db = get_database()
        
        # Fetch all logs in range
        logs = await db["daily_logs"].find({
            "user_id": current_user,
            "date": {"$gte": start_date, "$lte": end_date}
        }).to_list(None)
        
        return {
            "startDate": start_date,
            "endDate": end_date,
            "logs": logs,
            "count": len(logs)
        }
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
    except Exception as e:
        print(f"Error fetching history range: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch data"
        )
