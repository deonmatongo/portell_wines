import React, { useState, useEffect } from 'react';

export default function Privacy() {
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');

  useEffect(() => {
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const content = {
    pl: {
      title: 'Polityka Prywatności',
      lastUpdated: 'Ostatnia aktualizacja: Grudzień 2025',
      intro: 'W Portell szanujemy Twoją prywatność i zobowiązujemy się do ochrony Twoich danych osobowych. Niniejsza polityka prywatności wyjaśnia, jak gromadzimy, wykorzystujemy i chronimy Twoje informacje.',
      sections: [
        {
          title: '1. Zbieranie danych',
          content: 'Gromadzimy dane osobowe, które nam przekazujesz podczas dokonywania zakupów, rejestracji na wydarzenia lub kontaktu z nami. Mogą to być: imię i nazwisko, adres email, numer telefonu, adres dostawy.'
        },
        {
          title: '2. Wykorzystanie danych',
          content: 'Wykorzystujemy Twoje dane do przetwarzania zamówień, komunikacji z Tobą, doskonalenia naszych usług oraz wysyłania informacji marketingowych (za Twoją zgodą).'
        },
        {
          title: '3. Ochrona danych',
          content: 'Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony Twoich danych osobowych przed nieuprawnionym dostępem, utratą lub zniszczeniem.'
        },
        {
          title: '4. Twoje prawa',
          content: 'Masz prawo do dostępu do swoich danych, ich sprostowania, usunięcia oraz ograniczenia przetwarzania. Możesz również wycofać zgodę na przetwarzanie danych w dowolnym momencie.'
        },
        {
          title: '5. Pliki cookies',
          content: 'Nasza strona wykorzystuje pliki cookies w celu poprawy doświadczenia użytkownika. Możesz zarządzać preferencjami cookies w ustawieniach swojej przeglądarki.'
        },
        {
          title: '6. Kontakt',
          content: 'W razie pytań dotyczących naszej polityki prywatności, skontaktuj się z nami pod adresem: kontakt@portell.wine'
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: December 2025',
      intro: 'At Portell, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information.',
      sections: [
        {
          title: '1. Data Collection',
          content: 'We collect personal data that you provide to us when making purchases, registering for events, or contacting us. This may include: name, email address, phone number, delivery address.'
        },
        {
          title: '2. Use of Data',
          content: 'We use your data to process orders, communicate with you, improve our services, and send marketing information (with your consent).'
        },
        {
          title: '3. Data Protection',
          content: 'We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, loss, or destruction.'
        },
        {
          title: '4. Your Rights',
          content: 'You have the right to access your data, rectify it, delete it, and restrict processing. You can also withdraw consent for data processing at any time.'
        },
        {
          title: '5. Cookies',
          content: 'Our website uses cookies to improve user experience. You can manage cookie preferences in your browser settings.'
        },
        {
          title: '6. Contact',
          content: 'If you have questions about our privacy policy, contact us at: contact@portell.wine'
        }
      ]
    }
  }[language];

  return (
    <div className="min-h-screen bg-neutral-50 py-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-sm shadow-sm p-12">
          <h1 className="text-4xl font-light tracking-tight text-neutral-900 mb-4">
            {content.title}
          </h1>
          <p className="text-sm text-neutral-500 mb-8">{content.lastUpdated}</p>
          
          <p className="text-lg text-neutral-600 leading-relaxed mb-12">
            {content.intro}
          </p>

          <div className="space-y-8">
            {content.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-medium text-neutral-900 mb-3">
                  {section.title}
                </h2>
                <p className="text-neutral-600 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}