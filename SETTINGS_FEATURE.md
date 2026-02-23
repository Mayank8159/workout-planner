# Settings Feature Documentation

## Overview

A professional Settings page has been implemented for users to customize their personal information and nutrition goals. The feature is fully integrated with the backend and dashboard.

## Features Implemented

### 1. **Frontend - Settings Page** (`frontend/app/settings.tsx`)

**Location:** `/settings` route

**Design:**
- Professional glassmorphism styling matching the app theme
- Dark mode slate background with gradient accents
- Color-coded input fields with icons
- Keyboard protection (KeyboardAvoidingView with scroll)

**Editable Fields:**
- **Full Name** (Blue icon: person)
- **Daily Calorie Goal** (Purple icon: local-fire-department)
- **Protein Goal in grams** (Green icon: restaurant)
- **Carbs Goal in grams** (Orange icon: rice-bowl)
- **Fiber Goal in grams** (Blue icon: local-dining)

**Functionality:**
- Form validation for all required fields
- Loading state while saving
- Success/error messages with visual feedback
- Auto-redirect to profile after successful save
- Cancel button to discard changes

### 2. **Backend Updates**

#### Schema Updates (`backend/app/models/schemas.py`)

**UserResponseSchema** - Extended to include nutrition goals:
```python
- dailyCalorieGoal: int = 2000
- proteinGoal: int = 150
- carbsGoal: int = 200
- fiberGoal: int = 25
```

**UserSettingsUpdateSchema** - New schema for settings updates:
```python
- username: Optional[str]
- dailyCalorieGoal: Optional[int]
- proteinGoal: Optional[int]
- carbsGoal: Optional[int]
- fiberGoal: Optional[int]
```

#### API Endpoints (`backend/app/routes/users.py`)

**GET /users/me**
- Returns user profile with extended nutrition goals
- Includes default values if not set

**PUT /users/settings** (NEW)
- Updates user settings for name and nutrition goals
- Only updates provided fields (partial updates supported)
- Returns updated user profile
- Validates all inputs before updating

### 3. **Frontend - API Integration** (`frontend/utils/api.ts`)

**New Method:**
```typescript
dataAPI.updateUserSettings(settingsData: {
  username?: string;
  dailyCalorieGoal?: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fiberGoal?: number;
})
```

### 4. **Frontend - User Context** (`frontend/context/UserContext.tsx`)

**User Interface Extended:**
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  dailyCalorieGoal?: number;     // NEW
  proteinGoal?: number;          // NEW
  carbsGoal?: number;            // NEW
  fiberGoal?: number;            // NEW
  workoutStreak?: number;
  createdAt?: string;
}
```

**Updates propagated to:**
- `initializeAuth()` - Initial token validation
- `login()` - Login response parsing
- `register()` - Registration response parsing
- `refreshUser()` - Refresh user data

### 5. **Frontend - Dashboard Enhancement** (`frontend/app/(tabs)/dashboard.tsx`)

**Display Updates:**
- Calorie goal display with progress bar (existing)
- **NEW:** Carbs goal with progress bar
- **NEW:** Protein goal with progress bar
- **NEW:** Fat goal with progress bar (70g default)
- **NEW:** Fiber goal with progress bar

**Progress Bar Features:**
- Color-coded (Blue, Purple, Orange, Green)
- Shows current/goal values
- Shows percentage progress
- Caps at 100% visually

### 6. **Profile Screen Update** (`frontend/app/(tabs)/profile.tsx`)

**Navigation:**
- Settings button now functional
- Routes to `/settings` page
- Professional icon and styling

## User Flow

```
Profile Screen
    ↓
    [Settings Button]
    ↓
Settings Page
    ↓
Edit Fields → Save Settings
    ↓
API Call: PUT /users/settings
    ↓
Validation → Database Update → Success
    ↓
Redirect to Profile
    ↓
Dashboard displays updated goals
```

## Default Values

If user never sets goals, defaults are:
- **Daily Calories:** 2000 kcal
- **Protein:** 150g
- **Carbs:** 200g
- **Fiber:** 25g
- **Fat:** 70g (hardcoded on dashboard)

## Database Storage

Settings are stored in MongoDB `users` collection:

```json
{
  "_id": ObjectId(...),
  "email": "user@example.com",
  "username": "John Doe",
  "password": "hashed...",
  "dailyCalorieGoal": 2200,
  "proteinGoal": 150,
  "carbsGoal": 220,
  "fiberGoal": 30,
  "workoutStreak": 5,
  "createdAt": "2024-02-24T..."
}
```

## Error Handling

**Frontend Validation:**
- Empty fields detection
- Non-positive number validation
- Real-time error display

**Backend Validation:**
- HTTP 400 if no fields to update
- HTTP 401 if not authenticated
- HTTP 404 if user not found
- HTTP 500 for server errors

## Design System Consistency

✅ Dark theme (slate-900, slate-800)
✅ Glassmorphism effects (blurs, gradients)
✅ Color-coded sections (Blue, Purple, Green, Orange)
✅ Professional spacing and typography
✅ Consistent iconography (MaterialIcons)
✅ Keyboard protection on mobile
✅ Responsive layouts

## Security Features

- JWT token validation on all requests
- User can only update their own settings
- Input sanitization on backend
- Database querying by authenticated user ID only

## Testing Checklist

- [ ] Settings page loads without errors
- [ ] All input fields accept numeric values
- [ ] Save button shows loading state
- [ ] Success message appears after save
- [ ] Settings persist after refresh
- [ ] Dashboard shows updated goals
- [ ] Error messages display for invalid input
- [ ] Keyboard protection works on mobile
- [ ] Navigation works correctly

## Future Enhancements

- Export/import settings as JSON
- Preset configurations (sedentary, moderate, active)
- Goal recommendations based on user profile
- History of settings changes
- Share goals with trainer/friend

## Files Modified

**Frontend:**
- ✅ `frontend/app/settings.tsx` (NEW)
- ✅ `frontend/app/(tabs)/profile.tsx` (Updated)
- ✅ `frontend/app/(tabs)/dashboard.tsx` (Enhanced)
- ✅ `frontend/context/UserContext.tsx` (Extended)
- ✅ `frontend/utils/api.ts` (API method added)

**Backend:**
- ✅ `backend/app/models/schemas.py` (Extended)
- ✅ `backend/app/routes/users.py` (New endpoint)

## API Examples

### Get User Settings
```bash
GET /users/me
Authorization: Bearer <token>

Response 200:
{
  "id": "...",
  "username": "John Doe",
  "email": "john@example.com",
  "dailyCalorieGoal": 2200,
  "proteinGoal": 150,
  "carbsGoal": 220,
  "fiberGoal": 30,
  "workoutStreak": 5,
  "createdAt": "2024-02-24T..."
}
```

### Update Settings
```bash
PUT /users/settings
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "username": "Jane Doe",
  "dailyCalorieGoal": 2500,
  "proteinGoal": 175,
  "carbsGoal": 250,
  "fiberGoal": 35
}

Response 200: (same as GET /users/me)
```

## Known Limitations

- Fat goal is hardcoded to 70g on dashboard (can be added to settings if needed)
- No goal history/trends tracking
- Settings apply immediately (no gradual transitions)
- No preset goals or recommendations

## Support

For issues or questions, refer to the respective component files:
- Settings UI: `frontend/app/settings.tsx`
- API Integration: `frontend/utils/api.ts`
- Backend Logic: `backend/app/routes/users.py`
