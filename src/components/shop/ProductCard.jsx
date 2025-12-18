import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wine, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { getImageUrl } from '@/utils/images';

export default function ProductCard({ product, language }) {
  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cart = JSON.parse(localStorage.getItem('portell_cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: language === 'en' && product.name_en ? product.name_en : product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1
      });
    }
    
    localStorage.setItem('portell_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast.success(language === 'pl' ? 'Dodano do koszyka' : 'Added to cart');
  };

  const categoryLabels = {
    pl: {
      red: 'Czerwone',
      white: 'Białe',
      rose: 'Różowe',
      sparkling: 'Musujące',
      bundle: 'Zestaw'
    },
    en: {
      red: 'Red',
      white: 'White',
      rose: 'Rosé',
      sparkling: 'Sparkling',
      bundle: 'Bundle'
    }
  };

  const t = {
    pl: {
      addToCart: 'Dodaj do koszyka',
      outOfStock: 'Wyprzedane'
    },
    en: {
      addToCart: 'Add to cart',
      outOfStock: 'Out of stock'
    }
  }[language];

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <Link to={createPageUrl(`ProductDetail?id=${product.id}`)}>
      <div className="group cursor-pointer bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
        {/* Image */}
        <div className="aspect-[3/4] bg-neutral-100 overflow-hidden relative">
          <img
            src={getImageUrl(product.image_url, product.category)}
            alt={language === 'en' && product.name_en ? product.name_en : product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/95 text-neutral-900 hover:bg-white">
                {categoryLabels[language][product.category]}
              </Badge>
            </div>
          )}

          {/* Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-4 right-4">
              <Badge variant="destructive" className="bg-red-500">
                {t.outOfStock}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-light text-neutral-900 mb-2 group-hover:text-[var(--portell-burgundy)] transition-colors">
            {language === 'en' && product.name_en ? product.name_en : product.name}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
            {product.vintage && <span>{product.vintage}</span>}
            {product.vintage && product.region && <span>•</span>}
            {product.region && <span>{product.region}</span>}
          </div>

          {product.tasting_notes && (
            <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
              {language === 'en' && product.tasting_notes_en ? product.tasting_notes_en : product.tasting_notes}
            </p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <div>
              <span className="text-2xl font-light text-neutral-900">{product.price.toFixed(2)}</span>
              <span className="text-sm text-neutral-500 ml-1">PLN</span>
            </div>
            
            <Button
              onClick={addToCart}
              disabled={isOutOfStock}
              className="bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t.addToCart}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}