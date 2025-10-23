# Firebase Authentication & Role-Based User Management Guide

## Overview

This guide explains the Firebase Authentication system with role-based user management that has been implemented in Blue Haven Rentals.

## 🔑 User Types

The application supports three distinct user types:

### 1. **Typical User** (`typical_user`)

- **Purpose**: Users who search for and find boarding/rental listings
- **Access**:
  - Browse listings
  - View property details
  - Contact property owners
  - View and edit their own profile

### 2. **Boarding Owner** (`boarding_owner`)

- **Purpose**: Users who list and manage boarding/rental properties
- **Access**: Full platform access except admin dashboard:
  - All Typical User features (browse, view properties, contact owners)
  - Create new property listings
  - Manage their properties
  - View pending posts
  - Respond to inquiries
  - Access to all user pages and features
  - **Restricted from**: Admin dashboard and admin-only features

### 3. **Admin** (`admin`)

- **Purpose**: Platform administrator
- **Access**: Full system access including:
  - Admin dashboard at `/admin/dashboard`
  - User management capabilities
  - Listing management
  - System settings
  - All features available to other user types

## 📝 Signup Flow

### User Registration Steps:

1. **Step 1: Get Started** (`GetStartedPage.jsx`)

   - First name, last name
   - Email, password, confirm password
   - **User Type Selection**: Choose between Typical User or Boarding Owner

2. **Step 2: Account Setup** (`SetupYourAccountPage.jsx`)

   - Username, description, phone number

3. **Step 3: Location** (`SetupYourLocationPage.jsx`)

   - Country, district, division, postal code

4. **Step 4: ID Verification** (`VerifyYourIdPage.jsx`)

   - ID number, front/back images of ID

5. **Step 5: Profile Image** (`SetupYourImagePage.jsx`)

   - Upload profile photo
   - Creates Firebase Auth user
   - Uploads images to Firebase Storage
   - Creates user profile in Firestore with role

6. **Completion** (`SignupCompletePage.jsx`)
   - Success message
   - Redirect to browse page

## 🔐 Authentication Features

### Login

- Users log in at `/login` (`WelcomeBackPage.jsx`)
- Credentials validated via Firebase Authentication
- User profile (including role) fetched from Firestore

### Navbar Integration

- **User Icon**: Always visible in navbar

  - **Not logged in**: Clicking navigates to login page
  - **Logged in**: Opens dropdown with user options

- **Dropdown Menu** (when logged in):

  - Displays user name and username
  - Profile picture (if uploaded)
  - Quick links:
    - Profile
    - Find Place
    - Add Post (Boarding Owners only)
    - Pending Posts (Boarding Owners only)
    - Dashboard (Admins only)
    - Logout

- **Dashboard Link**:
  - Visible in main navbar for admin users
  - Located between "Contact" and "Find Place" button

### Route Protection

#### Basic Protection

```jsx
<ProtectedRoute>
  <UserPage />
</ProtectedRoute>
```

- Requires authentication
- Redirects to `/login` if not authenticated

#### Role-Based Protection

```jsx
<ProtectedRoute requireRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

- Requires authentication AND specific role
- Redirects to home page if user doesn't have required role

## 🎛️ Admin Setup

### Creating an Admin User

Since admin users cannot be created through the signup flow (for security), you must manually promote a user to admin status:

#### Option 1: Firebase Console (Firestore)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `blue-haven-rentals-64f42`
3. Navigate to **Firestore Database**
4. Find the `users` collection
5. Locate the user document by their UID
6. Edit the document and change the `role` field from `typical_user` or `boarding_owner` to `admin`
7. Save the changes

#### Option 2: Firebase Console (Custom Claims) - Future Enhancement

For enhanced security, you can implement custom claims:

```javascript
// In Firebase Admin SDK (server-side)
admin.auth().setCustomUserClaims(uid, { role: "admin" });
```

## 🗂️ Database Structure

### Firestore User Document

```javascript
{
  uid: "user-firebase-uid",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
  description: "Looking for a place near campus",
  phone: "+1234567890",
  country: "USA",
  district: "District Name",
  division: "Division Name",
  postalCode: "12345",
  idNumber: "ID123456",
  profileImageUrl: "https://firebase-storage-url/profile.jpg",
  idFrontImageUrl: "https://firebase-storage-url/id-front.jpg",
  idBackImageUrl: "https://firebase-storage-url/id-back.jpg",
  role: "typical_user", // or "boarding_owner" or "admin"
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Key Files Modified

### Configuration

- `src/firebase/firebaseConfig.js` - Firebase initialization with Analytics

### Context

- `src/context/AuthContext.jsx` - Authentication state management with role checking
- `src/context/SignupContext.jsx` - Signup flow state with userType field

### Services

- `src/firebase/authService.js` - Authentication operations
- `src/firebase/dbService.js` - Firestore operations with role support

### Components

- `src/components/Navbar.jsx` - User icon, dropdown, logout, role-based visibility

### Routes

- `src/routes/AppRoutes.jsx` - All routes including admin dashboard
- `src/routes/ProtectedRoute.jsx` - Route protection with role checking

### Pages

- `src/pages/sign-up-pages/GetStartedPage.jsx` - User type selection
- `src/pages/sign-up-pages/SetupYourImagePage.jsx` - Profile creation with role
- `src/pages/admin-pages/AdminDashboard.jsx` - Admin dashboard

## 🚀 Usage Examples

### Check if user is admin (in components)

```jsx
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { isAdmin } = useAuth();

  return <div>{isAdmin() && <AdminButton />}</div>;
}
```

### Check if user has specific role

```jsx
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { hasRole, userProfile } = useAuth();

  return (
    <div>
      {hasRole("boarding_owner") && <AddListingButton />}
      {userProfile?.role === "typical_user" && <BrowseButton />}
    </div>
  );
}
```

### Protect a route

```jsx
<Route
  path="/boarding-owner/dashboard"
  element={
    <ProtectedRoute requireRole="boarding_owner">
      <BoardingOwnerDashboard />
    </ProtectedRoute>
  }
/>
```

## 🔒 Security Considerations

1. **Admin Creation**: Always create admin users manually in Firebase Console
2. **Role Changes**: Only allow role changes through secure server-side functions
3. **Route Protection**: Always use `ProtectedRoute` for sensitive pages
4. **Client-Side Validation**: Remember that client-side role checks are for UX only
5. **Server-Side Rules**: Implement Firestore Security Rules to enforce role-based access

## 📋 Firestore Security Rules (Recommended)

Add these rules to your Firestore to enforce role-based access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Helper function to check if user is owner
    function isBoardingOwner() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'boarding_owner';
    }

    // Users collection
    match /users/{userId} {
      // Anyone can read their own profile
      allow read: if request.auth != null && request.auth.uid == userId;
      // Users can update their own profile (except role field)
      allow update: if request.auth != null &&
                       request.auth.uid == userId &&
                       !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']);
      // Only allow creating user during signup
      allow create: if request.auth != null && request.auth.uid == userId;
      // Admins can read all users
      allow read: if isAdmin();
    }

    // Places/Listings collection
    match /places/{placeId} {
      // Anyone can read listings
      allow read: if true;
      // Only boarding owners and admins can create listings
      allow create: if request.auth != null && (isBoardingOwner() || isAdmin());
      // Owners can update their own listings, admins can update any
      allow update: if request.auth != null &&
                       (resource.data.ownerId == request.auth.uid || isAdmin());
      // Owners can delete their own listings, admins can delete any
      allow delete: if request.auth != null &&
                       (resource.data.ownerId == request.auth.uid || isAdmin());
    }
  }
}
```

## 🧪 Testing the Implementation

### Test User Types

1. **Create a Typical User**:

   - Sign up and select "Typical User"
   - Verify you can browse listings but NOT add posts
   - Check that "Add Post" button is not in dropdown

2. **Create a Boarding Owner**:

   - Sign up and select "Boarding Owner"
   - Verify "Add Post" and "Pending Posts" appear in dropdown
   - Check that you can create listings

3. **Create an Admin**:
   - Sign up as any user type
   - Manually change role to "admin" in Firestore
   - Log out and log back in
   - Verify "Dashboard" link appears in navbar
   - Verify you can access `/admin/dashboard`

## 📞 Support

For questions or issues with the authentication system, please refer to:

- Firebase Authentication docs: https://firebase.google.com/docs/auth
- Firebase Firestore docs: https://firebase.google.com/docs/firestore
- React Context API: https://react.dev/learn/passing-data-deeply-with-context

---

**Last Updated**: October 2024
**Version**: 1.0
**Firebase Project**: blue-haven-rentals-64f42
