import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Cart() {
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    loadCart();
    const handleCartUpdate = () => loadCart();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem('portell_cart') || '[]');
    setCart(cartData);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('portell_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('portell_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem('portell_cart', '[]');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const t = {
    pl: {
      title: 'Koszyk',
      empty: 'Twój koszyk jest pusty',
      continueShopping: 'Kontynuuj zakupy',
      item: 'Produkt',
      price: 'Cena',
      quantity: 'Ilość',
      total: 'Suma',
      subtotal: 'Suma częściowa',
      shipping: 'Dostawa',
      shippingCost: 'Obliczane przy kasie',
      orderTotal: 'Łącznie',
      clearCart: 'Wyczyść koszyk',
      checkout: 'Przejdź do kasy'
    },
    en: {
      title: 'Cart',
      empty: 'Your cart is empty',
      continueShopping: 'Continue shopping',
      item: 'Item',
      price: 'Price',
      quantity: 'Quantity',
      total: 'Total',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      shippingCost: 'Calculated at checkout',
      orderTotal: 'Order total',
      clearCart: 'Clear cart',
      checkout: 'Proceed to checkout'
    }
  }[language];

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-20 px-6">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-neutral-300 mx-auto mb-6" />
          <h2 className="text-3xl font-light text-neutral-900 mb-4">{t.empty}</h2>
          <Link to={createPageUrl('Shop')}>
            <Button className="bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90">
              {t.continueShopping}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-12">
          {t.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-neutral-200 text-sm font-medium text-neutral-600">
                <div className="col-span-6">{t.item}</div>
                <div className="col-span-2 text-center">{t.price}</div>
                <div className="col-span-2 text-center">{t.quantity}</div>
                <div className="col-span-2 text-right">{t.total}</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-neutral-200">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-6 flex gap-4">
                        <div className="w-20 h-20 bg-neutral-100 rounded-sm overflow-hidden flex-shrink-0">
                          {item.image_url && (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-neutral-900">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-sm text-red-600 hover:text-red-700 mt-2 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            {language === 'pl' ? 'Usuń' : 'Remove'}
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-2 text-center">
                        <span className="text-neutral-900">{item.price.toFixed(2)} PLN</span>
                      </div>

                      <div className="md:col-span-2 flex justify-center">
                        <div className="flex items-center gap-2 border border-neutral-300 rounded-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-neutral-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-neutral-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-2 text-right">
                        <span className="text-lg font-medium text-neutral-900">
                          {(item.price * item.quantity).toFixed(2)} PLN
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t.clearCart}
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-light text-neutral-900 mb-6">
                {language === 'pl' ? 'Podsumowanie' : 'Order summary'}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-neutral-600">
                  <span>{t.subtotal}</span>
                  <span>{subtotal.toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>{t.shipping}</span>
                  <span className="text-sm">{t.shippingCost}</span>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-medium">
                  <span>{t.orderTotal}</span>
                  <span>{subtotal.toFixed(2)} PLN</span>
                </div>
              </div>

              <Link to={createPageUrl('Checkout')}>
                <Button className="w-full bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90 mb-4">
                  {t.checkout}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>

              <Link to={createPageUrl('Shop')}>
                <Button variant="outline" className="w-full">
                  {t.continueShopping}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}