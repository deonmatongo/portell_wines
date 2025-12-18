import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('portell_admin_logged_in');
    if (isLoggedIn === 'true') {
      navigate(createPageUrl('AdminDashboard'));
    }
  }, [navigate]);

  const t = {
    pl: {
      title: 'Panel Administracyjny',
      subtitle: 'Zaloguj się aby zarządzać witryną',
      username: 'Nazwa użytkownika',
      password: 'Hasło',
      login: 'Zaloguj się',
      error: 'Nieprawidłowa nazwa użytkownika lub hasło'
    },
    en: {
      title: 'Admin Panel',
      subtitle: 'Login to manage the website',
      username: 'Username',
      password: 'Password',
      login: 'Login',
      error: 'Invalid username or password'
    }
  }[language];

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === 'Admin' && password === '123456') {
      localStorage.setItem('portell_admin_logged_in', 'true');
      toast.success(language === 'pl' ? 'Zalogowano pomyślnie' : 'Login successful');
      navigate(createPageUrl('AdminDashboard'));
    } else {
      toast.error(t.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center px-6">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-[var(--portell-burgundy)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-light">{t.title}</CardTitle>
          <p className="text-neutral-600 text-sm mt-2">{t.subtitle}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>{t.username}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  placeholder="Admin"
                />
              </div>
            </div>
            <div>
              <Label>{t.password}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90">
              {t.login}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}