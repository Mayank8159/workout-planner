#!/usr/bin/env python3
"""
Setup script to download and configure pre-trained food detection model
Downloads from TensorFlow Hub and creates necessary files
"""

import os
import sys
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def create_models_directory():
    """Create models directory if it doesn't exist"""
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    logger.info(f"✓ Created/verified models directory: {models_dir.absolute()}")
    return models_dir


def create_food_classes_file(models_dir):
    """Create food classes file with common food items"""
    
    # Comprehensive food classes for Indian and international cuisine
    food_classes = [
        "chicken_tikka", "butter_chicken", "paneer_tikka", "tandoori_chicken",
        "biryani", "dum_biryani", "hyderabadi_biryani", "egg_biryani", "lamb_biryani", "mutton_biryani",
        "dal_makhani", "butter_naan", "garlic_naan", "plain_naan", "roti", "chapati", "puri",
        "basmati_rice", "jeera_rice", "coconut_rice", "lemon_rice", "pulao", "fried_rice",
        "samosa", "pakora", "spring_roll", "momos", "dumpling", "wonton",
        "pizza", "pasta", "spaghetti", "fettuccine", "penne", "lasagna",
        "burger", "sandwich", "wrap", "roll", "kebab", "shawarma",
        "salad", "greek_salad", "caesar_salad", "garden_salad", "coleslaw", "cucumber_salad",
        "dal_fry", "dal_tadka", "rajma", "chole_bhature", "chickpea_curry", "kidney_bean_curry",
        "aloo_gobi", "chana_masala", "baingan_bharta", "mushroom_curry", "mixed_vegetable_curry",
        "fish_curry", "fish_fry", "shrimp_curry", "prawn_fry", "fish_tandoori", "fish_biryani",
        "crab_curry", "squid_fry", "lobster_curry",
        "dosa", "idli", "sambhar", "chutney", "upma", "poha", "paratha", "kulcha",
        "kheer", "gulab_jamun", "jalebi", "rasgulla", "ladoo", "barfi",
        "fruit", "apple", "banana", "orange", "mango", "grapes", "strawberry", "watermelon",
        "soup", "chicken_soup", "tomato_soup", "coconut_soup", "dal_soup", "lentil_soup",
        "vegetable_soup", "minestrone", "bullion", "consomme",
        "smoothie", "milkshake", "juice", "coffee", "tea", "lassi", "faluda",
        "bread", "whole_wheat_bread", "french_baguette", "ciabatta", "focaccia",
        "egg_curry", "scrambled_eggs", "omelet", "egg_biryani",
        "meat_curry", "lamb_curry", "mutton_curry", "goat_curry", "pork_curry",
        "rice_bowl", "rice_plate", "rice_dish",
        "noodles", "chow_mein", "ramen", "udon", "soba",
        "taco", "burrito", "enchilada", "quesadilla",
        "sushi", "sashimi", "nigiri", "maki",
        "steak", "beef_steak", "pork_steak", "lamb_chop", "ribs",
        "chicken_breast", "chicken_leg", "chicken_wing", "chicken_drumstick",
        "fish", "salmon", "tuna", "cod", "mackerel", "sardine",
        "vegetables", "broccoli", "carrot", "cauliflower", "spinach", "kale",
        "beans", "green_beans", "black_beans", "pinto_beans",
        "potato", "sweet_potato", "fries", "chips",
        "corn", "sweet_corn", "popcorn",
        "dairy", "milk", "yogurt", "cheese", "butter", "cream",
        "nuts", "almonds", "cashews", "peanuts", "walnuts",
        "dessert", "cake", "cupcake", "donut", "cookie", "brownie", "pie",
        "breakfast", "cereal", "oatmeal", "pancake", "waffle", "toast",
        "appetizer", "starter", "entree", "main_course", "side_dish", "dessert"
    ]
    
    classes_file = models_dir / "food_classes.txt"
    with open(classes_file, 'w') as f:
        for class_name in sorted(set(food_classes)):  # Remove duplicates and sort
            f.write(f"{class_name}\n")
    
    logger.info(f"✓ Created food classes file: {classes_file}")
    logger.info(f"  Total food classes: {len(set(food_classes))}")
    return classes_file


def download_pretrained_model(models_dir):
    """Download pre-trained TensorFlow model for food detection"""
    
    logger.info("🔄 Preparing to download pre-trained model...")
    logger.info("   Note: This may take a few minutes (~100-200MB)")
    
    try:
        import tensorflow as tf
        from tensorflow.keras.applications import MobileNetV2, ResNet50, EfficientNetB0
        
        logger.info("✓ TensorFlow is available")
        
        # Option 1: Use pre-trained MobileNetV2 (lightweight, good for mobile)
        logger.info("📥 Downloading MobileNetV2 pre-trained model (ImageNet weights)...")
        
        model = MobileNetV2(
            input_shape=(224, 224, 3),
            include_top=True,
            weights='imagenet',
            classes=1000
        )
        
        model_path = models_dir / "food_model.h5"
        model.save(str(model_path))
        
        logger.info(f"✓ Model downloaded and saved: {model_path}")
        logger.info(f"  File size: {model_path.stat().st_size / (1024*1024):.2f} MB")
        logger.info(f"  Input shape: {model.input_shape}")
        logger.info(f"  Output shape: {model.output_shape}")
        
        return model_path
        
    except ImportError:
        logger.error("❌ TensorFlow not installed. Installing TensorFlow...")
        os.system(f"{sys.executable} -m pip install tensorflow")
        logger.info("Please run this script again after TensorFlow installation completes.")
        return None
    except Exception as e:
        logger.error(f"❌ Error downloading model: {e}")
        logger.info("\n📋 Alternative: Download manually from:")
        logger.info("   1. TensorFlow Hub: https://tfhub.dev/google/imagenet/inception_v3/classification/5")
        logger.info("   2. Hugging Face: https://huggingface.co/spaces/google/food-recognition")
        logger.info("   3. Kaggle: https://kaggle.com/datasets/trolukovich/food-recognition-using-cnn")
        return None


def verify_setup(models_dir):
    """Verify that model and classes file exist"""
    
    model_file = models_dir / "food_model.h5"
    classes_file = models_dir / "food_classes.txt"
    
    checks = {
        "Model file exists": model_file.exists(),
        "Classes file exists": classes_file.exists(),
        "Models directory exists": models_dir.exists(),
    }
    
    logger.info("\n📋 Verification Results:")
    all_pass = True
    for check, passed in checks.items():
        status = "✓" if passed else "✗"
        logger.info(f"  {status} {check}")
        if not passed:
            all_pass = False
    
    if all_pass:
        logger.info("\n✓ Setup complete! The backend will now use the pre-trained model.")
        logger.info("  Start the backend server with: python -m uvicorn app.main:app --reload")
    else:
        logger.warning("\n⚠ Some files are missing. Please check the errors above.")
    
    return all_pass


def main():
    """Main setup function"""
    
    logger.info("=" * 60)
    logger.info("Food Detection Model Setup")
    logger.info("=" * 60)
    
    # Create models directory
    models_dir = create_models_directory()
    
    # Create food classes file
    create_food_classes_file(models_dir)
    
    # Download pre-trained model
    model_path = download_pretrained_model(models_dir)
    
    # Verify setup
    if verify_setup(models_dir):
        logger.info("\n" + "=" * 60)
        logger.info("✓ Setup completed successfully!")
        logger.info("=" * 60)
        return 0
    else:
        logger.warning("\n" + "=" * 60)
        logger.warning("⚠ Setup completed with warnings - see above for details")
        logger.warning("=" * 60)
        return 1


if __name__ == "__main__":
    sys.exit(main())
