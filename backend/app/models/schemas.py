from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom Pydantic ObjectId type"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str):
            return ObjectId(v)
        raise TypeError("ObjectId required")


class UserRegisterSchema(BaseModel):
    """User registration request"""
    email: EmailStr
    username: str
    password: str
    dailyCalorieGoal: int = 2000


class UserLoginSchema(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class UserResponseSchema(BaseModel):
    """User response schema"""
    id: str = Field(alias="_id")
    email: str
    username: str
    dailyCalorieGoal: int
    workoutStreak: int = 0
    createdAt: datetime
    
    class Config:
        populate_by_name = True


class TokenSchema(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponseSchema


class WorkoutLogSchema(BaseModel):
    """Workout logging request"""
    exercise: str
    sets: int
    reps: int
    weight: float
    duration: int  # in minutes


class CalorieLogSchema(BaseModel):
    """Calorie logging from AI"""
    foodItem: str
    calories: float
    confidence: float


class DailyLogSchema(BaseModel):
    """Daily log document schema"""
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    date: str  # YYYY-MM-DD format
    workouts: List[dict] = Field(default_factory=list)
    nutrition: dict = Field(default_factory=lambda: {"totalCalories": 0, "items": []})
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True


class DailyHistoryResponseSchema(BaseModel):
    """Daily history response"""
    workouts: List[dict] = []
    nutrition: dict = Field(default_factory=lambda: {"totalCalories": 0, "items": []})


class FoodPredictionSchema(BaseModel):
    """Food prediction response from AI with full nutritional info"""
    food_item: str
    calories: float
    protein: float  # grams
    carbs: float    # grams
    fat: float      # grams
    fiber: float    # grams
    confidence: float
