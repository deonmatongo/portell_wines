import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';

export default function CalendarButtons({ event, language }) {
  const t = {
    pl: {
      addToCalendar: 'Dodaj do kalendarza',
      google: 'Google Calendar',
      apple: 'Apple Calendar',
      outlook: 'Outlook'
    },
    en: {
      addToCalendar: 'Add to calendar',
      google: 'Google Calendar',
      apple: 'Apple Calendar',
      outlook: 'Outlook'
    }
  }[language];

  const createICSFile = () => {
    const eventTitle = language === 'en' && event.title_en ? event.title_en : event.title;
    const eventDesc = language === 'en' && event.description_en ? event.description_en : event.description;
    
    // Parse date and time
    const [year, month, day] = event.date.split('-');
    const [hours, minutes] = event.time.split(':');
    
    // Create start date (format: YYYYMMDDTHHMMSS)
    const startDate = `${year}${month}${day}T${hours}${minutes}00`;
    
    // Estimate end time (add 2 hours if duration not specified)
    const endHours = String(parseInt(hours) + 2).padStart(2, '0');
    const endDate = `${year}${month}${day}T${endHours}${minutes}00`;
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Portell Winery//Event Booking//EN
BEGIN:VEVENT
UID:${Date.now()}@portell.wine
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${eventTitle}
DESCRIPTION:${eventDesc || ''}
LOCATION:${event.location}${event.address ? ', ' + event.address : ''}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    return icsContent;
  };

  const downloadICS = () => {
    const icsContent = createICSFile();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `portell-event-${event.slug || event.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addToGoogleCalendar = () => {
    const eventTitle = language === 'en' && event.title_en ? event.title_en : event.title;
    const eventDesc = language === 'en' && event.description_en ? event.description_en : event.description;
    
    const startDateTime = `${event.date.replace(/-/g, '')}T${event.time.replace(':', '')}00`;
    const endHours = String(parseInt(event.time.split(':')[0]) + 2).padStart(2, '0');
    const endDateTime = `${event.date.replace(/-/g, '')}T${endHours}${event.time.split(':')[1]}00`;
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(eventDesc || '')}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleUrl, '_blank');
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-neutral-700 text-center mb-3">
        <Calendar className="w-4 h-4 inline mr-2" />
        {t.addToCalendar}
      </p>
      
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          onClick={addToGoogleCalendar}
          className="w-full justify-start"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M7.5,16.5l-1.4-1.4l4.9-4.9l-4.9-4.9 l1.4-1.4l6.3,6.3L7.5,16.5z"/>
          </svg>
          {t.google}
        </Button>
        
        <Button
          variant="outline"
          onClick={downloadICS}
          className="w-full justify-start"
        >
          <Download className="w-4 h-4 mr-2" />
          {t.apple} / {t.outlook}
        </Button>
      </div>
    </div>
  );
}