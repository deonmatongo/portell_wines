// HTML Email Template Generator for Booking Confirmation

export const createBookingEmailHTML = (bookingData, language = 'pl') => {
  const t = {
    pl: {
      title: 'Potwierdzenie rezerwacji',
      hello: 'Witaj',
      thankYou: 'Dziękujemy za rezerwację na wydarzenie w Portell Winery!',
      confirmationCode: 'Kod potwierdzenia',
      eventDetails: 'Szczegóły wydarzenia',
      event: 'Wydarzenie',
      date: 'Data',
      time: 'Godzina',
      location: 'Lokalizacja',
      guests: 'Liczba gości',
      totalPrice: 'Łączna cena',
      free: 'Bezpłatne',
      specialRequests: 'Specjalne prośby',
      important: 'Ważne informacje',
      bringCode: 'Prosimy o zabranie ze sobą kodu potwierdzenia',
      arriveEarly: 'Zachęcamy do przybycia 10 minut przed rozpoczęciem',
      questions: 'W razie pytań, skontaktuj się z nami',
      lookingForward: 'Czekamy na Ciebie!',
      team: 'Zespół Portell',
      allRights: 'Wszelkie prawa zastrzeżone'
    },
    en: {
      title: 'Booking Confirmation',
      hello: 'Hello',
      thankYou: 'Thank you for your booking at Portell Winery!',
      confirmationCode: 'Confirmation Code',
      eventDetails: 'Event Details',
      event: 'Event',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      guests: 'Number of Guests',
      totalPrice: 'Total Price',
      free: 'Free',
      specialRequests: 'Special Requests',
      important: 'Important Information',
      bringCode: 'Please bring your confirmation code with you',
      arriveEarly: 'We encourage you to arrive 10 minutes early',
      questions: 'If you have questions, please contact us',
      lookingForward: 'We look forward to seeing you!',
      team: 'Portell Team',
      allRights: 'All rights reserved'
    }
  }[language];

  return `<!DOCTYPE html>
<html lang="${language}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${t.title}</title>
  <style>
    * { margin: 0; padding: 0; }
    body { margin: 0 !important; padding: 0 !important; background-color: #f5f5f5; font-family: Arial, Helvetica, sans-serif; }
    table { border-collapse: collapse; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="margin: 0 auto; background-color: #ffffff; max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #5C2E2E 0%, #2B2B2B 100%); padding: 50px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 36px; font-weight: 300; letter-spacing: 0.3em; color: #ffffff; font-family: Arial, sans-serif;">PORTELL</h1>
              <p style="margin: 15px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.1em;">${t.title}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 10px 0; font-size: 26px; font-weight: 400; color: #2B2B2B; font-family: Arial, sans-serif;">${t.hello} ${bookingData.customer_name},</h2>
              <p style="margin: 0 0 35px 0; font-size: 16px; line-height: 1.6; color: #666666;">${t.thankYou}</p>

              <!-- Confirmation Code Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #5C2E2E 0%, #8B4545 100%); padding: 30px; text-align: center; border-radius: 8px;">
                    <p style="margin: 0 0 10px 0; font-size: 11px; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 0.15em;">${t.confirmationCode}</p>
                    <p style="margin: 0; font-size: 32px; font-family: 'Courier New', Courier, monospace; font-weight: 700; color: #ffffff; letter-spacing: 0.08em; word-break: break-all;">${bookingData.confirmation_code}</p>
                  </td>
                </tr>
              </table>

              <!-- Event Details -->
              <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #2B2B2B; font-family: Arial, sans-serif;">${t.eventDetails}</h3>
              
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px;">
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #e5e5e5;">
                    <span style="display: inline-block; width: 150px; font-size: 15px; color: #999999; vertical-align: top;">${t.event}:</span>
                    <strong style="font-size: 15px; color: #2B2B2B;">${bookingData.event_name}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #e5e5e5;">
                    <span style="display: inline-block; width: 150px; font-size: 15px; color: #999999; vertical-align: top;">${t.date}:</span>
                    <strong style="font-size: 15px; color: #2B2B2B;">${bookingData.event_date}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #e5e5e5;">
                    <span style="display: inline-block; width: 150px; font-size: 15px; color: #999999; vertical-align: top;">${t.time}:</span>
                    <strong style="font-size: 15px; color: #2B2B2B;">${bookingData.event_time}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #e5e5e5;">
                    <span style="display: inline-block; width: 150px; font-size: 15px; color: #999999; vertical-align: top;">${t.location}:</span>
                    <strong style="font-size: 15px; color: #2B2B2B;">${bookingData.event_location}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #e5e5e5;">
                    <span style="display: inline-block; width: 150px; font-size: 15px; color: #999999; vertical-align: top;">${t.guests}:</span>
                    <strong style="font-size: 15px; color: #2B2B2B;">${bookingData.guests}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0;">
                    <span style="display: inline-block; width: 150px; font-size: 15px; color: #999999; vertical-align: top;">${t.totalPrice}:</span>
                    <strong style="font-size: 17px; color: #5C2E2E;">${bookingData.total_price === 0 ? t.free : `${bookingData.total_price.toFixed(2)} PLN`}</strong>
                  </td>
                </tr>
              </table>

              ${bookingData.special_requests ? `
              <div style="margin-bottom: 35px;">
                <h4 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #2B2B2B; text-transform: uppercase; letter-spacing: 0.05em;">${t.specialRequests}</h4>
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #666666; background-color: #f8f6f3; padding: 20px; border-radius: 6px;">${bookingData.special_requests}</p>
              </div>
              ` : ''}

              <!-- Important Info -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px;">
                <tr>
                  <td style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 25px; border-radius: 6px;">
                    <h4 style="margin: 0 0 15px 0; font-size: 17px; font-weight: 600; color: #92400e;">${t.important}</h4>
                    <p style="margin: 0 0 10px 0; font-size: 15px; line-height: 1.6; color: #78350f;">✓ ${t.bringCode}</p>
                    <p style="margin: 0 0 10px 0; font-size: 15px; line-height: 1.6; color: #78350f;">✓ ${t.arriveEarly}</p>
                    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #78350f;">✓ ${t.questions}</p>
                  </td>
                </tr>
              </table>

              <!-- Contact -->
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #666666; text-align: center;">
                <a href="mailto:kontakt@portell.wine" style="color: #5C2E2E; text-decoration: none;">kontakt@portell.wine</a> • 
                <a href="https://www.portell.wine" style="color: #5C2E2E; text-decoration: none;">www.portell.wine</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f6f3; padding: 35px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px 0; font-size: 16px; color: #2B2B2B; font-weight: 500;">${t.lookingForward}</p>
              <p style="margin: 0; font-size: 15px; color: #666666;">${t.team}</p>
            </td>
          </tr>
        </table>

        <!-- Footer Text -->
        <p style="margin: 25px 0 0 0; text-align: center; font-size: 12px; color: #999999;">
          © ${new Date().getFullYear()} Portell Winery • ${t.allRights}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};