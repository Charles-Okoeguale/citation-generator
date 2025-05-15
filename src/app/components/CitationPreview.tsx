'use client';

import { useEffect, useState } from 'react';
import { citationService } from '@/lib/citation/citation-service';
import type { CitationOutput } from '@/lib/citation/types';

interface CitationPreviewProps {
  sourceType: string;
  data: Record<string, any>;
}

export function CitationPreview({ sourceType, data }: CitationPreviewProps) {
  const [citation, setCitation] = useState<CitationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generatePreview = async () => {
      try {
        if (Object.keys(data).length === 0) {
          setCitation(null);
          return;
        }

        const result = await citationService.generateCitation({
          type: sourceType,
          ...data
        });
        
        setCitation(result);
        setError(null);
      } catch (err) {
        setError('Unable to generate citation preview');
        setCitation(null);
      }
    };

    generatePreview();
  }, [sourceType, data]);

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (!citation) {
    return <div className="text-gray-500">Fill in the form to see citation preview</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium">Bibliography Format</h4>
        <div
          className="mt-2 p-4 bg-gray-50 rounded"
          dangerouslySetInnerHTML={{ __html: citation.html }}
        />
      </div>
      
      <div>
        <h4 className="font-medium">In-text Citation</h4>
        <div className="mt-2 p-4 bg-gray-50 rounded">
          {citation.inText}
        </div>
      </div>
    </div>
  );
}