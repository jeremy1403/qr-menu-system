'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ingredientsApi, adminMenuItemsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function IngredientsAdminPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [name, setName] = useState('');

  const { data: ingredients = [], isLoading } = useQuery({
    queryKey: ['admin-ingredients'],
    queryFn: ingredientsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-ingredients'] }); closeDialog(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-ingredients'] }); closeDialog(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-ingredients'] }),
  });

  const closeDialog = () => { setOpen(false); setEditing(null); setName(''); };

  const openEdit = (ing: any) => { setEditing(ing); setName(ing.name); setOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: { name } });
    } else {
      createMutation.mutate({ name });
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ingredients</h1>
          <p className="text-gray-500 text-sm mt-1">{ingredients.length} ingredients</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-amber-500 hover:bg-amber-600">
          + Add Ingredient
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-3">
          {[...Array(9)].map((_, i) => <div key={i} className="bg-white rounded-xl h-12 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {ingredients.map((ing: any) => (
            <div key={ing.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-800">{ing.name}</span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(ing)} className="text-xs text-amber-600 hover:underline">Edit</button>
                <button onClick={() => deleteMutation.mutate(ing.id)} className="text-xs text-red-500 hover:underline">Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={(o) => { if (!o) closeDialog(); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Ingredient' : 'Add Ingredient'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600 flex-1">
                {editing ? 'Save' : 'Create'}
              </Button>
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}