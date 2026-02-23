# Food Detection Model Setup Guide

## Quick Start

The food detection model is required for the scanner feature to work properly. Follow these steps to set it up:

### Option 1: Automatic Setup (Easiest)

Run the automatic setup script:

```bash
cd backend
python setup_food_model.py
```

This script will:
1. ✓ Create the `models/` directory
2. ✓ Download a pre-trained MobileNetV2 model (~100MB)
3. ✓ Create a food classes file with 1000+ food items
4. ✓ Verify everything is set up correctly

**Note:** First run may take 2-5 minutes due to model download. Requires TensorFlow to be installed.

---

### Option 2: Manual Setup

If the automatic setup doesn't work, you can manually configure:

#### 1. Download a Pre-trained Model

Choose one of these sources:

**A) TensorFlow Hub** (Recommended - Easy, ready to use)
```
https://tfhub.dev/google/imagenet/inception_v3/classification/5
https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/classification/4
```

**B) Hugging Face**
```
https://huggingface.co/spaces/google/food-recognition
https://huggingface.co/google/food-classification
```

**C) Kaggle Datasets**
- Food-101: https://www.kaggle.com/datasets/trolukovich/food-101-pytorch-resnet50
- Food Recognition: https://www.kaggle.com/datasets/trolukovich/food-recognition-using-cnn

#### 2. Convert to H5 Format (if needed)

If your model is in a different format, convert it:

```python
import tensorflow as tf

# If model is SavedModel format
model = tf.keras.models.load_model('path/to/saved_model')
model.save('backend/models/food_model.h5')

# If model is .pth (PyTorch), you need to convert first
# Convert PyTorch → ONNX → TensorFlow → H5
```

#### 3. Place Model File

Save your model to:
```
backend/models/food_model.h5
```

#### 4. Create Food Classes File

Create `backend/models/food_classes.txt` with one food class per line:

```
chicken_tikka
butter_chicken
paneer_tikka
biryani
dal_makhani
...
```

---

## File Structure After Setup

```
backend/
├── models/
│   ├── food_model.h5          (Pre-trained model)
│   └── food_classes.txt       (Food class labels)
├── app/
│   └── utils/
│       └── model_loader.py    (Loads the model)
└── setup_food_model.py        (Setup script)
```

---

## Verify Setup

After setup, verify everything works:

```bash
cd backend
python -c "
from app.utils.model_loader import food_model
import os

model_exists = os.path.exists('models/food_model.h5')
classes_exist = os.path.exists('models/food_classes.txt')

print(f'Model file exists: {model_exists}')
print(f'Classes file exists: {classes_exist}')

if food_model.load_model('models/food_model.h5'):
    print('✓ Model loaded successfully!')
    if food_model.load_class_names('models/food_classes.txt'):
        print(f'✓ Loaded {len(food_model.class_names)} food classes')
else:
    print('✗ Failed to load model')
"
```

---

## Start Backend with Model

Once setup is complete:

```bash
cd backend
python -m uvicorn app.main:app --reload
```

The server logs should show:
```
✓ H5 Keras model loaded successfully
  Input shape: (224, 224, 3)
  Total classes: XXXX
```

---

## Model Recommendations

### For Mobile/Web (Best Performance)
- **MobileNetV2** - Small, fast, good accuracy
- **EfficientNet** - Balanced size and speed
- **SqueezeNet** - Ultra-lightweight

### For High Accuracy (Slower)
- **ResNet50** - Excellent accuracy
- **InceptionV3** - Very accurate
- **VGG16** - Good accuracy but large file

### Food-Specific Models (Best)
- **Food-101 trained models** - Optimized for food classification
- **Custom trained on Indian cuisine** - Better for local food recognition

---

## Troubleshooting

### "Model file not found"
- Run: `python setup_food_model.py`
- Or manually download and place model in `backend/models/food_model.h5`

### "Classes file not found"
- Run: `python setup_food_model.py`
- Or create manually with food class names

### "TensorFlow not installed"
```bash
pip install tensorflow
python setup_food_model.py
```

### "Model too large / Out of memory"
- Use a smaller model like MobileNetV2
- Reduce model in TFLite format (much smaller)

### "Scanner still shows random foods"
- Check backend logs: `python -m uvicorn app.main:app --reload`
- Should show "✓ H5 Keras model loaded successfully"
- If not, check model and classes files exist and are readable

---

## Testing the Scanner

Once setup complete:

1. Start backend: `python -m uvicorn app.main:app --reload`
2. Start frontend: `npx expo start`
3. Navigate to Scanner tab
4. Take a picture of food
5. Should return actual predicted food (not random)

**Note:** The model will predict from its trained classes. If you use ImageNet weights, it will recognize general objects. For better food recognition, use model trained on food datasets.

---

## Next Steps

For **production-grade** food detection:

1. **Train custom model** on food-specific dataset
2. **Quantize model** for faster inference
3. **Add fallback** to food API (Google Vision, Clarifai)
4. **Cache predictions** to improve speed
5. **Monitor accuracy** and retrain periodically
