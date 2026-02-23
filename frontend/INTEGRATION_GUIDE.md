# Advanced Features Integration Guide

This guide explains how to use the three new core features integrated into your Expo workout planner:

## 1. Global State Management with UserProvider

### Overview
The `UserProvider` context manages authentication and user data globally across the entire app.

### Features
- ✅ Persistent JWT token storage using `expo-secure-store`
- ✅ Automatic token validation on app launch
- ✅ User session management (login/logout)
- ✅ Global user object accessible from any screen

### Usage in Components

```typescript
import { useUser } from '@/context/UserContext';

export default function YourComponent() {
  const { user, isAuthenticated, login, logout } = useUser();

  // user.id is available for API calls
  // isAuthenticated boolean for conditional rendering
  // login(token) after user signs in
  // logout() when user signs out
}
```

### How It Works
1. App starts → `UserProvider` checks `expo-secure-store` for token
2. If token exists → Fetches user data from `/users/me` endpoint
3. All screens automatically have access via `useUser()` hook
4. When user logs out → Token cleared and state reset

---

## 2. Calendar Dashboard with Date-Wise Data Fetching

### Overview
Located at: `screens/CalendarDashboard.tsx`
Accessed via: **Calendar Tab** in bottom navigation

### Features
- 📅 Interactive calendar with date selection
- 📊 Fetch workouts and nutrition data for any selected date
- 📈 Display Daily Workouts section
- 🥗 Display Nutrition Summary with total calories
- 🎯 Optimistic UI with empty state handling

### How It Works

```
User selects date on calendar
         ↓
selectedDate state updates
         ↓
useEffect triggers API call to /data/{selectedDate}
         ↓
Backend returns { workouts: [], nutrition: { totalCalories, items: [] } }
         ↓
Display results in two sections or show "No logs found" button
```

### API Endpoint Expected
```bash
GET /data/{date}?user_id={userId}

Response:
{
  "workouts": [
    {
      "id": "uuid",
      "exercise": "Bench Press",
      "sets": 4,
      "reps": 8,
      "weight": 185,
      "duration": 45,
      "date": "2024-02-23T10:30:00Z"
    }
  ],
  "nutrition": {
    "totalCalories": 1850,
    "items": [
      {
        "id": "uuid",
        "name": "Chicken Salad",
        "calories": 450,
        "date": "2024-02-23T12:00:00Z"
      }
    ]
  }
}
```

### Customizing the Calendar
Edit `screens/CalendarDashboard.tsx` to:
- Change date format: `new Date().toISOString().split('T')[0]`
- Add date filtering logic
- Customize calendar colors in theme object

---

## 3. User Profile & Interactive Management

### Overview
Located at: `screens/ProfileScreen.tsx`
Accessed via: **Profile Tab** in bottom navigation

### Features
- 👤 Display user metadata (username, email)
- 📏 Real-time calorie progress bar
- 🔥 Workout streak tracker
- 📊 Today's workout statistics
- 🚪 Logout functionality with confirmation

### How It Works

```
Profile Screen Loads
         ↓
Fetch user from /users/me
Fetch today's stats from /data/{today}
         ↓
Display:
  - Username, email, avatar
  - Calorie progress (Consumed vs Goal)
  - Workouts today count & duration
  - Workout streak (days)
```

### API Endpoints Expected
```bash
GET /users/me
Response:
{
  "id": "user_id",
  "username": "john_doe",
  "email": "john@example.com",
  "dailyCalorieGoal": 2000,
  "workoutStreak": 12,
  "createdAt": "2024-01-01T00:00:00Z"
}

GET /data/{today}
Response: (see Calendar Dashboard section)
```

### Progress Bar Calculation
- **Used**: `caloriesConsumed` (sum of all food items today)
- **Max**: `user.dailyCalorieGoal` (default: 2000 kcal)
- **Display**: Green bar (0-100%) + percentage text

---

## 4. Mealog from Food Scanner (Optimistic UI)

### Overview
Enhanced Scanner tab with meal logging integration

### User Flow
```
User takes food photo
         ↓
AI identifies food: "Chicken Salad, ~350 kcal"
         ↓
Alert: "We found 'Chicken Salad' (~350 kcal). Add to today's log?"
         ↓
User taps "Add"
         ↓
OPTIMISTIC UPDATE: Show success immediately
         ↓
ASYNC: Send meal data to backend
```

### Code Example
```typescript
const handleSaveResult = async () => {
  Alert.alert(
    "Add to Log?",
    `We found '${predictionResult.food_item}' (~${predictionResult.calories} kcal). 
    Add to today's log?`,
    [
      { text: "Cancel" },
      {
        text: "Add",
        onPress: async () => {
          // OPTIMISTIC: Show success immediately
          Alert.alert("Added", "Meal added to today's log!");

          // ASYNC: Send to backend
          await logMealFromPrediction({
            foodItem: prediction.food_item,
            calories: prediction.calories,
            confidence: prediction.confidence,
            date: new Date().toISOString()
          });
        }
      }
    ]
  );
}
```

### API Endpoint Expected
```bash
POST /nutrition/meal-prediction

Request Body:
{
  "foodItem": "Chicken Salad",
  "calories": 350,
  "confidence": 0.92,
  "date": "2024-02-23T12:30:00Z",
  "userId": "user_id"
}

Response:
{
  "id": "uuid",
  "name": "Chicken Salad",
  "calories": 350,
  "date": "2024-02-23T12:30:00Z"
}
```

---

## 5. Food Logging Hook (useFoodLogging)

### Overview
Custom hook for managing food and workout entries with optimistic updates

### Available Methods
```typescript
const {
  addingFood,        // boolean - true while adding
  addingWorkout,     // boolean - true while adding
  addFoodItem,       // (data) => Promise<FoodItem>
  addWorkoutEntry,   // (data) => Promise<WorkoutEntry>
  deleteFoodItem,    // (id) => Promise<void>
  deleteWorkoutEntry,// (id) => Promise<void>
  logMealFromPrediction // (data) => Promise<FoodItem>
} = useFoodLogging();
```

### Usage Example
```typescript
import { useFoodLogging } from '@/hooks/useFoodLogging';

export default function YourScreen() {
  const { addingFood, addFoodItem } = useFoodLogging();

  const handleAddFood = async () => {
    try {
      const result = await addFoodItem({
        name: "Apple",
        calories: 95,
        date: new Date().toISOString()
      });
      console.log("Added:", result);
    } catch (error) {
      console.error("Failed to add:", error);
    }
  };

  return (
    <TouchableOpacity
      disabled={addingFood}
      onPress={handleAddFood}
    >
      {addingFood ? <ActivityIndicator /> : <Text>Add</Text>}
    </TouchableOpacity>
  );
}
```

---

## 6. API Utilities Organization

### Available API Functions

```typescript
// User endpoints
import { userAPI } from '@/utils/api';
await userAPI.getProfile();
await userAPI.updateProfile(data);
await userAPI.login(email, password);
await userAPI.register(username, email, password);

// Data endpoints
import { dataAPI } from '@/utils/api';
await dataAPI.getDailyData(date);
await dataAPI.getWorkouts(date);
await dataAPI.addWorkout(data);
await dataAPI.deleteWorkout(id);

// Nutrition endpoints
import { nutritionAPI } from '@/utils/api';
await nutritionAPI.getDailyNutrition(date);
await nutritionAPI.addFoodItem(data);
await nutritionAPI.deleteFoodItem(id);
await nutritionAPI.logMealFromPrediction(data);

// Calorie detection
import { calorieDetectionAPI } from '@/utils/api';
await calorieDetectionAPI.predictMeal(imageUri);
```

### Automatic Token Injection
All API calls automatically include:
```javascript
headers: {
  Authorization: `Bearer ${token}`
}
```

The token is fetched from `expo-secure-store` before each request.

---

## 7. Implementation Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     APP START                               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
         ┌───────────────────┐
         │   UserProvider    │
         │  Check Token in   │
         │  SecureStore      │
         └─────────┬─────────┘
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
   [Token Found]          [No Token]
        │                     │
        ↓                     ↓
  [Auth Skip]          [Show Login]
  Fetch User              Screen
        │
        ↓
   ┌────────────────────────────────┐
   │    Navigation Stack Ready      │
   │  ┌─────────┬─────────┬─────┐   │
   │  │Calendar │Workout │Scanner   │
   │  │         │        │(+Profile)│
   │  └─────────┴─────────┴─────┘   │
   └────────────────────────────────┘
```

---

## 8. Testing Checklist

- [ ] **UserProvider**: App launches without token → shows login
- [ ] **UserProvider**: Token exists → skips login, fetches user
- [ ] **Calendar**: Select date → fetches data for that date
- [ ] **Calendar**: No data → shows "Add one?" button
- [ ] **Profile**: Displays user metadata correctly
- [ ] **Profile**: Calorie progress bar updates in real-time
- [ ] **Logout**: Clears token and returns to login
- [ ] **Scanner**: AI predicts food → shows confirmation
- [ ] **Scanner**: User confirms → optimistic update + async save
- [ ] **useFoodLogging**: addingFood state prevents double-clicks

---

## 9. Backend Integration Checklist

Your FastAPI backend needs these endpoints:

### Authentication
- `POST /users/register` - Create new user
- `POST /users/login` - Return JWT token
- `GET /users/me` - Return current user data (protected)
- `PUT /users/me` - Update user profile (protected)

### Data & Workouts
- `GET /data/{date}` - Return workouts + nutrition for date (protected)
- `GET /workouts/date/{date}` - Return workouts for date
- `POST /workouts` - Add new workout
- `DELETE /workouts/{id}` - Remove workout

### Nutrition
- `GET /nutrition/date/{date}` - Return nutrition data
- `POST /nutrition/food` - Add food item
- `DELETE /nutrition/food/{id}` - Remove food item
- `POST /nutrition/meal-prediction` - Log predicted meal from AI

### AI Prediction
- `POST /predict` - Accept image, return food prediction

All protected endpoints should verify JWT from `Authorization: Bearer {token}` header.

---

## 10. Environment Variables

Ensure your `.env` file has:
```
EXPO_PUBLIC_API_URL=http://localhost:8000
```

And update token storage keys if needed in:
- `utils/secureStorage.ts` - Contains `TOKEN_KEY`
- `context/UserContext.tsx` - References `userToken`

---

## Troubleshooting

### "useUser must be used within UserProvider"
- ✅ Error: Your component is not wrapped by `UserProvider`
- 🔧 Fix: Ensure root `_layout.tsx` has `<UserProvider>` wrapper

### Calendar doesn't fetch data
- ✅ Error: `selectedDate` not sent to backend correctly
- 🔧 Fix: Verify `/data/${date}` endpoint exists and returns proper format

### Logout not working
- ✅ Error: Token not removed from SecureStore
- 🔧 Fix: Check `secureStorage.removeToken()` in `context/UserContext.tsx`

### Scanner meal not logging
- ✅ Error: `/nutrition/meal-prediction` endpoint not implemented
- 🔧 Fix: Create endpoint on FastAPI backend to accept meal predictions

---

## Next Steps

1. **Implement backend endpoints** (see section 9)
2. **Test Token Flow**: Login → Profile → Logout
3. **Test Calendar**: Select dates → verify data fetching
4. **Test Scanner**: Take photo → confirm meal logging
5. **Monitor Loading States**: Ensure UI shows spinners during async operations

Enjoy your enhanced workout planner! 🚀
