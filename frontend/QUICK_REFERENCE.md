# Quick Reference: New Features

## 🎯 What's New

### 1. Calendar Tab 📅
**Access**: Bottom navigation → Calendar icon
**What it does**: 
- Pick any date
- See workouts for that date
- See food eaten that day
- Empty state if no data

**Key Code**: `screens/CalendarDashboard.tsx`

---

### 2. Profile Tab 👤
**Access**: Bottom navigation → Profile icon
**What it does**:
- Shows your username and email
- Calorie progress bar (today)
- Workout streak counter
- Logout button

**Key Code**: `screens/ProfileScreen.tsx`

---

### 3. Enhanced Scanner 📸
**Access**: Bottom navigation → Scanner icon
**New feature**: When food is detected:
1. App shows: "We found 'Chicken Salad' (~350 kcal). Add to today's log?"
2. You tap "Add"
3. Success alert appears IMMEDIATELY (optimistic)
4. App sends to backend in background

**Key Code**: `app/(tabs)/scanner.tsx` + `hooks/useFoodLogging.ts`

---

## 🔑 Key Hooks & Functions

### Access Current User
```typescript
import { useUser } from '@/context/UserContext';

const { user, isAuthenticated } = useUser();
// user = { id, username, email, dailyCalorieGoal, workoutStreak, ... }
```

### Log Food
```typescript
import { useFoodLogging } from '@/hooks/useFoodLogging';

const { logMealFromPrediction, addingFood } = useFoodLogging();

// Use in scanner:
await logMealFromPrediction({
  foodItem: "Chicken Salad",
  calories: 350,
  confidence: 0.92,
  date: new Date().toISOString()
});
```

### Fetch Data for Date
```typescript
import { dataAPI } from '@/utils/api';

const data = await dataAPI.getDailyData('2024-02-23');
// { workouts: [...], nutrition: { totalCalories, items: [...] } }
```

---

## 🔄 Data Flow Examples

### Calendar → Show Date Data
```
User taps Feb 23 on calendar
    ↓
selectedDate = '2024-02-23'
    ↓
useEffect calls fetchDailyData()
    ↓
API: GET /data/2024-02-23
    ↓
Response: { workouts: [...], nutrition: {...} }
    ↓
Display workouts + nutrition sections
```

### Scanner → Log Meal
```
User takes food photo
    ↓
AI predicts: "Chicken Salad, 350 kcal"
    ↓
Alert: "Add to today's log?" with Cancel/Add buttons
    ↓
User taps "Add"
    ↓
OPTIMISTIC: Show "Added!" immediately
    ↓
ASYNC: API POST /nutrition/meal-prediction
    ↓
Backend stores meal
```

### Profile → View Stats
```
Profile tab loads
    ↓
Fetch /users/me → Get user data
    ↓
Fetch /data/{today} → Get today's stats
    ↓
Calculate: caloriesConsumed / dailyCalorieGoal
    ↓
Draw progress bar with percentage
    ↓
Display workout count and streak
```

---

## 🔌 API Endpoints Required

Your backend needs:

```
GET  /users/me                           → User profile data
GET  /data/{date}                        → Workouts + nutrition for date
POST /nutrition/meal-prediction          → Save predicted meal
POST /workouts                           → Add workout
POST /nutrition/food                     → Add food item
DELETE /workouts/{id}                    → Remove workout
DELETE /nutrition/food/{id}              → Remove food item
```

See INTEGRATION_GUIDE.md for detailed endpoint specs.

---

## 📱 Tab Navigation Structure

```
┌─────────────────────────────────────┐
│  Bottom Tab Bar (always visible)    │
├─────────────────────────────────────┤
│                                     │
│  [📊]  📅  [🏋️]  📷  [👤]           │
│  Dash  Cal  Work  Scan  Profile     │
│                                     │
│  Tap any icon to switch screens     │
│                                     │
└─────────────────────────────────────┘
   ▲
   └─ New in this update: Calendar & Profile
```

---

## ⚙️ Environment Setup

```bash
# Installed packages
npm install react-native-calendars react-native-progress expo-secure-store

# .env file must have
EXPO_PUBLIC_API_URL=http://localhost:8000

# Then start the app
npm start
```

---

## 🔐 Authentication Flow

```
App launches
    ↓
UserProvider checks expo-secure-store for token
    ↓
If token found:
    ├─ Fetch /users/me
    ├─ Set user data
    └─ Show app (Calendar/Profile/etc)
    
If no token:
    └─ Show login screen (if you have one)

When user logs in:
    ├─ Get JWT from backend
    ├─ Store in expo-secure-store
    ├─ Call /users/me to get profile
    └─ Show app

When user logs out:
    ├─ Delete token from secure store
    ├─ Clear user state
    └─ Show login screen
```

---

## 💡 Tips for Extending

### Add a Statistics Screen
```typescript
// Create stats.tsx in app/(tabs)/
import { dataAPI } from '@/utils/api';

// Get data for date range
const workouts = await dataAPI.getWorkouts('2024-02-01');
const nutrition = await nutritionAPI.getDailyNutrition('2024-02-01');
```

### Add Settings Page
```typescript
// In ProfileScreen, add:
<TouchableOpacity onPress={() => navigation.navigate('settings')}>
  <Text>Settings</Text>
</TouchableOpacity>
```

### Customize Progress Bar
```typescript
// In ProfileScreen, change color:
<Progress.Bar
  progress={calorieProgress}
  color="#ff6b6b"  // Change from orange to red
/>
```

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "useUser is undefined" | Not wrapped with UserProvider | Check app/_layout.tsx has `<UserProvider>` |
| Calendar doesn't load | /data endpoint not implemented | Create endpoint on FastAPI backend |
| Meal not saving | nutritionAPI not implemented | Create POST /nutrition/meal-prediction |
| Progress bar stuck at 0% | dailyCalorieGoal not set | Check /users/me returns dailyCalorieGoal |
| Token not persisting | expo-secure-store issue | Run `npm install expo-secure-store` |

---

## 🔗 File Structure

```
frontend/
├── app/
│   ├── _layout.tsx                 ← NOW HAS UserProvider wrapper
│   └── (tabs)/
│       ├── _layout.tsx             ← Added Calendar & Profile tabs
│       ├── calendar.tsx            ← NEW wrapper for CalendarDashboard
│       ├── profile.tsx             ← NEW wrapper for ProfileScreen
│       ├── dashboard.tsx
│       ├── workout.tsx
│       └── scanner.tsx             ← ENHANCED with food logging
│
├── context/
│   └── UserContext.tsx             ← NEW global auth state
│
├── screens/
│   ├── CalendarDashboard.tsx      ← NEW calendar screen
│   └── ProfileScreen.tsx           ← NEW profile screen
│
├── hooks/
│   ├── useWorkoutManager.ts        ← EXISTING
│   └── useFoodLogging.ts           ← NEW custom hook
│
├── utils/
│   ├── api.ts                      ← ENHANCED with new endpoints
│   ├── secureStorage.ts            ← NEW token storage
│   └── ...
│
├── INTEGRATION_GUIDE.md            ← Detailed backend specs
├── FEATURES_SUMMARY.md             ← This file's fuller version
└── ...
```

---

## 🎮 Testing Flow

1. **Start app**: `npm start`
2. **Check tabs**: See all 5 icons at bottom
3. **Test Calendar**:
   - Tap calendar icon
   - Pick a date
   - (Should work if backend has /data endpoint)
4. **Test Profile**:
   - Tap profile icon
   - See your user info
   - See calorie progress
5. **Test Scanner**:
   - Take food photo
   - See "Add to log?" prompt
   - Tap "Add"
   - See "Added!" immediately

---

## 📞 Getting Help

- **File issues**: Check INTEGRATION_GUIDE.md
- **API problems**: Verify endpoint in FastAPI
- **State issues**: Check context/UserContext.tsx
- **Component issues**: Check screens/ directory

---

## 🚀 Ready to Build!

```bash
# Development
npm start

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for Web
npm run web
```

Enjoy your enhanced workout planner! 💪
