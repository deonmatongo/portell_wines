
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Menu, X, Globe, ShoppingBag, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('portell_lang', language);
    window.dispatchEvent(new CustomEvent('languageChange', { detail: language }));
  }, [language]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('portell_cart') || '[]');
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));

    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem('portell_cart') || '[]');
      setCartCount(updatedCart.reduce((sum, item) => sum + item.quantity, 0));
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const t = {
    pl: {
      home: 'Start',
      about: 'O nas',
      wines: 'Wina',
      events: 'Wydarzenia',
      contact: 'Kontakt',
      admin: 'Panel',
      cart: 'Koszyk',
      searchPlaceholder: 'Szukaj win, wydarzeń...'
    },
    en: {
      home: 'Home',
      about: 'About',
      wines: 'Wines',
      events: 'Events',
      contact: 'Contact',
      admin: 'Admin',
      cart: 'Cart',
      searchPlaceholder: 'Search wines, events...'
    }
  }[language];

  const navLinks = [
    { name: t.home, page: 'Home' },
    { name: t.about, page: 'About' },
    { name: t.wines, page: 'Shop' },
    { name: t.events, page: 'Events' },
    { name: t.contact, page: 'Contact' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(createPageUrl('Search') + `?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <style>{`
        :root {
          --portell-burgundy: #5C2E2E;
          --portell-cream: #F8F6F3;
          --portell-charcoal: #2B2B2B;
          --portell-gold: #B89968;
        }
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="group">
              <h1 className="text-2xl font-light tracking-[0.2em] text-neutral-900 transition-all duration-300 group-hover:tracking-[0.25em]">
                PORTELL
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map(link => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className={`text-sm tracking-wider transition-all duration-300 hover:text-[var(--portell-burgundy)] ${
                    currentPageName === link.page ? 'text-[var(--portell-burgundy)] font-medium' : 'text-neutral-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Language Switcher - Desktop Only */}
              <button
                onClick={() => setLanguage(language === 'pl' ? 'en' : 'pl')}
                className="hidden md:flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase font-medium">{language}</span>
              </button>

              {/* Search - Desktop Only */}
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-64 h-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="hover:bg-neutral-100"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="hidden md:flex hover:bg-neutral-100"
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}

              {/* Cart - Desktop Only */}
              <Link to={createPageUrl('Cart')} className="relative hidden md:block">
                <Button variant="ghost" size="icon" className="hover:bg-neutral-100">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--portell-burgundy)] text-white text-xs rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Admin Link - Desktop Only */}
              <Link to={createPageUrl('AdminLogin')} className="hidden md:block">
                <Button variant="ghost" size="icon" className="hover:bg-neutral-100">
                  <User className="w-5 h-5" />
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-neutral-900"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-neutral-200">
            <div className="px-6 py-6 space-y-4">
              {/* Navigation Links */}
              {navLinks.map(link => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-lg text-neutral-700 hover:text-[var(--portell-burgundy)] transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t border-neutral-200 my-4"></div>

              {/* Search */}
              <Link
                to={createPageUrl('Search')}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-lg text-neutral-700 hover:text-[var(--portell-burgundy)] transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>{t.searchPlaceholder}</span>
              </Link>

              {/* Cart */}
              <Link
                to={createPageUrl('Cart')}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-lg text-neutral-700 hover:text-[var(--portell-burgundy)] transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{t.cart}</span>
                {cartCount > 0 && (
                  <span className="ml-auto w-6 h-6 bg-[var(--portell-burgundy)] text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Admin */}
              <Link
                to={createPageUrl('AdminLogin')}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-lg text-neutral-700 hover:text-[var(--portell-burgundy)] transition-colors"
              >
                <User className="w-5 h-5" />
                <span>{t.admin}</span>
              </Link>

              {/* Language Switcher */}
              <button
                onClick={() => {
                  setLanguage(language === 'pl' ? 'en' : 'pl');
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 text-lg text-neutral-700 hover:text-[var(--portell-burgundy)] transition-colors w-full"
              >
                <Globe className="w-5 h-5" />
                <span>{language === 'pl' ? 'English' : 'Polski'}</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--portell-charcoal)] text-neutral-300 mt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-light tracking-[0.2em] text-white mb-4">PORTELL</h3>
              <p className="text-sm leading-relaxed text-neutral-400 max-w-md">
                {language === 'pl' 
                  ? 'Winnica Portell. Tworzymy wina z pasją, szacunkiem dla tradycji i oka na przyszłość.'
                  : 'Portell Winery. Crafting wines with passion, respect for tradition, and an eye on the future.'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium tracking-wider text-white mb-4 uppercase">
                {language === 'pl' ? 'Menu' : 'Menu'}
              </h4>
              <div className="space-y-2">
                {navLinks.map(link => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    className="block text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium tracking-wider text-white mb-4 uppercase">
                {language === 'pl' ? 'Prawne' : 'Legal'}
              </h4>
              <div className="space-y-2">
                <Link to={createPageUrl('Privacy')} className="block text-sm text-neutral-400 hover:text-white transition-colors">
                  {language === 'pl' ? 'Polityka prywatności' : 'Privacy Policy'}
                </Link>
                <Link to={createPageUrl('Terms')} className="block text-sm text-neutral-400 hover:text-white transition-colors">
                  {language === 'pl' ? 'Regulamin' : 'Terms of Service'}
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} Portell. {language === 'pl' ? 'Wszelkie prawa zastrzeżone.' : 'All rights reserved.'}
          </div>
        </div>
      </footer>
    </div>
  );
}
