'use client';

import {  useState } from 'react';
import { StylePreview } from './StylePreview';
import { academicDisciplines, styleTags, type EnhancedStyleMetadata } from '@/lib/citation/types';
import { StyleMetadata } from '@/lib/citation/style-service';

interface StyleGridProps {
  styles: Record<string, StyleMetadata>;
  currentStyle: string;
  searchQuery: string;
  selectedDiscipline: string;
  selectedTags: string[];
  onStyleSelect: (styleId: string) => void;
}

export function StyleGrid({ 
  styles, 
  currentStyle, 
  searchQuery, 
  selectedDiscipline,
  selectedTags,
  onStyleSelect 
}: StyleGridProps) {
  const [previewStyle, setPreviewStyle] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const stylesPerPage = 9; // Show 9 styles per page (3x3 grid)

  const styleArray = Object.values(styles);
  
  // Then filter the array
  const filteredStyles = styleArray.filter((style) => {
    const matchesSearch = 
      style.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDiscipline = selectedDiscipline === 'all' || 
      style.disciplines?.includes(selectedDiscipline) ||
      (academicDisciplines
        .find((d: { id: string; }) => d.id === selectedDiscipline)
        ?.subfields
        .some((subfield: string) => style.disciplines?.includes(subfield)) ?? false);
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => style.tags?.includes(tag));
    
    return matchesSearch && matchesDiscipline && matchesTags;
  });

  // Calculate pagination
  const totalStyles = filteredStyles.length;
  const totalPages = Math.ceil(totalStyles / stylesPerPage);
  const startIndex = (currentPage - 1) * stylesPerPage;
  const visibleStyles = filteredStyles.slice(startIndex, startIndex + stylesPerPage);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Styles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleStyles.map((style: any) => (
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
            <div className="mt-2 flex flex-wrap gap-1">
              {style.tags?.map((tagId: string) => (
                <span
                  key={tagId}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                >
                  {/* {styleTags[tagId].label} */}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredStyles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No styles found matching your criteria
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(startIndex + stylesPerPage, totalStyles)} of {totalStyles} styles
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : page === '...'
                    ? 'cursor-default'
                    : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}