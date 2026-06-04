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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Our Menu</h1>
              <p className="text-xs text-gray-500">Tap any item to see details</p>
            </div>
            <span className="text-2xl">🍜</span>
          </div>
          <Input
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-50"
          />
          {!searchQuery && (
            <CategoryTabs
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Featured section */}
        {!searchQuery && selectedCategory === 'all' && featuredItems.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4">⭐ Featured Dishes</h2>
            <div className="grid grid-cols-2 gap-3">
              {featuredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Main items */}
        <section>
          {searchQuery ? (
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Results for "{searchQuery}"
            </h2>
          ) : selectedCategory !== 'all' ? (
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {categories.find((c: any) => c.id === selectedCategory)?.name}
            </h2>
          ) : (
            <h2 className="text-lg font-bold text-gray-800 mb-4">All Items</h2>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🍽️</p>
              <p>No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {displayedItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}