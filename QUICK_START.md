# Quick Start Guide - Role-Based Authentication

## ✅ What's Been Implemented

### 1. Firebase Configuration ✓

- Firebase app initialized with your credentials
- Authentication, Firestore, Storage, and Analytics enabled

### 2. User Types ✓

Three user roles are now supported:

- **Typical User**: Browse and search for listings
- **Boarding Owner**: Create and manage property listings
- **Admin**: Full platform access + dashboard

### 3. Signup Flow ✓

- User type selection added to signup (Step 1)
- User role saved to Firestore during registration

### 4. Authentication ✓

- Login functionality with role fetching
- Logout functionality
- Session persistence

### 5. Navbar Integration ✓

- User icon always visible
- Redirects to login when not authenticated
- Shows user dropdown when authenticated
- Role-based menu items:
  - Profile (all users)
  - Find Place (all users)
  - Add Post (boarding owners only)
  - Pending Posts (boarding owners only)
  - Dashboard (admins only)
- Dashboard link in main navbar (admins only)

### 6. Route Protection ✓

- Basic authentication protection
- Role-based route protection
- Proper redirects for unauthorized access

### 7. Admin Dashboard ✓

- Beautiful admin dashboard at `/admin/dashboard`
- Statistics overview
- Quick action buttons
- Protected by admin-only route

## 🚀 Getting Started

### Step 1: Install Dependencies (if needed)

```bash
npm install
```

### Step 2: Start the Development Server

```bash
npm run dev
```

### Step 3: Test the Signup Flow

1. Navigate to `/signup` or click "Sign Up" from login page
2. Fill in the form and **select a user type** (Typical User or Boarding Owner)
3. Complete all 5 steps
4. You'll be logged in automatically after signup

### Step 4: Create an Admin User

**Option A: Convert Existing User to Admin**

1. Sign up as a regular user
2. Go to [Firebase Console](https://console.firebase.google.com/)
3. Open project: `blue-haven-rentals-64f42`
4. Go to Firestore Database
5. Open `users` collection
6. Find your user document
7. Edit the `role` field to `"admin"`
8. Save changes
9. Log out and log back in
10. You should now see the Dashboard link

**Option B: Use Test User Setup Script**

```bash
# Create the script based on utils/testUserSetup.js
node src/utils/testUserSetup.js
```

## 🧪 Testing Checklist

### Test as Typical User

- [ ] Sign up as "Typical User"
- [ ] Login successfully
- [ ] See user icon in navbar
- [ ] Click user icon → dropdown opens
- [ ] See Profile, Find Place options
- [ ] Do NOT see Add Post, Pending Posts, or Dashboard
- [ ] Logout works

### Test as Boarding Owner

- [ ] Sign up as "Boarding Owner"
- [ ] Login successfully
- [ ] See user icon in navbar
- [ ] Click user icon → dropdown opens
- [ ] See Profile, Find Place, Add Post, Pending Posts
- [ ] Do NOT see Dashboard
- [ ] Logout works

### Test as Admin

- [ ] Create user and promote to admin in Firebase Console
- [ ] Login successfully
- [ ] See user icon in navbar
- [ ] See "Dashboard" link in main navbar
- [ ] Click user icon → dropdown opens
- [ ] See Dashboard option in dropdown
- [ ] Click Dashboard → navigate to `/admin/dashboard`
- [ ] See admin dashboard with stats
- [ ] Logout works

### Test Route Protection

- [ ] Try accessing `/admin/dashboard` while not logged in → redirects to login
- [ ] Try accessing `/admin/dashboard` as typical user → redirects to home
- [ ] Try accessing `/user` while not logged in → redirects to login

## 📱 User Flow Examples

### New User Signup

```
1. Click "Sign Up" on landing/login page
2. Fill in name, email, password
3. Select user type (Typical User or Boarding Owner)
4. Click "Sign Up"
5. Enter username, description, phone
6. Click "Next"
7. Enter location details
8. Click "Next"
9. Upload ID images
10. Click "Next"
11. Upload profile image
12. Click "Complete Signup"
13. Account created! Redirect to browse page
```

### Login Flow

```
1. Navigate to /login
2. Enter email and password
3. Click "Login"
4. System fetches user role from Firestore
5. Redirect to browse page
6. Navbar shows user icon with dropdown
```

### Admin Access

```
1. Admin logs in
2. "Dashboard" link appears in navbar
3. Dropdown menu has "Dashboard" option
4. Click Dashboard → Admin dashboard loads
5. View statistics and management options
```

## 🔑 Key Components

### Context Providers

```jsx
// In main.jsx or App.jsx
<AuthProvider>
  <SignupProvider>
    <App />
  </SignupProvider>
</AuthProvider>
```

### Using Auth in Components

```jsx
import { useAuth } from "./context/AuthContext";

function MyComponent() {
  const { user, userProfile, isAdmin, hasRole } = useAuth();

  // Check if user is logged in
  if (!user) return <LoginPrompt />;

  // Check if user is admin
  if (isAdmin()) return <AdminView />;

  // Check specific role
  if (hasRole("boarding_owner")) return <OwnerView />;

  return <DefaultView />;
}
```

## ⚠️ Important Notes

1. **Admin users cannot be created through signup** - This is intentional for security
2. **User must log out and log back in** after role change in Firebase Console
3. **Role changes should only be done manually** in Firebase Console for now
4. **Client-side role checks are for UX** - Implement Firestore Security Rules for real security
5. **Profile images are stored in Firebase Storage** under `users/{uid}/`

## 📂 New Files Created

```
src/
├── pages/
│   └── admin-pages/
│       └── AdminDashboard.jsx         # Admin dashboard page
├── context/
│   └── SignupContext.jsx              # Updated with userType
└── routes/
    └── ProtectedRoute.jsx             # Updated with role protection

Root:
├── AUTHENTICATION_GUIDE.md            # Comprehensive guide
└── QUICK_START.md                     # This file
```

## 📝 Modified Files

```
src/
├── firebase/
│   ├── firebaseConfig.js              # Added real credentials + Analytics
│   └── dbService.js                   # Added role to user profile
├── context/
│   └── AuthContext.jsx                # Added role fetching and helpers
├── components/
│   └── Navbar.jsx                     # Added auth integration + role-based UI
├── routes/
│   └── AppRoutes.jsx                  # Added admin route
└── pages/
    └── sign-up-pages/
        ├── GetStartedPage.jsx         # Added user type selection
        └── SetupYourImagePage.jsx     # Added userType to profile creation
```

## 🐛 Troubleshooting

### Dashboard link not showing

- Make sure you've changed the `role` field to `"admin"` (with quotes)
- Log out and log back in
- Check browser console for errors

### Can't access admin dashboard

- Verify role is set to "admin" in Firestore
- Check that you're logged in
- Try clearing browser cache and logging in again

### User profile not loading

- Check Firebase connection
- Verify user document exists in Firestore `users` collection
- Check browser console for errors

### Images not uploading

- Check Firebase Storage rules
- Verify Storage bucket is enabled
- Check file size (max 3MB for profile images)

## 📚 Next Steps

1. **Implement Firestore Security Rules** (see AUTHENTICATION_GUIDE.md)
2. **Add boarding owner dashboard** with listing management
3. **Implement admin user management** features
4. **Add email verification** during signup
5. **Implement password strength requirements**
6. **Add social authentication** (Google, Facebook)
7. **Create audit logs** for admin actions

## 🆘 Need Help?

Refer to:

- `AUTHENTICATION_GUIDE.md` - Comprehensive documentation
- Firebase Console: https://console.firebase.google.com/
- Project ID: `blue-haven-rentals-64f42`

---

**Ready to go! 🎉**

Start the dev server with `npm run dev` and test the authentication flow!
