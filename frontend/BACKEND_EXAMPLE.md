# FastAPI Backend Example for Calorie Detection

This is an example FastAPI backend that the React Native app expects to communicate with.

## Setup

### 1. Install Dependencies
```bash
pip install fastapi uvicorn python-multipart pillow torch torchvision
```

### 2. Create `main.py`

```python
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import io
from typing import Optional

app = FastAPI(title="Calorie Detection API", version="1.0.0")

# Enable CORS for React Native app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock calorie database
FOOD_CALORIES = {
    "pizza": {"calories": 285, "confidence": 0.92},
    "burger": {"calories": 540, "confidence": 0.88},
    "salad": {"calories": 150, "confidence": 0.91},
    "pasta": {"calories": 380, "confidence": 0.85},
    "chicken breast": {"calories": 165, "confidence": 0.93},
    "apple": {"calories": 95, "confidence": 0.89},
    "banana": {"calories": 105, "confidence": 0.90},
    "eggs": {"calories": 155, "confidence": 0.87},
}


def analyze_image(image: Image.Image) -> dict:
    """
    Analyze image and return food item and calories.
    This is a mock implementation. Replace with actual ML model.
    """
    # Mock implementation - replace with actual model inference
    # Example: Use YOLOv8 + custom model for food detection
    
    # For testing, return random food item
    import random
    food_item, data = random.choice(list(FOOD_CALORIES.items()))
    
    return {
        "food_item": food_item.title(),
        "calories": data["calories"],
        "confidence": data["confidence"],
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.post("/predict")
async def predict_calories(image: UploadFile = File(...)):
    """
    Predict calories from food image.
    
    - **image**: Image file (JPG, PNG)
    
    Returns:
    - **food_item**: Detected food item name
    - **calories**: Estimated calories
    - **confidence**: Confidence score (0-1)
    """
    try:
        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="Uploaded file must be an image"
            )
        
        # Read image
        contents = await image.read()
        img = Image.open(io.BytesIO(contents))
        
        # Analyze image
        result = analyze_image(img)
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )


@app.get("/foods")
async def get_food_database():
    """Get list of known foods and their calories"""
    return {
        "foods": [
            {
                "name": name,
                "calories": data["calories"],
                "confidence": data["confidence"],
            }
            for name, data in FOOD_CALORIES.items()
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 3. Run the Server

```bash
python main.py
# or
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /health
```

### Predict Calories
```
POST /predict
Content-Type: multipart/form-data

Expected Response:
{
  "food_item": "Pizza",
  "calories": 285,
  "confidence": 0.92
}
```

### Get Food Database
```
GET /foods
```

Expected Response:
```json
{
  "foods": [
    {
      "name": "pizza",
      "calories": 285,
      "confidence": 0.92
    },
    ...
  ]
}
```

## Production Implementation

For production, replace the mock implementation with:

1. **OpenFood Database API**: https://world.openfoodfacts.org/api
2. **Firebase ML Kit**: For on-device food recognition
3. **Custom YOLOv8 Model**: For accurate food detection
4. **Nutritionix API**: For detailed nutritional information

### Example with YOLOv8:

```python
from ultralytics import YOLO

model = YOLO("yolov8n.pt")  # or food-detection model

def analyze_image_with_yolo(image: Image.Image) -> dict:
    results = model.predict(source=image, conf=0.5)
    # Process results and return food item and calories
```

## CORS Configuration

For production, update CORS settings:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)
```

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 400: Bad request (invalid image)
- 500: Server error (processing failed)

## Testing

Use curl or Postman to test:

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -F "image=@pizza.jpg"
```

## Requirements File

Create `requirements.txt`:

```
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6
Pillow==10.1.0
numpy==1.26.2
```

Install with:
```bash
pip install -r requirements.txt
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Build and Run

```bash
docker build -t calorie-api .
docker run -p 8000:8000 calorie-api
```

## Notes

- This is a template; implement actual ML models for production
- Consider rate limiting for production APIs
- Add authentication if needed
- Monitor API performance and usage
- Keep models updated with latest data
