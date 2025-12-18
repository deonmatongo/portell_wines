import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search as SearchIcon, Wine, Calendar, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from '../components/events/EventCard';
import ProductCard from '../components/shop/ProductCard';

export default function Search() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';
  
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Product filters
  const [productCategory, setProductCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [productSort, setProductSort] = useState('name');
  const [wineType, setWineType] = useState('all');
  const [vintage, setVintage] = useState('all');
  const [grapeVariety, setGrapeVariety] = useState('all');
  
  // Event filters
  const [eventType, setEventType] = useState('all');
  const [eventSort, setEventSort] = useState('date');

  useEffect(() => {
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.filter({ active: true }, '-created_date', 100)
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.filter({ active: true }, 'date', 100)
  });

  const t = {
    pl: {
      title: 'Szukaj',
      placeholder: 'Szukaj win, wydarzeń...',
      search: 'Szukaj',
      filters: 'Filtry',
      hideFilters: 'Ukryj filtry',
      all: 'Wszystko',
      products: 'Wina',
      events: 'Wydarzenia',
      category: 'Kategoria',
      allCategories: 'Wszystkie',
      red: 'Czerwone',
      white: 'Białe',
      rose: 'Różowe',
      sparkling: 'Musujące',
      bundle: 'Zestawy',
      wineType: 'Typ wina',
      allTypes: 'Wszystkie',
      dry: 'Wytrawne',
      semiDry: 'Półwytrawne',
      semiSweet: 'Półsłodkie',
      sweet: 'Słodkie',
      vintage: 'Rocznik',
      allVintages: 'Wszystkie',
      grapeVariety: 'Szczep winogron',
      allVarieties: 'Wszystkie',
      priceRange: 'Zakres cen',
      sortBy: 'Sortuj',
      sortName: 'Nazwa',
      sortPriceAsc: 'Cena: rosnąco',
      sortPriceDesc: 'Cena: malejąco',
      sortDate: 'Data',
      eventType: 'Typ wydarzenia',
      tasting: 'Degustacje',
      dinner: 'Kolacje',
      workshop: 'Warsztaty',
      tour: 'Wycieczki',
      special: 'Specjalne',
      noResults: 'Brak wyników',
      noResultsDesc: 'Spróbuj zmienić kryteria wyszukiwania',
      resultsCount: 'Znaleziono',
      results: 'wyników',
      clearFilters: 'Wyczyść filtry'
    },
    en: {
      title: 'Search',
      placeholder: 'Search wines, events...',
      search: 'Search',
      filters: 'Filters',
      hideFilters: 'Hide filters',
      all: 'All',
      products: 'Wines',
      events: 'Events',
      category: 'Category',
      allCategories: 'All',
      red: 'Red',
      white: 'White',
      rose: 'Rosé',
      sparkling: 'Sparkling',
      bundle: 'Bundles',
      wineType: 'Wine Type',
      allTypes: 'All',
      dry: 'Dry',
      semiDry: 'Semi-Dry',
      semiSweet: 'Semi-Sweet',
      sweet: 'Sweet',
      vintage: 'Vintage',
      allVintages: 'All',
      grapeVariety: 'Grape Variety',
      allVarieties: 'All',
      priceRange: 'Price range',
      sortBy: 'Sort by',
      sortName: 'Name',
      sortPriceAsc: 'Price: Low to High',
      sortPriceDesc: 'Price: High to Low',
      sortDate: 'Date',
      eventType: 'Event type',
      tasting: 'Tastings',
      dinner: 'Dinners',
      workshop: 'Workshops',
      tour: 'Tours',
      special: 'Special',
      noResults: 'No results',
      noResultsDesc: 'Try adjusting your search criteria',
      resultsCount: 'Found',
      results: 'results',
      clearFilters: 'Clear filters'
    }
  }[language];

  // Get unique vintages and grape varieties from products
  const uniqueVintages = [...new Set(products.map(p => p.vintage).filter(Boolean))].sort((a, b) => b - a);
  const uniqueGrapeVarieties = [...new Set(products.map(p => p.grape_variety).filter(Boolean))].sort();

  // Filter and search products
  const filteredProducts = products
    .filter(p => {
      const nameMatch = (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                       (p.name_en?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const descMatch = (p.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                       (p.description_en?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const categoryMatch = productCategory === 'all' || p.category === productCategory;
      const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
      const wineTypeMatch = wineType === 'all' || p.wine_type === wineType;
      const vintageMatch = vintage === 'all' || p.vintage === parseInt(vintage);
      const grapeMatch = grapeVariety === 'all' || p.grape_variety === grapeVariety;
      
      return (nameMatch || descMatch) && categoryMatch && priceMatch && wineTypeMatch && vintageMatch && grapeMatch;
    })
    .sort((a, b) => {
      if (productSort === 'name') return (a.name || '').localeCompare(b.name || '');
      if (productSort === 'price-asc') return a.price - b.price;
      if (productSort === 'price-desc') return b.price - a.price;
      return 0;
    });

  // Filter and search events
  const filteredEvents = events
    .filter(e => {
      const titleMatch = (e.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                        (e.title_en?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const descMatch = (e.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                       (e.description_en?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const typeMatch = eventType === 'all' || e.event_type === eventType;
      
      return (titleMatch || descMatch) && typeMatch;
    })
    .sort((a, b) => {
      if (eventSort === 'date') return new Date(a.date) - new Date(b.date);
      if (eventSort === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (eventSort === 'price-desc') return (b.price || 0) - (a.price || 0);
      return 0;
    });

  const totalResults = filteredProducts.length + filteredEvents.length;

  const clearAllFilters = () => {
    setProductCategory('all');
    setPriceRange([0, 1000]);
    setProductSort('name');
    setWineType('all');
    setVintage('all');
    setGrapeVariety('all');
    setEventType('all');
    setEventSort('date');
    setSearchQuery('');
  };

  const hasActiveFilters = productCategory !== 'all' || wineType !== 'all' || vintage !== 'all' || 
                          grapeVariety !== 'all' || eventType !== 'all' || searchQuery;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="py-20 px-6 lg:px-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-6">
              {t.title}
            </h1>
            
            {/* Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                type="text"
                placeholder={t.placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-14 text-lg border-neutral-300 focus:ring-[var(--portell-burgundy)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filters Toggle */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? t.hideFilters : t.filters}
            </Button>
            
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearAllFilters} className="gap-2">
                <X className="w-4 h-4" />
                {t.clearFilters}
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-sm p-6 shadow-sm sticky top-24 space-y-6">
                  <div>
                    <h3 className="font-medium mb-4 text-neutral-900">{t.products}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-neutral-600">{t.category}</Label>
                        <Select value={productCategory} onValueChange={setProductCategory}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t.allCategories}</SelectItem>
                            <SelectItem value="red">{t.red}</SelectItem>
                            <SelectItem value="white">{t.white}</SelectItem>
                            <SelectItem value="rose">{t.rose}</SelectItem>
                            <SelectItem value="sparkling">{t.sparkling}</SelectItem>
                            <SelectItem value="bundle">{t.bundle}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm text-neutral-600">{t.wineType}</Label>
                        <Select value={wineType} onValueChange={setWineType}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t.allTypes}</SelectItem>
                            <SelectItem value="dry">{t.dry}</SelectItem>
                            <SelectItem value="semi-dry">{t.semiDry}</SelectItem>
                            <SelectItem value="semi-sweet">{t.semiSweet}</SelectItem>
                            <SelectItem value="sweet">{t.sweet}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm text-neutral-600">{t.vintage}</Label>
                        <Select value={vintage} onValueChange={setVintage}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t.allVintages}</SelectItem>
                            {uniqueVintages.map(v => (
                              <SelectItem key={v} value={v.toString()}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm text-neutral-600">{t.grapeVariety}</Label>
                        <Select value={grapeVariety} onValueChange={setGrapeVariety}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t.allVarieties}</SelectItem>
                            {uniqueGrapeVarieties.map(g => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm text-neutral-600">{t.priceRange}</Label>
                        <div className="mt-4 px-2">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={1000}
                            step={10}
                            className="mb-4"
                          />
                          <div className="flex justify-between text-sm text-neutral-600">
                            <span>{priceRange[0]} PLN</span>
                            <span>{priceRange[1]} PLN</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-neutral-600">{t.sortBy}</Label>
                        <Select value={productSort} onValueChange={setProductSort}>
                          <SelectTrigger className="mt-2">
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
                  </div>

                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="font-medium mb-4 text-neutral-900">{t.events}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-neutral-600">{t.eventType}</Label>
                        <Select value={eventType} onValueChange={setEventType}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t.allTypes}</SelectItem>
                            <SelectItem value="tasting">{t.tasting}</SelectItem>
                            <SelectItem value="dinner">{t.dinner}</SelectItem>
                            <SelectItem value="workshop">{t.workshop}</SelectItem>
                            <SelectItem value="tour">{t.tour}</SelectItem>
                            <SelectItem value="special">{t.special}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm text-neutral-600">{t.sortBy}</Label>
                        <Select value={eventSort} onValueChange={setEventSort}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="date">{t.sortDate}</SelectItem>
                            <SelectItem value="price-asc">{t.sortPriceAsc}</SelectItem>
                            <SelectItem value="price-desc">{t.sortPriceDesc}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="mb-6">
              <p className="text-neutral-600">
                {t.resultsCount} <span className="font-medium text-neutral-900">{totalResults}</span> {t.results}
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="all">
                  {t.all} ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="products">
                  {t.products} ({filteredProducts.length})
                </TabsTrigger>
                <TabsTrigger value="events">
                  {t.events} ({filteredEvents.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-12">
                {totalResults === 0 ? (
                  <div className="text-center py-20">
                    <SearchIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-light text-neutral-900 mb-2">{t.noResults}</h3>
                    <p className="text-neutral-500">{t.noResultsDesc}</p>
                  </div>
                ) : (
                  <>
                    {filteredProducts.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-light text-neutral-900 mb-6 flex items-center gap-2">
                          <Wine className="w-6 h-6" />
                          {t.products}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} language={language} />
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredEvents.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-light text-neutral-900 mb-6 flex items-center gap-2">
                          <Calendar className="w-6 h-6" />
                          {t.events}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} language={language} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="products">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20">
                    <Wine className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-light text-neutral-900 mb-2">{t.noResults}</h3>
                    <p className="text-neutral-500">{t.noResultsDesc}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} language={language} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="events">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-20">
                    <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-light text-neutral-900 mb-2">{t.noResults}</h3>
                    <p className="text-neutral-500">{t.noResultsDesc}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map(event => (
                      <EventCard key={event.id} event={event} language={language} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}