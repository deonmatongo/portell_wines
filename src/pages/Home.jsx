import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { apiClient } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wine, Calendar, Sparkles, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');

  useEffect(() => {
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => apiClient.entities.Product.filter({ featured: true, active: true }, '-created_date', 3)
  });

  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () => apiClient.entities.Event.filter({ active: true }, 'date', 2)
  });

  const t = {
    pl: {
      hero: {
        title: 'Wyjątkowe wina',
        subtitle: 'z pasją tworzone',
        description: 'Odkryj esencję polskiego winiarstwa. Każda butelka to historia, każdy łyk to podróż przez nasze winnice.',
        cta: 'Odkryj nasze wina',
        events: 'Zobacz wydarzenia'
      },
      featured: {
        title: 'Wybrane wina',
        cta: 'Zobacz więcej'
      },
      about: {
        badge: 'Nasza filozofia',
        title: 'Tradycja spotyka nowoczesność',
        description: 'W Portell wierzymy, że najlepsze wina powstają tam, gdzie tradycyjne metody spotykają się z innowacyjnym podejściem. Każda butelka to efekt naszej pasji, zaangażowania i szacunku dla ziemi.',
        cta: 'Nasza historia'
      },
      events: {
        title: 'Nadchodzące wydarzenia',
        viewAll: 'Zobacz wszystkie',
        book: 'Rezerwuj'
      },
      cta: {
        title: 'Dołącz do rodziny Portell',
        description: 'Bądź na bieżąco z naszymi wydarzeniami, premiami win i ekskluzywnych ofertach.',
        button: 'Skontaktuj się'
      }
    },
    en: {
      hero: {
        title: 'Exceptional wines',
        subtitle: 'crafted with passion',
        description: 'Discover the essence of Polish winemaking. Every bottle tells a story, every sip is a journey through our vineyards.',
        cta: 'Explore our wines',
        events: 'View events'
      },
      featured: {
        title: 'Featured wines',
        cta: 'View more'
      },
      about: {
        badge: 'Our philosophy',
        title: 'Tradition meets modernity',
        description: 'At Portell, we believe the best wines are born where traditional methods meet innovative approaches. Every bottle reflects our passion, dedication, and respect for the land.',
        cta: 'Our story'
      },
      events: {
        title: 'Upcoming events',
        viewAll: 'View all',
        book: 'Book now'
      },
      cta: {
        title: 'Join the Portell family',
        description: 'Stay updated with our events, new releases, and exclusive offers.',
        button: 'Get in touch'
      }
    }
  }[language];

  return (
    <div className="bg-neutral-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 bg-[url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/portell/public/69431027d88b346325b4161a/fa1d1e281_2023-07-11_13-35-34_UTC.jpg')] bg-cover bg-center opacity-30" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-4">
              {t.hero.title}
            </h1>
            <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extralight tracking-wide text-neutral-300 mb-8">
              {t.hero.subtitle}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto mb-12 leading-relaxed px-4"
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to={createPageUrl('Shop')} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90 text-white px-8 sm:px-10 py-4 sm:py-6 text-base">
                {t.hero.cta}
                <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
            </Link>
            <Link to={createPageUrl('Events')} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-neutral-300 px-8 sm:px-10 py-4 sm:py-6 text-base">
                {t.hero.events}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Wines */}
      {featuredProducts.length > 0 && (
        <section className="py-32 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-4">
                {t.featured.title}
              </h2>
              <div className="w-16 h-0.5 bg-[var(--portell-burgundy)] mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.8 }}
                >
                  <Link to={createPageUrl(`ProductDetail?id=${product.id}`)}>
                    <div className="group cursor-pointer">
                      <div className="aspect-[3/4] bg-neutral-100 rounded-sm overflow-hidden mb-6">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={language === 'en' && product.name_en ? product.name_en : product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Wine className="w-16 h-16 text-neutral-300" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-light text-neutral-900 mb-2 group-hover:text-[var(--portell-burgundy)] transition-colors">
                        {language === 'en' && product.name_en ? product.name_en : product.name}
                      </h3>
                      <p className="text-sm text-neutral-500 mb-3">
                        {product.vintage} • {product.category}
                      </p>
                      <p className="text-lg font-medium text-neutral-900">
                        {product.price.toFixed(2)} PLN
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link to={createPageUrl('Shop')}>
                <Button variant="outline" size="lg" className="border-neutral-300">
                  {t.featured.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-32 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full text-sm text-neutral-600 mb-6">
                <Sparkles className="w-4 h-4" />
                {t.about.badge}
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-6">
                {t.about.title}
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                {t.about.description}
              </p>
              <Link to={createPageUrl('About')}>
                <Button variant="outline" className="border-neutral-300">
                  {t.about.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="aspect-square bg-neutral-100 rounded-sm overflow-hidden"
            >
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/portell/public/69431027d88b346325b4161a/ede8b0c24_2023-03-17_15-53-01_UTC.jpg"
                alt="Portell Wine"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-32 px-6 lg:px-12 bg-neutral-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-4">
                {t.events.title}
              </h2>
              <div className="w-16 h-0.5 bg-[var(--portell-burgundy)] mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.8 }}
                  className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[16/9] bg-neutral-100">
                    {event.image_url && (
                      <img
                        src={event.image_url}
                        alt={language === 'en' && event.title_en ? event.title_en : event.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      {event.date} • {event.time}
                    </div>
                    <h3 className="text-2xl font-light text-neutral-900 mb-3">
                      {language === 'en' && event.title_en ? event.title_en : event.title}
                    </h3>
                    <p className="text-neutral-600 mb-6 line-clamp-2">
                      {language === 'en' && event.description_en ? event.description_en : event.description}
                    </p>
                    <Link to={createPageUrl(`EventBooking?id=${event.id}`)}>
                      <Button className="bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90">
                        {t.events.book}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link to={createPageUrl('Events')}>
                <Button variant="outline" size="lg" className="border-neutral-300">
                  {t.events.viewAll}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Wine Categories */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-4">
              {language === 'pl' ? 'Nasza kolekcja' : 'Our collection'}
            </h2>
            <div className="w-16 h-0.5 bg-[var(--portell-burgundy)] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                type: 'red', 
                title: language === 'pl' ? 'Czerwone' : 'Red wines',
                desc: language === 'pl' ? 'Głębokie, intensywne' : 'Deep, intense',
                image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/portell/public/69431027d88b346325b4161a/212c0c2a5_2023-04-02_12-18-39_UTC.jpg'
              },
              { 
                type: 'white', 
                title: language === 'pl' ? 'Białe' : 'White wines',
                desc: language === 'pl' ? 'Świeże, eleganckie' : 'Fresh, elegant',
                image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/portell/public/69431027d88b346325b4161a/eaef5fb37_2023-07-30_09-23-10_UTC.jpg'
              },
              { 
                type: 'rose', 
                title: language === 'pl' ? 'Różowe' : 'Rosé wines',
                desc: language === 'pl' ? 'Delikatne, orzeźwiające' : 'Delicate, refreshing',
                image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/portell/public/69431027d88b346325b4161a/fa1d1e281_2023-07-11_13-35-34_UTC.jpg'
              },
              { 
                type: 'sparkling', 
                title: language === 'pl' ? 'Musujące' : 'Sparkling',
                desc: language === 'pl' ? 'Świąteczne, wyjątkowe' : 'Celebratory, special',
                image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/portell/public/69431027d88b346325b4161a/50966cb72_2023-06-19_09-32-54_UTC.jpg'
              }
            ].map((category, index) => (
              <motion.div
                key={category.type}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
              >
                <Link to={createPageUrl(`Shop?category=${category.type}`)}>
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] bg-neutral-100 rounded-sm overflow-hidden mb-4">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-xl font-light text-neutral-900 mb-1 group-hover:text-[var(--portell-burgundy)] transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-neutral-500">{category.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-4">
              {language === 'pl' ? 'Nasz proces' : 'Our process'}
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {language === 'pl' 
                ? 'Od winnicy po butelkę - każdy krok to mistrzostwo i pasja'
                : 'From vineyard to bottle - every step is mastery and passion'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                number: '01',
                title: language === 'pl' ? 'Uprawa' : 'Cultivation',
                desc: language === 'pl' 
                  ? 'Starannie pielęgnujemy nasze winnice, dbając o każdy szczegół, od gleby po klimat.'
                  : 'We carefully tend our vineyards, caring for every detail from soil to climate.',
                icon: '🌱'
              },
              {
                number: '02',
                title: language === 'pl' ? 'Fermentacja' : 'Fermentation',
                desc: language === 'pl' 
                  ? 'Łączymy tradycyjne metody z nowoczesną technologią dla perfekcyjnej równowagi.'
                  : 'We combine traditional methods with modern technology for perfect balance.',
                icon: '🍇'
              },
              {
                number: '03',
                title: language === 'pl' ? 'Dojrzewanie' : 'Aging',
                desc: language === 'pl' 
                  ? 'Cierpliwie czekamy, aż każde wino rozwinie swój pełny charakter i głębię.'
                  : 'We patiently wait for each wine to develop its full character and depth.',
                icon: '🛢️'
              }
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                className="text-center"
              >
                <div className="text-5xl mb-6">{step.icon}</div>
                <div className="text-6xl font-extralight text-neutral-200 mb-4">{step.number}</div>
                <h3 className="text-2xl font-light text-neutral-900 mb-4">{step.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-4">
              {language === 'pl' ? 'Co mówią o nas' : 'What they say'}
            </h2>
            <div className="w-16 h-0.5 bg-[var(--portell-burgundy)] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: language === 'pl' 
                  ? 'Wyjątkowa jakość i niesamowite smaki. Każda degustacja to niezapomniane doświadczenie.'
                  : 'Exceptional quality and amazing flavors. Every tasting is an unforgettable experience.',
                author: 'Anna Kowalska',
                role: language === 'pl' ? 'Sommelierka' : 'Sommelier'
              },
              {
                quote: language === 'pl' 
                  ? 'Portell to dowód, że polskie wina mogą konkurować z najlepszymi na świecie.'
                  : 'Portell proves that Polish wines can compete with the best in the world.',
                author: 'Jan Nowak',
                role: language === 'pl' ? 'Krytyk winny' : 'Wine Critic'
              },
              {
                quote: language === 'pl' 
                  ? 'Pasja i zaangażowanie widoczne w każdej butelce. To prawdziwa sztuka winiarstwa.'
                  : 'Passion and dedication visible in every bottle. True winemaking artistry.',
                author: 'Maria Wiśniewska',
                role: language === 'pl' ? 'Entuzjastka win' : 'Wine Enthusiast'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                className="bg-neutral-50 rounded-sm p-8"
              >
                <div className="text-4xl text-[var(--portell-burgundy)] mb-4">"</div>
                <p className="text-neutral-700 leading-relaxed mb-6 italic">
                  {testimonial.quote}
                </p>
                <div className="border-t border-neutral-200 pt-4">
                  <p className="font-medium text-neutral-900">{testimonial.author}</p>
                  <p className="text-sm text-neutral-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-[var(--portell-burgundy)] to-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {[
              {
                number: '15+',
                label: language === 'pl' ? 'Lat doświadczenia' : 'Years of experience'
              },
              {
                number: '50+',
                label: language === 'pl' ? 'Rodzajów win' : 'Wine varieties'
              },
              {
                number: '5000+',
                label: language === 'pl' ? 'Zadowolonych klientów' : 'Happy customers'
              },
              {
                number: '25+',
                label: language === 'pl' ? 'Nagród' : 'Awards won'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-5xl md:text-6xl font-light mb-2 sm:mb-3">{stat.number}</div>
                <div className="text-xs sm:text-sm text-neutral-300 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Wine className="w-12 h-12 text-[var(--portell-burgundy)] mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-6">
              {language === 'pl' ? 'Bądź na bieżąco' : 'Stay updated'}
            </h2>
            <p className="text-lg text-neutral-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              {language === 'pl' 
                ? 'Zapisz się do naszego newslettera i otrzymuj informacje o nowych winach, wydarzeniach i ekskluzywnych ofertach.'
                : 'Subscribe to our newsletter and receive updates about new wines, events, and exclusive offers.'}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto px-4" onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.email.value;
              apiClient.integrations.Core.SendEmail({
                from_name: 'Portell Winery',
                to: email,
                subject: language === 'pl' ? 'Witaj w Portell!' : 'Welcome to Portell!',
                body: language === 'pl' 
                  ? `Dziękujemy za zapisanie się do naszego newslettera! Będziemy informować Cię o wszystkich nowościach.\n\nPozdrawiamy,\nZespół Portell`
                  : `Thank you for subscribing to our newsletter! We'll keep you informed about all the news.\n\nBest regards,\nPortell Team`
              });
              e.target.reset();
              alert(language === 'pl' ? 'Dziękujemy za zapis!' : 'Thank you for subscribing!');
            }}>
              <input
                type="email"
                name="email"
                placeholder={language === 'pl' ? 'Twój adres email' : 'Your email address'}
                required
                className="flex-1 px-6 py-4 rounded-sm border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[var(--portell-burgundy)] focus:border-transparent"
              />
              <Button type="submit" size="lg" className="bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90 px-8 py-4">
                {language === 'pl' ? 'Zapisz się' : 'Subscribe'}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-6">
                {language === 'pl' ? 'Odwiedź nas' : 'Visit us'}
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                {language === 'pl' 
                  ? 'Zapraszamy do naszej winnicy na degustacje, warsztaty i wycieczki. Poznaj naszą historię i pasję do tworzenia wyjątkowych win.'
                  : 'Visit our winery for tastings, workshops, and tours. Discover our story and passion for creating exceptional wines.'}
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[var(--portell-burgundy)] mt-1" />
                  <div>
                    <p className="font-medium text-neutral-900">Portell Winery</p>
                    <p className="text-neutral-600">ul. Winna 123, 00-000 Zielona Góra</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[var(--portell-burgundy)] mt-1" />
                  <div>
                    <p className="font-medium text-neutral-900">
                      {language === 'pl' ? 'Godziny otwarcia' : 'Opening hours'}
                    </p>
                    <p className="text-neutral-600">
                      {language === 'pl' ? 'Wt-Nd: 10:00 - 18:00' : 'Tue-Sun: 10:00 AM - 6:00 PM'}
                    </p>
                  </div>
                </div>
              </div>
              <Link to={createPageUrl('Contact')}>
                <Button size="lg" variant="outline" className="border-neutral-300">
                  {language === 'pl' ? 'Skontaktuj się' : 'Get in touch'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="aspect-[4/3] bg-neutral-100 rounded-sm overflow-hidden"
            >
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/portell/public/69431027d88b346325b4161a/6b8c7119e_2023-12-19_11-27-21_UTC.jpg"
                alt="Portell Sparkling Wine"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-[var(--portell-charcoal)] to-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
              {t.cta.title}
            </h2>
            <p className="text-lg text-neutral-300 mb-10 leading-relaxed">
              {t.cta.description}
            </p>
            <Link to={createPageUrl('Contact')}>
              <Button size="lg" className="bg-black text-white border-white border px-10 py-6">
                {t.cta.button}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}