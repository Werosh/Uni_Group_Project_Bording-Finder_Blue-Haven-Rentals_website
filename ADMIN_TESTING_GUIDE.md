# Admin Permissions Testing Guide

This guide will help you test the newly implemented admin role permissions to ensure admin users have unrestricted access to all functionality.

## Quick Setup

### Option 1: Create Test Admin User Automatically

1. **Import and run the admin user setup utility:**

   Add this to your `src/main.jsx` or any initialization file temporarily:

   ```javascript
   import { initializeAllTestUsers } from "./utils/adminUserSetup";

   // Run once on app load (development only)
   if (import.meta.env.DEV) {
     initializeAllTestUsers();
   }
   ```

2. **Test user credentials will be logged to console:**
   - **Admin**: `admin@bluerental.com` / `Admin@123`
   - **Boarding Owner**: `owner@bluerental.com` / `Owner@123`

### Option 2: Create Admin User Manually

1. **Sign up a new user through the application**

   - Navigate to `/signup`
   - Complete the signup flow
   - Choose any user type (you'll change this in Firestore)

2. **Update user role in Firestore:**

   - Open Firebase Console → Firestore Database
   - Navigate to `users` collection
   - Find your user document by UID
   - Edit the document:
     ```json
     {
       "role": "admin",
       "userType": "admin"
     }
     ```
   - Save changes

3. **Log out and log back in** to refresh the user profile

## Test Scenarios

### ✅ Test 1: Admin Dashboard Access

**Expected:** Admin users should access the dashboard

1. Log in with admin credentials
2. Navigate to `/admin/dashboard`
3. **Expected Result:** Dashboard loads successfully
4. **Verify:**
   - User statistics displayed
   - Quick action buttons visible
   - Admin notice section shows admin privileges

### ✅ Test 2: Post Creation Access (Boarding Owner Feature)

**Expected:** Admin users should access post creation without boarding_owner role

1. Log in with admin credentials (role: "admin", NOT "boarding_owner")
2. Navigate to `/post-add` or click "Create Post" from admin dashboard
3. **Expected Result:** Post creation form loads successfully
4. **Verify:**
   - All form fields are accessible
   - Can upload images
   - Can proceed through all steps
   - Can submit post successfully

### ✅ Test 3: All Protected Routes Access

**Expected:** Admin users should access all protected routes

Test each route:

| Route              | Expected Result              |
| ------------------ | ---------------------------- |
| `/`                | ✅ Accessible                |
| `/browse`          | ✅ Accessible                |
| `/post-add`        | ✅ Accessible (admin bypass) |
| `/user`            | ✅ Accessible                |
| `/admin/dashboard` | ✅ Accessible                |

### ✅ Test 4: Non-Admin User Restrictions

**Expected:** Non-admin users should be restricted appropriately

1. **Test with boarding_finder user:**

   - Should NOT access `/post-add` (redirects to `/`)
   - Should NOT access `/admin/dashboard` (redirects to `/`)
   - Should access `/browse` and `/user`

2. **Test with boarding_owner user:**
   - Should access `/post-add` (has correct role)
   - Should NOT access `/admin/dashboard` (redirects to `/`)
   - Should access `/browse` and `/user`

### ✅ Test 5: Admin Dashboard Functionality

**Expected:** Dashboard navigation buttons work correctly

1. Log in as admin
2. Navigate to `/admin/dashboard`
3. Click each button:
   - **Browse Listings** → Should navigate to `/browse`
   - **Create Post** → Should navigate to `/post-add`
   - **Manage Listings** → (Placeholder, no action currently)
   - **Manage Users** → (Placeholder, no action currently)

### ✅ Test 6: Role Verification in Components

**Expected:** Components should recognize admin role

1. Log in as admin
2. Open browser console
3. Test these commands:

   ```javascript
   // Should all return true for admin user
   window.location.href = "/admin/dashboard";

   // In React DevTools, check AuthContext values:
   // userProfile.role should be "admin"
   // isAdmin() should return true
   ```

## Automated Testing Script

You can run this in your browser console to test basic functionality:

```javascript
// Test Admin Access Check
async function testAdminAccess() {
  console.log("🧪 Testing Admin Access...");

  // Check current user role
  const currentPath = window.location.pathname;
  console.log("Current path:", currentPath);

  // Navigate to protected routes
  const testRoutes = ["/admin/dashboard", "/post-add", "/user", "/browse"];

  console.log("\n📍 Test Routes:");
  testRoutes.forEach((route) => {
    console.log(`  - ${route}`);
  });

  console.log(
    "\n✅ If you can navigate to all routes above, admin access is working correctly!"
  );
  console.log("❌ If you get redirected, check your user role in Firestore.");
}

testAdminAccess();
```

## Common Issues & Solutions

### Issue 1: Admin redirected from `/post-add`

**Symptoms:**

- Admin user is redirected to `/` when accessing `/post-add`
- Protected route not recognizing admin role

**Solutions:**

1. Check user role in Firestore:

   ```
   Firebase Console → Firestore → users → [your-uid] → role: "admin"
   ```

2. Clear browser cache and localStorage:

   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

3. Log out completely and log back in

4. Verify in console:
   ```javascript
   // Check if AuthContext has isAdmin function
   console.log(typeof isAdmin); // should be 'function'
   ```

### Issue 2: Role changes not taking effect

**Symptoms:**

- Updated role in Firestore but user still can't access admin features
- UI doesn't reflect new role

**Solutions:**

1. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear session:** Log out completely
3. **Restart browser:** Close all tabs and reopen
4. **Check AuthContext:** User profile is fetched on auth state change

### Issue 3: Admin dashboard not loading

**Symptoms:**

- `/admin/dashboard` shows blank page or error
- Quick action buttons not working

**Solutions:**

1. Check console for errors
2. Verify lucide-react icons are installed:
   ```bash
   npm install lucide-react
   ```
3. Check if AdminDashboard component imports are correct

### Issue 4: Test user creation fails

**Symptoms:**

- `initializeAllTestUsers()` throws error
- Cannot create test admin user

**Solutions:**

1. Check Firebase configuration in `firebaseConfig.js`
2. Verify Firestore is initialized
3. Check Firebase Auth is enabled in Firebase Console
4. Review console error messages for specific issues

## Verification Checklist

Use this checklist to verify complete implementation:

- [ ] Admin user profile created with `role: "admin"`
- [ ] Can access `/admin/dashboard`
- [ ] Can access `/post-add` without `boarding_owner` role
- [ ] Can navigate from dashboard to post creation
- [ ] Can create posts successfully as admin
- [ ] Can access all user pages
- [ ] Non-admin users are still restricted from admin routes
- [ ] Non-admin users are still restricted from role-specific routes
- [ ] Dashboard displays correct admin privileges
- [ ] All navigation buttons work correctly

## Testing with Different User Types

Create and test with these user types:

### 1. Admin User

```json
{
  "role": "admin",
  "userType": "admin"
}
```

**Expected Access:**

- ✅ All routes
- ✅ Post creation
- ✅ Admin dashboard
- ✅ User management (when implemented)

### 2. Boarding Owner

```json
{
  "role": "boarding_owner",
  "userType": "boarding_owner"
}
```

**Expected Access:**

- ✅ Post creation
- ✅ Own user page
- ❌ Admin dashboard
- ✅ Browse listings

### 3. Boarding Finder

```json
{
  "role": "boarding_finder",
  "userType": "boarding_finder"
}
```

**Expected Access:**

- ✅ Browse listings
- ✅ Own user page
- ❌ Post creation
- ❌ Admin dashboard

## Performance Testing

Test that admin checks don't impact performance:

1. **Route Loading Time:**

   - Admin routes should load quickly
   - No noticeable delay from role checks

2. **Navigation Speed:**

   - Dashboard navigation should be instant
   - No lag when switching between pages

3. **Role Check Efficiency:**
   - `isAdmin()` function should be O(1)
   - No unnecessary re-renders

## Security Testing

Verify security measures:

1. **Direct URL Access:**

   - Try accessing admin routes while logged out
   - Should redirect to `/login`

2. **Role Tampering:**

   - Cannot modify role in localStorage/sessionStorage
   - Role is fetched from Firestore only

3. **Bypass Attempts:**
   - Non-admin users cannot access admin features
   - Direct navigation is blocked

## Next Steps After Testing

Once all tests pass:

1. **Remove test user initialization** from production code
2. **Review and update Firebase Security Rules**
3. **Implement backend validation** for admin operations
4. **Add audit logging** for admin actions
5. **Create admin user management interface**

## Support

If you encounter issues during testing:

1. Review the main documentation: `ADMIN_ROLE_PERMISSIONS.md`
2. Check console for error messages
3. Verify Firebase configuration
4. Ensure all dependencies are installed
5. Review the implementation code in:
   - `src/routes/ProtectedRoute.jsx`
   - `src/context/AuthContext.jsx`
   - `src/pages/admin-pages/AdminDashboard.jsx`

---

**Happy Testing! 🚀**

Last Updated: October 4, 2025
