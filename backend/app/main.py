from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.models.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, scan, workout, history, health
from app.core.config import settings
from typing import Optional, Any


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
    Loads TFLite model at startup and cleans up at shutdown
    """
    # Startup
    print("🚀 Starting up application...")
    
    try:
        # Connect to MongoDB
        await connect_to_mongo()
        
        # Load TFLite model (optional, can be skipped in development)
        if not settings.SKIP_TFLITE:
            try:
                import tensorflow as tf
                model_path = "models/food_model.tflite"  # Path to your TFLite model
                app_state.model = tf.lite.Interpreter(model_path=model_path)
                app_state.model.allocate_tensors()
                app_state.input_details = app_state.model.get_input_details()
                app_state.output_details = app_state.model.get_output_details()
                print("✓ TFLite model loaded successfully")
            except FileNotFoundError:
                print("⚠ TFLite model not found. Running in simulation mode.")
                app_state.model = None
            except Exception as e:
                print(f"⚠ Failed to load TFLite model: {e}. Running without model.")
                app_state.model = None
        else:
            print("⚠ TFLite loading skipped (SKIP_TFLITE=true). Running in simulation mode.")
            app_state.model = None
        
        print("✓ Application startup complete")
    
    except Exception as e:
        print(f"❌ Startup failed: {e}")
        raise
    
    yield
    
    # Shutdown
    print("🛑 Shutting down application...")
    try:
        await close_mongo_connection()
        print("✓ Application shutdown complete")
    except Exception as e:
        print(f"❌ Shutdown error: {e}")


# Create FastAPI app with lifespan
app = FastAPI(
    title="Workout & Calorie Tracker API",
    description="Production-ready FastAPI backend for fitness tracking",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(health.router)
app.include_router(auth.router)
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",
    )
