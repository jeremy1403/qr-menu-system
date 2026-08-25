'use client';

import { Category } from '@/lib/types';

interface CategoryTabsProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onSelect('all')}
        className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
        style={
          selected === 'all'
            ? { background: '#D4A84B', color: '#3D1F0D' }
            : { background: 'rgba(253,246,236,0.15)', color: '#FDF6EC', border: '1px solid rgba(212,168,75,0.4)' }
        }
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
          style={
            selected === cat.id
              ? { background: '#D4A84B', color: '#3D1F0D' }
              : { background: 'rgba(253,246,236,0.15)', color: '#FDF6EC', border: '1px solid rgba(212,168,75,0.4)' }
          }
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}