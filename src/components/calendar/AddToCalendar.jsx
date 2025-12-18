import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AddToCalendar({ event, language = 'pl' }) {
  const t = {
    pl: {
      addToCalendar: 'Dodaj do kalendarza',
      googleCalendar: 'Google Calendar',
      appleCalendar: 'Apple Calendar',
      outlookCalendar: 'Outlook Calendar',
      yahooCalendar: 'Yahoo Calendar',
      downloadICS: 'Pobierz plik .ics'
    },
    en: {
      addToCalendar: 'Add to Calendar',
      googleCalendar: 'Google Calendar',
      appleCalendar: 'Apple Calendar',
      outlookCalendar: 'Outlook Calendar',
      yahooCalendar: 'Yahoo Calendar',
      downloadICS: 'Download .ics file'
    }
  }[language];

  // Format date and time for calendar
  const formatDateTime = (date, time) => {
    const [hours, minutes] = time.split(':');
    const eventDate = new Date(date);
    eventDate.setHours(parseInt(hours), parseInt(minutes), 0);
    return eventDate;
  };

  const startDate = formatDateTime(event.date, event.time);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours

  const formatForCalendar = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const eventDetails = {
    title: event.name,
    description: event.description || '',
    location: event.location || '',
    startTime: formatForCalendar(startDate),
    endTime: formatForCalendar(endDate)
  };

  // Google Calendar URL
  const googleCalendarUrl = () => {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: eventDetails.title,
      details: eventDetails.description,
      location: eventDetails.location,
      dates: `${eventDetails.startTime}/${eventDetails.endTime}`
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Outlook Calendar URL
  const outlookCalendarUrl = () => {
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: eventDetails.title,
      body: eventDetails.description,
      location: eventDetails.location,
      startdt: eventDetails.startTime,
      enddt: eventDetails.endTime
    });
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  };

  // Yahoo Calendar URL
  const yahooCalendarUrl = () => {
    const params = new URLSearchParams({
      v: '60',
      title: eventDetails.title,
      desc: eventDetails.description,
      in_loc: eventDetails.location,
      st: eventDetails.startTime,
      et: eventDetails.endTime
    });
    return `https://calendar.yahoo.com/?${params.toString()}`;
  };

  // Generate ICS file for Apple Calendar and download
  const downloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Portell Winery//Event//EN
BEGIN:VEVENT
UID:${event.id}@portell.wine
DTSTAMP:${formatForCalendar(new Date())}
DTSTART:${eventDetails.startTime}
DTEND:${eventDetails.endTime}
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description.replace(/\n/g, '\\n')}
LOCATION:${eventDetails.location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${eventDetails.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">
          <Calendar className="w-4 h-4 mr-2" />
          {t.addToCalendar}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuItem onClick={() => window.open(googleCalendarUrl(), '_blank')}>
          {t.googleCalendar}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadICS}>
          {t.appleCalendar}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(outlookCalendarUrl(), '_blank')}>
          {t.outlookCalendar}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(yahooCalendarUrl(), '_blank')}>
          {t.yahooCalendar}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadICS}>
          {t.downloadICS}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}