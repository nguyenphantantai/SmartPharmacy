// Utility function to handle image URLs
export function getImageUrl(imageUrl: string): string {
  if (!imageUrl) return '';

  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    console.log('🖼️ Using full URL:', imageUrl);
    return imageUrl;
  }

  // If it's a relative path, use direct backend URL
  if (imageUrl.startsWith('/')) {
    const fullUrl = `http://localhost:5000${imageUrl}`;
    console.log('🖼️ Using direct backend URL:', fullUrl);
    return fullUrl;
  }

  // Fallback: return as is
  console.log('🖼️ Using fallback URL:', imageUrl);
  return imageUrl;
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