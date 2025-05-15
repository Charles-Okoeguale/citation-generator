'use client';

import { FieldConfig } from '@/lib/citation/form-config';
import { AuthorField } from './citation-forms/fields/AuthorField';
import { DateField } from './citation-forms/fields/DateField';
import { IdentifierField } from './citation-forms/fields/IdentifierField';
import { PageRangeField } from './citation-forms/fields/PageRangerField';
import { ContainerField } from './citation-forms/fields/ContainerField';

interface FormFieldProps {
  name: string;
  config: FieldConfig;
  value: any;
  onChange: (value: any) => void;
}

export function FormField({ name, config, value, onChange }: FormFieldProps) {
  const renderField = () => {
    switch (config.type) {
      case 'author-list':
        return (
          <AuthorField
            value={value}
            onChange={onChange}
            required={config.required}
          />
        );
      case 'date':
        return (
          <DateField
            value={value}
            onChange={onChange}
            required={config.required}
          />
        );
      case 'identifier':
        return (
          <IdentifierField
            value={value}
            onChange={onChange}
            config={config}
          />
        );
      case 'page-range':
        return (
          <PageRangeField
            value={value}
            onChange={onChange}
            required={config.required}
          />
        );
      case 'container':
        return (
          <ContainerField
            value={value}
            onChange={onChange}
            config={config}
          />
        );
      case 'url':
        return (
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.placeholder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required={config.required}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.placeholder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required={config.required}
          />
        );
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {config.help && (
        <p className="mt-2 text-sm text-gray-500">{config.help}</p>
      )}
    </div>
  );
}