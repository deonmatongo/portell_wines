import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { apiClient } from '@/api/apiClient';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Package, CreditCard, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createBookingEmailHTML } from '../components/emails/BookingConfirmation';
import { createOrderEmailHTML } from '../components/emails/OrderConfirmation';
import AddToCalendar from '../components/calendar/AddToCalendar';

export default function Checkout() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const checkoutType = urlParams.get('type') || 'product';
  
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [confirmationDetails, setConfirmationDetails] = useState({
    type: 'order',
    number: '',
    eventName: '',
    eventData: null
  });

  const [shippingData, setShippingData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    street: '',
    city: '',
    postal_code: '',
    country: 'Polska'
  });

  const [billingData, setBillingData] = useState({
    street: '',
    city: '',
    postal_code: '',
    country: 'Polska'
  });

  const [paymentData, setPaymentData] = useState({
    method: 'card',
    card_number: '',
    card_name: '',
    card_expiry: '',
    card_cvv: ''
  });

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [gdprConsent, setGdprConsent] = useState(false);

  useEffect(() => {
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    if (checkoutType === 'event') {
      const eventItem = JSON.parse(sessionStorage.getItem('portell_checkout_item') || '{}');
      if (!eventItem || !eventItem.id) {
        toast.error(language === 'pl' ? 'Błąd: Brak danych wydarzenia.' : 'Error: No event data.');
        navigate(createPageUrl('Events'));
        return;
      }
      setCheckoutItems([eventItem]);
      if (eventItem.formData) {
        setShippingData(prev => ({
          ...prev,
          customer_name: eventItem.formData.customer_name,
          customer_email: eventItem.formData.customer_email,
          customer_phone: eventItem.formData.customer_phone,
        }));
        setGdprConsent(eventItem.formData.gdpr_consent);
      }
    } else {
      const cartData = JSON.parse(localStorage.getItem('portell_cart') || '[]');
      if (cartData.length === 0) {
        navigate(createPageUrl('Cart'));
        return;
      }
      setCheckoutItems(cartData);
    }
  }, [navigate, checkoutType, language]);

  const checkoutMutation = useMutation({
    mutationFn: async (checkoutData) => {
      console.log('Starting checkout mutation for type:', checkoutType);
      console.log('Checkout data:', checkoutData);
      
      if (checkoutType === 'event') {
        const eventItem = checkoutItems[0];
        if (!eventItem || !eventItem.id) {
          throw new Error(language === 'pl' ? 'Błąd: Brak danych wydarzenia.' : 'Error: No event data.');
        }

        console.log('Creating booking for event:', eventItem.id);
        const confirmationCode = `PORTELL-EVENT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // First, get the event data to ensure it exists
        let eventData;
        try {
          console.log('Fetching event data...');
          eventData = await apiClient.entities.Event.get(eventItem.id);
          console.log('Event data fetched:', eventData);
        } catch (eventError) {
          console.error('Error fetching event:', eventError);
          throw new Error(language === 'pl' ? 'Wydarzenie nie zostało znalezione.' : 'Event not found.');
        }

        console.log('Creating booking...');
        const booking = await apiClient.entities.Booking.create({
          event_id: eventItem.id,
          customer_name: checkoutData.customer_name,
          customer_email: checkoutData.customer_email,
          customer_phone: checkoutData.customer_phone,
          guests: eventItem.quantity,
          special_requests: eventItem.formData?.special_requests || '',
          total_price: eventItem.price * eventItem.quantity,
          status: 'confirmed',
          payment_status: eventItem.price === 0 ? 'free' : 'pending',
          confirmation_code: confirmationCode,
          gdpr_consent: checkoutData.gdpr_consent,
        });
        console.log('Booking created:', booking);

        // Update the event's booked_count
        console.log('Updating event booked_count...');
        await apiClient.entities.Event.update(eventItem.id, {
          booked_count: (eventData.booked_count || 0) + eventItem.quantity
        });
        console.log('Event updated');
        
        const eventTitle = eventItem.name;
        const eventDateFormatted = eventData?.date ? new Date(eventData.date).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
        
        console.log('Creating email HTML...');
        const emailHTML = createBookingEmailHTML({
          customer_name: checkoutData.customer_name,
          confirmation_code: confirmationCode,
          event_name: eventTitle,
          event_date: eventDateFormatted,
          event_time: eventData?.time || '',
          event_location: eventData?.location || '',
          guests: eventItem.quantity,
          total_price: eventItem.price * eventItem.quantity,
          special_requests: eventItem.formData?.special_requests || ''
        }, language);

        try {
          await apiClient.integrations.Core.SendEmail({
            from_name: 'Portell Winery',
            to: checkoutData.customer_email,
            subject: language === 'pl' ? `Potwierdzenie rezerwacji - ${eventTitle}` : `Booking Confirmation - ${eventTitle}`,
            body: emailHTML
          });
          console.log('Email sent successfully');
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Don't fail the booking if email fails, just log it
          toast.error(language === 'pl' ? 'Rezerwacja utworzona, ale wysłanie emaila nie powiodło się.' : 'Booking created, but email sending failed.');
        }

        console.log('Booking process completed successfully');
        return { 
          type: 'booking', 
          number: confirmationCode, 
          eventName: eventTitle,
          eventData: {
            id: eventItem.id,
            name: eventTitle,
            date: eventData?.date,
            time: eventData?.time,
            location: eventData?.location,
            description: eventData?.description || eventData?.description_en
          }
        };

      } else {
        const orderNumber = `PORTELL-${Date.now()}`;
        
        const order = await apiClient.entities.Order.create({
          ...checkoutData,
          order_number: orderNumber,
          status: 'pending',
          payment_status: 'pending'
        });

        const paymentMethodText = checkoutData.payment_method === 'card' ? (language === 'pl' ? 'Karta kredytowa/debetowa' : 'Credit/Debit Card') :
                                  checkoutData.payment_method === 'transfer' ? (language === 'pl' ? 'Przelew bankowy' : 'Bank Transfer') :
                                  (language === 'pl' ? 'Przy odbiorze' : 'Cash on Delivery');

        const emailHTML = createOrderEmailHTML({
          customer_name: checkoutData.customer_name,
          order_number: orderNumber,
          items: checkoutData.items,
          subtotal: checkoutData.subtotal,
          shipping_cost: checkoutData.shipping_cost,
          total: checkoutData.total,
          shipping_address: checkoutData.shipping_address,
          payment_method: paymentMethodText
        }, language);

        try {
          await apiClient.integrations.Core.SendEmail({
            from_name: 'Portell Winery',
            to: checkoutData.customer_email,
            subject: language === 'pl' ? `Potwierdzenie zamówienia ${orderNumber}` : `Order confirmation ${orderNumber}`,
            body: emailHTML
          });
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Don't fail the order if email fails, just log it
          toast.error(language === 'pl' ? 'Zamówienie utworzone, ale wysłanie emaila nie powiodło się.' : 'Order created, but email sending failed.');
        }

        return { type: 'order', number: orderNumber };
      }
    },
    onSuccess: ({ type, number, eventName, eventData }) => {
      setConfirmationDetails({ type, number, eventName, eventData });
      if (type === 'order') {
        localStorage.setItem('portell_cart', '[]');
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        sessionStorage.removeItem('portell_checkout_item');
      }
      setCurrentStep(4);
    },
    onError: (error) => {
      console.error('Checkout error:', error);
      const errorMessage = error?.message || error?.error?.message || 
        (language === 'pl' ? 'Wystąpił błąd podczas przetwarzania. Spróbuj ponownie.' : 'An error occurred while processing. Please try again.');
      toast.error(errorMessage);
    }
  });

  const t = {
    pl: {
      steps: ['Dane kontaktowe', 'Płatność', 'Podsumowanie', 'Potwierdzenie'],
      shipping: {
        title: checkoutType === 'event' ? 'Dane kontaktowe' : 'Adres dostawy',
        name: 'Imię i nazwisko',
        email: 'Email',
        phone: 'Telefon',
        street: 'Ulica i numer',
        city: 'Miasto',
        postal: 'Kod pocztowy',
        useSame: 'Adres rozliczeniowy taki sam jak adres dostawy',
        billingTitle: 'Adres rozliczeniowy'
      },
      payment: {
        title: 'Metoda płatności',
        card: 'Karta kredytowa/debetowa',
        transfer: 'Przelew bankowy',
        cod: 'Przy odbiorze',
        cardNumber: 'Numer karty',
        cardName: 'Imię i nazwisko na karcie',
        cardExpiry: 'Data ważności (MM/RR)',
        cardCvv: 'CVV'
      },
      review: {
        title: 'Podsumowanie',
        orderItems: checkoutType === 'event' ? 'Szczegóły' : 'Produkty',
        contactDetails: 'Dane kontaktowe',
        shippingAddress: 'Adres dostawy',
        paymentMethod: 'Metoda płatności',
        orderSummary: 'Podsumowanie'
      },
      confirmation: {
        orderTitle: 'Zamówienie potwierdzone!',
        orderMessage: 'Dziękujemy za zakupy. Potwierdzenie zostało wysłane na Twój email.',
        orderNumber: 'Numer zamówienia',
        bookingTitle: 'Rezerwacja potwierdzona!',
        bookingMessage: 'Dziękujemy za rezerwację. Potwierdzenie zostało wysłane na Twój adres email.',
        bookingCode: 'Kod potwierdzenia',
        backToShop: 'Powrót do sklepu',
        backToEvents: 'Powrót do wydarzeń',
        addToCalendar: 'Dodaj do kalendarza'
      },
      subtotal: 'Suma częściowa',
      shippingLabel: 'Dostawa',
      shippingFee: 'Bezpłatna',
      total: 'Łącznie',
      gdpr: 'Wyrażam zgodę na przetwarzanie danych osobowych',
      next: 'Dalej',
      back: 'Wstecz',
      placeOrder: checkoutType === 'event' ? 'Potwierdź rezerwację' : 'Złóż zamówienie',
      processing: 'Przetwarzanie...'
    },
    en: {
      steps: ['Contact Details', 'Payment', 'Review', 'Confirmation'],
      shipping: {
        title: checkoutType === 'event' ? 'Contact Details' : 'Shipping Address',
        name: 'Full name',
        email: 'Email',
        phone: 'Phone',
        street: 'Street and number',
        city: 'City',
        postal: 'Postal code',
        useSame: 'Billing address same as shipping',
        billingTitle: 'Billing Address'
      },
      payment: {
        title: 'Payment Method',
        card: 'Credit/Debit Card',
        transfer: 'Bank Transfer',
        cod: 'Cash on Delivery',
        cardNumber: 'Card number',
        cardName: 'Name on card',
        cardExpiry: 'Expiry date (MM/YY)',
        cardCvv: 'CVV'
      },
      review: {
        title: 'Review',
        orderItems: checkoutType === 'event' ? 'Details' : 'Items',
        contactDetails: 'Contact Details',
        shippingAddress: 'Shipping Address',
        paymentMethod: 'Payment Method',
        orderSummary: 'Summary'
      },
      confirmation: {
        orderTitle: 'Order Confirmed!',
        orderMessage: 'Thank you for your purchase. Confirmation has been sent to your email.',
        orderNumber: 'Order number',
        bookingTitle: 'Booking Confirmed!',
        bookingMessage: 'Thank you for your booking. A confirmation has been sent to your email.',
        bookingCode: 'Confirmation code',
        backToShop: 'Back to shop',
        backToEvents: 'Back to events',
        addToCalendar: 'Add to calendar'
      },
      subtotal: 'Subtotal',
      shippingLabel: 'Shipping',
      shippingFee: 'Free',
      total: 'Total',
      gdpr: 'I consent to data processing',
      next: 'Next',
      back: 'Back',
      placeOrder: checkoutType === 'event' ? 'Confirm Booking' : 'Place order',
      processing: 'Processing...'
    }
  }[language];

  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const validateStep1 = () => {
    if (!shippingData.customer_name || !shippingData.customer_email || !shippingData.customer_phone) {
      toast.error(language === 'pl' ? 'Wypełnij imię, email i telefon' : 'Fill name, email and phone');
      return false;
    }
    if (checkoutType === 'product') {
      if (!shippingData.street || !shippingData.city || !shippingData.postal_code) {
        toast.error(language === 'pl' ? 'Wypełnij adres dostawy' : 'Fill shipping address');
        return false;
      }
      if (!useSameAddress && (!billingData.street || !billingData.city || !billingData.postal_code)) {
        toast.error(language === 'pl' ? 'Wypełnij adres rozliczeniowy' : 'Fill billing address');
        return false;
      }
    }
    return true;
  };

  const validateStep2 = () => {
    if (paymentData.method === 'card') {
      if (!paymentData.card_number || !paymentData.card_name || !paymentData.card_expiry || !paymentData.card_cvv) {
        toast.error(language === 'pl' ? 'Wypełnij dane karty' : 'Fill card details');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !gdprConsent) {
      toast.error(language === 'pl' ? 'Wymagana zgoda na przetwarzanie danych' : 'Consent required');
      return;
    }
    if (currentStep === 3) {
      handlePlaceOrder();
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePlaceOrder = () => {
    const finalBillingAddress = useSameAddress ? {
      street: shippingData.street,
      city: shippingData.city,
      postal_code: shippingData.postal_code,
      country: shippingData.country
    } : billingData;

    checkoutMutation.mutate({
      customer_name: shippingData.customer_name,
      customer_email: shippingData.customer_email,
      customer_phone: shippingData.customer_phone,
      shipping_address: checkoutType === 'product' ? {
        street: shippingData.street,
        city: shippingData.city,
        postal_code: shippingData.postal_code,
        country: shippingData.country
      } : undefined,
      billing_address: checkoutType === 'product' ? finalBillingAddress : undefined,
      items: checkoutType === 'product' ? checkoutItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      })) : undefined,
      subtotal,
      shipping_cost: shippingCost,
      total,
      payment_method: paymentData.method,
      gdpr_consent: gdprConsent
    });
  };

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-neutral-50 py-20 px-6 lg:px-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-light text-neutral-900 mb-4">
                {confirmationDetails.type === 'order' ? t.confirmation.orderTitle : t.confirmation.bookingTitle}
              </h2>
              <p className="text-neutral-600 mb-8">
                {confirmationDetails.type === 'order' ? t.confirmation.orderMessage : t.confirmation.bookingMessage}
              </p>
              
              <div className="bg-neutral-50 rounded-lg p-6 mb-8">
                <p className="text-sm text-neutral-500 mb-2">
                  {confirmationDetails.type === 'order' ? t.confirmation.orderNumber : t.confirmation.bookingCode}
                </p>
                <p className="text-2xl font-mono font-medium text-[var(--portell-burgundy)]">
                  {confirmationDetails.number}
                </p>
                {confirmationDetails.type === 'booking' && confirmationDetails.eventName && (
                  <p className="text-lg text-neutral-700 mt-4">
                    {confirmationDetails.eventName}
                  </p>
                )}
              </div>

              {confirmationDetails.type === 'booking' && confirmationDetails.eventData && (
                <div className="mb-6">
                  <AddToCalendar event={confirmationDetails.eventData} language={language} />
                </div>
              )}

              <Button
                onClick={() => navigate(createPageUrl(confirmationDetails.type === 'order' ? 'Shop' : 'Events'))}
                className="bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90 w-full"
              >
                {confirmationDetails.type === 'order' ? t.confirmation.backToShop : t.confirmation.backToEvents}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {t.steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    currentStep > index + 1 ? 'bg-green-500 text-white' :
                    currentStep === index + 1 ? 'bg-[var(--portell-burgundy)] text-white' :
                    'bg-neutral-200 text-neutral-500'
                  }`}>
                    {currentStep > index + 1 ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                  </div>
                  <p className="text-sm text-neutral-600 text-center">{step}</p>
                </div>
                {index < t.steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mb-8 ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-neutral-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-light">
                  {currentStep === 1 && t.shipping.title}
                  {currentStep === 2 && t.payment.title}
                  {currentStep === 3 && t.review.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label>{t.shipping.name} *</Label>
                        <Input
                          value={shippingData.customer_name}
                          onChange={(e) => setShippingData({...shippingData, customer_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>{t.shipping.email} *</Label>
                        <Input
                          type="email"
                          value={shippingData.customer_email}
                          onChange={(e) => setShippingData({...shippingData, customer_email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>{t.shipping.phone} *</Label>
                        <Input
                          type="tel"
                          value={shippingData.customer_phone}
                          onChange={(e) => setShippingData({...shippingData, customer_phone: e.target.value})}
                        />
                      </div>
                      {checkoutType === 'product' && (
                        <>
                          <div className="md:col-span-2">
                            <Label>{t.shipping.street} *</Label>
                            <Input
                              value={shippingData.street}
                              onChange={(e) => setShippingData({...shippingData, street: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label>{t.shipping.city} *</Label>
                            <Input
                              value={shippingData.city}
                              onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label>{t.shipping.postal} *</Label>
                            <Input
                              value={shippingData.postal_code}
                              onChange={(e) => setShippingData({...shippingData, postal_code: e.target.value})}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {checkoutType === 'product' && (
                      <>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="sameAddress"
                            checked={useSameAddress}
                            onCheckedChange={setUseSameAddress}
                          />
                          <label htmlFor="sameAddress" className="text-sm cursor-pointer">
                            {t.shipping.useSame}
                          </label>
                        </div>

                        {!useSameAddress && (
                          <div className="space-y-4 pt-4 border-t border-neutral-200">
                            <h3 className="font-medium text-neutral-900">{t.shipping.billingTitle}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <Label>{t.shipping.street} *</Label>
                                <Input
                                  value={billingData.street}
                                  onChange={(e) => setBillingData({...billingData, street: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label>{t.shipping.city} *</Label>
                                <Input
                                  value={billingData.city}
                                  onChange={(e) => setBillingData({...billingData, city: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label>{t.shipping.postal} *</Label>
                                <Input
                                  value={billingData.postal_code}
                                  onChange={(e) => setBillingData({...billingData, postal_code: e.target.value})}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <RadioGroup value={paymentData.method} onValueChange={(value) => setPaymentData({...paymentData, method: value})}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-neutral-50">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <CreditCard className="w-5 h-5 inline mr-2" />
                          {t.payment.card}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-neutral-50">
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                          <FileText className="w-5 h-5 inline mr-2" />
                          {t.payment.transfer}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-neutral-50">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <Package className="w-5 h-5 inline mr-2" />
                          {t.payment.cod}
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentData.method === 'card' && (
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label>{t.payment.cardNumber} *</Label>
                          <Input
                            placeholder="1234 5678 9012 3456"
                            value={paymentData.card_number}
                            onChange={(e) => setPaymentData({...paymentData, card_number: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>{t.payment.cardName} *</Label>
                          <Input
                            value={paymentData.card_name}
                            onChange={(e) => setPaymentData({...paymentData, card_name: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>{t.payment.cardExpiry} *</Label>
                            <Input
                              placeholder="MM/RR"
                              value={paymentData.card_expiry}
                              onChange={(e) => setPaymentData({...paymentData, card_expiry: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label>{t.payment.cardCvv} *</Label>
                            <Input
                              placeholder="123"
                              value={paymentData.card_cvv}
                              onChange={(e) => setPaymentData({...paymentData, card_cvv: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-neutral-900 mb-4">{t.review.orderItems}</h3>
                      <div className="space-y-3">
                        {checkoutItems.map(item => (
                          <div key={item.id} className="flex justify-between items-center py-3 border-b border-neutral-100">
                            <div className="flex gap-3">
                              {item.image_url && (
                                <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded" />
                              )}
                              <div>
                                <p className="font-medium text-neutral-900">{item.name}</p>
                                <p className="text-sm text-neutral-500">
                                  {checkoutType === 'event' ? (language === 'pl' ? 'Liczba gości' : 'Guests') : (language === 'pl' ? 'Ilość' : 'Quantity')}: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium">{(item.price * item.quantity).toFixed(2)} PLN</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-200">
                      <div>
                        <h3 className="font-medium text-neutral-900 mb-2">
                          {checkoutType === 'product' ? t.review.shippingAddress : t.review.contactDetails}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {shippingData.customer_name}<br />
                          {shippingData.customer_email}<br />
                          {shippingData.customer_phone}
                          {checkoutType === 'product' && shippingData.street && (
                            <>
                              <br />{shippingData.street}
                              <br />{shippingData.postal_code} {shippingData.city}
                            </>
                          )}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium text-neutral-900 mb-2">{t.review.paymentMethod}</h3>
                        <p className="text-sm text-neutral-600">
                          {paymentData.method === 'card' && t.payment.card}
                          {paymentData.method === 'transfer' && t.payment.transfer}
                          {paymentData.method === 'cod' && t.payment.cod}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-6">
                      <Checkbox
                        id="gdpr"
                        checked={gdprConsent}
                        onCheckedChange={setGdprConsent}
                      />
                      <label htmlFor="gdpr" className="text-sm text-neutral-600 cursor-pointer">
                        {t.gdpr}
                      </label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl font-light">{t.review.orderSummary}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {checkoutItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-neutral-600">{item.name} x{item.quantity}</span>
                      <span className="text-neutral-900">{(item.price * item.quantity).toFixed(2)} PLN</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 mt-6 pt-6 space-y-3">
                  <div className="flex justify-between text-neutral-600">
                    <span>{t.subtotal}</span>
                    <span>{subtotal.toFixed(2)} PLN</span>
                  </div>
                  {checkoutType === 'product' && (
                    <div className="flex justify-between text-neutral-600">
                      <span>{t.shippingLabel}</span>
                      <span className="text-green-600">{t.shippingFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-medium pt-3 border-t border-neutral-200">
                    <span>{t.total}</span>
                    <span>{total.toFixed(2)} PLN</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className={`flex mt-8 max-w-6xl mx-auto ${currentStep === 1 ? 'justify-end' : 'justify-between'}`}>
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={checkoutMutation.isPending}
            className="bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90"
          >
            {checkoutMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.processing}
              </>
            ) : (
              <>
                {currentStep === 3 ? t.placeOrder : t.next}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}