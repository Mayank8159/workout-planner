# 💪 Workout Planner - React Native Expo App

A comprehensive fitness tracking application built with React Native, Expo, and AI-powered calorie detection. Track your workouts, log exercises, and detect calories from food images using machine learning.

[![Expo](https://img.shields.io/badge/Expo-54.0-blue)](https://docs.expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-green)](https://reactnative.dev)
[![NativeWind](https://img.shields.io/badge/NativeWind-4.0-purple)](https://www.nativewind.dev)
[![License](https://img.shields.io/badge/License-MIT-orange)](LICENSE)

## ✨ Features

### 📊 Dashboard
- View comprehensive workout history
- Track statistics (total workouts, volume, duration)
- Delete individual workout entries
- Responsive cards with dark theme

### 💪 Workout Logger
- Log exercises with sets, reps, weight, and duration
- Real-time form validation
- Recently added workouts display
- Success notifications

### 📷 Calorie Scanner
- Capture food images with device camera
- AI-powered calorie detection via FastAPI backend
- Display detection results with confidence scores
- Save or retake functionality
- Works with `http://localhost:8000/predict` endpoint

### 🎨 Modern UI
- Dark theme design
- NativeWind (Tailwind CSS) styling
- Material Design icons
- Smooth animations and transitions
- Fully responsive layout

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation

```bash
# Navigate to project
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm start
```

### Run on Different Platforms

```bash
npm run android
npm run ios
npm run web
```

## 📁 Quick Project Tour

```
frontend/
├── app/(tabs)/              # Three main screens
│   ├── dashboard.tsx        # Workout history
│   ├── workout.tsx          # Exercise logging
│   ├── scanner.tsx          # Camera & AI detection
│   └── _layout.tsx          # Tab navigation
├── config/                  # App configuration
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript types
├── utils/                   # API utilities
└── Documentation files      # Setup guides
```

## 📚 Documentation

Start with one of these:

1. **[QUICK_START.md](./QUICK_START.md)** - Get running in 5 minutes
2. **[INSTALLATION.md](./INSTALLATION.md)** - Detailed setup steps
3. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project overview
4. **[API_INTEGRATION.md](./API_INTEGRATION.md)** - API documentation
5. **[BACKEND_EXAMPLE.md](./BACKEND_EXAMPLE.md)** - FastAPI backend setup

## 🎯 Main Features Explained

### Dashboard Screen
Displays your workout history with helpful statistics:
- Total workouts count
- Total weight lifted (volume)
- Total workout duration
- Sortable exercise list with delete option

### Workout Logger
Simple form to log your exercises:
- Exercise name
- Sets and reps
- Weight lifted
- Workout duration
- Real-time validation

### Scanner (Calorie Detection)
AI-powered food detection:
- Open device camera
- Capture food images
- Sends to FastAPI backend
- Displays detected food, calories, and confidence
- Save results to history or retake

## 🔌 API Integration

The Scanner tab integrates with a FastAPI backend:

```
POST /predict
Content-Type: multipart/form-data
Body: { image: <image_file> }

Response:
{
  "food_item": "Pizza",
  "calories": 285,
  "confidence": 0.92
}
```

Backend must run on `http://localhost:8000` (or configured URL in `.env`)

See [BACKEND_EXAMPLE.md](./BACKEND_EXAMPLE.md) for complete backend setup.

## 🎨 Styling with NativeWind

This app uses Tailwind CSS for React Native:

```jsx
<View className="flex-1 bg-gray-900 p-6">
  <Text className="text-white text-xl font-bold">Welcome</Text>
  <TouchableOpacity className="bg-blue-600 rounded-lg p-4 mt-4">
    <Text className="text-white text-center">Press Me</Text>
  </TouchableOpacity>
</View>
```

## 🔐 Configuration

### Environment Variables (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:8000
```

### Color Palette (Customizable)
```
Primary: #1f2937
Secondary: #3b82f6
Accent: #10b981
Danger: #ef4444
Warning: #f59e0b
```

## 📦 Key Dependencies

- **expo** - App framework
- **react-navigation** - Navigation
- **nativewind** - Tailwind CSS styling
- **expo-camera** - Camera access
- **axios** - HTTP client

## 🚀 Development Commands

```bash
npm start               # Start dev server
npm run android         # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web
npm run lint           # Check code quality
npm start -- --clear   # Clear cache
```

## 🐛 Troubleshooting

### npm install fails
```bash
npm install --legacy-peer-deps
```

### Camera not working
- Grant camera permission in device settings
- Restart the app
- Use a physical device (emulator has limited support)

### API connection error
- Ensure FastAPI backend is running
- Check IP/URL in `.env`
- Verify device can reach backend

### Styling not applied
```bash
npm start -- --clear
```

## 📖 Learn More

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [NativeWind Guide](https://www.nativewind.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 📝 License

MIT

## 🎉 Ready to Go!

1. Run `npm install`
2. Copy `.env.example` to `.env`
3. Run `npm start`
4. Choose your platform (Android/iOS/Web)
5. Start building! 🚀

For detailed setup, see [INSTALLATION.md](./INSTALLATION.md) or [QUICK_START.md](./QUICK_START.md)

