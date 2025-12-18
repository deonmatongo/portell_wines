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
import { Plus, Edit, Trash2, Wine } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductManager({ language }) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    slug: '',
    description: '',
    description_en: '',
    tasting_notes: '',
    tasting_notes_en: '',
    price: 0,
    category: 'red',
    vintage: new Date().getFullYear(),
    volume: '750ml',
    alcohol: '',
    region: '',
    grape_variety: '',
    image_url: '',
    stock: 0,
    featured: false,
    active: true
  });

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => apiClient.entities.Product.list('-created_date', 100)
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiClient.entities.Product.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(language === 'pl' ? 'Produkt utworzony' : 'Product created');
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.entities.Product.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(language === 'pl' ? 'Produkt zaktualizowany' : 'Product updated');
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(language === 'pl' ? 'Produkt usunięty' : 'Product deleted');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      name_en: '',
      slug: '',
      description: '',
      description_en: '',
      tasting_notes: '',
      tasting_notes_en: '',
      price: 0,
      category: 'red',
      vintage: new Date().getFullYear(),
      volume: '750ml',
      alcohol: '',
      region: '',
      grape_variety: '',
      image_url: '',
      stock: 0,
      featured: false,
      active: true
    });
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      name_en: product.name_en || '',
      slug: product.slug || '',
      description: product.description || '',
      description_en: product.description_en || '',
      tasting_notes: product.tasting_notes || '',
      tasting_notes_en: product.tasting_notes_en || '',
      price: product.price || 0,
      category: product.category || 'red',
      vintage: product.vintage || new Date().getFullYear(),
      volume: product.volume || '750ml',
      alcohol: product.alcohol || '',
      region: product.region || '',
      grape_variety: product.grape_variety || '',
      image_url: product.image_url || '',
      stock: product.stock || 0,
      featured: product.featured || false,
      active: product.active !== false
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const t = {
    pl: {
      title: 'Zarządzanie Produktami',
      addNew: 'Dodaj Produkt',
      edit: 'Edytuj',
      delete: 'Usuń',
      save: 'Zapisz',
      cancel: 'Anuluj',
      stock: 'Magazyn',
      active: 'Aktywny',
      inactive: 'Nieaktywny',
      featured: 'Wyróżniony',
      formName: 'Nazwa (PL)',
      formNameEn: 'Nazwa (EN)',
      formSlug: 'Slug URL',
      formDesc: 'Opis (PL)',
      formDescEn: 'Opis (EN)',
      formTasting: 'Notatki (PL)',
      formTastingEn: 'Notatki (EN)',
      formPrice: 'Cena (PLN)',
      formCategory: 'Kategoria',
      formVintage: 'Rocznik',
      formVolume: 'Pojemność',
      formAlcohol: 'Alkohol',
      formRegion: 'Region',
      formGrapes: 'Szczep winogron',
      formImage: 'URL Obrazu',
      formStock: 'Ilość w magazynie',
      formFeatured: 'Wyróżniony',
      formActive: 'Aktywny'
    },
    en: {
      title: 'Product Management',
      addNew: 'Add Product',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      stock: 'Stock',
      active: 'Active',
      inactive: 'Inactive',
      featured: 'Featured',
      formName: 'Name (PL)',
      formNameEn: 'Name (EN)',
      formSlug: 'URL Slug',
      formDesc: 'Description (PL)',
      formDescEn: 'Description (EN)',
      formTasting: 'Tasting Notes (PL)',
      formTastingEn: 'Tasting Notes (EN)',
      formPrice: 'Price (PLN)',
      formCategory: 'Category',
      formVintage: 'Vintage',
      formVolume: 'Volume',
      formAlcohol: 'Alcohol',
      formRegion: 'Region',
      formGrapes: 'Grape Variety',
      formImage: 'Image URL',
      formStock: 'Stock Quantity',
      formFeatured: 'Featured',
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
              <DialogTitle>{editingProduct ? t.edit : t.addNew}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t.formName}</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                  <Label>{t.formNameEn}</Label>
                  <Input value={formData.name_en} onChange={(e) => setFormData({...formData, name_en: e.target.value})} />
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
                <div className="col-span-2">
                  <Label>{t.formTasting}</Label>
                  <Textarea value={formData.tasting_notes} onChange={(e) => setFormData({...formData, tasting_notes: e.target.value})} rows={2} />
                </div>
                <div className="col-span-2">
                  <Label>{t.formTastingEn}</Label>
                  <Textarea value={formData.tasting_notes_en} onChange={(e) => setFormData({...formData, tasting_notes_en: e.target.value})} rows={2} />
                </div>
                <div>
                  <Label>{t.formPrice}</Label>
                  <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} required />
                </div>
                <div>
                  <Label>{t.formCategory}</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="rose">Rosé</SelectItem>
                      <SelectItem value="sparkling">Sparkling</SelectItem>
                      <SelectItem value="bundle">Bundle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t.formVintage}</Label>
                  <Input type="number" value={formData.vintage} onChange={(e) => setFormData({...formData, vintage: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>{t.formVolume}</Label>
                  <Input value={formData.volume} onChange={(e) => setFormData({...formData, volume: e.target.value})} placeholder="750ml" />
                </div>
                <div>
                  <Label>{t.formAlcohol}</Label>
                  <Input value={formData.alcohol} onChange={(e) => setFormData({...formData, alcohol: e.target.value})} placeholder="13%" />
                </div>
                <div>
                  <Label>{t.formRegion}</Label>
                  <Input value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <Label>{t.formGrapes}</Label>
                  <Input value={formData.grape_variety} onChange={(e) => setFormData({...formData, grape_variety: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <Label>{t.formImage}</Label>
                  <Input value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
                </div>
                <div>
                  <Label>{t.formStock}</Label>
                  <Input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} required />
                </div>
                <div className="flex flex-col justify-end gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="featured" className="cursor-pointer">{t.formFeatured}</Label>
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
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={resetForm}>{t.cancel}</Button>
                <Button type="submit" className="bg-[var(--portell-burgundy)] hover:bg-[var(--portell-burgundy)]/90">{t.save}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <Card key={product.id}>
            <CardHeader>
              <div className="aspect-square bg-neutral-100 rounded-sm overflow-hidden mb-3">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Wine className="w-12 h-12 text-neutral-300" />
                  </div>
                )}
              </div>
              <CardTitle className="text-base font-medium">{product.name}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant={product.active ? 'default' : 'secondary'}>
                  {product.active ? t.active : t.inactive}
                </Badge>
                {product.featured && <Badge className="bg-yellow-500">{t.featured}</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">{language === 'pl' ? 'Cena' : 'Price'}:</span>
                  <span className="font-medium">{product.price} PLN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">{t.stock}:</span>
                  <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-orange-600' : ''}`}>
                    {product.stock}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(product)} className="flex-1">
                  <Edit className="w-3 h-3 mr-1" />
                  {t.edit}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(product.id)}>
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