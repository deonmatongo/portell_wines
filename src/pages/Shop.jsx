import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wine, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/shop/ProductCard';

export default function Shop() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';
  
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.filter({ active: true }, '-created_date', 100)
  });

  const t = {
    pl: {
      title: 'Sklep',
      subtitle: 'Odkryj naszą kolekcję wyjątkowych win',
      all: 'Wszystkie',
      red: 'Czerwone',
      white: 'Białe',
      rose: 'Różowe',
      sparkling: 'Musujące',
      bundle: 'Zestawy',
      sortBy: 'Sortuj',
      sortName: 'Nazwa',
      sortPriceAsc: 'Cena: rosnąco',
      sortPriceDesc: 'Cena: malejąco',
      noProducts: 'Brak produktów',
      loading: 'Ładowanie...'
    },
    en: {
      title: 'Shop',
      subtitle: 'Discover our collection of exceptional wines',
      all: 'All',
      red: 'Red',
      white: 'White',
      rose: 'Rosé',
      sparkling: 'Sparkling',
      bundle: 'Bundles',
      sortBy: 'Sort by',
      sortName: 'Name',
      sortPriceAsc: 'Price: Low to High',
      sortPriceDesc: 'Price: High to Low',
      noProducts: 'No products',
      loading: 'Loading...'
    }
  }[language];

  const filteredProducts = products
    .filter(p => category === 'all' || p.category === category)
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="py-20 px-6 lg:px-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-neutral-600">{t.subtitle}</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
            <Tabs value={category} onValueChange={setCategory}>
              <TabsList className="flex-wrap h-auto gap-2">
                <TabsTrigger value="all">{t.all}</TabsTrigger>
                <TabsTrigger value="red">{t.red}</TabsTrigger>
                <TabsTrigger value="white">{t.white}</TabsTrigger>
                <TabsTrigger value="rose">{t.rose}</TabsTrigger>
                <TabsTrigger value="sparkling">{t.sparkling}</TabsTrigger>
                <TabsTrigger value="bundle">{t.bundle}</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t.sortName}</SelectItem>
                <SelectItem value="price-asc">{t.sortPriceAsc}</SelectItem>
                <SelectItem value="price-desc">{t.sortPriceDesc}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 text-neutral-300 animate-spin mx-auto mb-4" />
              <p className="text-neutral-500">{t.loading}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Wine className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-xl text-neutral-500">{t.noProducts}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                >
                  <ProductCard product={product} language={language} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}