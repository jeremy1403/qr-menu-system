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
    <main style={{ minHeight: '100vh', width: '100%' }} className="mamak-bg">
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          width: '100%',
          background: 'linear-gradient(135deg, #5C1515, #7C1D1D, #9B2D2D)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 24px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <h1 className="font-display" style={{ color: '#D4A84B', fontSize: '1.875rem', fontWeight: 'bold' }}>
                JR's Kitchen
              </h1>
              <p style={{ color: '#F5E6D0', opacity: 0.8, fontSize: '0.75rem', marginTop: '2px' }}>
                🍛 Authentic Mamak Cuisine
              </p>
            </div>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', background: 'rgba(212,168,75,0.2)', border: '2px solid #D4A84B',
            }}>
              🍜
            </div>
          </div>

          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.875rem' }}>🔍</span>
            <Input
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 text-sm w-full"
              style={{
                paddingLeft: '36px',
                background: 'rgba(253,246,236,0.15)',
                color: '#FDF6EC',
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
      </header>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        {!searchQuery && selectedCategory === 'all' && featuredItems.length > 0 && (
          <section style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.25rem' }}>⭐</span>
              <h2 className="font-display" style={{ color: '#7C1D1D', fontSize: '1.25rem', fontWeight: 'bold' }}>
                Featured Dishes
              </h2>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #C8951A, transparent)' }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <h2 className="font-display" style={{ color: '#7C1D1D', fontSize: '1.25rem', fontWeight: 'bold' }}>
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory !== 'all'
                ? categories.find((c: any) => c.id === selectedCategory)?.name
                : 'All Items'}
            </h2>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #C8951A, transparent)' }} />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl h-64 animate-pulse" style={{ background: '#F5E6D0' }} />
              ))}
            </div>
          ) : displayedItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#9B2D2D' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🍽️</p>
              <p className="font-display" style={{ fontSize: '1.125rem' }}>No dishes found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid #F5E6D0', marginTop: '32px' }}>
          <p className="font-display" style={{ color: '#C8951A', fontSize: '0.875rem' }}>JR's Kitchen</p>
          <p style={{ color: '#9B2D2D', fontSize: '0.75rem', marginTop: '4px', opacity: 0.6 }}>
            Authentic Mamak cuisine since day one
          </p>
        </div>
      </div>
    </main>
  );
}