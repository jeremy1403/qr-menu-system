'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '@/lib/api';
import Link from 'next/link';

const navLinks = [
  { href: '/admin/dashboard', label: '📊 Dashboard' },
  { href: '/admin/categories', label: '📂 Categories' },
  { href: '/admin/menu-items', label: '🍽️ Menu Items' },
  { href: '/admin/ingredients', label: '🧂 Ingredients' },
  { href: '/admin/qr-code', label: '📱 QR Code' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (checking && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar — mobile only */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div>
          <p className="font-bold text-gray-900 text-sm">Admin Panel</p>
          <p className="text-xs text-gray-400">QR Menu System</p>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {menuOpen ? (
            <span className="text-xl">✕</span>
          ) : (
            <span className="text-xl">☰</span>
          )}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black/40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile slide-in menu */}
      <div className={`lg:hidden fixed top-0 right-0 h-full w-64 bg-white z-30 shadow-xl transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b border-gray-100">
          <p className="font-bold text-gray-900">Admin Panel</p>
          <p className="text-xs text-gray-400 mt-0.5">QR Menu System</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
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
            onClick={handleSignOut}
            className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors text-left px-3 py-2"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:flex w-56 bg-white border-r border-gray-200 flex-col min-h-screen sticky top-0">
          <div className="p-5 border-b border-gray-100">
            <h1 className="font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-400 mt-0.5">QR Menu System</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navLinks.map((link) => (
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
              onClick={handleSignOut}
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
    </div>
  );
}