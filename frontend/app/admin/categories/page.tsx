'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCategoriesApi, uploadApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const emptyForm = { name: '', slug: '', description: '', imageUrl: '', isActive: true, sortOrder: 0 };

export default function CategoriesAdminPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: adminCategoriesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: adminCategoriesApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-categories'] }); closeDialog(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => adminCategoriesApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-categories'] }); closeDialog(); },
  });

  const deleteMutation = useMutation({
    mutationFn: adminCategoriesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-categories'] }),
  });

  const closeDialog = () => { setOpen(false); setEditing(null); setForm(emptyForm); };

  const openEdit = (cat: any) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', imageUrl: cat.imageUrl || '', isActive: cat.isActive, sortOrder: cat.sortOrder });
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
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categories</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-amber-500 hover:bg-amber-600">
          + Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl h-16 animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Slug</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Items</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat: any) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-5 py-4 text-gray-500 text-sm">{cat.slug}</td>
                  <td className="px-5 py-4 text-gray-500 text-sm">{cat._count?.menuItems ?? 0}</td>
                  <td className="px-5 py-4">
                    <Badge variant={cat.isActive ? 'default' : 'secondary'} className={cat.isActive ? 'bg-green-100 text-green-700' : ''}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(cat)} className="text-sm text-amber-600 hover:underline">Edit</button>
                      <button onClick={() => deleteMutation.mutate(cat.id)} className="text-sm text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={(o) => { if (!o) closeDialog(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} required />
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
              <label className="text-sm font-medium text-gray-700 block mb-1">Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-gray-500" />
              {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
              {form.imageUrl && <img src={form.imageUrl} className="mt-2 h-20 rounded-lg object-cover" />}
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
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