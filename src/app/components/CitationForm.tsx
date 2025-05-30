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
import { citationToasts, styleToasts, generalToasts } from '@/lib/utils/toast';
import { styles, getStyles } from '@/lib/citation/style-data';
import type { SourceType, CitationInput } from '@/lib/citation/types';
import { ErrorBoundary } from './ErrorBoundary';
import { useRouter } from 'next/navigation';

// Helper function to check if a source type is valid
function isValidSourceType(type: string): boolean {
  const validSourceTypes = [
    'article-journal', 'book', 'webpage', 'newspaper', 
    'video', 'podcast', 'email', 'software', 'dataset', 'artwork'
  ];
  return validSourceTypes.includes(type);
}

interface CitationFormProps {
  initialData?: any;
  citationId?: string;
  isEditing?: boolean;
}

export function CitationForm({ initialData, citationId, isEditing = false }: CitationFormProps) {
  const router = useRouter();
  const [sourceType, setSourceType] = useState<SourceType>('article-journal');
  const formConfig = getFormConfig(sourceType);
  const [selectedStyle, setSelectedStyle] = useState('apa');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const { formData, updateFormData, saveForm } = useFormPersistence(sourceType);
  const { preferences, updateStyleUsage } = useStylePreferences();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedCitation, setGeneratedCitation] = useState<any>(null);
  const [allStyles, setAllStyles] = useState(styles);

  const [isServiceInitialized, setServiceInitialized] = useState(false);

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
        setIsGenerating(true); // Show loading state during initialization
        await citationService.initialize();
        setServiceInitialized(true);
        setIsGenerating(false);
      } catch (error) {
        console.error('Error initializing citation service:', error);
        generalToasts.error('We could not set up the citation system. Please refresh the page and try again.');
        setServiceInitialized(true);
        setIsGenerating(false);
      }
    }
    
    initService();
  }, []);

  // Initialize form with the provided data when in edit mode
  useEffect(() => {
    if (isEditing && initialData) {
      if (initialData.sourceType && isValidSourceType(initialData.sourceType)) {
        setSourceType(initialData.sourceType as SourceType);
      }
      
      if (initialData.style) {
        setSelectedStyle(initialData.style);
      }
      
      if (initialData.citationData) {
        updateFormData(initialData.citationData);
      }
    }
  }, [isEditing, initialData, updateFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!validateForm()) {
      citationToasts.missingFields();
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Show loading state
      citationToasts.generating();
      
      // Create citation input from form data
      const citationInput = createCitationInput();
      
      if (!citationInput) {
        citationToasts.generateFailed();
        setIsGenerating(false);
        return;
      }
      
      // Generate citation
      const citation = await citationService.generateCitation(
        citationInput,
        selectedStyle || "apa"
      );
      
      if (!citation) {
        citationToasts.generateFailed();
        setIsGenerating(false);
        return;
      }
      
      setGeneratedCitation(citation);
      
      if (isEditing) {
        await updateCitation();
      } else {
        await saveForm();
      }
      
      citationToasts.generateSuccess();
    } catch (error) {
      console.error('Error during citation generation:', error);
      citationToasts.generateFailed();
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Function to update an existing citation
  const updateCitation = async () => {
    if (!isEditing || !citationId) return;
    
    setIsSaving(true);
    try {
      const citationData = {
        id: citationId,
        title: formData.title || 'Untitled',
        sourceType: sourceType,
        citationData: formData,
        style: selectedStyle,
        authors: Array.isArray(formData.author) 
          ? formData.author.map((a: any) => `${a.given} ${a.family}`) 
          : []
      };
      
      const response = await fetch('/api/citations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(citationData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update citation');
      }
      
      citationToasts.updated();
    } catch (error) {
      console.error('Error updating citation:', error);
      citationToasts.updateFailed();
    } finally {
      setIsSaving(false);
    }
  };

  // Update the validateForm function to return a boolean
  const validateForm = () => {
    let isValid = true;
    const updatedErrors: Record<string, string> = {};
    
    // Check required fields based on source type
    Object.values(formConfig.sections || {}).forEach((section) => {
      section.fields.forEach((fieldName) => {
        const fieldConfig = formConfig.fields[fieldName];
        
        // Skip validation for fields that aren't required
        if (!fieldConfig.required) return;
        
        const value = formData[fieldName];
        
        // Special case for authorList type fields
        if (fieldConfig.type === 'author-list') {
          const authors = value as any[] || [];
          if (authors.length === 0) {
            updatedErrors[fieldName] = `${fieldConfig.label} is required`;
            isValid = false;
          }
        } 
        // For other field types
        else if (!value || (typeof value === 'string' && value.trim() === '')) {
          updatedErrors[fieldName] = `${fieldConfig.label} is required`;
          isValid = false;
        }
      });
    });
    
    // Update errors state
    // Assuming you have a setErrors function to update the errors state
    // setErrors(updatedErrors);
    return isValid;
  };

  // Update the createCitationInput function
  const createCitationInput = () => {
    // Implement the logic to create a citation input based on the current form data
    // This is a placeholder and should be replaced with the actual implementation
    return {
      type: sourceType,
      title: formData.title || 'Untitled',
      ...formData
    };
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
            disabled={isEditing} // Disable changing source type in edit mode
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
            {isEditing ? (
              <button
                type="button"
                className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => updateFormData({})}
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              disabled={isGenerating || isSaving}
              className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-50 dark:bg-brand dark:hover:bg-brand-dark"
            >
              {isGenerating ? 'Generating...' : isEditing ? (isSaving ? 'Saving...' : 'Update Citation') : 'Generate Citation'}
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