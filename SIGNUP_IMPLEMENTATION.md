# Multi-Step Signup Flow Implementation

## Overview

This document describes the complete implementation of a 6-step signup flow integrated with Firebase Authentication, Firestore, and Firebase Storage.

## Architecture

### 1. Context Management

**File**: `src/context/SignupContext.jsx`

The `SignupContext` manages the entire signup flow state:

- Current step tracking (1-6)
- Form data persistence across all steps
- LocalStorage integration for state persistence
- Navigation between steps (next/prev/goToStep)
- Form data reset functionality

### 2. Firebase Services

#### Enhanced dbService

**File**: `src/firebase/dbService.js`

Added user profile operations:

- `createUserProfile(uid, userData)` - Creates user document in Firestore
- `getUserProfile(uid)` - Retrieves user profile by UID
- `updateUserProfile(uid, updatedData)` - Updates user profile

#### Storage Service

**File**: `src/firebase/storageService.js`

Handles image uploads:

- Uploads to Firebase Storage
- Returns public download URLs
- Organized by user UID

### 3. Signup Pages

All pages located in `src/pages/sign-up-pages/`

#### Step 1: GetStartedPage.jsx

**Route**: `/signup` (initial step)

Collects:

- First Name
- Last Name
- Email
- Password
- Confirm Password

Validation:

- All fields required
- Email format validation
- Password strength (8+ chars, uppercase, lowercase, number, special character)
- Password confirmation match

#### Step 2: SetupYourAccountPage.jsx

Collects:

- Username (min 3 characters)
- Description (min 10 characters)
- Phone Number (7-15 digits)

#### Step 3: SetupYourLocationPage.jsx

Collects:

- Username (confirmation)
- Country (dropdown)
- District
- Division
- Postal Code (4-10 digits)

#### Step 4: VerifyYourIdPage.jsx

Collects:

- ID Number
- Front ID Image (drag & drop or click to upload)
- Back ID Image (drag & drop or click to upload)

#### Step 5: SetupYourImagePage.jsx

Collects:

- Profile Image (drag & drop or click to upload)

**This step handles the final submission**:

1. Creates Firebase Authentication user
2. Uploads all images to Firebase Storage
3. Creates user profile in Firestore
4. Navigates to completion page

#### Step 6: SignupCompletePage.jsx

**Route**: `/signup/complete`

- Displays success message
- Auto-redirects to `/browse` after 3 seconds
- Manual navigation button available

### 4. Main Flow Container

**File**: `src/pages/sign-up-pages/SignupFlow.jsx`

Renders the appropriate step component based on `currentStep` from context.

### 5. Routing Integration

**File**: `src/routes/AppRoutes.jsx`

Routes:

- `/signup` - Multi-step signup flow
- `/signup/complete` - Completion page

### 6. App Integration

**File**: `src/App.jsx`

Wrapped with:

- `AuthProvider` - Firebase authentication state
- `SignupProvider` - Signup flow state management

### 7. Test User Setup

**File**: `src/utils/testUserSetup.js`

Automatically creates test user on app load:

- **Email**: test@gmail.com
- **Password**: test@123
- Uses sessionStorage to prevent duplicate creation attempts
- Creates complete user profile in Firestore

## Data Flow

### Signup Process

```
Step 1 (Basic Info)
  → Step 2 (Account Details)
  → Step 3 (Location)
  → Step 4 (ID Verification)
  → Step 5 (Profile Image + Final Submit)
    ↓
  Firebase Auth User Creation
    ↓
  Upload Images to Storage
    ↓
  Create User Profile in Firestore
    ↓
  Step 6 (Completion)
    ↓
  Redirect to Browse Page
```

### Firestore User Document Structure

```javascript
{
  uid: "user-firebase-uid",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
  description: "User description",
  phone: "1234567890",
  country: "Sri Lanka",
  district: "Colombo",
  division: "Colombo 7",
  postalCode: "00700",
  idNumber: "ID123456789",
  profileImageUrl: "https://firebase-storage-url...",
  idFrontImageUrl: "https://firebase-storage-url...",
  idBackImageUrl: "https://firebase-storage-url...",
  createdAt: "2025-10-04T...",
  updatedAt: "2025-10-04T..."
}
```

## Features

### State Persistence

- Form data saved to localStorage after each step
- Users can close browser and resume where they left off
- Data cleared after successful signup

### Validation

- Real-time field validation
- Visual error indicators
- Comprehensive error messages
- Form submission blocked until validation passes

### User Experience

- Progress indicators on each page
- Previous/Next navigation
- Drag & drop file uploads
- Animated backgrounds and transitions
- Responsive design (mobile & desktop)
- Loading states during submission
- Error handling with user-friendly messages

### Error Handling

- Duplicate email detection
- Weak password warnings
- Network failure handling
- Firebase-specific error messages
- Graceful degradation

## Background Images

Each step uses existing project assets:

- Step 1: hero-background.webp
- Step 2: categories-background.webp
- Step 3: location-background.webp
- Step 4: about-background.webp
- Step 5: hero-background.webp

## Dependencies

All required packages already in project:

- `react-router-dom` - Routing
- `firebase` - Backend services
- `lucide-react` - Icons
- `react-icons` - Additional icons (BsStars)
- `tailwindcss` - Styling

## Testing

### Test User Credentials

**Email**: test@gmail.com  
**Password**: test@123

The test user is automatically created on app initialization.

### Manual Testing Flow

1. Navigate to `/signup`
2. Fill in Step 1 with valid data
3. Progress through Steps 2-5
4. Verify successful account creation
5. Check Firestore for user document
6. Check Firebase Storage for uploaded images
7. Verify redirect to completion page

## Customization

### Adding/Modifying Fields

1. Update `SignupContext.jsx` - Add field to initial state
2. Update appropriate step page - Add form field and validation
3. Update `SetupYourImagePage.jsx` - Include field in final submission

### Changing Step Order

1. Modify `SignupFlow.jsx` - Update switch cases
2. Update step navigation logic if needed

### Styling

All components use inline Tailwind CSS classes matching the provided design:

- Color scheme: `#263D5D` (dark blue), `#3ABBD0` (cyan)
- Font: Hugiller-Demo (custom font)
- Responsive breakpoints: sm, md, lg

## Security Considerations

- Passwords validated for strength
- Firebase Auth handles password encryption
- Images stored with user-specific paths
- Firestore rules should be configured appropriately (not included in this implementation)

## Future Enhancements

- Email verification before account activation
- Image size/format validation
- More countries in dropdown
- District/division based on selected country
- Password strength meter
- Resume signup from email link
- Admin dashboard for user management

## Notes

- Ensure Firebase configuration is updated in `src/firebase/firebaseConfig.js`
- Update Firestore security rules before production deployment
- Configure Firebase Storage CORS if needed
- Test on multiple browsers and devices
