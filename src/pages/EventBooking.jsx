import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Clock, Users, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import RecommendedEvents from '../components/events/RecommendedEvents';
import { toast } from 'sonner';

export default function EventBooking() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  const navigate = useNavigate();
  
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    guests: 1,
    special_requests: '',
    gdpr_consent: false
  });

  useEffect(() => {
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const events = await apiClient.entities.Event.filter({ id: eventId, active: true });
      return events[0];
    },
    enabled: !!eventId
  });

  // Track viewed event
  useEffect(() => {
    if (event) {
      const viewedEvents = JSON.parse(localStorage.getItem('portell_viewed_events') || '[]');
      if (!viewedEvents.includes(event.id)) {
        viewedEvents.push(event.id);
        // Keep only last 20 viewed events
        if (viewedEvents.length > 20) viewedEvents.shift();
        localStorage.setItem('portell_viewed_events', JSON.stringify(viewedEvents));
      }
    }
  }, [event]);

  const t = {
    pl: {
      back: 'Powrót do wydarzeń',
      bookingFor: 'Rezerwacja na',
      spots: 'Zostało miejsc',
      full: 'Wydarzenie wyprzedane',
      yourDetails: 'Twoje dane',
      fullName: 'Imię i nazwisko',
      email: 'Email',
      phone: 'Telefon',
      numberOfGuests: 'Liczba gości',
      specialRequests: 'Uwagi specjalne (opcjonalnie)',
      specialRequestsPlaceholder: 'Np. wymagania dietetyczne, prośby szczególne...',
      gdprConsent: 'Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z',
      privacyPolicy: 'Polityką Prywatności',
      totalPrice: 'Łączna cena',
      free: 'Bezpłatne',
      continueToCheckout: 'Przejdź do realizacji',
      date: 'Data',
      time: 'Godzina',
      location: 'Lokalizacja',
      about: 'O wydarzeniu',
      perPerson: 'za osobę'
    },
    en: {
      back: 'Back to events',
      bookingFor: 'Booking for',
      spots: 'spots left',
      full: 'Event sold out',
      yourDetails: 'Your details',
      fullName: 'Full name',
      email: 'Email',
      phone: 'Phone',
      numberOfGuests: 'Number of guests',
      specialRequests: 'Special requests (optional)',
      specialRequestsPlaceholder: 'E.g. dietary requirements, special requests...',
      gdprConsent: 'I consent to the processing of my personal data in accordance with',
      privacyPolicy: 'Privacy Policy',
      totalPrice: 'Total price',
      free: 'Free',
      continueToCheckout: 'Continue to checkout',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      about: 'About this event',
      perPerson: 'per person'
    }
  }[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.gdpr_consent) {
      toast.error(language === 'pl' ? 'Proszę wyrazić zgodę na przetwarzanie danych' : 'Please consent to data processing');
      return;
    }

    const spotsLeft = event.capacity - (event.booked_count || 0);
    if (formData.guests > spotsLeft) {
      toast.error(language === 'pl' ? 'Niewystarczająca liczba wolnych miejsc' : 'Not enough spots available');
      return;
    }

    const eventCheckoutItem = {
      id: event.id,
      type: 'event',
      name: language === 'en' && event.title_en ? event.title_en : event.title,
      price: event.price,
      quantity: formData.guests,
      image_url: event.image_url,
      formData: {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        special_requests: formData.special_requests,
        gdpr_consent: formData.gdpr_consent,
      },
    };

    sessionStorage.setItem('portell_checkout_item', JSON.stringify(eventCheckoutItem));
    navigate(createPageUrl('Checkout') + '?type=event');
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--portell-burgundy)]" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-neutral-500 mb-6">
            {language === 'pl' ? 'Wydarzenie nie znalezione' : 'Event not found'}
          </p>
          <Link to={createPageUrl('Events')}>
            <Button variant="outline">{t.back}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const spotsLeft = event.capacity - (event.booked_count || 0);
  const isFull = spotsLeft <= 0;
  const totalPrice = event.price * formData.guests;

  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-12 bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <Link to={createPageUrl('Events')} className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl sm:text-3xl font-light break-words">
                  {language === 'en' && event.title_en ? event.title_en : event.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {event.image_url && (
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-neutral-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500">{t.date}</p>
                      <p className="font-medium text-sm sm:text-base break-words">{new Date(event.date).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500">{t.time}</p>
                      <p className="font-medium">{event.time}{event.duration && ` • ${event.duration}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500">{t.location}</p>
                      <p className="font-medium">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500">{t.spots}</p>
                      <p className="font-medium">{spotsLeft}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">{t.about}</h3>
                  <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
                    {language === 'en' && event.description_en ? event.description_en : event.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle className="text-xl font-light">{t.bookingFor}</CardTitle>
                <div className="flex items-baseline gap-2">
                  {event.price === 0 ? (
                    <span className="text-xl sm:text-2xl font-medium text-green-600">{t.free}</span>
                  ) : (
                    <>
                      <span className="text-2xl sm:text-3xl font-light">{event.price}</span>
                      <span className="text-sm sm:text-base text-neutral-500">PLN {t.perPerson}</span>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isFull ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-lg text-neutral-600">{t.full}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-4 text-neutral-700">{t.yourDetails}</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">{t.fullName} *</Label>
                          <Input
                            id="name"
                            required
                            value={formData.customer_name}
                            onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">{t.email} *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.customer_email}
                            onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">{t.phone} *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            value={formData.customer_phone}
                            onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="guests">{t.numberOfGuests} *</Label>
                          <Input
                            id="guests"
                            type="number"
                            min="1"
                            max={spotsLeft}
                            required
                            value={formData.guests}
                            onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="requests">{t.specialRequests}</Label>
                          <Textarea
                            id="requests"
                            placeholder={t.specialRequestsPlaceholder}
                            value={formData.special_requests}
                            onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="gdpr"
                        checked={formData.gdpr_consent}
                        onCheckedChange={(checked) => setFormData({...formData, gdpr_consent: checked})}
                      />
                      <label htmlFor="gdpr" className="text-sm text-neutral-600 leading-tight cursor-pointer">
                        {t.gdprConsent}{' '}
                        <Link to={createPageUrl('Privacy')} className="text-[var(--portell-burgundy)] underline">
                          {t.privacyPolicy}
                        </Link>
                      </label>
                    </div>

                    {event.price > 0 && (
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-600">{t.totalPrice}</span>
                          <span className="text-2xl font-light">{totalPrice} PLN</span>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90"
                    >
                      {t.continueToCheckout}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Events */}
        <div className="mt-20">
          <RecommendedEvents language={language} currentEventId={eventId} limit={3} />
        </div>
      </div>
    </div>
  );
}