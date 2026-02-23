import os
import numpy as np
from datetime import datetime
from typing import Optional, Dict, Tuple
import logging

logger = logging.getLogger(__name__)


class FoodModelLoader:
    """
    Loads and manages Keras/TensorFlow H5 food detection models
    Supports multiple model architectures and custom trained models
    """
    
    def __init__(self):
        self.model: Optional[object] = None
        self.class_names: Optional[list] = None
        self.model_type: Optional[str] = None
        self.input_shape: Tuple[int, int, int] = (224, 224, 3)
        
    def load_model(self, model_path: str) -> bool:
        """
        Load a Keras H5 model
        
        Args:
            model_path: Path to .h5 model file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            import tensorflow as tf
            
            if not os.path.exists(model_path):
                logger.warning(f"Model not found at {model_path}")
                return False
                
            logger.info(f"Loading model from {model_path}...")
            self.model = tf.keras.models.load_model(model_path)
            
            # Get input shape from model
            input_layer_shape = self.model.input_shape
            self.input_shape = (input_layer_shape[1], input_layer_shape[2], 3)
            
            logger.info(f"Model loaded successfully!")
            logger.info(f"Input shape: {self.input_shape}")
            logger.info(f"Output shape: {self.model.output_shape}")
            
            return True
            
        except ImportError:
            logger.warning("TensorFlow not available. Model loading disabled.")
            return False
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            self.model = None
            return False
    
    def load_class_names(self, class_names_path: str) -> bool:
        """
        Load class names from a file
        
        Args:
            class_names_path: Path to file with class names (one per line)
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if not os.path.exists(class_names_path):
                logger.warning(f"Class names file not found at {class_names_path}")
                return False
                
            with open(class_names_path, 'r') as f:
                self.class_names = [line.strip() for line in f.readlines()]
                
            logger.info(f"Loaded {len(self.class_names)} class names")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load class names: {e}")
            return False
    
    def predict(self, image_array: np.ndarray, top_k: int = 5) -> Dict:
        """
        Make predictions on an image
        
        Args:
            image_array: Preprocessed image array (224, 224, 3)
            top_k: Return top K predictions
            
        Returns:
            Dictionary with predictions
        """
        if self.model is None:
            return {"error": "Model not loaded"}
            
        try:
            # Ensure image has batch dimension
            if len(image_array.shape) == 3:
                image_array = np.expand_dims(image_array, axis=0)
            
            # Make prediction
            predictions = self.model.predict(image_array, verbose=0)
            
            # Get top K predictions
            top_indices = np.argsort(predictions[0])[-top_k:][::-1]
            
            results = []
            for idx in top_indices:
                class_name = self.class_names[idx] if self.class_names else f"Class_{idx}"
                confidence = float(predictions[0][idx])
                
                results.append({
                    "class_index": int(idx),
                    "class_name": class_name,
                    "confidence": confidence
                })
            
            return {
                "predictions": results,
                "top_prediction": results[0] if results else None,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except ImportError:
            logger.error("TensorFlow not available for predictions")
            return {"error": "TensorFlow not available"}
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            return {"error": str(e)}
    
    def preprocess_image(self, image_array: np.ndarray) -> np.ndarray:
        """
        Preprocess image for model inference
        
        Args:
            image_array: Raw image array
            
        Returns:
            Preprocessed image ready for model
        """
        try:
            from PIL import Image
            
            # Convert to PIL if needed
            if isinstance(image_array, np.ndarray):
                if image_array.dtype == np.float32 or image_array.dtype == np.float64:
                    # Already float, just resize
                    img = Image.fromarray((image_array * 255).astype(np.uint8) if image_array.max() <= 1 else image_array.astype(np.uint8))
                else:
                    img = Image.fromarray(image_array.astype(np.uint8))
            else:
                img = image_array
            
            # Resize
            img_resized = img.resize((self.input_shape[0], self.input_shape[1]))
            
            # Convert to array
            resized_np = np.array(img_resized, dtype=np.float32)
            
            # Normalize to [0, 1]
            if resized_np.max() > 1.0:
                resized_np = resized_np / 255.0
            
            return resized_np
            
        except Exception as e:
            logger.error(f"Image preprocessing failed: {e}")
            # Return original image as fallback
            return image_array.astype(np.float32) / 255.0 if image_array.max() > 1 else image_array.astype(np.float32)
    
    def is_loaded(self) -> bool:
        """Check if model is currently loaded"""
        return self.model is not None


# Global model instance
food_model = FoodModelLoader()
