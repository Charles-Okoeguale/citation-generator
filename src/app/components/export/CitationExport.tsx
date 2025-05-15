'use client';

import { useState } from 'react';
import type { CitationOutput } from '@/lib/citation/types';
import { ExportOptions, exportService } from '@/lib/citation/export/export-service';

interface CitationExportProps {
  citations: CitationOutput[];
  onExport?: () => void;
}

export function CitationExport({ citations, onExport }: CitationExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportOptions['format']>('pdf');
  const [includeInText, setIncludeInText] = useState(true);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const filename = `citations-${Date.now()}`;
      let blob: Blob;

      switch (selectedFormat) {
        case 'word':
          blob = await exportService.exportToWord(citations, {
            format: 'word',
            includeInText,
            filename: `${filename}.docx`
          });
          exportService.downloadBlob(blob, `${filename}.docx`);
          break;

        case 'pdf':
          blob = await exportService.exportToPDF(citations, {
            format: 'pdf',
            includeInText,
            filename: `${filename}.pdf`
          });
          exportService.downloadBlob(blob, `${filename}.pdf`);
          break;

        case 'bibtex':
          blob = await exportService.exportToBibTeX(citations);
          exportService.downloadBlob(blob, `${filename}.bib`);
          break;

        case 'ris':
          blob = await exportService.exportToRIS(citations);
          exportService.downloadBlob(blob, `${filename}.ris`);
          break;
      }

      onExport?.();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-medium">Export Citations</h3>
      
      {/* Format Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Export Format
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'pdf', label: 'PDF Document', icon: '📄' },
            { id: 'word', label: 'Word Document', icon: '📝' },
            { id: 'bibtex', label: 'BibTeX File', icon: '📚' },
            { id: 'ris', label: 'RIS Format', icon: '📋' },
          ].map(format => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id as ExportOptions['format'])}
              className={`
                flex items-center p-3 rounded-lg border transition-colors
                ${selectedFormat === format.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{format.icon}</span>
              <span>{format.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Export Options
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="include-intext"
            checked={includeInText}
            onChange={(e) => setIncludeInText(e.target.checked)}
            className="rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="include-intext" className="ml-2 text-sm text-gray-600">
            Include in-text citations
          </label>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`
          w-full py-2 px-4 rounded-lg text-white font-medium
          ${isExporting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          }
        `}
      >
        {isExporting ? 'Exporting...' : 'Export Citations'}
      </button>
    </div>
  );
}