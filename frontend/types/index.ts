// Workout related types
export interface WorkoutEntry {
  id: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
}

// Calorie Detection types
export interface PredictionResult {
  food_item: string;
  calories: number;
  confidence: number;
  timestamp?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Form types
export interface WorkoutForm {
  exercise: string;
  sets: string;
  reps: string;
  weight: string;
  duration: string;
}

// Camera related types
export interface CameraSettings {
  quality: number;
  base64: boolean;
  mimeType?: string;
}
