// Portell Wine Images
// These are default images to use when products/events don't have images
// Update these URLs with your actual uploaded image paths

const BASE_STORAGE_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/portell/public/69431027d88b346325b4161a';

export const DEFAULT_IMAGES = {
  // Hero section - Portell rosé wine bottle on beach
  hero: `${BASE_STORAGE_URL}/portell-rose-beach-bottle.jpg`,
  
  // Product defaults by category
  red: `${BASE_STORAGE_URL}/portell-merlot-red-wine-bottle.jpg`,
  white: `${BASE_STORAGE_URL}/portell-blanc-de-blancs-white-wine.jpg`,
  rose: `${BASE_STORAGE_URL}/portell-rose-beach-bottle.jpg`,
  sparkling: `${BASE_STORAGE_URL}/portell-cava-brut-nature-reserva.jpg`,
  bundle: `${BASE_STORAGE_URL}/portell-six-cava-bottles-collection.jpg`,
  
  // Default product image - Cava Brut Nature Reserva
  product: `${BASE_STORAGE_URL}/portell-cava-brut-nature-reserva.jpg`,
  
  // Event defaults - Cava in ice bucket with strawberries
  event: `${BASE_STORAGE_URL}/portell-cava-ice-bucket-strawberries.jpg`,
  
  // About section - Three Portell Cava bottles
  about: `${BASE_STORAGE_URL}/portell-three-cava-bottles.jpg`,
  
  // Category images
  categories: {
    red: `${BASE_STORAGE_URL}/portell-merlot-red-wine-bottle.jpg`,
    white: `${BASE_STORAGE_URL}/portell-blanc-de-blancs-white-wine.jpg`,
    rose: `${BASE_STORAGE_URL}/portell-rose-beach-bottle.jpg`,
    sparkling: `${BASE_STORAGE_URL}/portell-cava-brut-nature-reserva.jpg`
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

