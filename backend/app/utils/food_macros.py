# Comprehensive food nutrition database with macronutrients
# Per 100g serving (unless specified otherwise)
# Format: food_name: {"calories": kcal, "protein": g, "carbs": g, "fat": g, "fiber": g}

FOOD_NUTRITION_MAP = {
    # ==================== INDIAN FOODS ====================
    
    # Indian Breads
    "roti": {"calories": 150, "protein": 4.2, "carbs": 33, "fat": 0.7, "fiber": 1.8},
    "chapati": {"calories": 120, "protein": 3.7, "carbs": 26, "fat": 0.5, "fiber": 1.5},
    "paratha": {"calories": 180, "protein": 4.2, "carbs": 30, "fat": 4.5, "fiber": 1.2},
    "naan": {"calories": 262, "protein": 8.3, "carbs": 44, "fat": 6.7, "fiber": 1.5},
    "puri": {"calories": 245, "protein": 4.8, "carbs": 35, "fat": 10, "fiber": 1.2},
    "dosa": {"calories": 168, "protein": 3.5, "carbs": 28, "fat": 5, "fiber": 1.8},
    "idli": {"calories": 150, "protein": 3.8, "carbs": 30, "fat": 2, "fiber": 0.6},
    "bhakri": {"calories": 140, "protein": 2.5, "carbs": 28, "fat": 1.5, "fiber": 3},
    "appam": {"calories": 135, "protein": 2.0, "carbs": 28, "fat": 2.5, "fiber": 0.8},
    "uttapam": {"calories": 160, "protein": 4.0, "carbs": 32, "fat": 2, "fiber": 1},
    
    # Indian Rice Dishes
    "biryani": {"calories": 240, "protein": 6.5, "carbs": 36, "fat": 7, "fiber": 0.5},
    "egg_biryani": {"calories": 240, "protein": 8.5, "carbs": 35, "fat": 7, "fiber": 0.5},
    "chicken_biryani": {"calories": 240, "protein": 12, "carbs": 34, "fat": 7, "fiber": 0.5},
    "pulao": {"calories": 180, "protein": 5.2, "carbs": 32, "fat": 4, "fiber": 0.4},
    "basmati_rice": {"calories": 130, "protein": 2.7, "carbs": 28, "fat": 0.3, "fiber": 0.4},
    "jeera_rice": {"calories": 140, "protein": 3.0, "carbs": 30, "fat": 0.5, "fiber": 0.5},
    "rice_pilaf": {"calories": 138, "protein": 3.5, "carbs": 29, "fat": 0.4, "fiber": 0.3},
    "khichdi": {"calories": 110, "protein": 3.2, "carbs": 22, "fat": 0.8, "fiber": 1.2},
    "fried_rice": {"calories": 145, "protein": 3.0, "carbs": 28, "fat": 2.5, "fiber": 0.3},
    
    # Indian Curries & Main Dishes
    "chicken_tikka": {"calories": 165, "protein": 23, "carbs": 4, "fat": 7, "fiber": 0},
    "butter_chicken": {"calories": 215, "protein": 15, "carbs": 8, "fat": 12, "fiber": 0.5},
    "tandoori_chicken": {"calories": 165, "protein": 24, "carbs": 2, "fat": 7, "fiber": 0},
    "chicken_curry": {"calories": 185, "protein": 20, "carbs": 6, "fat": 8, "fiber": 0.3},
    "goat_curry": {"calories": 195, "protein": 22, "carbs": 5, "fat": 10, "fiber": 0.2},
    "paneer_tikka": {"calories": 165, "protein": 14, "carbs": 5, "fat": 8, "fiber": 0.2},
    "paneer_butter_masala": {"calories": 240, "protein": 12, "carbs": 10, "fat": 16, "fiber": 0.5},
    "dal_makhani": {"calories": 165, "protein": 8.5, "carbs": 20, "fat": 5.5, "fiber": 3},
    "chole_bhature": {"calories": 320, "protein": 10, "carbs": 45, "fat": 10, "fiber": 6},
    "sambar": {"calories": 85, "protein": 4, "carbs": 12, "fat": 2, "fiber": 3},
    "rasam": {"calories": 25, "protein": 1.2, "carbs": 4, "fat": 0.5, "fiber": 0.5},
    "coconut_curry": {"calories": 180, "protein": 8, "carbs": 10, "fat": 12, "fiber": 1},
    "korma": {"calories": 210, "protein": 12, "carbs": 10, "fat": 13, "fiber": 0.5},
    "rogan_josh": {"calories": 200, "protein": 18, "carbs": 8, "fat": 10, "fiber": 0.3},
    "vindaloo": {"calories": 190, "protein": 16, "carbs": 8, "fat": 10, "fiber": 0.5},
    "dopiaza": {"calories": 170, "protein": 14, "carbs": 10, "fat": 8, "fiber": 1},
    "saag_paneer": {"calories": 155, "protein": 10, "carbs": 8, "fat": 8, "fiber": 2},
    "malai_kofta": {"calories": 220, "protein": 8, "carbs": 20, "fat": 12, "fiber": 2},
    "shahi_tukda": {"calories": 235, "protein": 5, "carbs": 30, "fat": 11, "fiber": 0.5},
    "pakora": {"calories": 180, "protein": 5, "carbs": 20, "fat": 9, "fiber": 1.5},
    "samosa": {"calories": 262, "protein": 5, "carbs": 32, "fat": 12, "fiber": 2},
    "spring_roll": {"calories": 195, "protein": 4, "carbs": 28, "fat": 8, "fiber": 1},
    "momo": {"calories": 140, "protein": 5, "carbs": 20, "fat": 4, "fiber": 0.5},
    "chicken_tikka_masala": {"calories": 165, "protein": 18, "carbs": 6, "fat": 7, "fiber": 0.3},
    
    # Indian Vegetable Dishes
    "aloo_gobi": {"calories": 85, "protein": 2.5, "carbs": 12, "fat": 4, "fiber": 2},
    "baingan_bharta": {"calories": 80, "protein": 1.5, "carbs": 8, "fat": 5, "fiber": 2.5},
    "bhindi_masala": {"calories": 95, "protein": 2, "carbs": 12, "fat": 5, "fiber": 2},
    "chana_masala": {"calories": 164, "protein": 8, "carbs": 20, "fat": 5, "fiber": 5},
    "dal_tadka": {"calories": 145, "protein": 8, "carbs": 18, "fat": 4, "fiber": 4},
    "dam_aloo": {"calories": 110, "protein": 2, "carbs": 15, "fat": 5, "fiber": 2},
    "mixed_vegetables": {"calories": 65, "protein": 2.5, "carbs": 10, "fat": 2, "fiber": 2},
    "tindora_masala": {"calories": 55, "protein": 1.5, "carbs": 8, "fat": 2, "fiber": 1.5},
    
    # Indian Yogurt & Dairy
    "dahi": {"calories": 59, "protein": 3.5, "carbs": 3.2, "fat": 3, "fiber": 0},
    "lassi": {"calories": 60, "protein": 2, "carbs": 8, "fat": 2, "fiber": 0},
    "paneer": {"calories": 265, "protein": 25, "carbs": 1.5, "fat": 19, "fiber": 0},
    "ghee": {"calories": 892, "protein": 0, "carbs": 0, "fat": 99, "fiber": 0},
    "butter_milk": {"calories": 40, "protein": 3.3, "carbs": 4.8, "fat": 0.8, "fiber": 0},
    "raita": {"calories": 95, "protein": 3.5, "carbs": 12, "fat": 4, "fiber": 1},
    
    # Indian Snacks & Street Food
    "vada": {"calories": 165, "protein": 4, "carbs": 20, "fat": 8, "fiber": 1.5},
    "chaat": {"calories": 170, "protein": 5, "carbs": 22, "fat": 7, "fiber": 2},
    "gol_gappa": {"calories": 150, "protein": 3, "carbs": 28, "fat": 2, "fiber": 1.5},
    "sev_puri": {"calories": 195, "protein": 5, "carbs": 25, "fat": 8, "fiber": 2},
    "bhel_puri": {"calories": 165, "protein": 4, "carbs": 28, "fat": 4, "fiber": 2},
    "pav_bhaji": {"calories": 200, "protein": 6, "carbs": 28, "fat": 8, "fiber": 2},
    "aloo_tikki": {"calories": 180, "protein": 3, "carbs": 25, "fat": 8, "fiber": 2},
    "jalebi": {"calories": 296, "protein": 0, "carbs": 76, "fat": 0.5, "fiber": 0},
    "gulab_jamun": {"calories": 185, "protein": 1.5, "carbs": 48, "fat": 0.2, "fiber": 0},
    "kheer": {"calories": 152, "protein": 3, "carbs": 20, "fat": 6, "fiber": 0.5},
    "halwa": {"calories": 350, "protein": 3, "carbs": 48, "fat": 16, "fiber": 1},
    "laddu": {"calories": 320, "protein": 5, "carbs": 45, "fat": 13, "fiber": 1.5},
    "barfi": {"calories": 365, "protein": 4, "carbs": 50, "fat": 17, "fiber": 0.5},
    "burfi": {"calories": 365, "protein": 4, "carbs": 50, "fat": 17, "fiber": 0.5},
    
    # ==================== ASIAN FOODS ====================
    
    # Chinese
    "fried_rice_chinese": {"calories": 145, "protein": 3, "carbs": 28, "fat": 2.5, "fiber": 0.3},
    "noodles_chow_mein": {"calories": 190, "protein": 5, "carbs": 35, "fat": 3, "fiber": 0.5},
    "spring_roll_chinese": {"calories": 195, "protein": 4, "carbs": 28, "fat": 8, "fiber": 1},
    "dim_sum": {"calories": 165, "protein": 6, "carbs": 20, "fat": 7, "fiber": 0.5},
    "peking_duck": {"calories": 195, "protein": 28, "carbs": 0, "fat": 10, "fiber": 0},
    "sweet_sour_pork": {"calories": 215, "protein": 15, "carbs": 18, "fat": 10, "fiber": 0},
    "mapo_tofu": {"calories": 160, "protein": 12, "carbs": 8, "fat": 8, "fiber": 1},
    "kung_pao_chicken": {"calories": 210, "protein": 18, "carbs": 10, "fat": 10, "fiber": 0.5},
    "singapura_mei_fun": {"calories": 180, "protein": 4, "carbs": 32, "fat": 4, "fiber": 0.5},
    "mongolian_beef": {"calories": 220, "protein": 20, "carbs": 12, "fat": 11, "fiber": 0},
    
    # Japanese
    "sushi": {"calories": 200, "protein": 8, "carbs": 36, "fat": 2, "fiber": 0.5},
    "ramen": {"calories": 356, "protein": 9, "carbs": 60, "fat": 8, "fiber": 1},
    "tempura": {"calories": 230, "protein": 8, "carbs": 20, "fat": 13, "fiber": 0.5},
    "teriyaki_chicken": {"calories": 245, "protein": 25, "carbs": 10, "fat": 11, "fiber": 0},
    "edamame": {"calories": 95, "protein": 11, "carbs": 8, "fat": 5, "fiber": 2.2},
    "miso_soup": {"calories": 35, "protein": 3, "carbs": 2, "fat": 1, "fiber": 0.3},
    "udon": {"calories": 180, "protein": 6, "carbs": 40, "fat": 0.5, "fiber": 0.2},
    "yakitori": {"calories": 165, "protein": 22, "carbs": 3, "fat": 8, "fiber": 0},
    
    # Thai
    "pad_thai": {"calories": 225, "protein": 8, "carbs": 32, "fat": 8, "fiber": 2},
    "green_curry": {"calories": 210, "protein": 15, "carbs": 6, "fat": 14, "fiber": 0.5},
    "red_curry": {"calories": 215, "protein": 14, "carbs": 8, "fat": 15, "fiber": 0.5},
    "tom_yum": {"calories": 70, "protein": 3, "carbs": 8, "fat": 3, "fiber": 0.5},
    "satay": {"calories": 415, "protein": 15, "carbs": 8, "fat": 37, "fiber": 1},
    "pad_see_ew": {"calories": 240, "protein": 9, "carbs": 30, "fat": 10, "fiber": 1},
    
    # ==================== WESTERN FOODS ====================
    
    "beef_steak": {"calories": 250, "protein": 26, "carbs": 0, "fat": 16, "fiber": 0},
    "chicken_breast": {"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6, "fiber": 0},
    "salmon": {"calories": 206, "protein": 22, "carbs": 0, "fat": 13, "fiber": 0},
    "tuna": {"calories": 132, "protein": 29, "carbs": 0, "fat": 1.3, "fiber": 0},
    "pork_chop": {"calories": 242, "protein": 27, "carbs": 0, "fat": 14, "fiber": 0},
    "turkey_breast": {"calories": 189, "protein": 29, "carbs": 0, "fat": 7.4, "fiber": 0},
    "lamb": {"calories": 294, "protein": 25, "carbs": 0, "fat": 21, "fiber": 0},
    "hamburger": {"calories": 215, "protein": 21, "carbs": 0, "fat": 14, "fiber": 0},
    "hot_dog": {"calories": 290, "protein": 12, "carbs": 3, "fat": 25, "fiber": 0},
    "pizza": {"calories": 285, "protein": 8, "carbs": 36, "fat": 11, "fiber": 2},
    "pasta": {"calories": 131, "protein": 5, "carbs": 25, "fat": 1.1, "fiber": 1.5},
    "spaghetti": {"calories": 131, "protein": 5, "carbs": 25, "fat": 1.1, "fiber": 1.5},
    "burger": {"calories": 215, "protein": 15, "carbs": 20, "fat": 10, "fiber": 1},
    "sandwich": {"calories": 200, "protein": 8, "carbs": 28, "fat": 8, "fiber": 1.5},
    "fries": {"calories": 365, "protein": 3.4, "carbs": 48, "fat": 17, "fiber": 4.2},
    "fried_chicken": {"calories": 320, "protein": 30, "carbs": 10, "fat": 17, "fiber": 0},
    "grilled_fish": {"calories": 145, "protein": 24, "carbs": 0, "fat": 5, "fiber": 0},
    "beef_stew": {"calories": 198, "protein": 20, "carbs": 12, "fat": 8, "fiber": 1},
    "chicken_soup": {"calories": 85, "protein": 7, "carbs": 8, "fat": 3, "fiber": 0.5},
    "meat_loaf": {"calories": 260, "protein": 20, "carbs": 3, "fat": 19, "fiber": 0},
    
    # ==================== FRUITS ====================
    
    "apple": {"calories": 52, "protein": 0.26, "carbs": 14, "fat": 0.17, "fiber": 2.4},
    "banana": {"calories": 89, "protein": 1.1, "carbs": 23, "fat": 0.3, "fiber": 2.6},
    "orange": {"calories": 47, "protein": 0.9, "carbs": 12, "fat": 0.12, "fiber": 2.4},
    "strawberry": {"calories": 32, "protein": 0.67, "carbs": 8, "fat": 0.3, "fiber": 2},
    "watermelon": {"calories": 30, "protein": 0.61, "carbs": 8, "fat": 0.15, "fiber": 0.4},
    "mango": {"calories": 60, "protein": 0.82, "carbs": 15, "fat": 0.38, "fiber": 1.6},
    "grapes": {"calories": 67, "protein": 0.72, "carbs": 17, "fat": 0.16, "fiber": 0.9},
    "avocado": {"calories": 160, "protein": 2, "carbs": 9, "fat": 15, "fiber": 7},
    "blueberry": {"calories": 57, "protein": 0.74, "carbs": 14, "fat": 0.33, "fiber": 2.4},
    "pineapple": {"calories": 50, "protein": 0.54, "carbs": 13, "fat": 0.12, "fiber": 1.4},
    
    # ==================== VEGETABLES ====================
    
    "carrot": {"calories": 41, "protein": 0.93, "carbs": 10, "fat": 0.24, "fiber": 2.8},
    "broccoli": {"calories": 34, "protein": 2.8, "carbs": 7, "fat": 0.4, "fiber": 2.4},
    "spinach": {"calories": 23, "protein": 2.7, "carbs": 3.6, "fat": 0.4, "fiber": 2.2},
    "potato": {"calories": 77, "protein": 2, "carbs": 17, "fat": 0.1, "fiber": 2.1},
    "tomato": {"calories": 18, "protein": 0.88, "carbs": 3.9, "fat": 0.2, "fiber": 1.2},
    "cucumber": {"calories": 16, "protein": 0.65, "carbs": 3.6, "fat": 0.11, "fiber": 0.5},
    "onion": {"calories": 40, "protein": 1.1, "carbs": 9, "fat": 0.1, "fiber": 1.7},
    "garlic": {"calories": 149, "protein": 6.4, "carbs": 33, "fat": 0.5, "fiber": 2.1},
    "lettuce": {"calories": 15, "protein": 0.9, "carbs": 2.9, "fat": 0.1, "fiber": 1.2},
    "bell_pepper": {"calories": 31, "protein": 1, "carbs": 6, "fat": 0.3, "fiber": 2},
    
    # ==================== DAIRY ====================
    
    "milk": {"calories": 61, "protein": 3.2, "carbs": 4.8, "fat": 3.3, "fiber": 0},
    "cheese": {"calories": 402, "protein": 25, "carbs": 1.3, "fat": 33, "fiber": 0},
    "yogurt": {"calories": 59, "protein": 3.5, "carbs": 3.2, "fat": 3, "fiber": 0},
    "ice_cream": {"calories": 207, "protein": 3.5, "carbs": 24, "fat": 11, "fiber": 0},
    "cream": {"calories": 340, "protein": 2.2, "carbs": 2.8, "fat": 35, "fiber": 0},
    "cream_cheese": {"calories": 342, "protein": 5.9, "carbs": 4.1, "fat": 34, "fiber": 0},
    
    # ==================== GRAINS ====================
    
    "bread": {"calories": 265, "protein": 9, "carbs": 49, "fat": 3.3, "fiber": 2.7},
    "whole_wheat_bread": {"calories": 247, "protein": 8.2, "carbs": 41, "fat": 3.3, "fiber": 6.8},
    "rice": {"calories": 130, "protein": 2.7, "carbs": 28, "fat": 0.3, "fiber": 0.4},
    "wheat": {"calories": 327, "protein": 13, "carbs": 71, "fat": 1.7, "fiber": 10.7},
    "oats": {"calories": 389, "protein": 17, "carbs": 66, "fat": 6.9, "fiber": 10.6},
    "cereal": {"calories": 150, "protein": 3, "carbs": 30, "fat": 1, "fiber": 1},
    "corn": {"calories": 86, "protein": 3.2, "carbs": 19, "fat": 1.2, "fiber": 2.7},
    
    # ==================== NUTS & SEEDS ====================
    
    "almonds": {"calories": 579, "protein": 21, "carbs": 22, "fat": 50, "fiber": 12.5},
    "peanuts": {"calories": 567, "protein": 26, "carbs": 16, "fat": 49, "fiber": 8.6},
    "walnuts": {"calories": 654, "protein": 9, "carbs": 14, "fat": 65, "fiber": 6.7},
    "sunflower_seeds": {"calories": 584, "protein": 8.5, "carbs": 20, "fat": 51, "fiber": 8.6},
    "pumpkin_seeds": {"calories": 559, "protein": 25, "carbs": 11, "fat": 49, "fiber": 6},
    
    # ==================== FAST FOOD ====================
    
    "mcdonalds_burger": {"calories": 215, "protein": 12, "carbs": 26, "fat": 9, "fiber": 1.5},
    "kfc_chicken": {"calories": 320, "protein": 30, "carbs": 10, "fat": 17, "fiber": 0},
    "subway_sandwich": {"calories": 230, "protein": 11, "carbs": 35, "fat": 4, "fiber": 2},
    "pizza_slice": {"calories": 285, "protein": 8, "carbs": 36, "fat": 11, "fiber": 2},
    "taco": {"calories": 195, "protein": 9, "carbs": 18, "fat": 10, "fiber": 1.5},
    "fries": {"calories": 365, "protein": 3.4, "carbs": 48, "fat": 17, "fiber": 4.2},
    
    # ==================== BEVERAGES ====================
    
    "water": {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0},
    "tea": {"calories": 2, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0},
    "coffee": {"calories": 2, "protein": 0.2, "carbs": 0.3, "fat": 0, "fiber": 0},
    "juice": {"calories": 47, "protein": 0.5, "carbs": 11, "fat": 0.1, "fiber": 0.1},
    "soft_drink": {"calories": 42, "protein": 0, "carbs": 11, "fat": 0, "fiber": 0},
    "beer": {"calories": 43, "protein": 0.5, "carbs": 3.6, "fat": 0, "fiber": 0},
    "wine": {"calories": 82, "protein": 0.1, "carbs": 2.6, "fat": 0, "fiber": 0},
    "smoothie": {"calories": 120, "protein": 3, "carbs": 28, "fat": 0.5, "fiber": 2},
    
    # ==================== SOUPS & STEWS ====================
    
    "vegetable_soup": {"calories": 75, "protein": 3, "carbs": 14, "fat": 1, "fiber": 2},
    "chicken_soup": {"calories": 85, "protein": 7, "carbs": 8, "fat": 3, "fiber": 0.5},
    "tomato_soup": {"calories": 70, "protein": 2, "carbs": 15, "fat": 1, "fiber": 1},
    "lentil_soup": {"calories": 120, "protein": 8, "carbs": 18, "fat": 1, "fiber": 4},
    "mushroom_soup": {"calories": 95, "protein": 3, "carbs": 10, "fat": 5, "fiber": 1.5},
    
    # ==================== SALADS ====================
    
    "caesar_salad": {"calories": 150, "protein": 7, "carbs": 10, "fat": 8, "fiber": 2},
    "garden_salad": {"calories": 50, "protein": 2, "carbs": 9, "fat": 0.5, "fiber": 2},
    "greek_salad": {"calories": 120, "protein": 5, "carbs": 9, "fat": 8, "fiber": 2},
    "coleslaw": {"calories": 150, "protein": 1.5, "carbs": 15, "fat": 9, "fiber": 2.5},
    "pasta_salad": {"calories": 180, "protein": 5, "carbs": 25, "fat": 7, "fiber": 2},
    
    # ==================== MEDITERRANEAN ====================
    
    "hummus": {"calories": 363, "protein": 12, "carbs": 33, "fat": 19, "fiber": 9.6},
    "falafel": {"calories": 333, "protein": 13, "carbs": 28, "fat": 17, "fiber": 5.9},
    "tabbouleh": {"calories": 99, "protein": 3.3, "carbs": 16, "fat": 2.2, "fiber": 3.9},
    "moussaka": {"calories": 215, "protein": 15, "carbs": 12, "fat": 12, "fiber": 1},
    "souvlaki": {"calories": 210, "protein": 28, "carbs": 2, "fat": 10, "fiber": 0},
    
    # ==================== DESSERTS ====================
    
    "cake": {"calories": 250, "protein": 3, "carbs": 40, "fat": 9, "fiber": 0.5},
    "chocolate": {"calories": 535, "protein": 4.9, "carbs": 58, "fat": 30, "fiber": 3.3},
    "cookie": {"calories": 452, "protein": 5, "carbs": 60, "fat": 21, "fiber": 1.5},
    "donut": {"calories": 452, "protein": 4.3, "carbs": 50, "fat": 25, "fiber": 0},
    "candy": {"calories": 390, "protein": 0, "carbs": 98, "fat": 0.3, "fiber": 0},
    "pudding": {"calories": 120, "protein": 2, "carbs": 20, "fat": 4, "fiber": 0},
    "pie": {"calories": 270, "protein": 2.5, "carbs": 40, "fat": 11, "fiber": 1.2},
}


def get_food_nutrition(food_name: str) -> dict:
    """
    Get complete nutrition info for a food item
    
    Args:
        food_name: Name of the food (case-insensitive)
        
    Returns:
        Dictionary with calories, protein, carbs, fat, fiber
        Returns default values if food not found
    """
    # Normalize food name
    food_key = food_name.lower().replace(" ", "_").replace("-", "_")
    
    # Try direct match first
    if food_key in FOOD_NUTRITION_MAP:
        return FOOD_NUTRITION_MAP[food_key].copy()
    
    # Try fuzzy matching for similar foods
    for key in FOOD_NUTRITION_MAP.keys():
        if key in food_key or food_key in key:
            return FOOD_NUTRITION_MAP[key].copy()
    
    # Default return: assume similar to rice
    return {
        "calories": 130,
        "protein": 2.7,
        "carbs": 28,
        "fat": 0.3,
        "fiber": 0.4,
    }


def get_all_food_classes() -> list:
    """Get list of all food names"""
    return list(FOOD_NUTRITION_MAP.keys())


def get_food_count() -> int:
    """Get total count of foods in database"""
    return len(FOOD_NUTRITION_MAP)
