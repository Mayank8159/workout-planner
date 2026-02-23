# Installation & Setup Instructions

## System Requirements

- **Node.js**: 18.0.0 or higher ([Download](https://nodejs.org))
- **npm**: 9.0.0 or higher (comes with Node.js)
- **Operating System**: Windows, macOS, or Linux
- **Memory**: At least 4GB RAM
- **Disk Space**: At least 2GB free space

## Step-by-Step Installation

### 1. Install Global Dependencies

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Verify installation
expo --version
npx --version
```

### 2. Navigate to Project Directory

```bash
cd frontend
# or if in the parent directory:
cd "workout planner\frontend"
```

### 3. Install Project Dependencies

```bash
# Standard installation
npm install

# If you encounter peer dependency warnings, use:
npm install --legacy-peer-deps
```

Expected output should show something like:
```
added XXX packages in XX.XXs
```

### 4. Verify Installation

```bash
# Check Node version
node --version    # Should be >= 18.0.0

# Check npm version
npm --version     # Should be >= 9.0.0

# Check installed packages
npm list react react-native expo
```

### 5. Create Environment File

```bash
# Copy template to actual env file
cp .env.example .env

# On Windows, you can also use:
copy .env.example .env
```

Edit `.env` and ensure the API URL is correct:
```
EXPO_PUBLIC_API_URL=http://localhost:8000
```

## Running the Application

### Option 1: Using Expo CLI (Recommended)

```bash
# Start development server
npm start
# or
expo start

# Press 'a' for Android emulator
# Press 'i' for iOS simulator
# Press 'w' for web browser
# Scan QR code with Expo Go app on physical device
```

### Option 2: Direct Platform Commands

```bash
# Android
npm run android

# iOS (macOS only)
npm run ios

# Web Browser
npm run web
```

### Option 3: Using Expo Go App (Physical Device)

1. Download [Expo Go](https://expo.dev/expo-go)
   - iOS: App Store
   - Android: Google Play Store

2. Run `npm start` in terminal

3. Scan the QR code with Expo Go app

4. App will load on your device

## Troubleshooting Installation

### Issue: `npm ERR! code ERESOLVE`

**Solution:**
```bash
npm install --legacy-peer-deps
```

### Issue: Command not found: `expo`

**Solution:**
```bash
npm install -g expo-cli
# Restart terminal after installation
```

### Issue: Port 8081 already in use

**Solution:**
```bash
# Use different port
expo start --port 8090
```

### Issue: Cannot find module errors

**Solution:**
```bash
# Delete and reinstall
rm -rf node_modules
npm install --legacy-peer-deps
```

### Issue: Gradle sync failed (Android)

**Solution:**
```bash
# Clear Gradle cache
rm -rf ~/.gradle/caches
npm run android -- --clear
```

## Development Setup

### Installing VS Code Extensions

Click on Extensions (Ctrl+Shift+X / Cmd+Shift+X) and search for:

1. **Expo Tools** - Expo development tools
2. **ESLint** - Code quality
3. **Prettier** - Code formatter
4. **Tailwind CSS IntelliSense** - CSS utility suggestions
5. **React Native Tools** - React Native development

Or install from `extensions.json`:
```
File → Open Extensions (Ctrl+Shift+X) → 
Recommended
```

### Recommended VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Backend Setup (Optional but Recommended)

See [BACKEND_EXAMPLE.md](./BACKEND_EXAMPLE.md) for complete FastAPI backend setup.

Quick start:
```bash
# Create backend directory
mkdir -p ../backend
cd ../backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install FastAPI
pip install fastapi uvicorn python-multipart pillow

# Create main.py with the example code from BACKEND_EXAMPLE.md

# Run server
python main.py
# Server will run on http://localhost:8000
```

## Testing the Installation

### 1. Start Development Server
```bash
npm start
```

### 2. Open on Simulator/Emulator/Web
Press 'w' for web, 'a' for Android, 'i' for iOS

### 3. Navigate to Each Tab
- Dashboard tab should display empty state
- Workout tab should have form inputs
- Scanner tab should show camera interface

### 4. Test Workout Logger
1. Go to Workout tab
2. Fill in form: Exercise "Test", Sets 3, Reps 10, Weight 100, Duration 30
3. Click "Add Workout"
4. Should see success notification

### 5. Test Camera (if backend ready)
1. Go to Scanner tab
2. Grant camera permission if prompted
3. Capture image (in web, you can upload)
4. Should send to backend at http://localhost:8000/predict

## File Structure Verification

After installation, verify you have:
```
frontend/
├── node_modules/          ✅ Installed packages
├── app/
│   ├── (tabs)/
│   │   ├── dashboard.tsx ✅
│   │   ├── workout.tsx   ✅
│   │   ├── scanner.tsx   ✅
│   │   └── _layout.tsx   ✅
│   └── _layout.tsx       ✅
├── config/
│   └── app.config.ts     ✅
├── hooks/
│   └── useWorkoutManager.ts ✅
├── types/
│   └── index.ts          ✅
├── utils/
│   └── api.ts            ✅
├── .env                  ✅ (Created from .env.example)
├── babel.config.js       ✅
├── tailwind.config.js    ✅
├── globals.css           ✅
├── package.json          ✅
└── Documentation files   ✅
```

## Performance Optimization

### Clear Cache Periodically
```bash
npm start -- --clear
# or
expo start --clear
```

### Monitor Performance
```bash
# Check bundle size
npm run lint

# View dependency tree
npm ls
```

## Environment Variables

### Development
```
EXPO_PUBLIC_API_URL=http://localhost:8000
```

### Production
```
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
```

## Common Commands Reference

```bash
# Installation
npm install
npm install --legacy-peer-deps

# Running
npm start                    # Start dev server
npm run android              # Run on Android
npm run ios                  # Run on iOS
npm run web                  # Run on web

# Development
npm run lint                 # Check code
npm start -- --clear         # Clear cache

# Cleaning
rm -rf node_modules          # Delete dependencies
npm cache clean --force      # Clear npm cache
```

## Next Steps After Installation

1. **Start the development server**
   ```bash
   npm start
   ```

2. **Test the app** on your preferred platform

3. **Set up backend** (see BACKEND_EXAMPLE.md)

4. **Explore the code** in `app/(tabs)/`

5. **Customize** colors, fonts, and styling

6. **Read** PROJECT_SUMMARY.md for complete overview

## Getting Help

- **Expo Docs**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Axios**: https://axios-http.com

## Checklist Before Starting Development

- [ ] Node.js >= 18 installed
- [ ] npm packages installed (`npm install`)
- [ ] `.env` file created with API URL
- [ ] Development server runs (`npm start`)
- [ ] Can open app on device/emulator/web
- [ ] All three tabs load without errors
- [ ] Backend running (optional, for Scanner feature)
- [ ] VS Code extensions installed

---

**Installation Status**: Ready ✅  
**Last Updated**: February 2026  
**Version**: 1.0.0
