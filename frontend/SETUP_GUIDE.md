# Workout Planner App - React Native Expo Boilerplate

A comprehensive React Native Expo application for tracking workouts and detecting calories from food images using AI. Built with Expo, React Navigation, NativeWind (Tailwind CSS), and axios.

## Features

- **Dashboard Screen**: View workout history with stats (total workouts, volume, duration)
- **Workout Logger**: Log exercises with sets, reps, weight, and duration
- **Scanner (Calorie Detection)**: Capture food images and send to FastAPI backend for AI-powered calorie detection
- **Dark Theme UI**: Modern dark-themed interface with NativeWind styling
- **Navigation**: Bottom tab navigation with three main screens

## Project Structure

```
frontend/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation configuration
│   │   ├── dashboard.tsx         # Workout history and stats
│   │   ├── workout.tsx           # Exercise logging form
│   │   └── scanner.tsx           # Camera and calorie detection
│   ├── _layout.tsx              # Root layout with theming
│   └── modal.tsx                # Modal template
├── utils/
│   └── api.ts                   # API client and utilities
├── package.json                 # Dependencies
├── babel.config.js              # NativeWind configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── globals.css                  # Tailwind directives
└── .env.example                 # Environment variables template
```

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio or Xcode (for mobile testing)
- FastAPI backend running on `http://localhost:8000`

### Setup Steps

1. **Clone and navigate to the project**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   Or with legacy peer deps if you encounter conflicts:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Update API URL (if needed)**
   Edit `.env` and set `EXPO_PUBLIC_API_URL` to match your FastAPI backend URL:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:8000
   ```

## Running the App

### Development Server
```bash
npm start
```

### Run on Android
```bash
npm run android
# or
expo start --android
```

### Run on iOS
```bash
npm run ios
# or
expo start --ios
```

### Run on Web
```bash
npm run web
# or
expo start --web
```

## Dependencies

### Core
- **expo**: ~54.0.33 - Expo framework
- **react**: 19.1.0 - React library
- **react-native**: 0.81.5 - React Native
- **expo-router**: ~6.0.23 - File-based routing

### Navigation
- **@react-navigation/native**: ~7.1.8
- **@react-navigation/bottom-tabs**: ~7.4.0
- **react-native-screens**: ~4.16.0
- **react-native-safe-area-context**: ~5.6.0

### Camera & Image
- **expo-camera**: ~16.0.11 - Camera access
- **expo-image**: ~3.0.11 - Image component

### Styling
- **nativewind**: ^4.0.0 - Tailwind CSS for React Native
- **tailwindcss**: ^4.0.0 - Utility-first CSS
- **styled-components**: For dynamic styling

### API & Networking
- **axios**: ^1.6.5 - HTTP client for API calls

### UI
- **@expo/vector-icons**: ^15.0.3 - Material Icons
- **react-native-gesture-handler**: ~2.28.0 - Gesture handling
- **react-native-reanimated**: ~4.1.1 - Animations

## API Integration

The Scanner screen integrates with a FastAPI backend:

### Required Backend Endpoint

**POST** `/predict`
- **Content-Type**: `multipart/form-data`
- **Body**: Image file with key `image`
- **Response**:
  ```json
  {
    "food_item": "Pizza",
    "calories": 285,
    "confidence": 0.95
  }
  ```

### Example FastAPI Backend Code

```python
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/predict")
async def predict_calories(image: UploadFile = File(...)):
    # Process image and predict calories
    # Return food item, calories, and confidence
    return {
        "food_item": "detected_food",
        "calories": 100,
        "confidence": 0.85
    }
```

## Screen Details

### Dashboard
- Displays workout statistics (count, total volume, total duration)
- Shows workout history with exercise details
- Option to delete entries
- Responsive card-based layout

### Workout Logger
- Input fields for exercise name, sets, reps, weight, and duration
- Form validation with error handling
- Recently added workouts display
- Success notifications

### Scanner (Calorie Detection)
- Real-time camera preview
- Capture photos of food items
- Send to FastAPI backend for analysis
- Display detection results with confidence percentage
- Save or retake options

## Configuration Files

### tailwind.config.js
Customizes Tailwind CSS for React Native with NativeWind preset and custom color palette.

### babel.config.js
Configures Babel with NativeWind plugin for proper CSS transformation.

### .env.example
Template for environment variables. Copy to `.env` and customize.

## Styling with NativeWind

This project uses **NativeWind** for Tailwind CSS support in React Native.

### Example Usage
```jsx
<View className="flex-1 bg-gray-900 p-6">
  <Text className="text-white text-2xl font-bold mb-4">
    Workout History
  </Text>
  <TouchableOpacity className="bg-blue-600 rounded-lg py-3 px-4">
    <Text className="text-white font-bold text-center">Log Workout</Text>
  </TouchableOpacity>
</View>
```

### Available Utilities
- Colors: `gray`, `blue`, `green`, `red`, `purple`, `yellow`, etc.
- Sizes: `p-4`, `m-6`, `w-full`, `h-64`, etc.
- Flexbox: `flex-1`, `flex-row`, `items-center`, `justify-between`, etc.
- Text: `text-white`, `font-bold`, `text-2xl`, etc.

## Permissions

### Camera Permission (Android/iOS)

The app requests camera permission on first use. Add to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera."
        }
      ]
    ]
  }
}
```

## Development Tips

1. **Hot Reload**: Changes to code automatically reload in the running app
2. **Error Handling**: Check console logs in Expo CLI for debugging
3. **Network Requests**: Ensure FastAPI backend is running on the specified port
4. **Camera Testing**: Use physical device or Android emulator with camera support

## Troubleshooting

### Dependencies Installation Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install --legacy-peer-deps
```

### Camera Not Working
- Ensure camera permission is granted in device settings
- Check that `expo-camera` is properly installed
- Verify device has camera hardware

### API Connection Issues
- Ensure FastAPI backend is running on `http://localhost:8000`
- Check network connectivity between device and backend
- Verify `EXPO_PUBLIC_API_URL` in `.env` file

### NativeWind Styling Not Applied
- Rebuild the project after changes: `expo start --clear`
- Verify `babel.config.js` contains NativeWind preset
- Ensure CSS classes follow Tailwind naming conventions

## Production Build

### Build APK (Android)
```bash
eas build --platform android
```

### Build IPA (iOS)
```bash
eas build --platform ios
```

### Build Web
```bash
npm run web
# or
expo export
```

## Best Practices

1. **State Management**: Consider using Redux or Zustand for larger apps
2. **Error Handling**: Implement comprehensive error handling for API calls
3. **Form Validation**: Use libraries like react-hook-form for complex forms
4. **Testing**: Add Jest and React Native Testing Library tests
5. **Performance**: Optimize images and implement lazy loading
6. **Security**: Never hardcode API keys; use environment variables

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [NativeWind Documentation](https://www.nativewind.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Expo Camera](https://docs.expo.dev/cameras/camera-api/)
- [FastAPI Documentation](https://fastapi.tiangolo.com)

## License

MIT

## Support

For issues or questions, please create an issue in your repository or contact the development team.
