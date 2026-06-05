'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '@/lib/api';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    authApi.getProfile()
      .then(() => setChecking(false))
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/admin/login');
      });
  }, [pathname]);

  if (checking && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <h1 className="font-bold text-gray-900">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-0.5">QR Menu System</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: '/admin/dashboard', label: '📊 Dashboard' },
            { href: '/admin/categories', label: '📂 Categories' },
            { href: '/admin/menu-items', label: '🍽️ Menu Items' },
            { href: '/admin/ingredients', label: '🧂 Ingredients' },
            { href: '/admin/qr-code', label: '📱 QR Code' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === link.href
                  ? 'bg-amber-50 text-amber-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/admin/login');
            }}
            className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors text-left px-3 py-2"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}