'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminMenuItemsApi, adminCategoriesApi, ingredientsApi, uploadApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const emptyForm = {
  name: '', slug: '', description: '', price: '', imageUrl: '',
  isAvailable: true, isFeatured: false, isPopular: false,
  sortOrder: 0, categoryId: '', ingredientIds: [] as string[],
};

export default function MenuItemsAdminPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: adminMenuItemsApi.getAll,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: adminCategoriesApi.getAll,
  });

  const { data: ingredients = [] } = useQuery({
    queryKey: ['admin-ingredients'],
    queryFn: ingredientsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: adminMenuItemsApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] }); closeDialog(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => adminMenuItemsApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] }); closeDialog(); },
  });

  const deleteMutation = useMutation({
    mutationFn: adminMenuItemsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] }),
  });

  const closeDialog = () => { setOpen(false); setEditing(null); setForm(emptyForm); };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      name: item.name, slug: item.slug, description: item.description || '',
      price: item.price.toString(), imageUrl: item.imageUrl || '',
      isAvailable: item.isAvailable, isFeatured: item.isFeatured, isPopular: item.isPopular,
      sortOrder: item.sortOrder, categoryId: item.categoryId,
      ingredientIds: item.ingredients.map((i: any) => i.ingredientId),
    });
    setOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadApi.uploadImage(file);
      setForm((f) => ({ ...f, imageUrl: result.url }));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const toggleIngredient = (id: string) => {
    setForm((f) => ({
      ...f,
      ingredientIds: f.ingredientIds.includes(id)
        ? f.ingredientIds.filter((i) => i !== id)
        : [...f.ingredientIds, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, price: parseFloat(form.price) };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
          <p className="text-gray-500 text-sm mt-1">{menuItems.length} items</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-amber-500 hover:bg-amber-600">
          + Add Item
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-xl h-16 animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Category</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Price</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Tags</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {menuItems.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-5 py-4 text-gray-500 text-sm">{item.category?.name}</td>
                  <td className="px-5 py-4 text-gray-900 font-medium">RM {Number(item.price).toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      {item.isFeatured && <Badge className="bg-amber-100 text-amber-700 text-xs">Featured</Badge>}
                      {item.isPopular && <Badge className="bg-rose-100 text-rose-700 text-xs">Popular</Badge>}
                      {!item.isAvailable && <Badge variant="secondary" className="text-xs">Unavailable</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)} className="text-sm text-amber-600 hover:underline">Edit</button>
                      <button onClick={() => deleteMutation.mutate(item.id)} className="text-sm text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={(o) => { if (!o) closeDialog(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Price (RM)</label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Slug</label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-gray-500" />
              {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
              {form.imageUrl && <img src={form.imageUrl} className="mt-2 h-20 rounded-lg object-cover" />}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Ingredients</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {ingredients.map((ing: any) => (
                  <button
                    key={ing.id}
                    type="button"
                    onClick={() => toggleIngredient(ing.id)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      form.ingredientIds.includes(ing.id)
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    {ing.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              {[
                { key: 'isAvailable', label: 'Available' },
                { key: 'isFeatured', label: 'Featured' },
                { key: 'isPopular', label: 'Popular' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600 flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
                {editing ? 'Save Changes' : 'Create'}
              </Button>
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}