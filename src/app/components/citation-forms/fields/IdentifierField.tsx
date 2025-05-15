'use client';

import { FieldConfig } from '@/lib/citation/form-config';

interface IdentifierFieldProps {
  value: string;
  onChange: (value: string) => void;
  config: FieldConfig;
}

export function IdentifierField({ value, onChange, config }: IdentifierFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const validate = () => {
    if (!value || !config.validation) return true;
    
    return config.validation.every(rule => {
      if (rule.type === 'pattern' && rule.pattern) {
        return rule.pattern.test(value);
      }
      if (rule.type === 'custom' && rule.validator) {
        return rule.validator(value);
      }
      return true;
    });
  };

  const isValid = validate();

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={value || ''}
          onChange={handleChange}
          placeholder={config.placeholder}
          className={`w-full px-3 py-2 border rounded-md ${
            !isValid ? 'border-red-500' : ''
          }`}
          required={config.required}
        />
        {value && !isValid && (
          <span className="absolute right-2 top-2 text-red-500">!</span>
        )}
      </div>
      
      {value && !isValid && config.validation && (
        <p className="text-red-500 text-sm">
          {config.validation.find(rule => 
            (rule.type === 'pattern' && rule.pattern && !rule.pattern.test(value)) ||
            (rule.type === 'custom' && rule.validator && !rule.validator(value))
          )?.message || 'Invalid format'}
        </p>
      )}
    </div>
  );
}