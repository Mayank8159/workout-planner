# Comprehensive food calorie database with Indian and worldwide cuisines
# Calories per standard serving (100g unless specified)

FOOD_CALORIE_MAP = {
    # ==================== INDIAN FOODS ====================
    
    # Indian Breads
    "roti": 150,
    "chapati": 120,
    "paratha": 180,
    "naan": 262,
    "puri": 245,
    "dosa": 168,
    "idli": 150,
    "bhakri": 140,
    "appam": 135,
    "uttapam": 160,
    
    # Indian Rice Dishes
    "biryani": 240,
    "pulao": 180,
    "basmati_rice": 130,
    "jeera_rice": 140,
    "rice_pilaf": 138,
    "khichdi": 110,
    "fried_rice": 145,
    
    # Indian Curries & Main Dishes
    "chicken_tikka": 165,
    "butter_chicken": 215,
    "tandoori_chicken": 165,
    "chicken_curry": 185,
    "goat_curry": 195,
    "paneer_tikka": 165,
    "paneer_butter_masala": 240,
    "dal_makhani": 165,
    "chole_bhature": 320,
    "sambar": 85,
    "rasam": 25,
    "coconut_curry": 180,
    "korma": 210,
    "rogan_josh": 200,
    "vindaloo": 190,
    "dopiaza": 170,
    "saag_paneer": 155,
    "malai_kofta": 220,
    "shahi_tukda": 235,
    "pakora": 180,
    "samosa": 262,
    "spring_roll": 195,
    "momo": 140,
    
    # Indian Vegetable Dishes
    "aloo_gobi": 85,
    "baingan_bharta": 80,
    "bhindi_masala": 95,
    "chana_masala": 164,
    "dam_aloo": 110,
    "mixed_vegetables": 65,
    "tindora_masala": 55,
    
    # Indian Yogurt & Dairy
    "dahi": 59,
    "lassi": 60,
    "paneer": 265,
    "ghee": 892,
    "butter_milk": 40,
    "raita": 95,
    
    # Indian Snacks & Street Food
    "vada": 165,
    "chaat": 170,
    "gol_gappa": 150,
    "sev_puri": 195,
    "bhel_puri": 165,
    "pav_bhaji": 200,
    "aloo_tikki": 180,
    "jalebi": 296,
    "gulab_jamun": 185,
    "kheer": 152,
    "halwa": 350,
    "laddu": 320,
    "barfi": 365,
    "burfi": 365,
    "chikhalwali": 250,
    "chikkhali": 250,
    
    # ==================== ASIAN FOODS ====================
    
    # Chinese
    "fried_rice_chinese": 145,
    "noodles_chow_mein": 190,
    "spring_roll_chinese": 195,
    "dim_sum": 165,
    "peking_duck": 195,
    "sweet_sour_pork": 215,
    "mapo_tofu": 160,
    "kung_pao_chicken": 210,
    
    # Japanese
    "sushi": 200,
    "ramen": 356,
    "tempura": 230,
    "tonkotsu_pork": 220,
    "teriyaki_chicken": 245,
    "edamame": 95,
    "miso_soup": 35,
    
    # Thai
    "pad_thai": 225,
    "green_curry": 210,
    "red_curry": 215,
    "tom_yum": 70,
    "satay": 415,
    
    # Vietnamese
    "pho": 130,
    "banh_mi": 220,
    "spring_roll_vietnam": 180,
    "vermicelli_bowl": 165,
    
    # Korean
    "bibimbap": 275,
    "kimchi": 23,
    "bulgogi": 245,
    "Korean_fried_chicken": 320,
    "tteokbokki": 180,
    
    # ==================== WESTERN FOODS ====================
    
    # Meats
    "beef_steak": 250,
    "pork_chop": 242,
    "lamb": 294,
    "turkey": 189,
    "duck": 337,
    "salmon": 206,
    "tuna": 132,
    "cod": 82,
    "shrimp": 99,
    "crab": 102,
    "lobster": 90,
    "chicken_breast": 165,
    "chicken_thigh": 209,
    
    # Vegetables
    "apple": 52,
    "banana": 89,
    "orange": 47,
    "strawberry": 32,
    "blueberry": 57,
    "broccoli": 34,
    "carrot": 41,
    "spinach": 23,
    "lettuce": 15,
    "tomato": 18,
    "potato": 77,
    "sweet_potato": 86,
    "peas": 81,
    "corn": 86,
    "bell_pepper": 30,
    "cucumber": 16,
    "cabbage": 25,
    "cauliflower": 25,
    "mushroom": 22,
    "onion": 40,
    "garlic": 149,
    "zucchini": 21,
    
    # Fruits (continued)
    "avocado": 160,
    "coconut": 354,
    "mango": 60,
    "pineapple": 50,
    "watermelon": 30,
    "grapes": 67,
    "peach": 39,
    "pear": 57,
    "kiwi": 61,
    "papaya": 43,
    "guava": 68,
    "pomegranate": 83,
    "fig": 74,
    "date": 282,
    "apricot": 48,
    "plum": 46,
    "cherry": 63,
    "melon": 34,
    
    # Grains & Bread
    "rice": 130,
    "white_bread": 79,
    "whole_wheat_bread": 81,
    "pasta": 131,
    "oatmeal": 150,
    "cereal": 375,
    "granola": 471,
    "bagel": 210,
    "muffin": 320,
    "croissant": 406,
    "donut": 269,
    "waffle": 291,
    "pancake": 227,
    "tortilla": 167,
    "crackers": 432,
    "quinoa": 120,
    "barley": 123,
    "buckwheat": 155,
    
    # Dairy
    "milk": 60,
    "yogurt": 100,
    "cheese": 402,
    "butter": 717,
    "cream": 340,
    "ice_cream": 207,
    "cottage_cheese": 98,
    "mozzarella": 280,
    "cheddar": 403,
    "feta": 265,
    "parmesan": 431,
    "whipped_cream": 340,
    
    # Beverages
    "water": 0,
    "tea": 2,
    "coffee": 2,
    "orange_juice": 45,
    "apple_juice": 46,
    "grape_juice": 67,
    "cranberry_juice": 46,
    "lemon_juice": 29,
    "soda": 140,
    "cola": 140,
    "sprite": 140,
    "beer": 155,
    "wine_red": 85,
    "wine_white": 82,
    "champagne": 89,
    "vodka": 231,
    "rum": 231,
    "whiskey": 231,
    "smoothie": 250,
    "milkshake": 290,
    "protein_shake": 180,
    "coconut_water": 19,
    
    # Nuts & Seeds
    "almond": 579,
    "walnut": 654,
    "peanut": 567,
    "pistachio": 562,
    "cashew": 553,
    "sunflower_seed": 585,
    "pumpkin_seed": 541,
    "sesame_seed": 563,
    "flaxseed": 534,
    "chia_seed": 486,
    
    # Oils & Condiments
    "olive_oil": 884,
    "coconut_oil": 892,
    "sesame_oil": 894,
    "soy_sauce": 80,
    "ketchup": 112,
    "mayo": 680,
    "mustard": 66,
    "honey": 304,
    "maple_syrup": 260,
    "peanut_butter": 588,
    "almond_butter": 614,
    "tahini": 645,
    
    # Snacks & Sweets
    "candy": 439,
    "chocolate": 535,
    "dark_chocolate": 598,
    "milk_chocolate": 565,
    "white_chocolate": 573,
    "chips": 547,
    "popcorn": 387,
    "cookies": 492,
    "cake": 271,
    "pie": 296,
    "brownies": 428,
    "candy_bar": 540,
    "granola_bar": 437,
    "protein_bar": 250,
    "candy_cane": 60,
    "chocolate_chip": 502,
    "marshmallow": 320,
    "gummies": 340,
    "jelly_beans": 375,
    "licorice": 335,
    "taffy": 400,
    "lollipop": 108,
    "cotton_candy": 337,
    "popsicle": 75,
    
    # Fast Food & Prepared
    "burger": 354,
    "cheeseburger": 404,
    "double_burger": 540,
    "hot_dog": 290,
    "pizza": 266,
    "pepperoni_pizza": 285,
    "taco": 206,
    "burrito": 345,
    "sandwich": 267,
    "club_sandwich": 350,
    "fries": 365,
    "chicken_nuggets": 190,
    "sushi_roll": 200,
    "ramen_noodles": 356,
    "instant_noodles": 380,
    "cup_noodles": 350,
    "pizza_slice": 285,
    "gyro": 287,
    "shawarma": 265,
    "kebab": 220,
    "falafel": 333,
    
    # Mexican Foods
    "enchilada": 320,
    "quesadilla": 350,
    "chile_relleno": 290,
    "ceviche": 155,
    "salsa": 36,
    "guacamole": 160,
    "refried_beans": 91,
    "nachos": 470,
    "churro": 382,
    
    # Italian Foods
    "lasagna": 312,
    "risotto": 175,
    "ravioli": 180,
    "spaghetti": 131,
    "fettuccine": 225,
    "carbonara": 265,
    "bolognese": 180,
    "polenta": 77,
    "minestrone": 82,
    "tiramisu": 285,
    "panna_cotta": 310,
    "gelato": 230,
    "panettone": 335,
    
    # Mediterranean Foods
    "hummus": 363,
    "falafel": 333,
    "tabbouleh": 99,
    "mezze": 280,
    "moussaka": 215,
    "souvlaki": 220,
    "tzatziki": 72,
    
    # Middle Eastern Foods
    "kabsa": 320,
    "mansaf": 280,
    "fattoush": 180,
    "labneh": 158,
    
    # African Foods
    "jollof_rice": 180,
    "fufu": 145,
    "injera": 165,
    "tagine": 190,
    "couscous": 112,
    
    # South American Foods
    "empanada": 275,
    "arepa": 265,
    "pupusa": 300,
    "ceviche": 155,
    
    # Soups & Stews
    "chicken_soup": 60,
    "vegetable_soup": 52,
    "minestrone_soup": 82,
    "pumpkin_soup": 50,
    "tomato_soup": 74,
    "cream_soup": 165,
    "beef_stew": 180,
    "goulash": 160,
    "chili": 200,
    "bouillabaisse": 120,
    
    # Salads
    "caesar_salad": 323,
    "greek_salad": 150,
    "garden_salad": 50,
    "coleslaw": 150,
    "potato_salad": 358,
    "tuna_salad": 225,
    "chicken_salad": 240,
    
    # Eggs
    "egg": 155,
    "boiled_egg": 147,
    "fried_egg": 165,
    "scrambled_egg": 154,
    "omelette": 154,
    "egg_white": 52,
    
    # Legumes
    "lentil": 116,
    "chickpea": 164,
    "kidney_bean": 127,
    "black_bean": 132,
    "pinto_bean": 143,
    "split_pea": 118,
    "white_bean": 127,
    
    # Prepared Foods (misc)
    "pizza_slice": 285,
    "garlic_bread": 278,
    "bruschetta": 122,
    "crostini": 280,
    "fondue": 320,
    "crepe": 275,
    "quiche": 255,
    "cottage_pie": 195,
    "shepherd_pie": 210,
    "pot_pie": 280,
    "dumplings": 180,
    "wontons": 145,
    "spring_rolls": 195,
    "egg_rolls": 195,
    "hot_and_sour_soup": 85,
    "wonton_soup": 75,
    "miso_soup": 35,
    "clear_soup": 15,
    "tomato_basil_soup": 70,
    "mushroom_soup": 120,
    "broccoli_cheddar_soup": 140,
}


def get_food_calorie(food_name: str, default_calories: int = 100) -> int:
    """
    Get calorie value for a food item
    
    Args:
        food_name: Name of the food (lowercase, underscores instead of spaces)
        default_calories: Default value if food not found
        
    Returns:
        Calorie value (per 100g typically)
    """
    # Normalize food name
    normalized_name = food_name.lower().replace(" ", "_").replace("-", "_")
    
    # Direct lookup
    if normalized_name in FOOD_CALORIE_MAP:
        return FOOD_CALORIE_MAP[normalized_name]
    
    # Try partial matching
    for food_key, calories in FOOD_CALORIE_MAP.items():
        if normalized_name in food_key or food_key in normalized_name:
            return calories
    
    # Return default if not found
    return default_calories


def get_all_food_classes() -> list:
    """Get list of all supported food classes"""
    return list(FOOD_CALORIE_MAP.keys())


def get_food_count() -> int:
    """Get total count of supported foods"""
    return len(FOOD_CALORIE_MAP)
