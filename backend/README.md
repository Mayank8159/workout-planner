# Workout & Calorie Tracker API

Production-ready FastAPI backend for the workout and calorie tracking application.

## Features

- ✅ **JWT Authentication** - Secure user authentication with JWT tokens
- ✅ **MongoDB Integration** - Async MongoDB with Motor for high performance
- ✅ **AI Food Detection** - TensorFlow Lite model for food image recognition
- ✅ **Daily Logging** - Single-document-per-user-per-day approach for fast queries
- ✅ **RESTful API** - Clean, well-documented endpoints
- ✅ **CORS Enabled** - Ready for React Native frontend
- ✅ **Health Monitoring** - Built-in health check endpoint
- ✅ **Production Ready** - Async/await, error handling, and logging

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/workout_db
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
PORT=8000
ENVIRONMENT=development
```

### 3. Run the Server

```bash
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

Interactive API docs: `http://localhost:8000/docs`

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Food Scanning

- `POST /scan/` - Upload food image and get calorie prediction

### Workout Logging

- `POST /workout/` - Log a workout session

### History

- `GET /data/{date}` - Get all data for a specific date (YYYY-MM-DD)
- `GET /data/` - Get data for a date range

### Health

- `GET /health` - Health check endpoint

## Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "username": "username",
  "password": "$2b$12$...",
  "dailyCalorieGoal": 2000,
  "workoutStreak": 5,
  "createdAt": ISODate
}
```

### Daily Logs Collection
```json
{
  "_id": ObjectId,
  "user_id": "user_id",
  "date": "2024-02-23",
  "workouts": [
    {
      "id": "uuid",
      "exercise": "Bench Press",
      "sets": 4,
      "reps": 8,
      "weight": 185,
      "duration": 45,
      "date": "2024-02-23T10:30:00"
    }
  ],
  "nutrition": {
    "totalCalories": 2150,
    "items": [
      {
        "id": "uuid",
        "name": "apple",
        "calories": 52,
        "confidence": 0.95,
        "date": "2024-02-23T12:30:00"
      }
    ]
  },
  "createdAt": ISODate
}
```

## Authentication

All protected endpoints require a bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Food Classes Supported

The system supports 101 food classes with estimated calories per 100g:

- Fruits: apple, banana, orange, grapes, etc.
- Vegetables: carrot, broccoli, spinach, etc.
- Proteins: chicken, beef, fish, eggs, etc.
- Dairy: milk, yogurt, cheese, butter, etc.
- Grains: rice, bread, pasta, cereals, etc.
- And many more...

See `app/utils/food_mapping.py` for complete list.

## TFLite Model Setup

To use the AI image recognition:

1. Download a pre-trained food classification model:
   - TensorFlow Lite Food Classification Model
   - Or train your own using TensorFlow

2. Place the `.tflite` file in a `models/` directory:
   ```
   backend/models/food_model.tflite
   ```

3. The model will be loaded automatically on server startup

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | localhost |
| `JWT_SECRET` | Secret key for JWT signing | change-me |
| `JWT_ALGORITHM` | Algorithm for JWT | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | 30 |
| `PORT` | Server port | 8000 |
| `ENVIRONMENT` | dev/production mode | development |

## Deployment

### Render.com (Recommended for TFLite)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn app.main:app --worker-class uvicorn.workers.UvicornWorker`
5. Add environment variables in dashboard
6. Deploy

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Error Handling

All errors return standard HTTP status codes with descriptive messages:

- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid token)
- `404` - Not Found
- `500` - Internal Server Error

## Logging

The application logs all major events to stdout. Integrate with your monitoring service:

- Sentry for error tracking
- DataDog/New Relic for performance monitoring
- CloudWatch for AWS deployments

## Security Best Practices

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens for stateless auth
- ✅ CORS configured for frontend
- ✅ SQL injection protected (MongoDB with Pydantic)
- ✅ Rate limiting recommended (add in production)
- ✅ HTTPS enforced in production

## Support

For issues or questions, please check the API documentation at `/docs` or contact the development team.
