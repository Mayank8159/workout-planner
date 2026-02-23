from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, status
from datetime import datetime
from uuid import uuid4
import tensorflow as tf
import numpy as np
from app.models.database import get_database
from app.models.schemas import FoodPredictionSchema
from app.utils.auth import get_current_user
from app.utils.image_processor import process_image
from app.utils.food_mapping import get_food_calorie

router = APIRouter(prefix="/scan", tags=["food scanning"])


@router.post("/", response_model=FoodPredictionSchema)
async def scan_food(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
):
    """
    Scan a food image and return calorie estimate
    
    Args:
        file: Uploaded image file
        current_user: Authenticated user ID
    
    Returns:
        FoodPredictionSchema with food item, calories, and confidence
    """
    try:
        # Read uploaded file
        contents = await file.read()
        
        # Process image for model
        processed_image, success = await process_image(contents)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to process image"
            )
        
        # Get TFLite model from app state
        from fastapi import Request
        # This will be populated in the lifespan event
        # For now, we'll simulate a prediction
        
        # Simulated food prediction (replace with actual TFLite inference)
        # In production, this would run the loaded model
        food_predictions = [
            {"name": "apple", "confidence": 0.85},
            {"name": "banana", "confidence": 0.12},
            {"name": "orange", "confidence": 0.03},
        ]
        
        # Get top prediction
        best_prediction = max(food_predictions, key=lambda x: x["confidence"])
        food_item = best_prediction["name"]
        confidence = best_prediction["confidence"]
        
        # Get calorie estimate
        calories_per_100g = get_food_calorie(food_item)
        # Estimate typical serving is ~100g
        estimated_calories = calories_per_100g
        
        # Save to daily logs
        db = get_database()
        today = datetime.utcnow().strftime("%Y-%m-%d")
        
        # Update or create daily log
        daily_log = await db["daily_logs"].find_one({
            "user_id": current_user,
            "date": today
        })
        
        food_entry = {
            "id": str(uuid4()),
            "name": food_item,
            "calories": estimated_calories,
            "confidence": confidence,
            "date": datetime.utcnow().isoformat(),
        }
        
        if daily_log:
            # Append to existing day
            await db["daily_logs"].update_one(
                {"user_id": current_user, "date": today},
                {
                    "$push": {"nutrition.items": food_entry},
                    "$inc": {"nutrition.totalCalories": estimated_calories}
                }
            )
        else:
            # Create new day
            await db["daily_logs"].insert_one({
                "user_id": current_user,
                "date": today,
                "workouts": [],
                "nutrition": {
                    "totalCalories": estimated_calories,
                    "items": [food_entry]
                },
                "createdAt": datetime.utcnow(),
            })
        
        return FoodPredictionSchema(
            food_item=food_item,
            calories=estimated_calories,
            confidence=confidence
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in scan endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process image"
        )
