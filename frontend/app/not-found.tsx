import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl mb-4">🍽️</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 text-sm mb-6">The page you are looking for does not exist.</p>
      <Link
        href="/menu"
        className="px-5 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition-colors"
      >
        Back to Menu
      </Link>
    </div>
  );
}