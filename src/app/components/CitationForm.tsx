'use client';

import { useState } from 'react';
import { getFormConfig } from '@/lib/citation/form-config';
import { SourceTypeSelector } from './SourceTypeSelector';
import { FormSection } from './FormSection';
import { useFormPersistence } from '@/lib/citation/hooks/useFormPersistence';
import { EnhancedCitationPreview } from './EnhancedCitationPreview';

export function CitationForm() {
  const [sourceType, setSourceType] = useState('article-journal');
  const formConfig = getFormConfig(sourceType);
  const [selectedStyles, setSelectedStyles] = useState(['apa']); 
  
  const { formData, updateFormData, saveForm } = useFormPersistence(sourceType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveForm();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SourceTypeSelector
        selectedType={sourceType}
        onTypeChange={setSourceType}
      />
      
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
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
            selectedStyles={selectedStyles}
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Generate Citation
          </button>
        </div>
      </form>
    </div>
  );
}