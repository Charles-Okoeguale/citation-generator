'use client';

import { useState, useEffect } from 'react';
import { getFormConfig } from '@/lib/citation/form-config';
import { SourceTypeSelector } from './citation-forms/SourceTypeSelector';
import { FormSection } from './FormSection';
import { useFormPersistence } from '@/lib/citation/hooks/useFormPersistence';
import { TagFilter } from './citation-styles/TagFilter';
import { StyleGrid } from './citation-styles/StyleGrid';
import { StylePreferences } from './citation-styles/StylePreferences';
import { useStylePreferences } from '@/lib/citation/hooks/useStylePreferences';
import { GeneratedCitation } from './citation-forms/GeneratedCitation';
import { citationService } from '@/lib/citation/citation-service';
import toast from 'react-hot-toast';
import { styles, getStyles } from '@/lib/citation/style-data';
import type { SourceType, CitationInput } from '@/lib/citation/types';
import { ErrorBoundary } from './ErrorBoundary';

export function CitationForm() {
  const [sourceType, setSourceType] = useState<SourceType>('article-journal');
  const formConfig = getFormConfig(sourceType);
  const [selectedStyle, setSelectedStyle] = useState('apa');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const { formData, updateFormData, saveForm } = useFormPersistence(sourceType);
  const { preferences, updateStyleUsage } = useStylePreferences();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCitation, setGeneratedCitation] = useState<any>(null);
  const [allStyles, setAllStyles] = useState(styles);

  const [isServiceInitialized, setServiceInitialized] = useState(false);

  // Helper function to check if a string is a valid SourceType for UI purposes
  const isValidSourceType = (type: string): boolean => {
    // Include all source types used in the SourceTypeSelector component
    return [
      'book', 
      'article-journal', 
      'webpage',
      'newspaper',
      'video',
      'podcast',
      'email',
      'software',
      'dataset',
      'artwork'
    ].includes(type);
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    updateStyleUsage(styleId);
  };

  const handleSourceTypeChange = (type: string) => {
    if (isValidSourceType(type)) {
      // Use type assertion to bypass TypeScript's type checking
      setSourceType(type as SourceType);
    } else {
      console.warn(`Invalid source type: ${type}, defaulting to article-journal`);
      setSourceType('article-journal' as SourceType);
    }
    
    // Initialize form data with empty values for all fields in the config
    const newConfig = getFormConfig(type);
    const initialData: Record<string, any> = {};
    
    // Process all sections and their fields
    Object.values(newConfig.sections || {}).forEach(section => {
      section.fields.forEach(fieldName => {
        const fieldConfig = newConfig.fields[fieldName];
        // Set appropriate default values based on field type
        if (fieldConfig.type === 'author-list') {
          initialData[fieldName] = [];
        } else if (fieldConfig.type === 'date') {
          initialData[fieldName] = null;
        } else {
          initialData[fieldName] = '';
        }
      });
    });
    
    updateFormData(initialData);
  };

  // Use default style on initial load if available
  useEffect(() => {
    if (preferences.defaultStyle && !selectedStyle) {
      setSelectedStyle(preferences.defaultStyle);
    }
  }, [preferences.defaultStyle]);

  // Load all styles on component mount
  useEffect(() => {
    async function loadAllStyles() {
      const loadedStyles = await getStyles();
      setAllStyles(loadedStyles);
    }
    loadAllStyles();
  }, []);

  // Initialize citation service on component mount
  useEffect(() => {
    async function initService() {
      try {
        await citationService.initialize();
        setServiceInitialized(true);
      } catch (error) {
        console.error('Error initializing citation service:', error);
        // Still set as initialized to prevent blocking the UI
        setServiceInitialized(true);
      }
    }
    
    initService();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Create a citation input with the sourceType and form data
      const citationInput: CitationInput = {
        type: sourceType,
        title: formData.title || 'Untitled',
        ...formData
      };

      const citation = await citationService.generateCitation(
        citationInput,
        selectedStyle
      );
      
      setGeneratedCitation(citation);
      await saveForm();
    } catch (error) {
      toast.error('Failed to generate citation');
      console.error('Citation generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        <ErrorBoundary fallback={
          <div className="p-4 border border-yellow-200 dark:border-yellow-800 rounded-md bg-yellow-50 dark:bg-yellow-900/20">
            <p className="text-yellow-800 dark:text-yellow-300">There was an issue with the source type selector.</p>
          </div>
        }>
          <SourceTypeSelector
            selectedType={sourceType}
            onTypeChange={handleSourceTypeChange}
          />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Filter by Features</h2>
            <TagFilter
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
          </div>
        </ErrorBoundary>

        <ErrorBoundary>
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Your Citation Styles</h2>
            <StylePreferences
              styles={styles}
              onStyleSelect={handleStyleSelect}
            />
          </div>
        </ErrorBoundary>

        <ErrorBoundary>
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Citation Style</h2>
            <StyleGrid
              styles={allStyles}
              currentStyle={selectedStyle}
              searchQuery={searchQuery}
              selectedDiscipline={selectedDiscipline}
              selectedTags={selectedTags}
              onStyleSelect={handleStyleSelect}
            />
          </div>
        </ErrorBoundary>
      
        <form onSubmit={handleSubmit} className="space-y-8">
          {formConfig.order?.map((sectionKey) => (
            <ErrorBoundary key={sectionKey}>
              <FormSection
                section={formConfig.sections?.[sectionKey]}
                fields={formConfig.fields}
                formData={formData}
                onChange={(field, value) => updateFormData({ [field]: value })}
              />
            </ErrorBoundary>
          ))}
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => updateFormData({})}
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-50 dark:bg-brand dark:hover:bg-brand-dark"
            >
              {isGenerating ? 'Generating...' : 'Generate Citation'}
            </button>
          </div>
        </form>

        {generatedCitation && (
          <ErrorBoundary>
            <GeneratedCitation
              citation={generatedCitation}
              onClose={() => setGeneratedCitation(null)}
            />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}