'use client';

import { useQuery } from '@tanstack/react-query';
import { categoriesApi, menuItemsApi, ingredientsApi } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: menuItems = [] } = useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: () => menuItemsApi.getAll(),
  });

  const { data: ingredients = [] } = useQuery({
    queryKey: ['admin-ingredients'],
    queryFn: () => ingredientsApi.getAll(),
  });

  const stats = [
    { label: 'Categories', value: categories.length, href: '/admin/categories', emoji: '📂' },
    { label: 'Menu Items', value: menuItems.length, href: '/admin/menu-items', emoji: '🍽️' },
    { label: 'Ingredients', value: ingredients.length, href: '/admin/ingredients', emoji: '🧂' },
    { label: 'Featured', value: menuItems.filter((i: any) => i.isFeatured).length, href: '/admin/menu-items', emoji: '⭐' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your menu system</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
              <p className="text-3xl mb-2">{stat.emoji}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <Link href="/admin/menu-items" className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition-colors">
            + Add Menu Item
          </Link>
          <Link href="/admin/categories" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:border-amber-300 transition-colors">
            + Add Category
          </Link>
          <Link href="/menu" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:border-amber-300 transition-colors">
            👁️ View Menu
          </Link>
        </div>
      </div>
    </div>
  );
}