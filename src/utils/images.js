// Portell Wine Images
// These are default images to use when products/events don't have images
// Using existing image files from storage

const BASE_STORAGE_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69431027d88b346325b4161a';

export const DEFAULT_IMAGES = {
  // Hero section - Portell rosé wine bottle on beach (using existing image)
  hero: `${BASE_STORAGE_URL}/fa1d1e281_2023-07-11_13-35-34_UTC.jpg`,
  
  // Product defaults by category (using existing images)
  red: `${BASE_STORAGE_URL}/212c0c2a5_2023-04-02_12-18-39_UTC.jpg`,
  white: `${BASE_STORAGE_URL}/eaef5fb37_2023-07-30_09-23-10_UTC.jpg`,
  rose: `${BASE_STORAGE_URL}/fa1d1e281_2023-07-11_13-35-34_UTC.jpg`,
  sparkling: `${BASE_STORAGE_URL}/6b8c7119e_2023-12-19_11-27-21_UTC.jpg`,
  bundle: `${BASE_STORAGE_URL}/ede8b0c24_2023-03-17_15-53-01_UTC.jpg`,
  
  // Default product image
  product: `${BASE_STORAGE_URL}/fa1d1e281_2023-07-11_13-35-34_UTC.jpg`,
  
  // Event defaults
  event: `${BASE_STORAGE_URL}/ede8b0c24_2023-03-17_15-53-01_UTC.jpg`,
  
  // About section
  about: `${BASE_STORAGE_URL}/ede8b0c24_2023-03-17_15-53-01_UTC.jpg`,
  
  // Category images
  categories: {
    red: `${BASE_STORAGE_URL}/212c0c2a5_2023-04-02_12-18-39_UTC.jpg`,
    white: `${BASE_STORAGE_URL}/eaef5fb37_2023-07-30_09-23-10_UTC.jpg`,
    rose: `${BASE_STORAGE_URL}/fa1d1e281_2023-07-11_13-35-34_UTC.jpg`,
    sparkling: `${BASE_STORAGE_URL}/6b8c7119e_2023-12-19_11-27-21_UTC.jpg`
  }
};

// Helper function to get default image by category
export const getDefaultImage = (category = 'product') => {
  if (category && DEFAULT_IMAGES.categories[category]) {
    return DEFAULT_IMAGES.categories[category];
  }
  return DEFAULT_IMAGES.product;
};

// Helper function to get image or default
export const getImageUrl = (imageUrl, category = 'product') => {
  return imageUrl || getDefaultImage(category);
};

