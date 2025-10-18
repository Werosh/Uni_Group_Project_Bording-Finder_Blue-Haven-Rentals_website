# Firebase Storage Integration Setup Guide

This guide provides comprehensive instructions for setting up and using the Firebase Storage integration with mandatory image uploads and security rules.

## Overview

The Firebase Storage integration has been enhanced with:

- **Mandatory image uploads** for all user actions
- **Image compression** to optimize storage usage
- **Comprehensive security rules** for file access control
- **Error handling** and progress indicators
- **Image fetching** and caching functionality

## Files Modified/Created

### New Files Created:

- `FIREBASE_STORAGE_RULES.txt` - Firebase Storage security rules
- `FIREBASE_STORAGE_SETUP_GUIDE.md` - This setup guide

### Files Enhanced:

- `src/firebase/storageService.js` - Enhanced with comprehensive image handling
- `src/pages/main-pages/PostAddFormPage.jsx` - Made image uploads mandatory
- `src/pages/sign-up-pages/SetupYourImagePage.jsx` - Made profile and ID images mandatory
- `src/components/EditPostModal.jsx` - Updated to use new storage functions
- `src/pages/main-pages/BrowsePlacePage.jsx` - Enhanced with image fetching

## Firebase Storage Security Rules Setup

### 1. Access Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Storage** > **Rules**

### 2. Deploy Security Rules

1. Copy the contents of `FIREBASE_STORAGE_RULES.txt`
2. Replace the existing rules in the Firebase Console
3. Click **Publish** to deploy the rules

### 3. Test Rules (Optional)

1. Use the **Rules Playground** in Firebase Console
2. Test different scenarios:
   - Authenticated user uploading profile image
   - Public access to post images
   - Admin access to all files

## Storage Structure

The Firebase Storage is organized as follows:

```
gs://your-project.appspot.com/
├── profiles/
│   └── {userId}/
│       └── {timestamp}_{filename}
├── id-documents/
│   └── {userId}/
│       └── {timestamp}_{filename}
├── posts/
│   └── {postId}/
│       └── {timestamp}_{filename}
├── admin/
│   └── {adminFiles}
└── temp/
    └── {userId}/
        └── {temporaryFiles}
```

## New Storage Service Functions

### Image Upload Functions

- `uploadImage(file, path)` - Upload single image
- `uploadMultipleImages(files, path, onProgress)` - Upload multiple images
- `uploadCompressedImage(file, path, options)` - Upload with compression
- `uploadMultipleCompressedImages(files, path, options, onProgress)` - Upload multiple with compression

### Image Fetching Functions

- `fetchImageUrl(imagePath)` - Get single image URL
- `fetchMultipleImageUrls(imagePaths)` - Get multiple image URLs
- `listImagesInFolder(folderPath)` - List all images in a folder

### Image Management Functions

- `deleteImage(imagePath)` - Delete single image
- `deleteMultipleImages(imagePaths)` - Delete multiple images

### Validation Functions

- `validateImage(file)` - Validate single image
- `validateImages(files)` - Validate multiple images
- `validateRequiredImages(files, minCount, maxCount)` - Validate required images

### Compression Functions

- `compressImage(file, maxWidth, maxHeight, quality)` - Client-side compression

## Mandatory Image Upload Requirements

### 1. User Signup Flow

- **Profile Image**: Required for all users
- **ID Front Image**: Required for boarding_owner users
- **ID Back Image**: Required for boarding_owner users

### 2. Post Creation

- **Property Images**: Minimum 1, maximum 5 images required
- Images are automatically compressed before upload
- Progress indicators show upload status

### 3. Form Validation

- All image upload fields show "Required" indicators
- Clear error messages when images are missing
- Form submission blocked without required images

## Implementation Details

### Image Compression

- **Profile Images**: 800x800px, 80% quality
- **ID Documents**: 1200x1200px, 90% quality
- **Post Images**: 1920x1080px, 80% quality
- Automatic fallback to original upload if compression fails

### Error Handling

- Comprehensive error messages for validation failures
- Progress indicators for upload operations
- Graceful fallback for failed operations
- User-friendly error displays

### Security Features

- User-based access control for personal files
- Public read access for post images
- Admin access for management operations
- File type and size validation at storage level

## Testing Checklist

### 1. Upload Functionality

- [ ] Profile image upload during signup
- [ ] ID document upload during signup
- [ ] Property image upload during post creation
- [ ] Image compression working correctly
- [ ] Progress indicators displaying properly

### 2. Validation

- [ ] Required image validation working
- [ ] File type validation (JPEG, PNG, WebP)
- [ ] File size validation (3MB limit)
- [ ] Minimum/maximum image count validation

### 3. Security

- [ ] Users can only access their own profile images
- [ ] Users can only access their own ID documents
- [ ] Post images are publicly readable
- [ ] Admin access working correctly

### 4. Error Handling

- [ ] Network errors handled gracefully
- [ ] Invalid file types rejected
- [ ] Oversized files rejected
- [ ] Missing required images blocked

### 5. User Experience

- [ ] Clear error messages displayed
- [ ] Progress indicators working
- [ ] Form validation preventing submission
- [ ] Image previews showing correctly

## Troubleshooting

### Common Issues

1. **Images not uploading**

   - Check Firebase Storage rules
   - Verify authentication status
   - Check file size and type

2. **Compression not working**

   - Check browser compatibility
   - Verify image file types
   - Check console for errors

3. **Security rule violations**

   - Verify user authentication
   - Check file path structure
   - Review rule conditions

4. **Performance issues**
   - Monitor image sizes
   - Check compression settings
   - Review upload progress

### Debug Steps

1. Check browser console for errors
2. Verify Firebase Storage rules
3. Test with different file types
4. Check network connectivity
5. Review authentication status

## Maintenance

### Regular Tasks

- Monitor storage usage
- Review access logs
- Update security rules as needed
- Clean up temporary files
- Monitor performance metrics

### Storage Optimization

- Implement automatic cleanup for temp files
- Monitor storage costs
- Consider CDN integration for better performance
- Review compression settings periodically

## Support

For issues or questions:

1. Check this documentation
2. Review Firebase Storage documentation
3. Check browser console for errors
4. Verify Firebase project configuration
5. Test with different browsers/devices

## Security Considerations

- All images are validated before upload
- User access is strictly controlled
- File types and sizes are enforced
- Admin access is properly restricted
- Temporary files are cleaned up automatically

## Performance Notes

- Images are compressed before upload to reduce storage costs
- Progress indicators provide user feedback
- Error handling prevents failed uploads from blocking the UI
- Caching is implemented for better performance
