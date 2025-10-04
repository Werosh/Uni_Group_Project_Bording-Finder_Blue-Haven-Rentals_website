# Signup Flow Implementation - User Types & Firebase Security

## Overview

This document describes the implementation of a two-tier user signup flow with distinct data collection requirements for different user types, along with securing Firebase credentials using environment variables.

## Changes Summary

### 1. User Type Selection (New Feature)

#### Created: `src/pages/sign-up-pages/UserTypeSelectionPage.jsx`

- **Purpose**: New first step in the signup flow where users select their account type
- **User Types**:
  - `boarding_finder`: Users looking for boarding/rental places
  - `boarding_owner`: Users offering boarding/rental properties
- **Features**:
  - Visual card-based selection interface
  - Clear descriptions of each user type and what they offer
  - Icons (Users icon for Boarding Finder, Home icon for Boarding Owner)
  - Validation to ensure a type is selected before proceeding

### 2. Conditional Signup Flow

#### Updated: `src/context/SignupContext.jsx`

- **Changes**:
  - Restructured `formData` to reflect user type as the first field
  - Updated step numbering (now 7 steps total, with step 1 being user type selection)
  - Modified `nextStep()` function to skip steps 3-6 for `boarding_finder` users
  - Changed default user type from `"typical_user"` to `""` (empty, requiring explicit selection)

#### Updated: `src/pages/sign-up-pages/SignupFlow.jsx`

- **Changes**:
  - Added `UserTypeSelectionPage` as step 1
  - Implemented conditional rendering based on user type
  - `boarding_finder` users: Steps 1 (type selection) → 2 (basic info) → 7 (completion)
  - `boarding_owner` users: All steps 1-7 (full flow with verification, location, ID, images)

#### Updated: `src/pages/sign-up-pages/GetStartedPage.jsx`

- **Changes**:
  - Removed user type selection (moved to dedicated page)
  - Added account creation logic for `boarding_finder` users (completes signup at step 2)
  - Added navigation imports (`useNavigate`, `signup`, `createUserProfile`)
  - Added loading state and error handling
  - Added "Previous" button to navigate back to user type selection
  - Dynamic button text based on user type ("Complete Signup" for boarding_finder, "Next" for boarding_owner)
  - Minimal data collection for boarding_finder: firstName, lastName, email, password only

### 3. Database Updates

#### Updated: `src/firebase/dbService.js`

- **Changes**:
  - Updated `createUserProfile()` to explicitly store `userType` field
  - Maintains backward compatibility by also storing as `role`
  - Default value changed from `"typical_user"` to `"boarding_finder"`

#### Updated: `src/pages/sign-up-pages/SetupYourImagePage.jsx`

- **Changes**:
  - Removed hardcoded default `"typical_user"` value
  - Now passes `formData.userType` directly to ensure correct type is stored

### 4. Firebase Configuration Security

#### Updated: `src/firebase/firebaseConfig.js`

- **Changes**:
  - Replaced hardcoded Firebase credentials with environment variables
  - Uses Vite's `import.meta.env` syntax for accessing environment variables
  - All sensitive values now loaded from `.env` file

#### Created: `.env`

- Contains actual Firebase credentials
- **Important**: This file is now in `.gitignore` and will not be committed
- Contains the following variables:
  ```
  VITE_FIREBASE_API_KEY
  VITE_FIREBASE_AUTH_DOMAIN
  VITE_FIREBASE_PROJECT_ID
  VITE_FIREBASE_STORAGE_BUCKET
  VITE_FIREBASE_MESSAGING_SENDER_ID
  VITE_FIREBASE_APP_ID
  VITE_FIREBASE_MEASUREMENT_ID
  ```

#### Created: `.env.example`

- Template file with placeholder values
- Committed to git to show developers what variables are needed
- Instructions included for copying to `.env` and replacing with actual credentials

#### Updated: `.gitignore`

- **Added**:
  ```
  # Environment variables
  .env
  .env.local
  .env.production
  ```
- Prevents accidental committing of sensitive Firebase credentials

## User Flow Diagrams

### Boarding Finder Flow

```
Step 1: User Type Selection (UserTypeSelectionPage)
  ↓
Step 2: Basic Info Collection (GetStartedPage)
  - First Name
  - Last Name
  - Email
  - Password
  → Account Created Immediately
  ↓
Step 7: Completion Page (SignupCompletePage)
```

### Boarding Owner Flow

```
Step 1: User Type Selection (UserTypeSelectionPage)
  ↓
Step 2: Basic Info Collection (GetStartedPage)
  - First Name
  - Last Name
  - Email
  - Password
  ↓
Step 3: Account Details (SetupYourAccountPage)
  - Username
  - Description
  - Phone Number
  ↓
Step 4: Location Details (SetupYourLocationPage)
  - Country
  - District
  - Division
  - Postal Code
  ↓
Step 5: ID Verification (VerifyYourIdPage)
  - ID Number
  - Front Image
  - Back Image
  ↓
Step 6: Profile Image (SetupYourImagePage)
  - Profile Image Upload
  → Account Created After This Step
  ↓
Step 7: Completion Page (SignupCompletePage)
```

## Database Schema

### User Document (Firestore: `users` collection)

#### Boarding Finder Users

```javascript
{
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  userType: "boarding_finder",
  role: "boarding_finder", // For backward compatibility
  createdAt: string (ISO timestamp),
  updatedAt: string (ISO timestamp)
}
```

#### Boarding Owner Users

```javascript
{
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  username: string,
  description: string,
  phone: string,
  country: string,
  district: string,
  division: string,
  postalCode: string,
  idNumber: string,
  profileImageUrl: string,
  idFrontImageUrl: string,
  idBackImageUrl: string,
  userType: "boarding_owner",
  role: "boarding_owner", // For backward compatibility
  createdAt: string (ISO timestamp),
  updatedAt: string (ISO timestamp)
}
```

## Setup Instructions

### For New Developers

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd gp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Copy `.env.example` to `.env`
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and replace placeholder values with actual Firebase credentials
   - Obtain Firebase credentials from Firebase Console or team lead

4. **Run the development server**
   ```bash
   npm run dev
   ```

### For Existing Developers

1. **Pull latest changes**

   ```bash
   git pull origin main
   ```

2. **Create `.env` file**

   - Copy `.env.example` to `.env`
   - Contact team lead for actual Firebase credentials
   - Add credentials to `.env` file

3. **Restart development server**
   ```bash
   npm run dev
   ```

## Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore` for a reason
2. **Never share Firebase credentials publicly** - Use secure channels (encrypted chat, password managers)
3. **Use different Firebase projects for development and production** - Update `.env` accordingly
4. **Rotate Firebase credentials** if they are accidentally exposed
5. **Review `.env.example`** to ensure it doesn't contain actual credentials

## Testing Checklist

### Boarding Finder User Signup

- [ ] User can select "Boarding Finder" option
- [ ] User can navigate back from basic info to user type selection
- [ ] User can fill in: first name, last name, email, password
- [ ] Password validation works correctly
- [ ] Account is created after step 2
- [ ] User is redirected to completion page
- [ ] User document in Firestore has correct fields and userType
- [ ] User can login after signup

### Boarding Owner User Signup

- [ ] User can select "Boarding Owner" option
- [ ] User can navigate back from basic info to user type selection
- [ ] User can complete all 6 steps (basic info, account, location, ID, profile image)
- [ ] All validation works at each step
- [ ] Images upload successfully to Firebase Storage
- [ ] Account is created after profile image upload
- [ ] User is redirected to completion page
- [ ] User document in Firestore has all required fields and correct userType
- [ ] User can login after signup

### Firebase Security

- [ ] `.env` file exists and contains credentials
- [ ] `.env` is in `.gitignore`
- [ ] Application runs without hardcoded credentials
- [ ] Firebase connection works with environment variables
- [ ] `.env.example` has placeholder values (not real credentials)

## Files Modified

### New Files

- `src/pages/sign-up-pages/UserTypeSelectionPage.jsx`
- `.env`
- `.env.example`

### Modified Files

- `src/context/SignupContext.jsx`
- `src/pages/sign-up-pages/SignupFlow.jsx`
- `src/pages/sign-up-pages/GetStartedPage.jsx`
- `src/pages/sign-up-pages/SetupYourImagePage.jsx`
- `src/firebase/firebaseConfig.js`
- `src/firebase/dbService.js`
- `.gitignore`

## Migration Notes

### Existing Users

- Existing users with `userType: "typical_user"` will continue to work
- Database queries should check for both `"typical_user"` and `"boarding_finder"` if treating them the same
- Consider adding a migration script if all existing `"typical_user"` entries should be updated to `"boarding_finder"`

### Backward Compatibility

- `role` field is maintained alongside `userType` for backward compatibility
- Existing code checking `role` will continue to work
- New code should use `userType` field

## Future Enhancements

1. **Email Verification** - Add email verification step for both user types
2. **Phone Verification** - Add SMS verification for boarding owners
3. **Document Approval Workflow** - Admin review of boarding owner IDs
4. **Profile Completion Indicators** - Show profile completion percentage
5. **User Type Switching** - Allow users to upgrade from boarding_finder to boarding_owner
6. **Social Authentication** - Add Google/Facebook signup options

## Support

For questions or issues related to this implementation:

1. Check this documentation first
2. Review the code comments in modified files
3. Contact the development team
4. Create an issue in the repository

---

**Implementation Date**: October 4, 2025
**Version**: 1.0.0
**Status**: ✅ Complete
