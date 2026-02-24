from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timedelta
from app.models.schemas import (
    UserRegisterSchema,
    UserLoginSchema,
    TokenSchema,
    UserResponseSchema,
)
from app.core.security import hash_password, create_access_token, verify_password
from app.models.database import get_database
from app.utils.timezone import get_ist_now

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=TokenSchema, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegisterSchema):
    """
    Register a new user
    
    Args:
        user_data: Registration data (email, username, password)
    
    Returns:
        TokenSchema with JWT token and user info
    """
    db = get_database()
    
    # Check if email already exists
    existing_user = await db["users"].find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = {
        "email": user_data.email,
        "username": user_data.username,
        "password": hashed_password,
        "dailyCalorieGoal": user_data.dailyCalorieGoal,
        "workoutStreak": 0,
        "createdAt": get_ist_now(),
    }
    
    result = await db["users"].insert_one(new_user)
    user_id = str(result.inserted_id)
    
    # Create JWT token
    access_token = create_access_token({"sub": user_id})
    
    return TokenSchema(
        access_token=access_token,
        user=UserResponseSchema(
            id=user_id,
            email=user_data.email,
            username=user_data.username,
            dailyCalorieGoal=user_data.dailyCalorieGoal,
            workoutStreak=0,
            createdAt=get_ist_now(),
        )
    )


@router.post("/login", response_model=TokenSchema)
async def login(credentials: UserLoginSchema):
    """
    Login user with email and password
    
    Args:
        credentials: Email and password
    
    Returns:
        TokenSchema with JWT token and user info
    """
    db = get_database()
    
    # Find user by email
    user = await db["users"].find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create JWT token
    user_id = str(user["_id"])
    access_token = create_access_token({"sub": user_id})
    
    return TokenSchema(
        access_token=access_token,
        user=UserResponseSchema(
            id=user_id,
            email=user["email"],
            username=user["username"],
            dailyCalorieGoal=user.get("dailyCalorieGoal", 2000),
            workoutStreak=user.get("workoutStreak", 0),
            createdAt=user.get("createdAt", get_ist_now()),
        )
    )
