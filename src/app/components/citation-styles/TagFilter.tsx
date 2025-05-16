'use client';

import { StyleTag, styleTags, tagCategories } from '@/lib/citation/types';
import { useState } from 'react';

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagFilter({ selectedTags, onTagsChange }: TagFilterProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleTag = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(t => t !== tagId)
      : [...selectedTags, tagId];
    onTagsChange(newTags);
  };

  const groupedTags = Object.entries(styleTags).reduce((acc, [_, tag]) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, StyleTag[]>);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedTags.map(tagId => (
          <span
            key={tagId}
            className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
          >
            {styleTags[tagId].label}
            <button
              onClick={() => toggleTag(tagId)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {Object.entries(tagCategories).map(([category, label]) => (
        <div key={category} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedCategory(
              expandedCategory === category ? null : category
            )}
            className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
          >
            <span className="font-medium">{label}</span>
            <span>{expandedCategory === category ? '−' : '+'}</span>
          </button>
          
          {expandedCategory === category && (
            <div className="p-4 grid grid-cols-2 gap-2">
              {groupedTags[category]?.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`p-2 text-sm rounded-lg text-left transition-colors
                    ${selectedTags.includes(tag.id)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                  <div className="font-medium">{tag.label}</div>
                  {tag.description && (
                    <div className="text-xs text-gray-600 mt-1">
                      {tag.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}