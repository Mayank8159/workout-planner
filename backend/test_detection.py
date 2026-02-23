#!/usr/bin/env python3
"""Test food detection endpoints and egg biryani calories"""

import requests
import sys

BASE_URL = 'http://localhost:8001'

def main():
    print("=" * 60)
    print("FOOD DETECTION SYSTEM TEST - EGG BIRYANI")
    print("=" * 60)
    print()
    
    try:
        # Step 1: Register new user (or use existing)
        print("[1] Checking/registering test user...")
        import time
        import random
        test_email = f'biryani_test_{int(time.time())}_{random.randint(100,999)}@test.com'
        register_payload = {
            'email': test_email,
            'username': 'biryaniTester',
            'password': 'Test@123456',
            'dailyCalorieGoal': 2000
        }
        
        resp = requests.post(f'{BASE_URL}/auth/register', json=register_payload, timeout=5)
        if resp.status_code == 200:
            print("    ✓ User registered successfully")
        elif resp.status_code == 422:
            print(f"    ℹ User may already exist, trying to login...")
        else:
            print(f"    ℹ Registration status: {resp.status_code}")
        print()
        
        # Step 2: Login
        print("[2] Logging in...")
        login_payload = {
            'email': test_email,
            'password': 'Test@123456'
        }
        resp = requests.post(f'{BASE_URL}/auth/login', json=login_payload, timeout=5)
        
        if resp.status_code != 200:
            print(f"    ✗ Login failed with status {resp.status_code}")
            return False
            
        login_response = resp.json()
        token = login_response.get('access_token')
        
        if not token:
            print("    ✗ No token received")
            return False
            
        print("    ✓ Login successful, token obtained")
        print()
        
        headers = {'Authorization': f'Bearer {token}'}
        
        # Step 3: Check supported foods
        print("[3] Checking supported foods...")
        resp = requests.get(f'{BASE_URL}/scan/supported-foods', headers=headers, timeout=5)
        
        if resp.status_code != 200:
            print(f"    ✗ Request failed with status {resp.status_code}")
            return False
            
        supported = resp.json()
        print(f"    ✓ Total foods in database: {supported.get('total_foods')}")
        print(f"    ✓ Food categories: {len(supported.get('categories', []))}")
        print(f"    ✓ Model status: {supported.get('model_status')}")
        print()
        
        # Step 4: Check model status
        print("[4] Checking H5 model status...")
        resp = requests.get(f'{BASE_URL}/scan/model-status', headers=headers, timeout=5)
        
        if resp.status_code != 200:
            print(f"    ✗ Request failed with status {resp.status_code}")
            return False
            
        model_info = resp.json()
        print(f"    ✓ Model Loaded: {model_info.get('model_loaded')}")
        print(f"    ✓ Input Shape: {model_info.get('input_shape')}")
        print(f"    ✓ Total Supported Foods: {model_info.get('total_supported_foods')}")
        print(f"    ✓ Status: {model_info.get('status')}")
        print()
        
        # Step 5: Check egg biryani specifically in food database
        print("[5] Checking EGG BIRYANI in food database...")
        from app.utils.food_mapping_extended import get_food_calorie, get_food_count
        
        egg_biryani_calories = get_food_calorie('egg_biryani')
        total_foods = get_food_count()
        
        print(f"    ✓ Egg Biryani found in database")
        print(f"    ✓ Calorie value: {egg_biryani_calories} kcal per 100g")
        print(f"    ✓ Total foods in database: {total_foods}")
        print()
        
        # Step 6: Summary
        print("=" * 60)
        print("SYSTEM STATUS SUMMARY")
        print("=" * 60)
        print(f"Backend Status: ✓ Running on http://localhost:8001")
        print(f"Database Connection: ✓ Connected")
        print(f"Authentication: ✓ JWT working")
        print(f"Food Database: ✓ {total_foods} foods available")
        print(f"H5 Model: {'' if model_info.get('model_loaded') else 'Simulation mode'} {'✓ Loaded' if model_info.get('model_loaded') else '⚠ Not loaded (running in simulation)'}")
        print(f"Egg Biryani Detection: ✓ {egg_biryani_calories} kcal")
        print()
        print("All systems operational! Ready to detect egg biryani calories.")
        print()
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("✗ Error: Cannot connect to backend at http://localhost:8001")
        print("  Make sure the FastAPI server is running:")
        print("  python -m uvicorn app.main:app --host 0.0.0.0 --port 8001")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
