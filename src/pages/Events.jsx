import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { apiClient } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import EventCard from '../components/events/EventCard';
import RecommendedEvents from '../components/events/RecommendedEvents';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Wine } from 'lucide-react';

export default function Events() {
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => apiClient.entities.Event.filter({ active: true }, 'date', 50)
  });

  const t = {
    pl: {
      title: 'Wydarzenia',
      subtitle: 'Dołącz do nas na degustacjach, warsztatach i specjalnych wydarzeniach',
      all: 'Wszystkie',
      tasting: 'Degustacje',
      dinner: 'Kolacje',
      workshop: 'Warsztaty',
      tour: 'Wycieczki',
      special: 'Specjalne',
      noEvents: 'Brak nadchodzących wydarzeń',
      loading: 'Ładowanie wydarzeń...',
      allEvents: 'Wszystkie wydarzenia'
    },
    en: {
      title: 'Events',
      subtitle: 'Join us for tastings, workshops, and special occasions',
      all: 'All',
      tasting: 'Tastings',
      dinner: 'Dinners',
      workshop: 'Workshops',
      tour: 'Tours',
      special: 'Special',
      noEvents: 'No upcoming events',
      loading: 'Loading events...',
      allEvents: 'All Events'
    }
  }[language];

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.event_type === filter);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative py-32 px-6 lg:px-12 bg-gradient-to-br from-neutral-100 to-neutral-50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1600')] bg-cover bg-center opacity-5" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm text-neutral-600 mb-6 shadow-sm">
              <Calendar className="w-4 h-4" />
              {t.title}
            </div>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              {t.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Recommended Events */}
      <section className="py-12 px-6 lg:px-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <RecommendedEvents language={language} limit={3} />
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 px-6 lg:px-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-light text-neutral-900 mb-6">{t.allEvents}</h2>
          <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <TabsList className="w-full justify-center flex-wrap h-auto gap-2 bg-transparent p-0">
              <TabsTrigger value="all" className="data-[state=active]:bg-[var(--portell-burgundy)] data-[state=active]:text-white">
                {t.all}
              </TabsTrigger>
              <TabsTrigger value="tasting" className="data-[state=active]:bg-[var(--portell-burgundy)] data-[state=active]:text-white">
                {t.tasting}
              </TabsTrigger>
              <TabsTrigger value="dinner" className="data-[state=active]:bg-[var(--portell-burgundy)] data-[state=active]:text-white">
                {t.dinner}
              </TabsTrigger>
              <TabsTrigger value="workshop" className="data-[state=active]:bg-[var(--portell-burgundy)] data-[state=active]:text-white">
                {t.workshop}
              </TabsTrigger>
              <TabsTrigger value="tour" className="data-[state=active]:bg-[var(--portell-burgundy)] data-[state=active]:text-white">
                {t.tour}
              </TabsTrigger>
              <TabsTrigger value="special" className="data-[state=active]:bg-[var(--portell-burgundy)] data-[state=active]:text-white">
                {t.special}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <Wine className="w-12 h-12 text-neutral-300 animate-pulse mx-auto mb-4" />
              <p className="text-neutral-500">{t.loading}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-xl text-neutral-500">{t.noEvents}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <EventCard event={event} language={language} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}