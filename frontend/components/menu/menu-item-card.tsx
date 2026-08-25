'use client';

import { useState } from 'react';
import { MenuItem } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
        style={{
          background: '#FFFAF4',
          border: '1px solid #F0D9BC',
          boxShadow: '0 2px 8px rgba(124, 29, 29, 0.08)',
        }}
        onClick={() => setOpen(true)}
      >
        {/* Image */}
        <div className="relative h-44" style={{ background: '#F5E6D0' }}>
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              🍽️
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {item.isFeatured && (
              <span className="badge-gold text-xs px-2 py-0.5 rounded-full text-white text-[10px]">
                ⭐ Featured
              </span>
            )}
            {item.isPopular && (
              <span className="badge-maroon text-xs px-2 py-0.5 rounded-full text-white text-[10px]">
                🔥 Popular
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3
            className="font-display font-bold text-sm leading-tight"
            style={{ color: '#3D1F0D' }}
          >
            {item.name}
          </h3>
          {item.description && (
            <p className="text-xs mt-1 line-clamp-2" style={{ color: '#7C5C3E' }}>
              {item.description}
            </p>
          )}
          <p
            className="font-display font-bold text-base mt-2"
            style={{ color: '#C8951A' }}
          >
            RM {Number(item.price).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
          {/* Dialog Header Image */}
          <div className="relative h-56" style={{ background: '#F5E6D0' }}>
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                🍽️
              </div>
            )}
            <div
              className="absolute bottom-0 left-0 right-0 h-16"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}
            />
          </div>

          {/* Dialog Content */}
          <div className="p-5 space-y-3" style={{ background: '#FFFAF4' }}>
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display font-bold text-xl" style={{ color: '#3D1F0D' }}>
                {item.name}
              </h2>
              <p className="font-display font-bold text-xl flex-shrink-0" style={{ color: '#C8951A' }}>
                RM {Number(item.price).toFixed(2)}
              </p>
            </div>

            <div className="flex gap-2">
              {item.isFeatured && (
                <span className="badge-gold text-xs px-2 py-0.5 rounded-full text-white">
                  ⭐ Featured
                </span>
              )}
              {item.isPopular && (
                <span className="badge-maroon text-xs px-2 py-0.5 rounded-full text-white">
                  🔥 Popular
                </span>
              )}
            </div>

            {item.description && (
              <p className="text-sm leading-relaxed" style={{ color: '#5C3D2E' }}>
                {item.description}
              </p>
            )}

            {item.ingredients.length > 0 && (
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: '#7C1D1D' }}
                >
                  Ingredients
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.ingredients.map((i) => (
                    <span
                      key={i.ingredientId}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: '#F5E6D0', color: '#5C3D2E', border: '1px solid #E8C99A' }}
                    >
                      {i.ingredient.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div
              className="text-xs text-center pt-2 border-t"
              style={{ borderColor: '#F0D9BC', color: '#C8951A' }}
            >
              JR's Kitchen — Authentic Mamak Cuisine
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}