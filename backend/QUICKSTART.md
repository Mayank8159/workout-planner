# Quick Start Guide - Backend Setup

## For Windows Users

### 1. Prerequisites
- Python 3.11+ installed
- MongoDB Atlas account (or local MongoDB)
- Git installed

### 2. Clone & Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy example to .env
copy .env.example .env

# Edit .env with your MongoDB URI
# Use Notepad or VS Code
```

Sample `.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/workout_db?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-here-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
PORT=8000
ENVIRONMENT=development
```

### 4. Run Server

```bash
# Make sure venv is activated
python -m uvicorn app.main:app --reload --port 8000
```

Output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
✓ Connected to MongoDB
✓ TFLite model loaded successfully
```

### 5. Test API

Open browser: http://localhost:8000/docs

You'll see interactive Swagger UI where you can:
- Test all endpoints
- See request/response schemas
- Try authorization

## For macOS/Linux Users

### 1. Prerequisites
```bash
# Install Python
brew install python@3.11

# Verify installation
python3 --version
```

### 2. Clone & Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure

```bash
cp .env.example .env
# Edit .env with your preferred editor
nano .env  # or vim, etc.
```

### 4. Run

```bash
python -m uvicorn app.main:app --reload --port 8000
```

## With Docker

### 1. Build Image

```bash
docker build -t workout-api .
```

### 2. Run with Docker Compose

```bash
docker-compose up
```

This runs:
- MongoDB on port 27017
- FastAPI on port 8000

Access: http://localhost:8000/docs

## MongoDB Setup

### Option A: MongoDB Atlas (Recommended)

1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Add IP to whitelist
5. Paste into `MONGO_URI` in `.env`

### Option B: Local MongoDB

**Windows:**
- Download: https://www.mongodb.com/try/download/community
- Run installer
- MongoDB runs at `mongodb://localhost:27017`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo service mongodb start
```

## Verify Setup

### Test Endpoint

```bash
# Health check
curl http://localhost:8000/health

# Should return:
# {"status":"healthy","timestamp":"...","version":"1.0.0"}
```

### Register User

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPassword123",
    "dailyCalorieGoal": 2000
  }'
```

### View Swagger Docs

```
http://localhost:8000/docs
```

Click "Authorize" and paste your JWT token to test protected endpoints.

## Common Issues

### "ModuleNotFoundError: No module named 'fastapi'"
```bash
# Make sure venv is activated
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Then reinstall
pip install -r requirements.txt
```

### "MongoDB connection refused"
- Check `MONGO_URI` in `.env`
- Verify MongoDB is running
- Check IP whitelist (MongoDB Atlas)
- Try local MongoDB: `mongodb://localhost:27017`

### "Port 8000 already in use"
```bash
# Use different port
python -m uvicorn app.main:app --port 8001
```

### "TFLite model not found"
- This is okay - app runs in simulation mode
- To use real model: download TFLite model and place in `models/food_model.tflite`

## Next Steps

1. ✅ Frontend API_BASE_URL: `http://localhost:8000`
2. ✅ Test endpoints in `/docs`
3. ✅ Integrate with frontend
4. ✅ Deploy to Render when ready

## Troubleshooting

```bash
# Check Python version
python --version

# Check pip packages
pip list

# Check if server is running
curl http://localhost:8000/health

# View server logs
# Check terminal output for error messages

# Reset everything
rm -rf venv
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

## Getting Help

- API Docs: http://localhost:8000/docs
- OpenAPI Schema: http://localhost:8000/openapi.json
- README: See `README.md`
- API Integration: See `API_INTEGRATION.md`
- Deployment: See `DEPLOYMENT.md`

---

**Tip**: Bookmark http://localhost:8000/docs - you'll use it frequently!
