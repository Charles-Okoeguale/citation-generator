'use client';

import { useState } from 'react';
import type { CitationFormat } from '@/lib/citation/types';
import { FormatPreview } from './FormatPreview';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';

interface FormatSwitcherProps {
  citation: {
    html: string;
    text: string;
    bibtex: string;
    inText: string;
  };
  onFormatChange?: (format: CitationFormat) => void;
}

const formatOptions: Array<{
  id: CitationFormat;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    id: 'html',
    label: 'Rich Text',
    icon: '🔤',
    description: 'Formatted text with styling'
  },
  {
    id: 'text',
    label: 'Plain Text',
    icon: '📝',
    description: 'Simple text without formatting'
  },
  {
    id: 'bibtex',
    label: 'BibTeX',
    icon: '📚',
    description: 'For LaTeX documents'
  }
];

export function FormatSwitcher({ citation, onFormatChange }: FormatSwitcherProps) {
  const [preferredFormat, setPreferredFormat] = useLocalStorage<CitationFormat>(
    'preferred-citation-format',
    'html'
  );
  const [activeFormat, setActiveFormat] = useState<CitationFormat>(preferredFormat);
  const [showPreview, setShowPreview] = useState(false);

  const handleFormatChange = (format: CitationFormat) => {
    setActiveFormat(format);
    setPreferredFormat(format);
    onFormatChange?.(format);
  };

  return (
    <div className="space-y-4">
      {/* Quick Format Toggle */}
      <div className="flex flex-wrap gap-2">
        {formatOptions.map((format) => (
          <button
            key={format.id}
            onClick={() => handleFormatChange(format.id)}
            className={`
              flex items-center px-4 py-2 rounded-lg transition-colors
              ${activeFormat === format.id
                ? 'bg-blue-100 text-blue-700 border-blue-300'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
              } border
            `}
          >
            <span className="mr-2">{format.icon}</span>
            <span>{format.label}</span>
          </button>
        ))}
      </div>

      {/* Format Preview */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-gray-700">
            {formatOptions.find(f => f.id === activeFormat)?.label} Preview
          </h4>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
        
        {showPreview && (
          <FormatPreview
            format={activeFormat}
            citation={citation}
          />
        )}
      </div>

      {/* Format Description */}
      <p className="text-sm text-gray-600 mt-2">
        {formatOptions.find(f => f.id === activeFormat)?.description}
      </p>

      {/* Quick Actions */}
      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              activeFormat === 'html' ? citation.html :
              activeFormat === 'bibtex' ? citation.bibtex :
              citation.text
            );
          }}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Copy {formatOptions.find(f => f.id === activeFormat)?.label}
        </button>
      </div>
    </div>
  );
}