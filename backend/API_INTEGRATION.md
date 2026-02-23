# API Integration Guide

How to integrate the FastAPI backend with your React Native frontend.

## API Base URL

Update this in your frontend `.env`:

```
API_BASE_URL=http://localhost:8000  # Development
API_BASE_URL=https://your-api.onrender.com  # Production
```

## Request/Response Examples

### 1. User Registration

**Request:**
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securePassword123",
  "dailyCalorieGoal": 2000
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "dailyCalorieGoal": 2000,
    "workoutStreak": 0,
    "createdAt": "2024-02-23T10:30:00"
  }
}
```

### 2. User Login

**Request:**
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "dailyCalorieGoal": 2000,
    "workoutStreak": 0,
    "createdAt": "2024-02-23T10:30:00"
  }
}
```

### 3. Scan Food Image

**Request:**
```bash
POST /scan/
Authorization: Bearer <token>
Content-Type: multipart/form-data

file=<image_file>
```

**Response:**
```json
{
  "food_item": "apple",
  "calories": 52.0,
  "confidence": 0.95
}
```

### 4. Log Workout

**Request:**
```bash
POST /workout/
Authorization: Bearer <token>
Content-Type: application/json

{
  "exercise": "Bench Press",
  "sets": 4,
  "reps": 8,
  "weight": 185.0,
  "duration": 45
}
```

**Response:**
```json
{
  "message": "Workout logged successfully",
  "workoutId": "550e8400-e29b-41d4-a716-446655440000",
  "date": "2024-02-23"
}
```

### 5. Get Daily History

**Request:**
```bash
GET /data/2024-02-23
Authorization: Bearer <token>
```

**Response:**
```json
{
  "workouts": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "exercise": "Bench Press",
      "sets": 4,
      "reps": 8,
      "weight": 185.0,
      "duration": 45,
      "date": "2024-02-23T10:30:00"
    }
  ],
  "nutrition": {
    "totalCalories": 2150,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "apple",
        "calories": 52.0,
        "confidence": 0.95,
        "date": "2024-02-23T12:30:00"
      }
    ]
  }
}
```

### 6. Get Date Range History

**Request:**
```bash
GET /data/?start_date=2024-02-20&end_date=2024-02-23
Authorization: Bearer <token>
```

**Response:**
```json
{
  "startDate": "2024-02-20",
  "endDate": "2024-02-23",
  "logs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user_id": "userId",
      "date": "2024-02-20",
      "workouts": [],
      "nutrition": {"totalCalories": 0, "items": []},
      "createdAt": "2024-02-20T00:00:00"
    },
    ...
  ],
  "count": 4
}
```

### 7. Health Check

**Request:**
```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-02-23T10:30:00",
  "version": "1.0.0"
}
```

## Error Responses

### 400 - Bad Request
```json
{
  "detail": "Invalid date format. Use YYYY-MM-DD"
}
```

### 401 - Unauthorized
```json
{
  "detail": "Invalid token"
}
```

### 409 - Conflict (Email already exists)
```json
{
  "detail": "Email already registered"
}
```

### 500 - Server Error
```json
{
  "detail": "Failed to log workout"
}
```

## Frontend Implementation Tips

### Axios Interceptor for JWT

```typescript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to every request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
```

### Upload Image for Food Scanning

```typescript
async function scanFood(imageUri: string) {
  const formData = new FormData();
  
  const response = await fetch(imageUri);
  const blob = await response.blob();
  
  formData.append('file', blob, 'photo.jpg');
  
  const result = await apiClient.post('/scan/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return result.data;
}
```

### Fetch Daily Data

```typescript
async function getDailyData(date: string) {
  const response = await apiClient.get(`/data/${date}`);
  return response.data;
}
```

## Rate Limiting (Production)

Add rate limiting middleware for production:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/workout/")
@limiter.limit("100/minute")
async def log_workout(...):
    ...
```

## Monitoring & Debugging

### Enable Debug Logging

Set `ENVIRONMENT=development` in `.env` to see detailed logs.

### Monitor MongoDB

```bash
# Connect to MongoDB
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/workout_db"

# Check collections
show collections

# View sample user
db.users.findOne()

# View daily logs for a user
db.daily_logs.find({user_id: "userId"})
```

### API Performance

Use the `/docs` Swagger UI to test endpoints:

1. Go to `http://localhost:8000/docs`
2. Click "Authorize" and paste your JWT token
3. Test all endpoints interactively

## SSL/HTTPS (Production)

Always use HTTPS in production. If deploying on Render/Railway:

1. SSL is automatically provided
2. Redirect HTTP to HTTPS
3. Enable HSTS headers

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
)
```
