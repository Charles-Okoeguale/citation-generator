'use client';

import { useState } from 'react';
import { unifiedStyleService } from '@/lib/citation/style-service';
import { StyleSelector } from './StyleSelector';

interface StyleComparisonProps {
  onStyleSelect?: (styleId: string) => void;
}

export function StyleComparison({ onStyleSelect }: StyleComparisonProps) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['apa', 'mla', 'chicago']);
  const [examples, setExamples] = useState<Record<string, { bibliography: string; inText: string }>>({});
  const [loading, setLoading] = useState(false);


  const sampleSource : any = {
    type: 'book',
    title: 'The Great Gatsby',
    author: [{ given: 'F. Scott', family: 'Fitzgerald' }],
    issued: { 'date-parts': [[1925]] },
    publisher: 'Charles Scribner\'s Sons',
    'publisher-place': 'New York'
  };

  const addStyle = async (styleId: string) => {
    if (selectedStyles.length >= 3) {
      return; // Limit to 3 styles for better UI
    }
    
    setLoading(true);
    try {
      const example : any = await unifiedStyleService.generateExample(sampleSource);
      setExamples(prev => ({
        ...prev,
        [styleId]: {
          bibliography: example.bibliography,
          inText: example.inText
        }
      }));
      setSelectedStyles(prev => [...prev, styleId]);
    } catch (error) {
      console.error('Failed to generate example:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeStyle = (styleId: string) => {
    setSelectedStyles(prev => prev.filter(id => id !== styleId));
    setExamples(prev => {
      const { [styleId]: _, ...rest } = prev;
      return rest;
    });
  };

  const selectAsMain = (styleId: string) => {
    onStyleSelect?.(styleId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Compare Citation Styles</h3>
        {selectedStyles.length < 3 && (
          <button
            onClick={() => document.getElementById('style-selector-modal')?.showModal()}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Add Style
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedStyles.map((styleId) => (
          <div key={styleId} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">{styleId.toUpperCase()}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => selectAsMain(styleId)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Use This Style
                </button>
                <button
                  onClick={() => removeStyle(styleId)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>

            {examples[styleId] && (
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">Bibliography Format</h5>
                  <div className="p-3 bg-gray-50 rounded-md font-serif text-sm">
                    <div dangerouslySetInnerHTML={{ __html: examples[styleId].bibliography }} />
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">In-text Citation</h5>
                  <div className="p-3 bg-gray-50 rounded-md font-serif text-sm">
                    {examples[styleId].inText}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Key differences:
                  <ul className="mt-1 list-disc list-inside">
                    <li>Author name format</li>
                    <li>Publication year placement</li>
                    <li>Punctuation style</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <dialog id="style-selector-modal" className="rounded-lg p-6 w-full max-w-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Select Style to Compare</h3>
            <button
              onClick={() => document.getElementById('style-selector-modal')?.close()}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <StyleSelector
            onStyleSelect={(styleId) => {
              addStyle(styleId);
              document.getElementById('style-selector-modal')?.close();
            }}
            excludeStyles={selectedStyles}
          />
        </div>
      </dialog>
    </div>
  );
}