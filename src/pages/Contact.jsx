import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Contact() {
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const sendEmailMutation = useMutation({
    mutationFn: async (data) => {
      await base44.integrations.Core.SendEmail({
        from_name: 'Portell Contact Form',
        to: 'contact@portell.wine',
        subject: `[Contact Form] ${data.subject}`,
        body: `New contact form submission:\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nMessage:\n${data.message}`
      });

      await base44.integrations.Core.SendEmail({
        from_name: 'Portell Winery',
        to: data.email,
        subject: language === 'pl' ? 'Dziękujemy za kontakt' : 'Thank you for contacting us',
        body: language === 'pl'
          ? `Witaj ${data.name},\n\nDziękujemy za wiadomość. Odpowiemy najszybciej jak to możliwe.\n\nPozdrawiamy,\nZespół Portell`
          : `Hello ${data.name},\n\nThank you for your message. We'll respond as soon as possible.\n\nBest regards,\nPortell Team`
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  });

  const t = {
    pl: {
      title: 'Kontakt',
      subtitle: 'Masz pytania? Chętnie odpowiemy',
      form: {
        title: 'Wyślij wiadomość',
        name: 'Imię i nazwisko',
        email: 'Email',
        phone: 'Telefon',
        subject: 'Temat',
        message: 'Wiadomość',
        send: 'Wyślij wiadomość',
        sending: 'Wysyłanie...'
      },
      success: {
        title: 'Dziękujemy!',
        message: 'Twoja wiadomość została wysłana. Odpowiemy najszybciej jak to możliwe.'
      },
      info: {
        title: 'Informacje kontaktowe',
        address: 'Adres',
        addressValue: 'ul. Winna 123, 00-000 Zielona Góra',
        phone: 'Telefon',
        phoneValue: '+48 123 456 789',
        email: 'Email',
        emailValue: 'kontakt@portell.wine',
        hours: 'Godziny otwarcia',
        hoursValue: 'Wt-Nd: 10:00 - 18:00'
      }
    },
    en: {
      title: 'Contact',
      subtitle: 'Have questions? We\'d love to hear from you',
      form: {
        title: 'Send a message',
        name: 'Full name',
        email: 'Email',
        phone: 'Phone',
        subject: 'Subject',
        message: 'Message',
        send: 'Send message',
        sending: 'Sending...'
      },
      success: {
        title: 'Thank you!',
        message: 'Your message has been sent. We\'ll respond as soon as possible.'
      },
      info: {
        title: 'Contact information',
        address: 'Address',
        addressValue: 'ul. Winna 123, 00-000 Zielona Góra',
        phone: 'Phone',
        phoneValue: '+48 123 456 789',
        email: 'Email',
        emailValue: 'contact@portell.wine',
        hours: 'Opening hours',
        hoursValue: 'Tue-Sun: 10:00 AM - 6:00 PM'
      }
    }
  }[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    sendEmailMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="py-32 px-6 lg:px-12 bg-gradient-to-br from-neutral-100 to-neutral-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              {t.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-light text-neutral-900 mb-3">{t.success.title}</h3>
                      <p className="text-neutral-600">{t.success.message}</p>
                      <Button
                        onClick={() => setSubmitted(false)}
                        variant="outline"
                        className="mt-6"
                      >
                        {language === 'pl' ? 'Wyślij kolejną wiadomość' : 'Send another message'}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-light text-neutral-900 mb-6">{t.form.title}</h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <Label htmlFor="name">{t.form.name} *</Label>
                          <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">{t.form.email} *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">{t.form.phone}</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="subject">{t.form.subject} *</Label>
                          <Input
                            id="subject"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="message">{t.form.message} *</Label>
                          <Textarea
                            id="message"
                            required
                            rows={6}
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90"
                          disabled={sendEmailMutation.isPending}
                        >
                          {sendEmailMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {t.form.sending}
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              {t.form.send}
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-light text-neutral-900 mb-8">{t.info.title}</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[var(--portell-burgundy)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[var(--portell-burgundy)]" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 mb-1">{t.info.address}</p>
                      <p className="text-neutral-600">{t.info.addressValue}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[var(--portell-burgundy)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[var(--portell-burgundy)]" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 mb-1">{t.info.phone}</p>
                      <p className="text-neutral-600">{t.info.phoneValue}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[var(--portell-burgundy)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[var(--portell-burgundy)]" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 mb-1">{t.info.email}</p>
                      <p className="text-neutral-600">{t.info.emailValue}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[var(--portell-burgundy)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-[var(--portell-burgundy)]" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 mb-1">{t.info.hours}</p>
                      <p className="text-neutral-600">{t.info.hoursValue}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="aspect-video bg-neutral-100 rounded-sm overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
                  alt="Winery"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}