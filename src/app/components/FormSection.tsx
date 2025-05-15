'use client';

import { FieldConfig, FormSection as FormSectionType }  from '@/lib/citation/form-config';
import { FormField } from './FormField';


interface FormSectionProps {
    section: FormSectionType;
    fields: Record<string, FieldConfig>;
    formData: Record<string, any>;
    onChange: (field: string, value: any) => void;
  }
  
  export function FormSection({ section, fields, formData, onChange }: FormSectionProps) {
    if (!section) return null;
  
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">{section.label}</h3>
        <div className="grid grid-cols-1 gap-6">
          {section.fields.map((fieldName) => (
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