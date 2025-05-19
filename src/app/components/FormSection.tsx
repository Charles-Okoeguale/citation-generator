'use client';


import { FieldConfig } from '@/lib/citation/types';
import { FormField } from './FormField';


interface FormSectionProps {
    section: any;
    fields: Record<string, FieldConfig>;
    formData: Record<string, any>;
    onChange: (field: string, value: any) => void;
  }
  
  export function FormSection({ section, fields, formData, onChange }: FormSectionProps) {
    if (!section) return null;
  
    return (
      <div className="space-y-6 p-6 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{section.label}</h3>
        <div className="grid grid-cols-1 gap-6">
          {section.fields.map((fieldName: string) => (
            <FormField
              key={fieldName}
              name={fieldName}
              config={fields[fieldName]}
              value={formData[fieldName]}
              onChange={(value) => onChange(fieldName, value)}
            />
          ))}
        </div>
      </div>
    );
  }