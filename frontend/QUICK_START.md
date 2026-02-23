# Quick Start Guide for Workout Planner Frontend

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ and npm/yarn
- Expo CLI installed globally: `npm install -g expo-cli`
- A physical device or emulator for testing
- FastAPI backend running on `http://localhost:8000`

## 1. Initial Setup

### Install Dependencies
```bash
cd frontend
npm install
```

If you encounter peer dependency issues:
```bash
npm install --legacy-peer-deps
```

### Create Environment File
```bash
cp .env.example .env
```

## 2. Configure FastAPI Backend URL

Edit `.env` and ensure the API URL matches your backend:
```
EXPO_PUBLIC_API_URL=http://localhost:8000
```

## 3. Run the Development Server

### Start Expo
```bash
npm start
# or
expo start
```

### Run on Different Platforms

**Android Emulator:**
```bash
npm run android
# or press 'a' in the Expo CLI
```

**iOS Simulator:**
```bash
npm run ios
# or press 'i' in the Expo CLI
```

**Web Browser:**
```bash
npm run web
# or press 'w' in the Expo CLI
```

**Physical Device:**
- Download Expo Go app from App Store or Play Store
- Scan the QR code displayed in the terminal
- App will open in Expo Go

## 4. Features Overview

### Dashboard Tab 🏠
- View workout history
- See statistics (total workouts, volume, duration)
- Delete individual workout entries
- Data persists during session (stored in state)

### Workout Tab 💪
- Log new exercises
- Enter sets, reps, weight, and duration
- Form validation included
- View recently added workouts
- All entries validated before submission

### Scanner Tab 📷
- Open camera to capture food photos
- Send images to FastAPI backend for analysis
- View detection results (food item, calories, confidence)
- Save results or retake photos
- Requires camera permissions

## 5. Development Tips

### Hot Reload
- Changes to code automatically reload in the running app
- Modify files and save to see changes instantly

### Debugging
- Open Expo DevTools by pressing `j` in the terminal
- View console logs for error messages
- Use React DevTools for component inspection

### Network Issues
- Ensure FastAPI backend is running: `python main.py` or `uvicorn main:app --reload`
- Check that device can reach backend URL
- Verify firewall settings allow connections

### Camera Testing
- Use physical device for best results
- Android emulator needs camera support enabled
- iOS simulator has simulated camera

## 6. Project Structure Summary

```
frontend/
├── app/
│   └── (tabs)/              # Tab-based screens
│       ├── dashboard.tsx    # Workout history
│       ├── workout.tsx      # Exercise logging
│       └── scanner.tsx      # Calorie detection
├── **Your custom files**
├── config/                  # App configuration
├── types/                   # TypeScript types
├── utils/                   # API utilities
├── tailwind.config.js       # Tailwind CSS config
├── babel.config.js          # Babel with NativeWind
└── package.json             # Dependencies
```

## 7. Common Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Lint code
npm run lint

# Clear cache and restart
npm start -- --clear
```

## 8. Troubleshooting

### Blank Screen
- Clear cache: `npm start --clear`
- Restart device
- Ensure all dependencies installed: `npm install`

### Camera Permission Denied
- Check device settings → Apps → Permissions → Camera
- Grant camera permission explicitly
- Restart app after granting permission

### API Connection Errors
- Ensure FastAPI backend is running
- Check `EXPO_PUBLIC_API_URL` in `.env`
- Verify device IP and backend IP match (use `localhost` for local testing)
- Check firewall settings

### Styling Not Applied
- Rebuild with: `npm start --clear`
- Verify NativeWind is in `babel.config.js`
- Clear node_modules and reinstall if needed

### Installation Failing
- Delete `node_modules` folder: `rm -rf node_modules`
- Clear npm cache: `npm cache clean --force`
- Reinstall: `npm install --legacy-peer-deps`

## 9. Next Steps

- Integrate state management (Redux, Zustand, Context API)
- Add data persistence with AsyncStorage or SQLite
- Implement user authentication
- Set up push notifications
- Add unit and integration tests
- Optimize performance and bundle size

## 10. Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [NativeWind Guide](https://www.nativewind.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)

## Support

For detailed setup instructions, see `SETUP_GUIDE.md` in the root directory.
