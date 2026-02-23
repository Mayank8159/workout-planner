import numpy as np
from io import BytesIO
from PIL import Image
from typing import Tuple


async def process_image(file_bytes: bytes) -> Tuple[np.ndarray, bool]:
    """
    Process uploaded image for TFLite model inference
    
    Args:
        file_bytes: Raw image bytes
    
    Returns:
        Tuple of (processed_image, success)
    """
    try:
        # Convert bytes to PIL image
        img = Image.open(BytesIO(file_bytes))
        img = img.convert('RGB')
        
        # Resize to 224x224 (standard for most food models)
        img_resized = img.resize((224, 224))
        
        # Convert to numpy array
        img_array = np.array(img_resized)
        
        # Normalize to [0, 1]
        img_normalized = img_array.astype(np.float32) / 255.0
        
        # Add batch dimension: (1, 224, 224, 3)
        img_batch = np.expand_dims(img_normalized, axis=0)
        
        return img_batch, True
    except Exception as e:
        print(f"Error processing image: {e}")
        return None, False


async def save_uploaded_file(file_bytes: bytes, filename: str) -> str:
    """Save uploaded file to temp location"""
    import tempfile
    import os
    
    temp_dir = tempfile.gettempdir()
    filepath = os.path.join(temp_dir, filename)
    
    with open(filepath, "wb") as f:
        f.write(file_bytes)
    
    return filepath
