// Utility functions for handling image URLs

const getBackendUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace('/api', '');
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it starts with /uploads, construct the full URL
  if (imagePath.startsWith('/uploads')) {
    return `${getBackendUrl()}${imagePath}`;
  }
  
  // If it's just a filename, assume it's in uploads/thumbnails
  return `${getBackendUrl()}/uploads/thumbnails/${imagePath}`;
};

export const getThumbnailUrl = (thumbnailPath) => {
  return getImageUrl(thumbnailPath);
};

export const getVideoUrl = (videoPath) => {
  if (!videoPath) return null;
  
  if (videoPath.startsWith('http')) {
    return videoPath;
  }
  
  if (videoPath.startsWith('/uploads')) {
    return `${getBackendUrl()}${videoPath}`;
  }
  
  return `${getBackendUrl()}/uploads/videos/${videoPath}`;
};

export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;
  
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }
  
  if (avatarPath.startsWith('/uploads')) {
    return `${getBackendUrl()}${avatarPath}`;
  }
  
  return `${getBackendUrl()}/uploads/avatars/${avatarPath}`;
};