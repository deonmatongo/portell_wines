import React, { useState, useEffect } from 'react';

export default function Terms() {
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');

  useEffect(() => {
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const content = {
    pl: {
      title: 'Regulamin',
      lastUpdated: 'Ostatnia aktualizacja: Grudzień 2025',
      intro: 'Niniejszy regulamin określa zasady korzystania ze strony internetowej Portell oraz warunki dokonywania zakupów i rezerwacji wydarzeń.',
      sections: [
        {
          title: '1. Postanowienia ogólne',
          content: 'Sklep internetowy Portell prowadzi sprzedaż win i produktów pokrewnych. Korzystając z naszej strony, akceptujesz niniejszy regulamin.'
        },
        {
          title: '2. Składanie zamówień',
          content: 'Zamówienia można składać 24/7 przez stronę internetową. Potwierdzenie zamówienia zostanie wysłane na podany adres email. Minimalna wartość zamówienia to 100 PLN.'
        },
        {
          title: '3. Płatności',
          content: 'Akceptujemy płatności kartą kredytową, przelewem bankowym oraz przy odbiorze. Wszystkie ceny podane są w PLN i zawierają VAT.'
        },
        {
          title: '4. Dostawa',
          content: 'Wysyłka realizowana jest w ciągu 2-3 dni roboczych. Koszt dostawy zależy od wartości zamówienia i lokalizacji. Darmowa dostawa dla zamówień powyżej 300 PLN.'
        },
        {
          title: '5. Zwroty i reklamacje',
          content: 'Masz prawo do zwrotu produktu w ciągu 14 dni od daty otrzymania. Produkty muszą być w oryginalnym opakowaniu i nieuszkodzone.'
        },
        {
          title: '6. Wydarzenia',
          content: 'Rezerwacje wydarzeń można anulować do 48 godzin przed wydarzeniem z pełnym zwrotem kosztów. Późniejsze anulacje nie podlegają zwrotowi.'
        },
        {
          title: '7. Odpowiedzialność',
          content: 'Sprzedaż alkoholu osobom poniżej 18 roku życia jest zabroniona. Dokonując zakupu, potwierdzasz, że jesteś pełnoletni.'
        }
      ]
    },
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last updated: December 2025',
      intro: 'These terms and conditions govern the use of the Portell website and the conditions for making purchases and event reservations.',
      sections: [
        {
          title: '1. General Provisions',
          content: 'Portell online store sells wines and related products. By using our website, you accept these terms and conditions.'
        },
        {
          title: '2. Placing Orders',
          content: 'Orders can be placed 24/7 through the website. Order confirmation will be sent to the provided email address. Minimum order value is 100 PLN.'
        },
        {
          title: '3. Payments',
          content: 'We accept credit card payments, bank transfers, and cash on delivery. All prices are in PLN and include VAT.'
        },
        {
          title: '4. Delivery',
          content: 'Shipping is processed within 2-3 business days. Delivery cost depends on order value and location. Free shipping for orders over 300 PLN.'
        },
        {
          title: '5. Returns and Complaints',
          content: 'You have the right to return products within 14 days of receipt. Products must be in original packaging and undamaged.'
        },
        {
          title: '6. Events',
          content: 'Event reservations can be cancelled up to 48 hours before the event with full refund. Later cancellations are non-refundable.'
        },
        {
          title: '7. Liability',
          content: 'Sale of alcohol to persons under 18 years of age is prohibited. By making a purchase, you confirm that you are of legal age.'
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