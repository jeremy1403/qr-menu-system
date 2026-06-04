'use client';

import { useState } from 'react';
import { MenuItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setOpen(true)}
      >
        <div className="relative h-48 bg-gray-100">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
              🍽️
            </div>
          )}
          <div className="absolute top-2 left-2 flex gap-1">
            {item.isFeatured && (
              <Badge className="bg-amber-500 text-white text-xs">Featured</Badge>
            )}
            {item.isPopular && (
              <Badge className="bg-rose-500 text-white text-xs">Popular</Badge>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-base">{item.name}</h3>
          {item.description && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
          )}
          <p className="text-lg font-bold text-amber-600 mt-2">
            RM {Number(item.price).toFixed(2)}
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-56 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-56 bg-gray-100 rounded-xl flex items-center justify-center text-6xl">
                🍽️
              </div>
            )}
            <div className="flex gap-2">
              {item.isFeatured && (
                <Badge className="bg-amber-500 text-white">Featured</Badge>
              )}
              {item.isPopular && (
                <Badge className="bg-rose-500 text-white">Popular</Badge>
              )}
            </div>
            {item.description && (
              <p className="text-gray-600 text-sm">{item.description}</p>
            )}
            {item.ingredients.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((i) => (
                    <Badge key={i.ingredientId} variant="outline" className="text-xs">
                      {i.ingredient.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <p className="text-2xl font-bold text-amber-600">
              RM {Number(item.price).toFixed(2)}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}