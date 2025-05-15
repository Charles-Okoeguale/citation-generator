'use client';

import type { StyleCategory } from '@/lib/citation/types';

interface StyleCategoriesProps {
  categories: StyleCategory[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function StyleCategories({ 
  categories,
  selectedCategory, 
  onCategorySelect 
}: StyleCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        key="all"
        onClick={() => onCategorySelect('all')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Styles
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}