'use client';

import type { CitationFormat } from '@/lib/citation/types';

interface FormatPreviewProps {
  format: CitationFormat;
  citation: {
    html: string;
    text: string;
    bibtex: string;
    inText: string;
  };
}

export function FormatPreview({ format, citation }: FormatPreviewProps) {
  const getPreviewContent = () => {
    switch (format) {
      case 'html':
        return (
          <div
            className="font-serif"
            dangerouslySetInnerHTML={{ __html: citation.html }}
          />
        );
      case 'bibtex':
        return (
          <pre className="font-mono text-sm whitespace-pre-wrap">
            {citation.bibtex}
          </pre>
        );
      case 'text':
      default:
        return (
          <pre className="font-serif whitespace-pre-wrap">
            {citation.text}
          </pre>
        );
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      {getPreviewContent()}
    </div>
  );
}