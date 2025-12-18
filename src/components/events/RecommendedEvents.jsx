import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Sparkles } from 'lucide-react';
import EventCard from './EventCard';

export default function RecommendedEvents({ language, currentEventId = null, limit = 3 }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: allEvents = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.filter({ active: true }, 'date', 100)
  });

  const { data: userBookings = [] } = useQuery({
    queryKey: ['user-bookings'],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        return await base44.entities.Booking.filter({ customer_email: user.email }, '-created_date', 50);
      } catch {
        return [];
      }
    }
  });

  useEffect(() => {
    const getRecommendations = async () => {
      if (allEvents.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        // Get viewed events from localStorage
        const viewedEvents = JSON.parse(localStorage.getItem('portell_viewed_events') || '[]');
        
        // Get booked event IDs
        const bookedEventIds = userBookings.map(b => b.event_id);
        const bookedEvents = allEvents.filter(e => bookedEventIds.includes(e.id));

        // Filter out current event if provided
        const availableEvents = currentEventId 
          ? allEvents.filter(e => e.id !== currentEventId)
          : allEvents;

        // Build context for LLM
        let context = `You are an event recommendation system for a winery. Recommend ${limit} upcoming events.\n\n`;
        
        if (currentEventId) {
          const currentEvent = allEvents.find(e => e.id === currentEventId);
          if (currentEvent) {
            context += `Current event being viewed:\n- ${currentEvent.title} (${currentEvent.event_type})\n  ${currentEvent.description?.substring(0, 200)}\n\n`;
            context += `Recommend similar events that the user might also enjoy.\n\n`;
          }
        }

        if (bookedEvents.length > 0) {
          context += `User's past bookings:\n${bookedEvents.map(e => `- ${e.title} (${e.event_type})`).join('\n')}\n\n`;
        }

        if (viewedEvents.length > 0) {
          const viewed = allEvents.filter(e => viewedEvents.includes(e.id)).slice(0, 5);
          if (viewed.length > 0) {
            context += `Recently viewed events:\n${viewed.map(e => `- ${e.title} (${e.event_type})`).join('\n')}\n\n`;
          }
        }

        context += `Available events to recommend:\n${availableEvents.map(e => 
          `ID: ${e.id}, Title: ${e.title}, Type: ${e.event_type}, Date: ${e.date}, Price: ${e.price}, Description: ${e.description?.substring(0, 100)}`
        ).join('\n')}\n\n`;
        
        context += `Return ONLY the event IDs as a JSON array of strings, e.g., ["id1", "id2", "id3"]. Base recommendations on user preferences and event similarity.`;

        const response = await base44.integrations.Core.InvokeLLM({
          prompt: context,
          response_json_schema: {
            type: "object",
            properties: {
              event_ids: {
                type: "array",
                items: { type: "string" }
              }
            }
          }
        });

        const recommendedIds = response.event_ids || [];
        const recommended = availableEvents
          .filter(e => recommendedIds.includes(e.id))
          .slice(0, limit);

        // Fallback to random events if LLM didn't return enough
        if (recommended.length < limit) {
          const remaining = availableEvents
            .filter(e => !recommendedIds.includes(e.id))
            .sort(() => Math.random() - 0.5)
            .slice(0, limit - recommended.length);
          recommended.push(...remaining);
        }

        setRecommendations(recommended);
      } catch (error) {
        console.error('Error getting recommendations:', error);
        // Fallback to recent events
        setRecommendations(availableEvents.slice(0, limit));
      } finally {
        setIsLoading(false);
      }
    };

    getRecommendations();
  }, [allEvents, userBookings, currentEventId, limit]);

  const t = {
    pl: {
      title: currentEventId ? 'Podobne wydarzenia' : 'Polecane dla Ciebie',
      subtitle: 'Na podstawie Twoich preferencji'
    },
    en: {
      title: currentEventId ? 'Similar Events' : 'Recommended for You',
      subtitle: 'Based on your preferences'
    }
  }[language];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--portell-burgundy)]" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-[var(--portell-burgundy)]" />
        <div>
          <h2 className="text-2xl font-light text-neutral-900">{t.title}</h2>
          <p className="text-sm text-neutral-500">{t.subtitle}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((event, index) => (
          <EventCard key={event.id} event={event} language={language} />
        ))}
      </div>
    </div>
  );
}