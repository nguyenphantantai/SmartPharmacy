import { API_BASE } from './utils';
import { getSupabaseImageUrl } from './supabase';

// Utility function to handle image URLs
// Supports: Supabase URLs, local backend URLs, relative paths, and filenames
export function getImageUrl(imageUrl: string | undefined): string {
  if (!imageUrl || imageUrl.trim() === '') {
    // Return default image if no imageUrl provided
    return `${API_BASE}/medicine-images/default-medicine.jpg`;
  }

  // Trim whitespace
  imageUrl = imageUrl.trim();

  // If it's already a full URL (including Supabase URLs), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // Supabase URLs are already correct, return as is
    if (import.meta.env.DEV) {
      console.log('✅ Using full URL:', imageUrl.substring(0, 100) + '...');
    }
    return imageUrl;
  }

  // Check if it's a Supabase path format (bucket/path)
  // Example: "medicine-images/medicines/medicine_123.jpg"
  if (imageUrl.includes('/') && !imageUrl.startsWith('/')) {
    const parts = imageUrl.split('/');
    const bucket = parts[0];
    
    // Check if it's a known Supabase bucket
    if (['medicine-images', 'user-avatars', 'prescriptions_images'].includes(bucket)) {
      const filePath = parts.slice(1).join('/');
      const supabaseUrl = getSupabaseImageUrl(bucket, filePath);
      
      // If Supabase URL generation failed, fallback to backend
      if (!supabaseUrl || supabaseUrl === '') {
        // Only log in development
        if (import.meta.env.DEV) {
          console.warn('⚠️ Failed to generate Supabase URL, falling back to backend');
        }
        return `${API_BASE}/medicine-images/${imageUrl}`;
      }
      
      return supabaseUrl;
    }
  }

  // If it's a relative path starting with /, use backend URL
  if (imageUrl.startsWith('/')) {
    return `${API_BASE}${imageUrl}`;
  }

  // If it's a filename without path, assume it's in medicine-images folder
  // This handles cases where admin might save just the filename
  return `${API_BASE}/medicine-images/${imageUrl}`;
}

// Function to check if a product has a valid image
export function hasValidImage(imageUrl: string): boolean {
  if (!imageUrl) return false;
  
  // Check if it's a placeholder or default image
  const invalidImages = [
    'https://via.placeholder.com',
    '/medicine-images/default-medicine.jpg',
    'default-medicine.jpg',
    'placeholder',
    'default'
  ];
  
  return !invalidImages.some(invalid => imageUrl.includes(invalid));
}