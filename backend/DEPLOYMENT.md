# Deployment Guide

## Deployment Options

### Option 1: Render.com (Recommended for TFLite)

Render is perfect for TensorFlow Lite models due to better memory management.

#### Steps:

1. **Push code to GitHub**
   ```bash
   cd ..
   git add .
   git commit -m "Add backend"
   git push
   ```

2. **Create Render Web Service**
   - Go to https://render.com/
   - Click "Create" → "Web Service"
   - Connect your GitHub repo
   - Select the `backend` directory

3. **Configure Environment**
   - **Name**: `workout-api`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app.main:app --worker-class uvicorn.workers.UvicornWorker --workers 2 --timeout 60`
   - **Plan**: Free or Paid (depending on needs)

4. **Add Environment Variables**
   In Render dashboard, add these to "Environment":
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/workout_db
   JWT_SECRET=your-strong-secret-key-here
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   PORT=3000
   ENVIRONMENT=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Logs will show deployment progress
   - Get your API URL: `https://workout-api.onrender.com`

#### Render Advantages:
- ✅ Free tier available
- ✅ Auto-deploys on push
- ✅ Good TFLite support
- ✅ Built-in monitoring
- ✅ PostgreSQL add-on available
- ✅ Easy MongoDB Atlas integration

### Option 2: Railway (Alternative)

1. Go to https://railway.app/
2. Click "New Project" → "GitHub Repo"
3. Select your repository
4. Add MongoDB addon
5. Set environment variables
6. Deploy

### Option 3: AWS EC2

For more control and scalability:

```bash
# 1. SSH into EC2 instance
ssh -i key.pem ubuntu@instance.ip

# 2. Install dependencies
sudo apt update
sudo apt install python3.11 python3-pip supervisor nginx

# 3. Clone repository
git clone <your-repo-url>
cd backend

# 4. Create virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 5. Install Gunicorn
pip install gunicorn

# 6. Create Supervisor config
sudo nano /etc/supervisor/conf.d/workout_api.conf
```

Add to Supervisor config:
```ini
[program:workout_api]
directory=/home/ubuntu/backend
command=/home/ubuntu/backend/venv/bin/gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
autostart=true
autorestart=true
stderr_logfile=/var/log/workout_api.err.log
stdout_logfile=/var/log/workout_api.out.log
```

Then:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start workout_api
```

### Option 4: Docker on Any Server

```bash
# Build image
docker build -t workout-api .

# Run container
docker run -d \
  -p 8000:8000 \
  -e MONGO_URI="your-mongo-uri" \
  -e JWT_SECRET="your-secret" \
  --name workout-api \
  workout-api

# Or use docker-compose
docker-compose -f docker-compose.yml up -d
```

## Database Setup

### MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and organization
3. Create a new cluster
4. Get connection string
5. Update `MONGO_URI` in `.env`

Connection string format:
```
mongodb+srv://username:password@cluster.mongodb.net/workout_db?retryWrites=true&w=majority
```

### Local MongoDB

For development:
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows - download from https://www.mongodb.com/try/download/community

# Connection string
mongodb://localhost:27017/workout_db
```

## Production Checklist

- [ ] Set `ENVIRONMENT=production`
- [ ] Use strong `JWT_SECRET` (at least 32 characters)
- [ ] Enable HTTPS (automatic on Render)
- [ ] Set specific CORS origins (not `*`)
- [ ] Enable MongoDB authentication
- [ ] Set up backups for MongoDB
- [ ] Configure logging/monitoring
- [ ] Add rate limiting
- [ ] Monitor API performance
- [ ] Set up CI/CD pipeline
- [ ] Document API changes
- [ ] Plan for scaling

## Monitoring & Logging

### Sentry Integration

```python
import sentry_sdk

sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=1.0,
    environment="production"
)
```

### CloudWatch (AWS)

```python
import logging
import watchtower

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.addHandler(
    watchtower.CloudWatchLogHandler()
)
```

### Datadog

```bash
pip install datadog
DD_SERVICE=workout-api DD_AGENT_HOST=localhost flask-datadog
```

## Performance Optimization

### 1. Database Indexing
Already configured in `database.py`:
- `user_id + date` compound index for fast queries
- `user_id` index for user lookups
- `email` unique index

### 2. Connection Pooling
Motor automatically handles connection pooling.

### 3. Caching
Consider adding Redis for session caching:

```python
from redis import asyncio as aioredis

@app.on_event("startup")
async def init_cache():
    app.redis = await aioredis.from_url("redis://localhost")
```

### 4. Pagination
For large datasets:

```python
@router.get("/data/")
async def get_history_range(
    start_date: str,
    end_date: str,
    skip: int = 0,
    limit: int = 100,
    current_user: str = Depends(get_current_user),
):
    logs = await db["daily_logs"].find({...}).skip(skip).limit(limit).to_list(None)
```

## SSL Certificate Management

### Automatic (Render/Railway)
- ✅ Automatically provided and renewed

### Manual (AWS/DigitalOcean)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

## Backup Strategy

### MongoDB Atlas
- Automatic daily backups
- 30-day retention on free tier
- Full backup capability on paid tier

### Manual Backup
```bash
# Backup
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/workout_db" --out ./backup

# Restore
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/workout_db" ./backup
```

## Troubleshooting

### "Connection refused" to MongoDB
- Check connection string
- Verify IP whitelist in MongoDB Atlas
- Test locally first

### "Invalid token" errors
- Verify `JWT_SECRET` matches frontend
- Check token expiration time
- Confirm time sync across servers

### High memory usage
- Reduce TFLite model size
- Use TFLite Lite model format
- Implement connection pooling

### Slow API responses
- Check database indexes
- Monitor MongoDB performance
- Add Redis caching
- Enable response compression

## Cost Estimation

### Render (minimal)
- Web Service: Free or $7/month
- MongoDB Atlas: Free tier (512MB)
- Total: ~$7/month

### AWS
- EC2 t2.micro: Free tier eligible
- MongoDB Atlas: Free tier
- RDS (optional): ~$15/month
- Total: ~$15/month

### Production (High Traffic)
- Load balancer: $20/month
- Multiple API servers: $50/month
- MongoDB M2: $57/month
- Total: ~$150+/month

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Update frontend `API_BASE_URL`
3. ✅ Test all endpoints
4. ✅ Set up monitoring
5. ✅ Configure backups
6. ✅ Plan scaling strategy
