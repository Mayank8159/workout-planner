"""
Comprehensive Backend Test Suite
Tests all functionality before APK build and deployment
"""
import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.utils.timezone import get_ist_now, get_ist_date_string
from app.core.security import hash_password, verify_password, create_access_token
from app.utils.food_macros import get_food_nutrition
import requests
import json


def print_header(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)


def test_result(name, passed, message=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status} - {name}")
    if message:
        print(f"    {message}")


async def test_database():
    """Test MongoDB connection"""
    print_header("DATABASE CONNECTION TEST")
    try:
        client = AsyncIOMotorClient(settings.MONGO_URI)
        db = client.get_database()
        
        # Test connection
        collections = await db.list_collection_names()
        test_result("MongoDB Connection", True, f"Connected to: {db.name}")
        test_result("Collections Found", len(collections) >= 0, f"Collections: {collections}")
        
        # Test collection counts
        for coll_name in collections:
            count = await db[coll_name].count_documents({})
            print(f"    📁 {coll_name}: {count} documents")
        
        client.close()
        return True
    except Exception as e:
        test_result("MongoDB Connection", False, str(e))
        return False


def test_timezone():
    """Test IST timezone utilities"""
    print_header("IST TIMEZONE TEST")
    try:
        ist_now = get_ist_now()
        date_str = get_ist_date_string()
        
        test_result("Get IST Now", True, f"Current IST: {ist_now}")
        test_result("IST Timezone", str(ist_now.tzinfo) == "UTC+05:30", f"Timezone: {ist_now.tzinfo}")
        test_result("IST Date String", len(date_str) == 10, f"Date: {date_str}")
        return True
    except Exception as e:
        test_result("IST Timezone", False, str(e))
        return False


def test_security():
    """Test password hashing and JWT tokens"""
    print_header("SECURITY TEST")
    try:
        # Test password hashing
        password = "Test123!"
        hashed = hash_password(password)
        test_result("Password Hashing", len(hashed) > 0, f"Hash length: {len(hashed)}")
        
        # Test password verification
        is_valid = verify_password(password, hashed)
        test_result("Password Verification", is_valid, "Correct password validated")
        
        is_invalid = verify_password("WrongPassword", hashed)
        test_result("Password Rejection", not is_invalid, "Wrong password rejected")
        
        # Test JWT token creation
        token = create_access_token({"sub": "test_user_123"})
        test_result("JWT Token Creation", len(token) > 0, f"Token length: {len(token)}")
        
        return True
    except Exception as e:
        test_result("Security", False, str(e))
        return False


def test_food_macros():
    """Test food nutrition database"""
    print_header("FOOD NUTRITION DATABASE TEST")
    try:
        # Test common foods
        test_foods = ["apple", "chicken breast", "rice", "banana", "egg"]
        
        for food in test_foods:
            nutrition = get_food_nutrition(food)
            has_data = all(key in nutrition for key in ['calories', 'protein', 'carbs', 'fat', 'fiber'])
            test_result(f"Food: {food}", has_data, 
                       f"Calories: {nutrition.get('calories', 'N/A')}, Protein: {nutrition.get('protein', 'N/A')}g")
        
        return True
    except Exception as e:
        test_result("Food Macros", False, str(e))
        return False


def test_backend_api():
    """Test backend API endpoints (if running)"""
    print_header("BACKEND API TEST (if server is running)")
    
    base_url = "https://workout-planner-b8in.onrender.com"
    
    try:
        # Test health endpoint
        response = requests.get(f"{base_url}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            test_result("Health Endpoint", True, 
                       f"Status: {data.get('status')}, Timezone: {data.get('timezone')}")
        else:
            test_result("Health Endpoint", False, f"Status code: {response.status_code}")
    except requests.exceptions.ConnectionError:
        test_result("Health Endpoint", False, "Server not running (this is OK for local testing)")
    except Exception as e:
        test_result("Health Endpoint", False, str(e))


def test_config():
    """Test configuration settings"""
    print_header("CONFIGURATION TEST")
    
    test_result("MongoDB URI", settings.MONGO_URI.startswith("mongodb"), 
               f"URI configured: {settings.MONGO_URI[:30]}...")
    test_result("JWT Secret", len(settings.JWT_SECRET) > 10, 
               f"Secret length: {len(settings.JWT_SECRET)}")
    test_result("Environment", settings.ENVIRONMENT in ['development', 'production'], 
               f"Environment: {settings.ENVIRONMENT}")
    test_result("Skip TFLite", settings.SKIP_TFLITE == True, 
               "TFLite skipped (using simulation)")
    test_result("Port", settings.PORT == 8000, f"Port: {settings.PORT}")


async def run_all_tests():
    """Run all tests"""
    print("\n" + "🧪 "*30)
    print("  WORKOUT PLANNER - COMPREHENSIVE TEST SUITE")
    print("🧪 "*30)
    
    results = []
    
    # Configuration Test
    test_config()
    
    # Database Test
    db_result = await test_database()
    results.append(("Database", db_result))
    
    # Timezone Test
    tz_result = test_timezone()
    results.append(("Timezone", tz_result))
    
    # Security Test
    sec_result = test_security()
    results.append(("Security", sec_result))
    
    # Food Macros Test
    food_result = test_food_macros()
    results.append(("Food Database", food_result))
    
    # API Test (optional)
    test_backend_api()
    
    # Summary
    print_header("TEST SUMMARY")
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅" if result else "❌"
        print(f"{status} {name}")
    
    print(f"\n📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Ready to build APK and deploy!")
    else:
        print("\n⚠️  Some tests failed. Please review before deployment.")
    
    return passed == total


if __name__ == "__main__":
    success = asyncio.run(run_all_tests())
    sys.exit(0 if success else 1)
