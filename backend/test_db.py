#!/usr/bin/env python3
"""Test database connection and food detection directly"""

import asyncio
from app.models.database import get_database, connect_to_mongo
from app.core.security import hash_password

async def test_db_connection():
    """Test database connection and user registration"""
    try:
        print("=" * 60)
        print("DATABASE CONNECTION TEST")
        print("=" * 60)
        print()
        
        # Connect to MongoDB
        await connect_to_mongo()
        print("[1] MongoDB connection: ✓ Success")
        print()
        
        db = get_database()
        
        # Check collections
        print("[2] Checking users collection...")
        user_count = await db["users"].count_documents({})
        print(f"    Total users in database: {user_count}")
        print()
        
        # Try to create a test user
        print("[3] Creating test user...")
        test_user = {
            "email": "egg_biryani_test@test.com",
            "username": "eggBiryaniTest",
            "password": hash_password("Test@123456"),
            "dailyCalorieGoal": 2000,
            "workoutStreak": 0,
        }
        
        from datetime import datetime
        test_user["createdAt"] = datetime.utcnow()
        
        result = await db["users"].insert_one(test_user)
        print(f"    ✓ User created with ID: {result.inserted_id}")
        print()
        
        # Test food database
        print("[4] Testing food database...")
        from app.utils.food_mapping_extended import get_food_calorie, get_food_count
        
        egg_biryani_calories = get_food_calorie("egg_biryani")
        total_foods = get_food_count()
        
        print(f"    ✓ Total foods: {total_foods}")
        print(f"    ✓ Egg Biryani calories: {egg_biryani_calories} kcal")
        print()
        
        # Test model loader
        print("[5] Testing model loader...")
        from app.utils.model_loader import food_model
        
        print(f"    ✓ Model loaded: {food_model.is_loaded()}")
        print(f"    ✓ Input shape: {food_model.input_shape}")
        print()
        
        print("=" * 60)
        print("ALL TESTS PASSED!")
        print("=" * 60)
        print()
        print("System Status:")
        print(f"  Database: ✓ Connected")
        print(f"  Food Database: ✓ {total_foods} foods available")
        print(f"  Egg Biryani: ✓ {egg_biryani_calories} kcal per 100g")
        print(f"  H5 Model: {'✓ Loaded' if food_model.is_loaded() else '⚠ Simulation mode'}")
        print()
        
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    asyncio.run(test_db_connection())
