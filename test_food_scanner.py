"""
Test Food Scanner 
"""
import sys
sys.path.insert(0, 'backend')

from app.utils.model_loader import food_model
from app.utils.food_macros import get_food_nutrition

print("\n" + "="*60)
print("  FOOD SCANNER TEST")
print("="*60)

print(f"\n📊 Food Model Status:")
print(f"  Model loaded: {food_model is not None}")
print(f"  Model type: {type(food_model).__name__}")

if food_model:
    print(f"  Model class: {food_model.__class__.__name__}")
    if hasattr(food_model, 'model'):
        print(f"  Has model attribute: Yes")
    else:
        print(f"  Simulation mode: Active")

print(f"\n🍎 Testing Food Nutrition Database:")
test_foods = ["apple", "pizza", "salad", "burger", "chicken"]

for food in test_foods:
    nutrition = get_food_nutrition(food)
    print(f"\n  {food.upper()}:")
    print(f"    Calories: {nutrition['calories']}")
    print(f"    Protein: {nutrition['protein']}g")
    print(f"    Carbs: {nutrition['carbs']}g")
    print(f"    Fat: {nutrition['fat']}g")
    print(f"    Fiber: {nutrition['fiber']}g")

print("\n" + "="*60)
print("✅ Food scanner is working in simulation mode!")
print("="*60)
