from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
from typing import Optional

# Global database client
client: Optional[AsyncIOMotorClient] = None
db: Optional[AsyncIOMotorDatabase] = None


async def connect_to_mongo():
    """Connect to MongoDB using Motor"""
    global client, db
    try:
        client = AsyncIOMotorClient(settings.MONGO_URI)
        db = client.get_database()
        
        # Create indexes for better performance
        daily_logs = db["daily_logs"]
        await daily_logs.create_index([("user_id", 1), ("date", 1)])
        await daily_logs.create_index([("user_id", 1)])
        
        users = db["users"]
        await users.create_index([("email", 1)], unique=True)
        
        print("✓ Connected to MongoDB")
    except Exception as e:
        print(f"⚠ MongoDB connection failed: {e}. Running in simulation mode.")
        client = None
        db = None


async def close_mongo_connection():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("✓ Disconnected from MongoDB")


def get_database() -> AsyncIOMotorDatabase:
    """Get the database instance"""
    return db
