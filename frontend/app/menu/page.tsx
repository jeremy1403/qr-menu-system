'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi, menuItemsApi } from '@/lib/api';
import { MenuItem } from '@/lib/types';
import MenuItemCard from '@/components/menu/menu-item-card';
import CategoryTabs from '@/components/menu/category-tabs';
import { Input } from '@/components/ui/input';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const { data: allItems = [], isLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: () => menuItemsApi.getAll(),
  });

  const { data: searchResults = [] } = useQuery({
    queryKey: ['menu-items', 'search', searchQuery],
    queryFn: () => menuItemsApi.search(searchQuery),
    enabled: searchQuery.length > 1,
  });

  const displayedItems: MenuItem[] = useMemo(() => {
    if (searchQuery.length > 1) return searchResults;
    if (selectedCategory === 'all') return allItems;
    return allItems.filter((item: MenuItem) => item.categoryId === selectedCategory);
  }, [searchQuery, searchResults, selectedCategory, allItems]);

  const featuredItems: MenuItem[] = useMemo(
    () => allItems.filter((item: MenuItem) => item.isFeatured),
    [allItems]
  );

  return (
    <div className="min-h-screen mamak-bg flex flex-col items-center">
      {/* Hero Header - Full Width */}
      <div
        className="sticky top-0 z-10 shadow-lg w-full"
        style={{ background: 'linear-gradient(135deg, #5C1515, #7C1D1D, #9B2D2D)' }}
      >
        <div className="w-full max-w-5xl mx-auto px-6 pt-5 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="font-display text-3xl font-bold tracking-wide"
                style={{ color: '#D4A84B' }}
              >
                JR's Kitchen
              </h1>
              <p className="text-xs mt-0.5" style={{ color: '#F5E6D0', opacity: 0.8 }}>
                🍛 Authentic Mamak Cuisine
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner"
              style={{ background: 'rgba(212, 168, 75, 0.2)', border: '2px solid #D4A84B' }}
            >
              🍜
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
            <Input
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-0 text-sm w-full"
              style={{
                background: 'rgba(253, 246, 236, 0.15)',
                color: '#FDF6EC',
                backdropFilter: 'blur(4px)',
              }}
            />
          </div>

          {!searchQuery && (
            <CategoryTabs
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          )}
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="w-full max-w-5xl mx-auto px-6 py-6 space-y-8">
        {!searchQuery && selectedCategory === 'all' && featuredItems.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⭐</span>
              <h2 className="font-display text-xl font-bold" style={{ color: '#7C1D1D' }}>
                Featured Dishes
              </h2>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, #C8951A, transparent)' }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-display text-xl font-bold" style={{ color: '#7C1D1D' }}>
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory !== 'all'
                ? categories.find((c: any) => c.id === selectedCategory)?.name
                : 'All Items'}
            </h2>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, #C8951A, transparent)' }} />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl h-64 animate-pulse" style={{ background: '#F5E6D0' }} />
              ))}
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="text-center py-16" style={{ color: '#9B2D2D' }}>
              <p className="text-4xl mb-3">🍽️</p>
              <p className="font-display text-lg">No dishes found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <div className="text-center py-4 border-t" style={{ borderColor: '#F5E6D0' }}>
          <p className="font-display text-sm" style={{ color: '#C8951A' }}>
            JR's Kitchen
          </p>
          <p className="text-xs mt-1" style={{ color: '#9B2D2D', opacity: 0.6 }}>
            Authentic Mamak cuisine since day one
          </p>
        </div>
      </div>
    </div>
  );
}