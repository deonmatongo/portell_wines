import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { getImageUrl, DEFAULT_IMAGES } from '@/utils/images';

export default function EventCard({ event, language }) {
  const spotsLeft = event.capacity - (event.booked_count || 0);
  const isFull = spotsLeft <= 0;
  const isAlmostFull = spotsLeft > 0 && spotsLeft <= 5;

  const eventTypes = {
    pl: {
      tasting: 'Degustacja',
      dinner: 'Kolacja',
      workshop: 'Warsztat',
      tour: 'Wycieczka',
      special: 'Wydarzenie specjalne'
    },
    en: {
      tasting: 'Tasting',
      dinner: 'Dinner',
      workshop: 'Workshop',
      tour: 'Tour',
      special: 'Special Event'
    }
  };

  const t = {
    pl: {
      spots: 'Zostało miejsc',
      full: 'Wyprzedane',
      free: 'Bezpłatne',
      bookNow: 'Zarezerwuj',
      viewDetails: 'Zobacz szczegóły'
    },
    en: {
      spots: 'spots left',
      full: 'Sold out',
      free: 'Free',
      bookNow: 'Book now',
      viewDetails: 'View details'
    }
  }[language];

  return (
    <div className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
      {/* Image */}
      <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
        <img
          src={getImageUrl(event.image_url, 'event')}
          alt={language === 'en' && event.title_en ? event.title_en : event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Event Type Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/95 text-neutral-900 hover:bg-white">
            {eventTypes[language][event.event_type]}
          </Badge>
        </div>

        {/* Availability Badge */}
        {isFull ? (
          <div className="absolute top-4 right-4">
            <Badge variant="destructive" className="bg-red-500">
              {t.full}
            </Badge>
          </div>
        ) : isAlmostFull ? (
          <div className="absolute top-4 right-4">
            <Badge className="bg-orange-500 text-white hover:bg-orange-600">
              {spotsLeft} {t.spots}
            </Badge>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-light text-neutral-900 mb-4 group-hover:text-[var(--portell-burgundy)] transition-colors">
          {language === 'en' && event.title_en ? event.title_en : event.title}
        </h3>

        <div className="space-y-2 mb-6 text-sm text-neutral-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{event.time} {event.duration && `• ${event.duration}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{event.booked_count || 0} / {event.capacity}</span>
          </div>
        </div>

        <p className="text-neutral-600 mb-6 line-clamp-3">
          {language === 'en' && event.description_en ? event.description_en : event.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div>
            {event.price === 0 ? (
              <span className="text-lg font-medium text-green-600">{t.free}</span>
            ) : (
              <span className="text-2xl font-light text-neutral-900">{event.price} PLN</span>
            )}
          </div>
          
          <Link to={createPageUrl(`EventBooking?id=${event.id}`)}>
            <Button 
              className="bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90"
              disabled={isFull}
            >
              {isFull ? t.full : t.bookNow}
              {!isFull && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}