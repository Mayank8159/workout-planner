import os
import numpy as np
from datetime import datetime
from typing import Optional, Dict, Tuple
import logging

logger = logging.getLogger(__name__)


class FoodModelLoader:
    """
    Loads and manages TensorFlow Lite food detection models
    Uses lightweight TFLite runtime instead of full TensorFlow
    Perfect for deployment on resource-constrained servers
    """
    
    def __init__(self):
        self.interpreter: Optional[object] = None
        self.input_details: Optional[list] = None
        self.output_details: Optional[list] = None
        self.class_names: Optional[list] = None
        self.model_type: str = "tflite"
        self.input_shape: Tuple[int, int, int] = (224, 224, 3)
        
    def load_model(self, model_path: str) -> bool:
        """
        Load a TensorFlow Lite model
        
        Args:
            model_path: Path to .tflite model file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Try tflite_runtime first (lightweight, ~1MB)
            try:
                import tflite_runtime.interpreter as tflite
                logger.info("Using tflite_runtime (lightweight)")
            except ImportError:
                # Fallback to tensorflow.lite (if full TF is installed)
                import tensorflow as tf
                tflite = tf.lite
                logger.info("Using tensorflow.lite")
            
            if not os.path.exists(model_path):
                logger.warning(f"Model not found at {model_path}")
                return False
                
            logger.info(f"Loading TFLite model from {model_path}...")
            
            # Load TFLite model
            self.interpreter = tflite.Interpreter(model_path=model_path)
            self.interpreter.allocate_tensors()
            
            # Get input and output details
            self.input_details = self.interpreter.get_input_details()
            self.output_details = self.interpreter.get_output_details()
            
            # Get input shape
            input_shape = self.input_details[0]['shape']
            self.input_shape = (int(input_shape[1]), int(input_shape[2]), 3)
            
            logger.info(f"✅ TFLite model loaded successfully!")
            logger.info(f"   Input shape: {self.input_shape}")
            logger.info(f"   Input dtype: {self.input_details[0]['dtype']}")
            logger.info(f"   Output shape: {self.output_details[0]['shape']}")
            
            return True
            
        except ImportError:
            logger.warning("TFLite runtime not available. Model loading disabled.")
            return False
        except Exception as e:
            logger.error(f"Failed to load TFLite model: {e}")
            self.interpreter = None
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
        Make predictions on an image using TFLite interpreter
        
        Args:
            image_array: Preprocessed image array (224, 224, 3)
            top_k: Return top K predictions
            
        Returns:
            Dictionary with predictions
        """
        if self.interpreter is None:
            return {"error": "Model not loaded"}
            
        try:
            # Ensure image has batch dimension
            if len(image_array.shape) == 3:
                image_array = np.expand_dims(image_array, axis=0)
            
            # Convert to correct dtype (TFLite usually expects float32)
            image_array = image_array.astype(self.input_details[0]['dtype'])
            
            # Set input tensor
            self.interpreter.set_tensor(self.input_details[0]['index'], image_array)
            
            # Run inference
            self.interpreter.invoke()
            
            # Get output tensor
            predictions = self.interpreter.get_tensor(self.output_details[0]['index'])[0]
            
            # Ensure top_k doesn't exceed available classes
            num_classes = len(predictions)
            top_k = min(top_k, num_classes)
            
            # Get top K predictions
            top_indices = np.argsort(predictions)[-top_k:][::-1]
            
            results = []
            for idx in top_indices:
                # Make sure idx is within bounds
                if idx >= len(predictions):
                    continue
                    
                class_name = self.class_names[idx] if (self.class_names and idx < len(self.class_names)) else f"Class_{idx}"
                confidence = float(predictions[idx])
                
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
            
        except Exception as e:
            logger.error(f"TFLite prediction failed: {e}")
            import traceback
            logger.error(traceback.format_exc())
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
        """Check if TFLite model is currently loaded"""
        return self.interpreter is not None


# Global model instance
food_model = FoodModelLoader()
