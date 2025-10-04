import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Validate image file
export const validateImage = (file) => {
  const errors = [];

  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    errors.push("Only JPEG, PNG, and WebP formats are allowed");
  }

  // Check file size (3MB limit)
  const maxSize = 3 * 1024 * 1024; // 3MB in bytes
  if (file.size > maxSize) {
    errors.push("File size must be under 3MB");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate multiple images (for post uploads)
export const validateImages = (files) => {
  const errors = [];

  // Check number of files
  if (files.length > 5) {
    errors.push("Maximum 5 images allowed");
  }

  // Validate each file
  files.forEach((file, index) => {
    const validation = validateImage(file);
    if (!validation.isValid) {
      errors.push(`Image ${index + 1}: ${validation.errors.join(", ")}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// UPLOAD single image
export const uploadImage = async (file, path) => {
  // Validate image first
  const validation = validateImage(file);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(", "));
  }

  // Generate unique filename with timestamp
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const storageRef = ref(storage, `${path}/${fileName}`);

  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef); // returns public image URL
};

// Upload multiple images with progress callback
export const uploadMultipleImages = async (files, path, onProgress = null) => {
  // Validate all images first
  const validation = validateImages(files);
  if (!validation.isValid) {
    throw new Error(validation.errors.join("\n"));
  }

  const uploadResults = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const imageUrl = await uploadImage(files[i], path);
      uploadResults.push(imageUrl);

      // Call progress callback if provided
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: files.length,
          percentage: Math.round(((i + 1) / files.length) * 100),
        });
      }
    } catch (error) {
      console.error(`Failed to upload image ${i + 1}:`, error);
      errors.push({
        index: i,
        filename: files[i].name,
        error: error.message,
      });
    }
  }

  return {
    success: uploadResults,
    errors,
    successCount: uploadResults.length,
    errorCount: errors.length,
  };
};
