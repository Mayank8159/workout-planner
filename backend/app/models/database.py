from motor.motor_asyncio import AsyncClient, AsyncDatabase
from app.core.config import settings
from typing import Optional

# Global database client
client: Optional[AsyncClient] = None
db: Optional[AsyncDatabase] = None


async def connect_to_mongo():
    """Connect to MongoDB using Motor"""
    global client, db
    client = AsyncClient(settings.MONGO_URI)
    db = client.get_database()
    
    # Create indexes for better performance
    daily_logs = db["daily_logs"]
    await daily_logs.create_index([("user_id", 1), ("date", 1)])
    await daily_logs.create_index([("user_id", 1)])
    
    users = db["users"]
    await users.create_index([("email", 1)], unique=True)
    
    print("✓ Connected to MongoDB")


async def close_mongo_connection():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("✓ Disconnected from MongoDB")


def get_database() -> AsyncDatabase:
    """Get the database instance"""
    return db
