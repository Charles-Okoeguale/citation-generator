'use client';

import { useState, useEffect } from 'react';
import { citationService } from '@/lib/citation/citation-service';
import type { CitationOutput, CitationStyle } from '@/lib/citation/types';

interface EnhancedCitationPreviewProps {
  sourceType: string;
  data: Record<string, any>;
  selectedStyles: string[];  // Array of style IDs for comparison
}

export function EnhancedCitationPreview({ 
  sourceType, 
  data, 
  selectedStyles 
}: EnhancedCitationPreviewProps) {
  const [citations, setCitations] = useState<Record<string, CitationOutput>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generatePreviews = async () => {
      if (Object.keys(data).length === 0) {
        setCitations({});
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await Promise.all(
          selectedStyles.map(async (styleId) => {
            const citation = await citationService.generateCitation(
              { type: sourceType, ...data },
              styleId
            );
            return [styleId, citation] as const;
          })
        );

        setCitations(Object.fromEntries(results));
      } catch (err) {
        setError('Unable to generate citation previews');
      } finally {
        setLoading(false);
      }
    };

    generatePreviews();
  }, [sourceType, data, selectedStyles]);

  if (loading) {
    return (
      <div className="space-y-4">
        {selectedStyles.map(style => (
          <div key={style} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (Object.keys(citations).length === 0) {
    return (
      <div className="text-gray-500">
        Fill in the form to see citation previews
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {selectedStyles.map(styleId => {
        const citation = citations[styleId];
        if (!citation) return null;

        return (
          <div key={styleId} className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">{styleId}</h3>
            
            <div className="space-y-6">
              {/* Bibliography Format */}
              <div>
                <h4 className="font-medium text-gray-700">Bibliography Format</h4>
                <div className="mt-2 p-4 bg-gray-50 rounded-md">
                  <div 
                    className="font-serif"
                    dangerouslySetInnerHTML={{ __html: citation.html }} 
                  />
                </div>
              </div>

              {/* In-text Citation */}
              <div>
                <h4 className="font-medium text-gray-700">In-text Citation</h4>
                <div className="mt-2 p-4 bg-gray-50 rounded-md">
                  <p className="font-serif">{citation.inText}</p>
                </div>
              </div>

              {/* Copy Buttons */}
              <div className="flex space-x-4">
                <button 
                  onClick={() => navigator.clipboard.writeText(citation.text)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Copy Bibliography
                </button>
                <button 
                  onClick={() => navigator.clipboard.writeText(citation.inText)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Copy In-text Citation
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}