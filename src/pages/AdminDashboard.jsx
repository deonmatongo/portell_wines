import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { apiClient } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Package, Calendar, ShoppingCart, Users, LayoutDashboard, Wine } from 'lucide-react';
import EventManager from '../components/admin/EventManager';
import ProductManager from '../components/admin/ProductManager';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem('portell_lang') || 'pl');

  useEffect(() => {
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('portell_admin_logged_in');
    if (isLoggedIn !== 'true') {
      navigate(createPageUrl('AdminLogin'));
    }
  }, [navigate]);

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiClient.entities.Product.list('-created_date', 1000)
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => apiClient.entities.Event.list('-date', 1000)
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => apiClient.entities.Booking.list('-created_date', 1000)
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: () => apiClient.entities.Order.list('-created_date', 1000)
  });

  const t = {
    pl: {
      title: 'Panel Administracyjny',
      logout: 'Wyloguj',
      overview: 'Przegląd',
      events: 'Wydarzenia',
      products: 'Produkty',
      totalProducts: 'Wszystkie Produkty',
      activeEvents: 'Aktywne Wydarzenia',
      totalBookings: 'Rezerwacje',
      totalOrders: 'Zamówienia',
      recentBookings: 'Najnowsze Rezerwacje',
      recentOrders: 'Najnowsze Zamówienia',
      customer: 'Klient',
      event: 'Wydarzenie',
      guests: 'Goście',
      status: 'Status',
      total: 'Suma',
      items: 'Produkty'
    },
    en: {
      title: 'Admin Dashboard',
      logout: 'Logout',
      overview: 'Overview',
      events: 'Events',
      products: 'Products',
      totalProducts: 'Total Products',
      activeEvents: 'Active Events',
      totalBookings: 'Bookings',
      totalOrders: 'Orders',
      recentBookings: 'Recent Bookings',
      recentOrders: 'Recent Orders',
      customer: 'Customer',
      event: 'Event',
      guests: 'Guests',
      status: 'Status',
      total: 'Total',
      items: 'Items'
    }
  }[language];

  const handleLogout = () => {
    localStorage.removeItem('portell_admin_logged_in');
    navigate(createPageUrl('AdminLogin'));
  };

  const stats = [
    {
      title: t.totalProducts,
      value: products.length,
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: t.activeEvents,
      value: events.filter(e => e.active).length,
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: t.totalBookings,
      value: bookings.length,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: t.totalOrders,
      value: orders.length,
      icon: ShoppingCart,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light text-neutral-900 mb-2">{t.title}</h1>
            <p className="text-neutral-600">PORTELL</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            {t.logout}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-neutral-200">
            <TabsTrigger value="overview">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              {t.overview}
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="w-4 h-4 mr-2" />
              {t.events}
            </TabsTrigger>
            <TabsTrigger value="products">
              <Wine className="w-4 h-4 mr-2" />
              {t.products}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-neutral-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-light text-neutral-900">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">{t.recentBookings}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map(booking => {
                      const event = events.find(e => e.id === booking.event_id);
                      return (
                        <div key={booking.id} className="flex justify-between items-start py-3 border-b border-neutral-100 last:border-0">
                          <div>
                            <p className="font-medium text-neutral-900">{booking.customer_name}</p>
                            <p className="text-sm text-neutral-500">{event?.title || 'Event'}</p>
                            <p className="text-xs text-neutral-400">{t.guests}: {booking.guests}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs px-2 py-1 rounded bg-neutral-100 text-neutral-700">
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">{t.recentOrders}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex justify-between items-start py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="font-medium text-neutral-900">{order.customer_name}</p>
                          <p className="text-sm text-neutral-500">{order.order_number}</p>
                          <p className="text-xs text-neutral-400">{order.items?.length || 0} {t.items}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-neutral-900">{order.total?.toFixed(2)} PLN</p>
                          <span className="text-xs px-2 py-1 rounded bg-neutral-100 text-neutral-700">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <EventManager language={language} />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <ProductManager language={language} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}