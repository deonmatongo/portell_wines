import React, { useState } from 'react';
import { apiClient } from '@/api/apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function EventManager({ language }) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    slug: '',
    description: '',
    description_en: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    address: '',
    price: 0,
    capacity: 20,
    image_url: '',
    event_type: 'tasting',
    active: true
  });

  const { data: events = [] } = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => apiClient.entities.Event.list('-date', 100)
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiClient.entities.Event.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success(language === 'pl' ? 'Wydarzenie utworzone' : 'Event created');
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.entities.Event.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success(language === 'pl' ? 'Wydarzenie zaktualizowane' : 'Event updated');
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.entities.Event.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success(language === 'pl' ? 'Wydarzenie usunięte' : 'Event deleted');
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      title_en: '',
      slug: '',
      description: '',
      description_en: '',
      date: '',
      time: '',
      duration: '',
      location: '',
      address: '',
      price: 0,
      capacity: 20,
      image_url: '',
      event_type: 'tasting',
      active: true
    });
    setEditingEvent(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      title_en: event.title_en || '',
      slug: event.slug || '',
      description: event.description || '',
      description_en: event.description_en || '',
      date: event.date || '',
      time: event.time || '',
      duration: event.duration || '',
      location: event.location || '',
      address: event.address || '',
      price: event.price || 0,
      capacity: event.capacity || 20,
      image_url: event.image_url || '',
      event_type: event.event_type || 'tasting',
      active: event.active !== false
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: formData });
    } else {
      createMutation.mutate({ ...formData, booked_count: 0 });
    }
  };

  const t = {
    pl: {
      title: 'Zarządzanie Wydarzeniami',
      addNew: 'Dodaj Wydarzenie',
      edit: 'Edytuj',
      delete: 'Usuń',
      save: 'Zapisz',
      cancel: 'Anuluj',
      capacity: 'Miejsca',
      booked: 'Zarezerwowane',
      active: 'Aktywne',
      inactive: 'Nieaktywne',
      formTitle: 'Tytuł (PL)',
      formTitleEn: 'Tytuł (EN)',
      formSlug: 'Slug URL',
      formDesc: 'Opis (PL)',
      formDescEn: 'Opis (EN)',
      formDate: 'Data',
      formTime: 'Godzina',
      formDuration: 'Czas trwania',
      formLocation: 'Lokalizacja',
      formAddress: 'Adres',
      formPrice: 'Cena (PLN)',
      formCapacity: 'Maksymalna liczba miejsc',
      formImage: 'URL Obrazu',
      formType: 'Typ wydarzenia',
      formActive: 'Aktywne'
    },
    en: {
      title: 'Event Management',
      addNew: 'Add Event',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      capacity: 'Capacity',
      booked: 'Booked',
      active: 'Active',
      inactive: 'Inactive',
      formTitle: 'Title (PL)',
      formTitleEn: 'Title (EN)',
      formSlug: 'URL Slug',
      formDesc: 'Description (PL)',
      formDescEn: 'Description (EN)',
      formDate: 'Date',
      formTime: 'Time',
      formDuration: 'Duration',
      formLocation: 'Location',
      formAddress: 'Address',
      formPrice: 'Price (PLN)',
      formCapacity: 'Maximum capacity',
      formImage: 'Image URL',
      formType: 'Event type',
      formActive: 'Active'
    }
  }[language];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light text-neutral-900">{t.title}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90">
              <Plus className="w-4 h-4 mr-2" />
              {t.addNew}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? t.edit : t.addNew}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t.formTitle}</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div>
                  <Label>{t.formTitleEn}</Label>
                  <Input value={formData.title_en} onChange={(e) => setFormData({...formData, title_en: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <Label>{t.formSlug}</Label>
                  <Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <Label>{t.formDesc}</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} />
                </div>
                <div className="col-span-2">
                  <Label>{t.formDescEn}</Label>
                  <Textarea value={formData.description_en} onChange={(e) => setFormData({...formData, description_en: e.target.value})} rows={3} />
                </div>
                <div>
                  <Label>{t.formDate}</Label>
                  <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                </div>
                <div>
                  <Label>{t.formTime}</Label>
                  <Input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required />
                </div>
                <div>
                  <Label>{t.formDuration}</Label>
                  <Input value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} placeholder="2 hours" />
                </div>
                <div>
                  <Label>{t.formLocation}</Label>
                  <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                </div>
                <div className="col-span-2">
                  <Label>{t.formAddress}</Label>
                  <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <div>
                  <Label>{t.formPrice}</Label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} required />
                </div>
                <div>
                  <Label>{t.formCapacity}</Label>
                  <Input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})} required />
                </div>
                <div className="col-span-2">
                  <Label>{t.formImage}</Label>
                  <Input value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
                </div>
                <div>
                  <Label>{t.formType}</Label>
                  <Select value={formData.event_type} onValueChange={(value) => setFormData({...formData, event_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tasting">Tasting</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="tour">Tour</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="active" className="cursor-pointer">{t.formActive}</Label>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={resetForm}>{t.cancel}</Button>
                <Button type="submit" className="bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90">{t.save}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(event => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-medium">{event.title}</CardTitle>
                  <p className="text-sm text-neutral-500 mt-1">{event.date} • {event.time}</p>
                </div>
                <Badge variant={event.active ? 'default' : 'secondary'}>
                  {event.active ? t.active : t.inactive}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">{t.capacity}:</span>
                  <span className="font-medium">{event.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">{t.booked}:</span>
                  <span className="font-medium">{event.booked_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">{language === 'pl' ? 'Cena' : 'Price'}:</span>
                  <span className="font-medium">{event.price} PLN</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(event)} className="flex-1">
                  <Edit className="w-3 h-3 mr-1" />
                  {t.edit}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(event.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}