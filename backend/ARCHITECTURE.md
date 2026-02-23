# Backend Architecture Overview

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Main FastAPI application
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py           # Environment configuration
│   │   └── security.py         # JWT and password hashing
│   ├── models/
│   │   ├── __init__.py
│   │   ├── database.py         # MongoDB async connection (Motor)
│   │   └── schemas.py          # Pydantic validation schemas
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py             # Register & Login endpoints
│   │   ├── scan.py             # Food image scanning AI
│   │   ├── workout.py          # Workout logging
│   │   ├── history.py          # Get date-wise data
│   │   └── health.py           # Health check
│   └── utils/
│       ├── __init__.py
│       ├── auth.py             # JWT dependency
│       ├── image_processor.py  # Image resizing & normalization
│       └── food_mapping.py     # 101 food classes & calories
├── requirements.txt            # Python dependencies
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose setup
├── setup.sh                   # Setup script
├── README.md                  # Main documentation
├── QUICKSTART.md              # Quick start guide
├── API_INTEGRATION.md         # Frontend integration guide
└── DEPLOYMENT.md              # Deployment instructions
```

## Key Components

### 1. Main Application (`app/main.py`)

**Purpose**: FastAPI application with lifespan management

**Features**:
- ✅ Lifespan event handler (startup/shutdown)
- ✅ TensorFlow Lite model loading
- ✅ MongoDB connection management
- ✅ CORS middleware configuration
- ✅ Route registration
- ✅ Health check endpoint

**Key Functions**:
- `lifespan()` - Async context manager for app lifecycle
- `connect_to_mongo()` - Initialize MongoDB connection
- `close_mongo_connection()` - Cleanup on shutdown

### 2. Configuration (`app/core/config.py`)

**Purpose**: Environment variable management

**Settings**:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for token signing
- `JWT_ALGORITHM` - Algorithm (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token lifetime
- `PORT` - Server port
- `ENVIRONMENT` - dev/production mode

### 3. Security (`app/core/security.py`)

**Purpose**: Authentication and password management

**Functions**:
- `hash_password()` - Bcrypt password hashing
- `verify_password()` - Verify password against hash
- `create_access_token()` - Generate JWT token
- `verify_token()` - Validate JWT token

**Algorithm**: HS256 (HMAC-SHA256)

### 4. Database (`app/models/database.py`)

**Purpose**: Async MongoDB connection with Motor

**Features**:
- ✅ Motor AsyncIO driver
- ✅ Automatic index creation
- ✅ Compound indexes for performance
- ✅ Connection pooling

**Indexes**:
```
daily_logs: (user_id, date) - composite for fast queries
users: email - unique for authentication
```

**Collections**:
- `users` - User accounts
- `daily_logs` - Single document per user per day

### 5. Schemas (`app/models/schemas.py`)

**Purpose**: Pydantic validation models

**Key Models**:
- `UserRegisterSchema` - Registration request
- `UserLoginSchema` - Login request
- `UserResponseSchema` - User data response
- `TokenSchema` - JWT token response
- `WorkoutLogSchema` - Workout data
- `CalorieLogSchema` - Calorie entry
- `DailyLogSchema` - Daily aggregated data
- `FoodPredictionSchema` - AI prediction response

**Benefits**:
- JSON validation
- Type safety
- OpenAPI documentation
- MongoDB `_id` to `id` conversion

### 6. Routes

#### Auth (`app/routes/auth.py`)
- `POST /auth/register` - Create new user
- `POST /auth/login` - Authenticate user

#### Scan (`app/routes/scan.py`)
- `POST /scan/` - Upload and analyze food image

Features:
- Image processing (224x224 resize, normalization)
- TFLite model inference
- Calorie lookup
- Automatic daily log entry

#### Workout (`app/routes/workout.py`)
- `POST /workout/` - Log a workout session

Saves to daily_logs with:
- Exercise details
- Sets, reps, weight
- Duration
- Timestamp

#### History (`app/routes/history.py`)
- `GET /data/{date}` - Get single day data
- `GET /data/` - Get date range

Returns:
- All workouts for date
- All food items with total calories
- Metadata

#### Health (`app/routes/health.py`)
- `GET /health` - Availability check

### 7. Utilities

#### Image Processor (`app/utils/image_processor.py`)

**Functions**:
- `process_image()` - Process uploaded image for AI
  - Decode bytes → OpenCV image
  - Resize to 224x224
  - Convert BGR → RGB
  - Normalize to [0, 1]
  - Add batch dimension
  
- `save_uploaded_file()` - Save temp file

#### Food Mapping (`app/utils/food_mapping.py`)

**Features**:
- 101 food classes with calories
- Calorie lookup by food name
- Per 100g estimation
- Default fallback value

**Sample Foods**:
- Fruits: apple (52 kcal), banana (89 kcal)
- Vegetables: carrot (41 kcal), broccoli (34 kcal)
- Proteins: chicken (165 kcal), beef (250 kcal)
- And 88 more...

#### Auth Dependency (`app/utils/auth.py`)

**Function**:
- `get_current_user()` - FastAPI dependency
  - Extracts JWT from Authorization header
  - Validates token
  - Returns user_id for protected routes

## Data Flow

### User Registration
```
Frontend (register form)
    ↓
POST /auth/register
    ↓
Pydantic validation
    ↓
Check if email exists
    ↓
Hash password (bcrypt)
    ↓
Insert user to MongoDB
    ↓
Generate JWT token
    ↓
Return token + user data
    ↓
Frontend (save token to secure storage)
```

### Food Scanning
```
Frontend (capture photo)
    ↓
POST /scan/ (with Authorization header)
    ↓
Extract user_id from JWT
    ↓
Process image (224x224, normalize)
    ↓
Run TFLite inference
    ↓
Get top prediction (food name, confidence)
    ↓
Lookup calories in food_mapping
    ↓
Update daily_logs (create or append)
    ↓
Return prediction
    ↓
Frontend (save to local list)
```

### Get Daily Data
```
Frontend (request data for date)
    ↓
GET /data/2024-02-23 (with JWT)
    ↓
Verify JWT, extract user_id
    ↓
Query daily_logs: {user_id, date}
    ↓
Return workouts + nutrition
    ↓
Frontend (display on calendar)
```

## Database Schema

### Users Collection
```json
{
  "_id": ObjectId(),
  "email": "user@example.com",
  "username": "john_doe",
  "password": "$2b$12$...",
  "dailyCalorieGoal": 2000,
  "workoutStreak": 5,
  "createdAt": ISODate(),
  "updatedAt": ISODate()
}
```

### Daily Logs Collection
```json
{
  "_id": ObjectId(),
  "user_id": "507f1f77bcf86cd799439011",
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
  "createdAt": ISODate(),
  "updatedAt": ISODate()
}
```

## Indexes

Created automatically on startup:

```javascript
// daily_logs collection
db.daily_logs.createIndex({user_id: 1, date: 1})  // Compound index
db.daily_logs.createIndex({user_id: 1})           // User lookups

// users collection
db.users.createIndex({email: 1}, {unique: true})  // Unique email
```

## Security Features

### Authentication
- ✅ **JWT Tokens** - Stateless, time-limited
- ✅ **Bcrypt Hashing** - Passwords salted and hashed
- ✅ **Bearer Tokens** - HTTP Authorization header
- ✅ **Token Expiration** - Configurable (default 30 min)

### Database
- ✅ **Connection Pooling** - Async Motor driver
- ✅ **Indexes** - Fast queries by user
- ✅ **Unique Constraints** - Email uniqueness
- ✅ **Prepared Statements** - Prevent injection

### API
- ✅ **CORS Enabled** - React Native frontend compatible
- ✅ **Rate Limiting** - Configurable (production)
- ✅ **Input Validation** - Pydantic schemas
- ✅ **Error Handling** - Standard HTTP status codes

## Performance Optimizations

### Database Layer
1. **Compound Indexes** - (user_id, date) for fast daily fetches
2. **Connection Pooling** - Motor handles automatically
3. **Single Document per Day** - Fewer queries

### API Layer
1. **Async/Await** - Non-blocking I/O
2. **Lazy Loading** - Dependencies only when needed
3. **Compression** - GZIP responses
4. **Caching** - Plans for Redis integration

### Image Processing
1. **OpenCV** - Efficient image operations
2. **TFLite** - Lightweight inference (used on frontend)
3. **Batch Processing** - Handle multiple images

## Monitoring & Logging

### Built-in Monitoring
- Health check endpoint
- Startup/shutdown logs
- Error logging to stdout

### Integration Points
- **Sentry** - Error tracking
- **DataDog** - Performance monitoring
- **CloudWatch** - AWS logging
- **Prometheus** - Metrics (can be added)

## Error Handling

All endpoints return standard HTTP responses:

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success | User logged in |
| 201 | Created | New account created |
| 400 | Bad Request | Invalid date format |
| 401 | Unauthorized | Invalid token |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Database error |

## Scaling Considerations

### Current Setup (Single Server)
- ✅ Good for <10k users
- ✅ Simple deployment
- ✅ MongoDB Atlas free tier

### Medium Scale (10k-100k users)
- Add Redis for caching
- Horizontal scaling with load balancer
- Database read replicas

### Large Scale (>100k users)
- Microservices architecture
- Message queues (RabbitMQ/Kafka)
- Database sharding
- CDN for static files
- Elasticsearch for search

## Files You'll Edit Most Often

1. **`.env`** - Environment variables
2. **`app/utils/food_mapping.py`** - Add/update food items
3. **`app/main.py`** - Configuration updates
4. **`requirements.txt`** - Add dependencies

## Common Tasks

### Add New Endpoint
1. Create function in `app/routes/`
2. Add route with `@router.get/post/etc()`
3. Include router in `main.py`

### Add New Food Item
1. Update `food_mapping.py`
2. Add to `FOOD_CALORIE_MAP` dict

### Change Token Duration
1. Edit `ACCESS_TOKEN_EXPIRE_MINUTES` in `.env`

### Enable Rate Limiting
1. Install `slowapi`: `pip install slowapi`
2. Add limiter to routes

### Add Logging Service
1. Import service (Sentry/DataDog)
2. Initialize in `main.py` startup

---

**Next**: See `QUICKSTART.md` to get the server running locally!
