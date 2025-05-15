'use client';

import { useState } from 'react';
import { StylePreview } from './StylePreview';
import type { EnhancedStyleMetadata } from '@/lib/citation/types';

interface StyleGridProps {
  styles: EnhancedStyleMetadata[];
  currentStyle: string;
  searchQuery: string;
  category: string;
  onStyleSelect: (styleId: string) => void;
}

export function StyleGrid({ 
  styles, 
  currentStyle, 
  searchQuery, 
  category,
  onStyleSelect 
}: StyleGridProps) {
  const [previewStyle, setPreviewStyle] = useState<string | null>(null);

  // Filter styles based on search and category
  const filteredStyles = styles.filter(style => {
    const matchesSearch = 
      style.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || style.categories.includes(category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStyles.map((style) => (
          <div
            key={style.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              currentStyle === style.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onStyleSelect(style.id)}
            onMouseEnter={() => setPreviewStyle(style.id)}
            onMouseLeave={() => setPreviewStyle(null)}
          >
            <h3 className="font-medium">{style.title}</h3>
            <div className="text-sm text-gray-500 mt-1">
              {style.categories.join(', ')}
            </div>
            {previewStyle === style.id && (
              <StylePreview styleId={style.id} />
            )}
          </div>
        ))}
      </div>

      {filteredStyles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No styles found matching your criteria
        </div>
      )}
    </div>
  );
}