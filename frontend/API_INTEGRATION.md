# API Integration Guide

## Overview

This Workout Planner app integrates with a FastAPI backend for calorie detection from food images. This guide explains the API endpoints, integration details, and how to set up both frontend and backend.

## Frontend API Configuration

### Environment Variables

The frontend uses environment variables to configure the API endpoint. Create a `.env` file in the `frontend` directory:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8000
```

## API Endpoints

### 1. Health Check
**Endpoint:** `GET /health`

**Purpose:** Verify backend is running

**Response:**
```json
{
  "status": "healthy"
}
```

**Usage in Frontend:**
```typescript
import axios from 'axios';

const checkHealth = async () => {
  try {
    const response = await axios.get('/health');
    console.log('Backend is healthy:', response.data);
  } catch (error) {
    console.error('Backend is unavailable');
  }
};
```

### 2. Predict Calories (Main Endpoint)
**Endpoint:** `POST /predict`

**Description:** Send food image to get calorie prediction

**Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
- `image` (File): Image file (JPG, PNG, WebP)

**Response:**
```json
{
  "food_item": "Pizza",
  "calories": 285,
  "confidence": 0.92
}
```

**Response Fields:**
- `food_item` (string): Detected food name
- `calories` (number): Estimated calories per serving
- `confidence` (number): Confidence score (0-1)

**Error Response:**
```json
{
  "detail": "Uploaded file must be an image"
}
```

**Usage in Frontend:**

```typescript
// From app/(tabs)/scanner.tsx
import axios from 'axios';

const sendImageToBackend = async (imageUri: string) => {
  try {
    const formData = new FormData();
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    formData.append('image', blob as any, 'photo.jpg');
    
    const backendResponse = await axios.post(
      `${API_BASE_URL}/predict`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      }
    );
    
    setPredictionResult(backendResponse.data);
  } catch (error) {
    console.error('Prediction failed:', error);
  }
};
```

### 3. Get Food Database
**Endpoint:** `GET /foods`

**Purpose:** Get list of known foods and calories (for reference/caching)

**Response:**
```json
{
  "foods": [
    {
      "name": "pizza",
      "calories": 285,
      "confidence": 0.92
    },
    {
      "name": "burger",
      "calories": 540,
      "confidence": 0.88
    }
  ]
}
```

## Integration Examples

### Using Axios Client Utility

The app includes an API utility file at `utils/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const calorieDetectionAPI = {
  predictMeal: async (imageUri: string) => {
    const formData = new FormData();
    const response = await fetch(imageUri);
    const blob = await response.blob();
    formData.append('image', blob as any, 'photo.jpg');

    return apiClient.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
```

### Direct Integration in Components

```typescript
const Scanner = () => {
  const handleCapture = async (imageUri: string) => {
    try {
      const result = await calorieDetectionAPI.predictMeal(imageUri);
      console.log('Detected:', result.data.food_item);
      console.log('Calories:', result.data.calories);
    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
    }
  };
};
```

## Error Handling

The frontend handles various error scenarios:

```typescript
try {
  const result = await axios.post(`${API_BASE_URL}/predict`, formData);
} catch (error) {
  if (error.response?.status === 400) {
    // Bad request - invalid image
    console.error('Invalid image format');
  } else if (error.response?.status === 500) {
    // Server error
    console.error('Backend processing error');
  } else if (error.code === 'ECONNABORTED') {
    // Timeout
    console.error('Request timeout - backend unreachable');
  } else {
    console.error('Unknown error:', error.message);
  }
}
```

## CORS Configuration

The backend must enable CORS for the mobile app:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Network Configuration

### Local Development

For local development on physical device:

1. **Find your machine's IP address:**
   ```bash
   # Mac/Linux
   ifconfig | grep inet
   
   # Windows
   ipconfig
   ```

2. **Update `.env` with your IP:**
   ```
   EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
   ```

3. **Ensure backend is accessible:**
   - Backend must listen on `0.0.0.0` (not just `localhost`)
   - Check firewall settings
   - Verify device is on same network

### Production Deployment

For production:

1. **Use HTTPS:**
   ```
   EXPO_PUBLIC_API_URL=https://api.yourdomain.com
   ```

2. **Configure CORS properly:**
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://yourdomain.com"],
       allow_methods=["POST", "GET"],
       allow_headers=["*"],
   )
   ```

3. **Add authentication:**
   ```typescript
   const headers = {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'multipart/form-data',
   };
   ```

## Testing the API

### Using cURL

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test prediction
curl -X POST http://localhost:8000/predict \
  -F "image=@pizza.jpg"

# Test food database
curl http://localhost:8000/foods
```

### Using Postman

1. Create POST request to `http://localhost:8000/predict`
2. Set Content-Type to `multipart/form-data`
3. Add file parameter `image` with image file
4. Send request

### Using React Native Debugger

```typescript
import { Alert } from 'react-native';

const testAPI = async () => {
  try {
    const response = await axios.get('http://localhost:8000/health');
    Alert.alert('Success', JSON.stringify(response.data));
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

## Performance Optimization

### Image Compression

Before sending to backend:

```typescript
const compressImage = async (uri: string) => {
  // Use image-resizer or similar library
  const compressed = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 640, height: 640 } }],
    { compress: 0.8, format: 'jpeg' }
  );
  return compressed.uri;
};
```

### Caching

Cache prediction results to reduce API calls:

```typescript
const cache = new Map();

const getPrediction = async (imageUri: string) => {
  if (cache.has(imageUri)) {
    return cache.get(imageUri);
  }
  
  const result = await calorieDetectionAPI.predictMeal(imageUri);
  cache.set(imageUri, result.data);
  return result.data;
};
```

### Timeout Configuration

Adjust timeout based on backend processing time:

```typescript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for ML inference
});
```

## Troubleshooting

### Connection Refused
- Backend not running
- Wrong IP address in `.env`
- Firewall blocking connection

### CORS Error
- Backend CORS not configured
- Wrong origin headers
- Browser/app security policy

### Image Processing Error
- Invalid image file
- File size too large
- Unsupported format

### Timeout Error
- Network too slow
- ML model taking too long
- Request stuck

## Example Backend Implementations

See `BACKEND_EXAMPLE.md` for complete FastAPI example implementation.

## Best Practices

1. **Always validate image format before sending**
2. **Implement proper error handling and user feedback**
3. **Use environment variables for configuration**
4. **Add request/response logging for debugging**
5. **Implement rate limiting on backend**
6. **Cache results when possible**
7. **Use HTTPS in production**
8. **Monitor API performance and usage**

## Security Considerations

1. **Don't expose sensitive credentials** in client app
2. **Validate all inputs** on backend
3. **Use HTTPS** for production
4. **Implement authentication** if needed
5. **Add rate limiting** to prevent abuse
6. **Sanitize uploaded files** before processing
7. **Use environment variables** for sensitive data

## Resources

- [Axios Documentation](https://axios-http.com/docs/intro)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Native Networking](https://reactnative.dev/docs/network)
- [Expo Camera API](https://docs.expo.dev/cameras/camera-api/)
