'use client';

import { Category } from '@/lib/types';

interface CategoryTabsProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect('all')}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selected === 'all'
            ? 'bg-amber-500 text-white'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-300'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === cat.id
              ? 'bg-amber-500 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-300'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}