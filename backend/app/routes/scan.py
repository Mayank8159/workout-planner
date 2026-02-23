from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, status
from datetime import datetime
from uuid import uuid4
import numpy as np
import cv2
import logging
from app.models.database import get_database
from app.models.schemas import FoodPredictionSchema
from app.utils.auth import get_current_user
from app.utils.food_macros import get_food_nutrition, get_food_count, get_all_food_classes
from app.utils.model_loader import food_model

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/scan", tags=["food scanning"])


@router.post("/", response_model=FoodPredictionSchema)
async def scan_food(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
):
    """
    Scan a food image and return calorie estimate
    Uses H5 Keras model for comprehensive food detection
    Supports 1000+ food types including Indian and worldwide cuisines
    
    Args:
        file: Uploaded image file
        current_user: Authenticated user ID
    
    Returns:
        FoodPredictionSchema with food item, calories, and confidence
    """
    try:
        # Read uploaded file
        contents = await file.read()
        
        # Decode image
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to decode image"
            )
        
        # Process image for model
        processed_image = food_model.preprocess_image(image.astype(np.float32))
        
        # Make prediction
        if food_model.is_loaded():
            # Use real H5 model
            prediction_result = food_model.predict(processed_image, top_k=5)
            
            if "error" in prediction_result:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Prediction failed: {prediction_result['error']}"
                )
            
            top_pred = prediction_result["top_prediction"]
            food_item = top_pred["class_name"]
            confidence = top_pred["confidence"]
            
            # Clean up food name
            food_item = food_item.lower().replace(" ", "_").replace("-", "_")
            
        else:
            # Fallback to simulation mode if model not loaded
            logger.warning("H5 model not loaded. Using simulation mode.")
            food_predictions = [
                {"name": "chicken_tikka", "confidence": 0.85},
                {"name": "butter_chicken", "confidence": 0.10},
                {"name": "egg_biryani", "confidence": 0.05},
            ]
            
            best_prediction = max(food_predictions, key=lambda x: x["confidence"])
            food_item = best_prediction["name"]
            confidence = best_prediction["confidence"]
        
        # Get complete nutrition info
        nutrition = get_food_nutrition(food_item)
        calories = nutrition["calories"]
        protein = nutrition["protein"]
        carbs = nutrition["carbs"]
        fat = nutrition["fat"]
        fiber = nutrition["fiber"]
        
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
            "calories": calories,
            "protein": round(protein, 1),
            "carbs": round(carbs, 1),
            "fat": round(fat, 1),
            "fiber": round(fiber, 1),
            "confidence": round(confidence, 4),
            "date": datetime.utcnow().isoformat(),
        }
        
        if daily_log:
            # Append to existing day
            await db["daily_logs"].update_one(
                {"user_id": current_user, "date": today},
                {
                    "$push": {"nutrition.items": food_entry},
                    "$inc": {
                        "nutrition.total_calories": calories,
                        "nutrition.total_protein": protein,
                        "nutrition.total_carbs": carbs,
                        "nutrition.total_fat": fat,
                        "nutrition.total_fiber": fiber,
                    }
                }
            )
        else:
            # Create new day
            await db["daily_logs"].insert_one({
                "user_id": current_user,
                "date": today,
                "workouts": [],
                "nutrition": {
                    "total_calories": calories,
                    "total_protein": protein,
                    "total_carbs": carbs,
                    "total_fat": fat,
                    "total_fiber": fiber,
                    "items": [food_entry]
                },
                "createdAt": datetime.utcnow(),
            })
        
        logger.info(f"Food scanned: {food_item} - Calories: {calories}, Protein: {protein}g, Carbs: {carbs}g, Fat: {fat}g, Fiber: {fiber}g - Confidence: {confidence}")
        
        return FoodPredictionSchema(
            food_item=food_item,
            calories=calories,
            protein=protein,
            carbs=carbs,
            fat=fat,
            fiber=fiber,
            confidence=confidence
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in scan endpoint: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process image"
        )


@router.get("/supported-foods")
async def get_supported_foods(current_user: str = Depends(get_current_user)):
    """
    Get list of all supported food types
    
    Returns:
        Dictionary with total food count and sample foods
    """
    food_count = get_food_count()
    
    return {
        "total_foods": food_count,
        "categories": [
            "Indian Foods",
            "Asian Foods (Chinese, Japanese, Thai, Vietnamese, Korean)",
            "Western Foods",
            "Mediterranean Foods",
            "Middle Eastern Foods",
            "African Foods",
            "South American Foods",
            "Soups & Stews",
            "Salads",
            "Snacks & Desserts",
            "Fast Food",
        ],
        "model_status": "H5 Model Loaded" if food_model.is_loaded() else "Simulation Mode",
        "message": f"Supports {food_count}+ foods including Indian, Chinese, Japanese, Thai, Western, Mediterranean, and many more cuisines"
    }


@router.get("/model-status")
async def model_status(current_user: str = Depends(get_current_user)):
    """Get current model loading status"""
    return {
        "model_loaded": food_model.is_loaded(),
        "input_shape": food_model.input_shape,
        "total_supported_foods": get_food_count(),
        "status": "Ready for predictions" if food_model.is_loaded() else "Running in simulation mode"
    }
