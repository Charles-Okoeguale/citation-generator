'use client';

import { useState, useEffect } from 'react';
import { getFormConfig } from '@/lib/citation/form-config';
import { SourceTypeSelector } from './citation-forms/SourceTypeSelector';
import { FormSection } from './FormSection';
import { useFormPersistence } from '@/lib/citation/hooks/useFormPersistence';
import { EnhancedCitationPreview } from './EnhancedCitationPreview';
import { TagFilter } from './citation-styles/TagFilter';
import { StyleGrid } from './citation-styles/StyleGrid';
import { StylePreferences } from './citation-styles/StylePreferences';
import { useStylePreferences } from '@/lib/citation/hooks/useStylePreferences';
import { GeneratedCitation } from './citation-forms/GeneratedCitation';
import { citationService } from '@/lib/citation/citation-service';
import toast from 'react-hot-toast';
import { styles, getStyles } from '@/lib/citation/style-data';

export function CitationForm() {
  const [sourceType, setSourceType] = useState('article-journal');
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

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    updateStyleUsage(styleId);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const citation = await citationService.generateCitation(
        { type: sourceType, ...formData },
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
        <SourceTypeSelector
          selectedType={sourceType}
          onTypeChange={setSourceType}
        />
        
        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-lg font-medium mb-4">Filter by Features</h2>
          <TagFilter
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-lg font-medium mb-4">Your Citation Styles</h2>
          <StylePreferences
            styles={styles}
            onStyleSelect={handleStyleSelect}
          />
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-lg font-medium mb-4">Citation Style</h2>
          <StyleGrid
            styles={allStyles}
            currentStyle={selectedStyle}
            searchQuery={searchQuery}
            selectedDiscipline={selectedDiscipline}
            selectedTags={selectedTags}
            onStyleSelect={handleStyleSelect}
          />
        </div>
      
        <form onSubmit={handleSubmit} className="space-y-8">
          {formConfig.order?.map((sectionKey) => (
            <FormSection
              key={sectionKey}
              section={formConfig.sections?.[sectionKey]}
              fields={formConfig.fields}
              formData={formData}
              onChange={(field, value) => updateFormData({ [field]: value })}
            />
          ))}
          
          <div className="mt-8">
            <EnhancedCitationPreview
              sourceType={sourceType}
              data={formData}
              selectedStyles={[selectedStyle]}
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              onClick={() => updateFormData({})}
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Citation'}
            </button>
          </div>
        </form>

        {generatedCitation && (
          <GeneratedCitation
            citation={generatedCitation}
            onClose={() => setGeneratedCitation(null)}
          />
        )}
      </div>
    </div>
  );
}