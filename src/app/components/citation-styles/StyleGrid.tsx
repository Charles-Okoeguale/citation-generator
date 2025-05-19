'use client';

import { useEffect, useState } from 'react';
import { academicDisciplines, styleTags, type EnhancedStyleMetadata } from '@/lib/citation/types';
import { StyleMetadata } from '@/lib/citation/style-service';
import { getStyles } from '@/lib/citation/style-data';
import { useStylePreferences } from '@/lib/citation/hooks/useStylePreferences';
import { Star, StarOff } from 'lucide-react';
import { usePagination } from '@/lib/hooks/use-pagination';
import { Pagination } from '@/app/components/ui/Pagination';

interface StyleGridProps {
  currentStyle: string;
  searchQuery: string;
  selectedDiscipline: string;
  selectedTags: string[];
  onStyleSelect: (styleId: string) => void;
  styles?: any
}

export function StyleGrid({ 
  currentStyle, 
  searchQuery, 
  selectedDiscipline,
  selectedTags,
  onStyleSelect 
}: StyleGridProps) {
  const [styles, setStyles] = useState<Record<string, StyleMetadata>>({});
  const [loading, setLoading] = useState(true);

  const { preferences, addToFavorites, removeFromFavorites } = useStylePreferences();

  const isStyleFavorited = (styleId: string) => {
    return preferences.favoriteStyles.some(style => style.styleId === styleId);
  };

  const handleToggleFavorite = (e: React.MouseEvent, styleId: string) => {
    e.stopPropagation();
    
    if (isStyleFavorited(styleId)) {
      removeFromFavorites(styleId);
    } else {
      addToFavorites(styleId);
    }
  };

  useEffect(() => {
    async function loadStyles() {
      setLoading(true);
      const loadedStyles = await getStyles();
      setStyles(loadedStyles);
      setLoading(false);
    }
    
    loadStyles();
  }, []);
  
  // Convert styles object to array for filtering
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

  // Use our pagination hook with the filtered styles
  const pagination = usePagination(filteredStyles);

  if (loading || pagination.loading) {
    return <div className="text-gray-600 dark:text-gray-300">Loading styles...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Styles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pagination.currentItems.map((style: any) => (
          <div
            key={style.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md relative ${
              currentStyle === style.id
                ? 'border-brand bg-brand/5 dark:bg-brand/20 dark:border-brand-light'
                : 'border-gray-200 dark:border-gray-700 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => onStyleSelect(style.id)}
          >
            {/* Top Right Buttons */}
            <div className="absolute top-3 right-3">
              {/* Favorite Button */}
              <button
                className="text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 focus:outline-none transition-colors"
                onClick={(e) => handleToggleFavorite(e, style.id)}
                aria-label={isStyleFavorited(style.id) ? "Remove from favorites" : "Add to favorites"}
              >
                {isStyleFavorited(style.id) ? (
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 dark:fill-yellow-300 dark:text-yellow-300" />
                ) : (
                  <Star className="h-5 w-5" />
                )}
              </button>
            </div>
            
            <div className="flex flex-col h-full">
              <h3 className="font-semibold pr-12 text-gray-900 dark:text-white text-base sm:text-lg truncate">{style.title}</h3>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {style.id}
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {style.categories && style.categories.length > 0 ? style.categories.join(', ') : 'General'}
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1 pt-2">
                {style.tags?.slice(0, 3).map((tagId: string) => (
                  <span
                    key={tagId}
                    className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    {tagId}
                  </span>
                ))}
                {style.tags && style.tags.length > 3 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    +{style.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredStyles.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No styles found matching your criteria
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
          isFirstPage={pagination.isFirstPage}
          isLastPage={pagination.isLastPage}
          itemsPerPage={pagination.itemsPerPage}
          totalItems={pagination.totalItems}
          onItemsPerPageChange={pagination.setPageSize}
          showItemsPerPage={true}
        />
      )}
    </div>
  );
}