'use client';

import { useState, useEffect } from 'react';
import { StyleGrid } from './StyleGrid';
import { StyleSearch } from './StyleSearch';
import { StyleCategories } from './StyleCategories';
import type { EnhancedStyleMetadata } from '@/lib/citation/types';
import { unifiedStyleService } from '@/lib/citation/style-service';

export function StyleSelector({ 
  onStyleSelect, 
  currentStyle = 'apa' 
}: {
  onStyleSelect: (styleId: string) => void;
  currentStyle?: string;
}) {
  const [styles, setStyles] = useState<EnhancedStyleMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadStyles();
  }, []);

  async function loadStyles() {
    try {
      setLoading(true);
      await unifiedStyleService.initialize();
      const allStyles = Array.from(unifiedStyleService.getStyles().values());
      setStyles(allStyles);
    } catch (error) {
      console.error('Failed to load styles:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <StyleSearch 
        onSearch={setSearchQuery} 
        placeholder="Search citation styles..."
      />
      
      <StyleCategories
        categories={unifiedStyleService.getCategories()}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <StyleGrid
          styles={styles}
          currentStyle={currentStyle}
          searchQuery={searchQuery}
          category={selectedCategory}
          onStyleSelect={onStyleSelect}
        />
      )}
    </div>
  );
}