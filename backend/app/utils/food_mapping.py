"""
Food classification mapping for 101 food classes
Maps food class to estimated calories per 100g
Based on common food items detected in computer vision models
"""

FOOD_CALORIE_MAP = {
    "apple": 52,
    "banana": 89,
    "orange": 47,
    "grapes": 69,
    "strawberry": 32,
    "blueberry": 57,
    "watermelon": 30,
    "mango": 60,
    "pineapple": 50,
    "peach": 39,
    "pear": 57,
    "kiwi": 61,
    "avocado": 160,
    "coconut": 354,
    "lemon": 29,
    "lime": 30,
    "cherry": 63,
    "blackberry": 43,
    "raspberry": 52,
    "papaya": 43,
    "cucumber": 16,
    "tomato": 18,
    "carrot": 41,
    "broccoli": 34,
    "cauliflower": 25,
    "spinach": 23,
    "lettuce": 15,
    "kale": 49,
    "bell_pepper": 31,
    "onion": 40,
    "garlic": 149,
    "ginger": 80,
    "potato": 77,
    "sweet_potato": 86,
    "corn": 86,
    "peas": 81,
    "beans": 127,
    "chickpea": 164,
    "lentil": 116,
    "rice": 130,
    "bread": 265,
    "pasta": 131,
    "cereal": 380,
    "oats": 389,
    "milk": 42,
    "yogurt": 59,
    "cheese": 402,
    "butter": 717,
    "cream": 340,
    "egg": 155,
    "chicken": 165,
    "beef": 250,
    "pork": 242,
    "fish": 206,
    "salmon": 208,
    "tuna": 144,
    "shrimp": 99,
    "crab": 102,
    "lobster": 95,
    "turkey": 189,
    "duck": 337,
    "lamb": 294,
    "ham": 145,
    "bacon": 541,
    "sausage": 301,
    "hot_dog": 290,
    "burger": 215,
    "pizza": 285,
    "sandwich": 265,
    "salad": 100,
    "soup": 40,
    "steak": 271,
    "chicken_breast": 165,
    "peanut_butter": 588,
    "almond": 579,
    "walnut": 654,
    "cashew": 553,
    "hazelnut": 628,
    "pistachio": 562,
    "sunflower_seeds": 584,
    "chocolate": 535,
    "cake": 365,
    "cookie": 492,
    "donut": 452,
    "ice_cream": 207,
    "candy": 400,
    "chips": 547,
    "french_fries": 365,
    "popcorn": 387,
    "pretzel": 383,
    "olive": 115,
    "pickle": 12,
    "mushroom": 22,
    "honey": 304,
    "jam": 278,
    "soy_sauce": 53,
    "oil": 884,
    "vinegar": 18,
    "salt": 0,
    "sugar": 387,
    "flour": 364,
    "coffee": 0,
    "tea": 0,
    "juice": 46,
    "soda": 42,
    "beer": 43,
    "wine": 82,
    "whiskey": 250,
    "vodka": 235,
}


def get_food_calorie(food_name: str) -> float:
    """
    Get calorie count for a food item
    
    Args:
        food_name: Name of the food item (lowercase)
    
    Returns:
        Calories per 100g (default 100 if not found)
    """
    food_key = food_name.lower().strip().replace(" ", "_")
    return FOOD_CALORIE_MAP.get(food_key, 100)  # Default to 100 kcal per 100g


def get_all_food_classes():
    """Get list of all supported food classes"""
    return list(FOOD_CALORIE_MAP.keys())
