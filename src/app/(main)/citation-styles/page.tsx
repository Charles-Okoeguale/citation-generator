'use client';

import { useState, useEffect } from 'react';
import { useStylePreferences } from '@/lib/citation/hooks/useStylePreferences';
import { StyleGrid } from '@/app/components/citation-styles/StyleGrid';
import { getStyles } from '@/lib/citation/style-data';
import { unifiedStyleService } from '@/lib/citation/style-service';
import { StyleMetadata } from '@/lib/citation/style-service';
import { Search, Filter } from 'lucide-react';

export default function StylesPage() {
  const [styles, setStyles] = useState<Record<string, StyleMetadata>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const { preferences, updateStyleUsage, setDefaultStyle } = useStylePreferences();

  useEffect(() => {
    async function loadStyles() {
      setLoading(true);
      try {
        const loadedStyles = await getStyles();
        setStyles(loadedStyles);
        
        // Set a default selected style
        if (preferences.defaultStyle) {
          setSelectedStyle(preferences.defaultStyle);
        } else if (Object.keys(loadedStyles).length > 0) {
          // Set first style as selected if no default
          setSelectedStyle(Object.keys(loadedStyles)[0]);
        }
      } catch (error) {
        console.error('Failed to load styles:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadStyles();
  }, [preferences.defaultStyle]);

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    updateStyleUsage(styleId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Filters and Search */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Citation Styles</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Browse, search, and select from the available citation styles for your documents.
            </p>
            
            {/* Search Box */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            {/* Discipline Filter (simplified) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Academic Discipline
              </label>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Disciplines</option>
                <option value="humanities">Humanities</option>
                <option value="social-sciences">Social Sciences</option>
                <option value="sciences">Sciences</option>
                <option value="medicine">Medicine</option>
                <option value="engineering">Engineering</option>
                <option value="law">Law</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Right Column - Style Grid */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Browse Styles</h2>
              {selectedStyle && (
                <button
                  onClick={() => setDefaultStyle(selectedStyle)}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                >
                  Set as Default
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="py-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 dark:border-blue-500 border-r-transparent"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading citation styles...</p>
              </div>
            ) : (
              <StyleGrid 
                currentStyle={selectedStyle}
                searchQuery={searchQuery}
                selectedDiscipline={selectedDiscipline}
                selectedTags={selectedTags}
                onStyleSelect={handleStyleSelect}
                styles={styles}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 