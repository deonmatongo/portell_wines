import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { apiClient } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Wine, Loader2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getImageUrl } from '@/utils/images';

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const products = await apiClient.entities.Product.filter({ id: productId, active: true });
      return products[0];
    },
    enabled: !!productId
  });

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('portell_cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: language === 'en' && product.name_en ? product.name_en : product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: quantity
      });
    }
    
    localStorage.setItem('portell_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast.success(language === 'pl' ? 'Dodano do koszyka' : 'Added to cart');
  };

  const t = {
    pl: {
      back: 'Powrót do sklepu',
      addToCart: 'Dodaj do koszyka',
      outOfStock: 'Wyprzedane',
      quantity: 'Ilość',
      details: 'Szczegóły',
      vintage: 'Rocznik',
      region: 'Region',
      grapes: 'Szczep',
      alcohol: 'Alkohol',
      volume: 'Pojemność',
      tastingNotes: 'Notatki degustacyjne',
      inStock: 'Dostępne',
      limitedStock: 'Ograniczona dostępność'
    },
    en: {
      back: 'Back to shop',
      addToCart: 'Add to cart',
      outOfStock: 'Out of stock',
      quantity: 'Quantity',
      details: 'Details',
      vintage: 'Vintage',
      region: 'Region',
      grapes: 'Grapes',
      alcohol: 'Alcohol',
      volume: 'Volume',
      tastingNotes: 'Tasting notes',
      inStock: 'In stock',
      limitedStock: 'Limited stock'
    }
  }[language];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--portell-burgundy)]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-neutral-500 mb-6">
            {language === 'pl' ? 'Produkt nie znaleziony' : 'Product not found'}
          </p>
          <Link to={createPageUrl('Shop')}>
            <Button variant="outline">{t.back}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const defaultImage = getImageUrl(null, product?.category);
  const images = [product?.image_url || defaultImage, ...(product?.gallery || [])].filter(Boolean);
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const isLimitedStock = product.stock !== undefined && product.stock > 0 && product.stock <= 10;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 sm:py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <Link to={createPageUrl('Shop')} className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-[3/4] bg-neutral-100 rounded-sm overflow-hidden mb-4">
              <img
                src={images[selectedImage] || defaultImage}
                alt={language === 'en' && product.name_en ? product.name_en : product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-neutral-100 rounded-sm overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-[var(--portell-burgundy)]' : ''
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4">
              {product.category && (
                <Badge className="mb-4">
                  {product.category}
                </Badge>
              )}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-neutral-900 mb-4 break-words">
                {language === 'en' && product.name_en ? product.name_en : product.name}
              </h1>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl sm:text-4xl font-light text-neutral-900">{product.price.toFixed(2)}</span>
                <span className="text-lg sm:text-xl text-neutral-500">PLN</span>
              </div>

              {!isOutOfStock && isLimitedStock && (
                <Badge variant="outline" className="border-orange-500 text-orange-600 mb-4">
                  {t.limitedStock} ({product.stock})
                </Badge>
              )}
            </div>

            {product.description && (
              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed mb-8">
                {language === 'en' && product.description_en ? product.description_en : product.description}
              </p>
            )}

            {/* Quantity & Add to Cart */}
            <div className="mb-8 pb-8 border-b border-neutral-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center justify-center gap-2 border border-neutral-300 rounded-sm w-full sm:w-auto">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-neutral-100"
                    disabled={isOutOfStock}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-16 text-center text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-neutral-100"
                    disabled={isOutOfStock}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <Button
                  onClick={addToCart}
                  disabled={isOutOfStock}
                  className="flex-1 bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90 h-auto py-3 w-full sm:w-auto"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isOutOfStock ? t.outOfStock : t.addToCart}
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-light text-neutral-900">{t.details}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {product.vintage && (
                  <div>
                    <p className="text-neutral-500 mb-1">{t.vintage}</p>
                    <p className="text-neutral-900 font-medium">{product.vintage}</p>
                  </div>
                )}
                {product.region && (
                  <div>
                    <p className="text-neutral-500 mb-1">{t.region}</p>
                    <p className="text-neutral-900 font-medium">{product.region}</p>
                  </div>
                )}
                {product.grape_variety && (
                  <div>
                    <p className="text-neutral-500 mb-1">{t.grapes}</p>
                    <p className="text-neutral-900 font-medium">{product.grape_variety}</p>
                  </div>
                )}
                {product.alcohol && (
                  <div>
                    <p className="text-neutral-500 mb-1">{t.alcohol}</p>
                    <p className="text-neutral-900 font-medium">{product.alcohol}</p>
                  </div>
                )}
                {product.volume && (
                  <div>
                    <p className="text-neutral-500 mb-1">{t.volume}</p>
                    <p className="text-neutral-900 font-medium">{product.volume}</p>
                  </div>
                )}
              </div>

              {product.tasting_notes && (
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">{t.tastingNotes}</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    {language === 'en' && product.tasting_notes_en ? product.tasting_notes_en : product.tasting_notes}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}