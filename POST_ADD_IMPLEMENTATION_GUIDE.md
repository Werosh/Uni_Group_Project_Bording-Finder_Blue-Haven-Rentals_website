# Post Add Feature Implementation Guide

## Overview

The Post Add feature allows boarding owners to create rental listings with images and videos. The implementation uses:

- **React + Vite** for the frontend
- **Firebase Firestore** for storing post data
- **Strapi** for image/video storage
- **Protected Routes** to restrict access to boarding owners only

## Architecture

```
User (Boarding Owner)
    ↓
PostAdd Landing Button → /post-add route
    ↓
ProtectedRoute (checks role === "boarding_owner")
    ↓
PostAddFormPage (Multi-step form)
    ↓
    ├─→ Step 1: Details (title, category, location, etc.)
    ├─→ Step 2: Gallery (images/videos upload)
    └─→ Step 3: Preview & Submit
            ↓
            ├─→ Upload images to Strapi
            ├─→ Get Strapi URLs
            └─→ Save post data + URLs to Firestore
```

## Components & Files Created

### 1. Services

#### `src/firebase/strapiService.js`

Handles all Strapi API interactions:

- `uploadImageToStrapi(file)` - Upload single image
- `uploadImagesToStrapi(files)` - Upload multiple images
- `uploadVideoToStrapi(file)` - Upload single video
- `uploadVideosToStrapi(files)` - Upload multiple videos
- `getStrapiMediaUrl(url)` - Convert relative URLs to absolute
- `deleteFileFromStrapi(fileId)` - Delete file from Strapi

#### `src/firebase/dbService.js` (Extended)

Added post-related functions:

- `createPost(postData)` - Create new post in Firestore
- `getPosts()` - Get all posts
- `getPostsByLocation(location)` - Filter by location
- `getPostsByCategory(category)` - Filter by category
- `getPostsByOwner(ownerId)` - Get posts by owner
- `getPost(id)` - Get single post by ID
- `updatePost(id, data)` - Update existing post
- `deletePost(id)` - Delete post

### 2. Pages

#### `src/pages/main-pages/PostAddFormPage.jsx`

Multi-step form with three stages:

**Step 1 - Details:**

- Title (10-100 characters)
- Category (Boarding Houses, Apartment, House)
- For Whom (Students, Families, Professionals)
- Location (City selection)
- Description (20-500 characters)
- Rent (numeric, Rs.)
- Email (owner contact)
- Mobile (9-digit Sri Lankan number)

**Step 2 - Gallery:**

- Image upload (1-10 images, max 3MB each)
- Video upload (optional, max 50MB each)
- Support: JPEG, PNG, WebP for images
- Support: MP4, AVI, MOV, WMV for videos
- Preview and remove functionality

**Step 3 - Finish:**

- Preview all entered data
- Image carousel
- Edit button to go back
- Submit button

### 3. Updated Components

#### `src/routes/AppRoutes.jsx`

Added protected route:

```jsx
<Route
  path="/post-add"
  element={
    <ProtectedRoute requireRole="boarding_owner">
      <PostAddFormPage />
    </ProtectedRoute>
  }
/>
```

#### `src/pages/landing-pages/PostAdd.jsx`

Updated button with navigation logic:

- Checks if user is logged in
- Checks if user is boarding owner
- Shows appropriate message if not authorized
- Navigates to `/post-add` if authorized

#### `src/pages/main-pages/BrowsePlacePage.jsx`

Updated to fetch real posts:

- Fetches posts from Firestore on mount
- Displays images from Strapi
- Shows loading state
- Shows empty state if no posts
- Filters by location, category, price range
- Displays "For Whom" information

## Data Structure

### Post Document in Firestore

```javascript
{
  id: "auto-generated-id",
  title: "Comfortable Room in Colombo",
  category: "Boarding Houses",
  forWhom: "Students",
  location: "Colombo",
  description: "Beautiful room with all amenities...",
  rent: 25000,
  email: "owner@example.com",
  mobile: "771234567",
  images: [
    {
      id: "strapi-id-1",
      url: "http://localhost:1337/uploads/image1.jpg",
      name: "image1.jpg",
      formats: { ... }
    },
    // ... more images
  ],
  videos: [
    {
      id: "strapi-id-2",
      url: "http://localhost:1337/uploads/video1.mp4",
      name: "video1.mp4"
    }
  ],
  ownerId: "firebase-user-id",
  ownerName: "John Doe",
  status: "active",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z"
}
```

## User Flow

### For Boarding Owners:

1. **Visit Landing Page** → Click "Add Post" button
2. **Authentication Check** → Must be logged in as boarding owner
3. **Step 1: Enter Details**
   - Fill all required fields
   - Real-time validation
   - Click "Next" to proceed
4. **Step 2: Upload Media**
   - Upload 1-10 images (required)
   - Upload videos (optional)
   - Preview uploaded files
   - Remove unwanted files
   - Click "Next"
5. **Step 3: Review & Submit**
   - Review all information
   - Browse image carousel
   - Edit if needed
   - Click "Submit Post"
6. **Submission Process**
   - Images uploaded to Strapi
   - Videos uploaded to Strapi (if any)
   - Post data saved to Firestore with Strapi URLs
   - Success message displayed
   - Redirected to Browse page

### For Boarding Finders:

1. **Visit Landing Page** → Click "Add Post" button
2. **Notification** → "Only boarding owners can post ads"
3. **Suggested Action** → Sign up as boarding owner or browse existing posts

### For Non-Logged In Users:

1. **Visit Landing Page** → Click "Add Post" button
2. **Redirect** → Login page
3. **After Login** → Check user type and proceed accordingly

## Validation Rules

### Title

- Required
- Minimum 10 characters
- Maximum 100 characters

### Category

- Required
- Must select one option

### For Whom

- Required
- Must select one option

### Location

- Required
- Must select a city

### Description

- Required
- Minimum 20 characters
- Maximum 500 characters

### Rent

- Required
- Must be numeric
- Must be greater than 0
- Maximum 1,000,000

### Email

- Required
- Must be valid email format

### Mobile

- Required
- Must be exactly 9 digits (Sri Lankan format without country code)

### Images

- At least 1 image required
- Maximum 10 images
- File types: JPEG, JPG, PNG, WebP
- Maximum size per image: 3MB

### Videos

- Optional
- File types: MP4, AVI, MOV, WMV
- Maximum size per video: 50MB

## Environment Setup

Required environment variables in `.env`:

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=your_strapi_api_token
```

## Testing Checklist

- [ ] Non-logged in user clicks "Add Post" → Redirected to login
- [ ] Boarding finder clicks "Add Post" → Shows error message
- [ ] Boarding owner clicks "Add Post" → Opens form
- [ ] Step 1 validation works for all fields
- [ ] Cannot proceed without filling required fields
- [ ] Step 2 image upload works
- [ ] Can upload multiple images
- [ ] Can remove uploaded images
- [ ] Video upload works (optional)
- [ ] Step 3 preview shows all data correctly
- [ ] Image carousel works
- [ ] Edit button navigates back to Step 1
- [ ] Submit button uploads to Strapi
- [ ] Submit button saves to Firestore
- [ ] Success message appears
- [ ] Redirects to browse page
- [ ] New post appears in browse page
- [ ] Images load correctly from Strapi
- [ ] Filters work with new posts

## Common Issues & Solutions

### Images not uploading to Strapi

- Check if Strapi is running (`http://localhost:1337`)
- Verify `VITE_STRAPI_URL` in `.env`
- Check API token is valid
- Check CORS configuration in Strapi

### "Only boarding owners can post ads" for boarding owner

- Check user profile in Firestore
- Verify `role` field is set to `"boarding_owner"`
- Check auth context is loading user profile correctly

### Images not displaying in Browse page

- Check Strapi URL in environment variables
- Verify images were uploaded successfully
- Check browser console for 404 errors
- Ensure Strapi is running

### Form validation not working

- Check all required fields have validation
- Verify error messages are displaying
- Check `canProceedToNext()` logic

## Future Enhancements

- Add draft save functionality
- Allow editing existing posts
- Add image cropping/editing
- Add more location options
- Add amenities checklist
- Add map integration for location
- Add post preview before publishing
- Add email notifications
- Add analytics dashboard for owners
- Add favorite/bookmark functionality for finders
- Add contact form for inquiries
- Add ratings and reviews

## Security Considerations

- API tokens stored in environment variables (not in code)
- Protected routes check user authentication and role
- File upload validation on both client and server
- File size limits enforced
- File type restrictions enforced
- User can only edit/delete their own posts
- SQL injection prevention (Firebase handles this)
- XSS prevention (React handles this)

## Performance Optimizations

- Lazy loading of images
- Image compression on upload
- Pagination in browse page
- Efficient Firestore queries
- Debounced search
- Optimized re-renders with useMemo
- Cleanup of object URLs to prevent memory leaks
