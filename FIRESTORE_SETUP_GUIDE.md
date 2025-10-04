# Firestore Setup Guide - Fix 400 Bad Request Error

## Problem

You're getting this error:

```
GET https://firestore.googleapis.com/...  400 (Bad Request)
WebChannelConnection RPC 'Write' stream transport errored
```

This means **Firestore is not initialized** in your Firebase project.

---

## Solution: Set Up Firestore Database

### Step 1: Access Firebase Console

1. Open: https://console.firebase.google.com/
2. Log in with your Google account
3. Select project: **blue-haven-rentals-64f42**

### Step 2: Create Firestore Database

1. In the left sidebar, click **"Build"** → **"Firestore Database"**
   (or just click "Firestore Database")

2. Click the **"Create database"** button

3. Choose a starting mode:

   - **Production mode** (Recommended): Secure by default, requires authentication
   - **Test mode**: Open for 30 days (good for quick testing)

4. Choose **location**:

   - For Sri Lanka/India users: `asia-south1 (Mumbai)`
   - For general use: `us-central1 (Iowa)`
   - ⚠️ **This cannot be changed later!**

5. Click **"Enable"**

### Step 3: Configure Security Rules

#### For Development/Testing (Open Access)

Go to **Rules** tab and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Allow read/write for 30 days (adjust date as needed)
      allow read, write: if request.time < timestamp.date(2025, 11, 4);
    }
  }
}
```

⚠️ **Remember**: This is open to everyone! Update before production.

#### For Production (Secure Access)

Go to **Rules** tab and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Anyone authenticated can read user profiles
      allow read: if request.auth != null;
      // Users can only write to their own profile
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Places collection (boarding listings)
    match /places/{placeId} {
      // Anyone authenticated can read places
      allow read: if request.auth != null;
      // Any authenticated user can create a place
      allow create: if request.auth != null;
      // Only the owner can update/delete their place
      allow update, delete: if request.auth != null &&
        resource.data.ownerId == request.auth.uid;
    }
  }
}
```

Click **"Publish"** to save the rules.

### Step 4: Verify Setup

1. Go to **"Data"** tab in Firestore
2. You should see an empty database (or existing collections)
3. No error messages should appear

### Step 5: Test Your Application

1. **Restart your dev server** (if needed):

   ```bash
   npm run dev
   ```

2. **Refresh your browser**

3. **Check the console** - the 400 error should be gone!

---

## Understanding Firestore Collections

Your app uses these collections:

### 1. `users` Collection

Stores user profiles created during signup:

```javascript
{
  uid: "user123",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  userType: "boarding_finder", // or "boarding_owner"
  createdAt: "2025-10-04T10:00:00.000Z"
}
```

### 2. `places` Collection

Stores boarding/rental listings:

```javascript
{
  id: "place123",
  ownerId: "user123",
  title: "Cozy Room in Colombo",
  description: "...",
  price: 15000,
  location: "Colombo 7"
}
```

These collections will be **automatically created** when your app writes data to them.

---

## Troubleshooting

### If you still get 400 error after setup:

**Check 1: Firestore is enabled**

- Firebase Console → Firestore Database
- You should see "Cloud Firestore" tab with data/rules

**Check 2: Location is set**

- Cannot create database without selecting a location
- Check if you completed the full setup wizard

**Check 3: Rules are published**

- Go to Rules tab
- Rules should show as "Published" with a timestamp

**Check 4: Browser cache**

- Clear browser cache and reload
- Or open in incognito/private mode

**Check 5: Network**

- Check if you can access firebase.google.com
- Disable VPN if using one
- Check firewall/proxy settings

### Still not working?

**Option 1: Use Test Mode temporarily**

1. Go to Firestore → Rules
2. Use the test mode rules (open access for 30 days)
3. This will help identify if it's a rules issue

**Option 2: Check Firebase Console logs**

1. Go to Firebase Console
2. Check for any errors or warnings
3. Look at usage/quotas to ensure nothing is exceeded

**Option 3: Verify project ID**

1. Check that `.env` has correct `VITE_FIREBASE_PROJECT_ID`
2. Should match the project name in Firebase Console
3. Currently: `blue-haven-rentals-64f42`

---

## Security Best Practices

### For Development

✅ Use test mode rules with expiration date
✅ Limit access to your IP if possible
✅ Monitor usage in Firebase Console

### For Production

✅ Always require authentication: `if request.auth != null`
✅ Validate user permissions before allowing writes
✅ Use field-level validation
✅ Set up rate limiting
✅ Monitor for suspicious activity

### Example: Stricter Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null &&
                      request.auth.uid == userId &&
                      request.resource.data.userType == resource.data.userType; // Prevent type changes
      allow delete: if false; // Users cannot delete their own account
    }

    match /places/{placeId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
                      request.auth.token.userType == 'boarding_owner'; // Only owners can create
      allow update: if request.auth != null &&
                      resource.data.ownerId == request.auth.uid;
      allow delete: if request.auth != null &&
                      resource.data.ownerId == request.auth.uid;
    }
  }
}
```

---

## Summary

1. ✅ Go to Firebase Console
2. ✅ Enable Firestore Database
3. ✅ Choose location (cannot change later!)
4. ✅ Set up security rules
5. ✅ Publish rules
6. ✅ Test your app

**After completing these steps, the 400 error will be resolved!**

---

## Need Help?

- Firebase Documentation: https://firebase.google.com/docs/firestore
- Security Rules: https://firebase.google.com/docs/firestore/security/get-started
- Firebase Support: https://firebase.google.com/support

---

**Last Updated**: October 4, 2025  
**Project**: Blue Haven Rentals  
**Firebase Project ID**: blue-haven-rentals-64f42
