'use client';

import { useState } from 'react';
import type { CitationOutput, CitationFormat } from '@/lib/citation/types';
import { FormatSwitcher } from './format/FormatSwitcher';
import { CitationExport } from './export/CitationExport';
import { CitationShare } from './share/CitationShare';

interface CitationPreviewProps {
  citation: CitationOutput;
  onCitationUpdate?: (updatedCitation: CitationOutput) => void;
}

export function CitationPreview({ citation, onCitationUpdate }: CitationPreviewProps) {
  const [selectedFormat, setSelectedFormat] = useState<CitationFormat>('html');

  const handleFormatChange = (format: CitationFormat) => {
    setSelectedFormat(format);
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Citation Format</h3>
        <FormatSwitcher
          citation={citation}
          onFormatChange={handleFormatChange}
        />
      </div>

      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">In-text Citation</h3>
        <div className="p-4 bg-gray-50 rounded-lg font-serif">
          {citation.inText}
        </div>
      </div>

      <CitationExport citations={[citation]} />
      <CitationShare citations={[citation]} />
    </div>
  );
}