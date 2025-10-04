import axios from 'axios';

// Strapi Configuration
// Update these values based on your Strapi setup
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN || '';

// Create axios instance with default config
const strapiApi = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
  },
});

/**
 * Upload a single image to Strapi
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} - Returns the uploaded file data from Strapi
 */
export const uploadImageToStrapi = async (file) => {
  try {
    const formData = new FormData();
    formData.append('files', file);

    const response = await strapiApi.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Strapi returns array of uploaded files
    return response.data[0];
  } catch (error) {
    console.error('Error uploading image to Strapi:', error);
    throw new Error('Failed to upload image: ' + error.message);
  }
};

/**
 * Upload multiple images to Strapi
 * @param {File[]} files - Array of image files to upload
 * @returns {Promise<Object[]>} - Returns array of uploaded file data from Strapi
 */
export const uploadImagesToStrapi = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await strapiApi.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading images to Strapi:', error);
    throw new Error('Failed to upload images: ' + error.message);
  }
};

/**
 * Upload a video to Strapi
 * @param {File} file - The video file to upload
 * @returns {Promise<Object>} - Returns the uploaded file data from Strapi
 */
export const uploadVideoToStrapi = async (file) => {
  try {
    const formData = new FormData();
    formData.append('files', file);

    const response = await strapiApi.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data[0];
  } catch (error) {
    console.error('Error uploading video to Strapi:', error);
    throw new Error('Failed to upload video: ' + error.message);
  }
};

/**
 * Upload multiple videos to Strapi
 * @param {File[]} files - Array of video files to upload
 * @returns {Promise<Object[]>} - Returns array of uploaded file data from Strapi
 */
export const uploadVideosToStrapi = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await strapiApi.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading videos to Strapi:', error);
    throw new Error('Failed to upload videos: ' + error.message);
  }
};

/**
 * Get full URL for Strapi media
 * @param {string} url - The URL path from Strapi (can be relative or absolute)
 * @returns {string} - Full URL to access the media
 */
export const getStrapiMediaUrl = (url) => {
  if (!url) return '';
  
  // If URL is already absolute, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, prepend Strapi URL
  return `${STRAPI_URL}${url}`;
};

/**
 * Delete a file from Strapi
 * @param {string} fileId - The ID of the file to delete
 * @returns {Promise<void>}
 */
export const deleteFileFromStrapi = async (fileId) => {
  try {
    await strapiApi.delete(`/api/upload/files/${fileId}`);
  } catch (error) {
    console.error('Error deleting file from Strapi:', error);
    throw new Error('Failed to delete file: ' + error.message);
  }
};

