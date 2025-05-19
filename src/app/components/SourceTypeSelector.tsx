'use client';

import { sourceTypes } from '@/lib/citation/form-config';

interface SourceTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function SourceTypeSelector({ selectedType, onTypeChange }: SourceTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Source Type
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sourceTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onTypeChange(type.id)}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              selectedType === type.id
                ? 'border-brand bg-brand/5 dark:border-brand-light dark:bg-brand/10'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
          >
            <span className="text-2xl mb-2 block">{type.icon}</span>
            <span className="font-medium block">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}