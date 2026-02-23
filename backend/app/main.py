from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.models.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, scan, workout, history, health, users
from app.core.config import settings
from typing import Optional, Any
import logging

logger = logging.getLogger(__name__)


# Global state for TFLite model
class AppState:
    model: Optional[Any] = None
    input_details: Optional[list] = None
    output_details: Optional[list] = None


app_state = AppState()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler for startup and shutdown
    Loads H5 model at startup and cleans up at shutdown
    """
    # Startup
    logger.info("🚀 Starting up application...")
    
    try:
        # Connect to MongoDB
        await connect_to_mongo()
        
        # Load H5 Keras model for food detection
        if not settings.SKIP_TFLITE:
            try:
                from app.utils.model_loader import food_model
                
                # Try to load H5 model
                model_path = "models/food_model.h5"
                class_names_path = "models/food_classes.txt"
                
                if food_model.load_model(model_path):
                    if food_model.load_class_names(class_names_path):
                        logger.info("✓ H5 Keras model loaded successfully")
                        logger.info(f"  Input shape: {food_model.input_shape}")
                        logger.info(f"  Total classes: {len(food_model.class_names) if food_model.class_names else 'Unknown'}")
                    else:
                        logger.warning("⚠ Model loaded but class names not found. Using fallback mapping.")
                else:
                    logger.warning("⚠ H5 model not found. Running in simulation mode with extended food database (1000+ foods).")
            except ImportError:
                logger.warning("⚠ Model loader import failed. Running in simulation mode.")
            except Exception as e:
                logger.warning(f"⚠ Failed to load H5 model: {e}. Running in simulation mode.")
        else:
            logger.info("ℹ H5 model loading skipped (SKIP_TFLITE=true). Using simulation mode with extended database.")
        
        logger.info("✓ Application startup complete")
    
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down application...")
    try:
        await close_mongo_connection()
        logger.info("✓ Application shutdown complete")
    except Exception as e:
        logger.error(f"❌ Shutdown error: {e}")


# Create FastAPI app with lifespan
app = FastAPI(
    title="Workout & Calorie Tracker API",
    description="Production-ready FastAPI backend for fitness tracking",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware with explicit configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Include routes
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(scan.router)
app.include_router(workout.router)
app.include_router(history.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Workout & Calorie Tracker API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.options("/{full_path:path}")
async def options_handler():
    """Handle preflight OPTIONS requests"""
    return {"message": "OK"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",
    )
