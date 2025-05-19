'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import type { CitationOutput } from '@/lib/citation/types';

interface CitationExportProps {
  citations: CitationOutput[];
  selectedStyle?: string;
}

export default function CitationExport({ citations, selectedStyle }: CitationExportProps) {
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx' | 'bibtex' | 'ris'>('pdf');

  const handleExport = async () => {
    if (!citations || citations.length === 0) {
      toast.error('No citations to export');
      return;
    }

    try {
      setExporting(true);
      toast.loading('Preparing export...', { id: 'exportToast' });
      
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          citations,
          format: selectedFormat,
          style: selectedStyle || "apa"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Export failed');
      }

      if (selectedFormat === 'pdf' || selectedFormat === 'docx') {
        // For file formats, we need to get the blob and create a download link
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `citations.${selectedFormat}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast.success('Export completed successfully', { id: 'exportToast' });
      } else {
        // For text formats (BibTeX, RIS), we can display the response directly
        const text = await response.text();
        setExportResult(text);
        toast.success('Export completed successfully', { id: 'exportToast' });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error instanceof Error ? error.message : 'Export failed', { id: 'exportToast' });
    } finally {
      setExporting(false);
    }
  };
  
  return (
    <div className="border dark:border-gray-700 rounded-lg p-6 space-y-4 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Export Citations</h3>
      
      {/* Format Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Export Format
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'pdf', label: 'PDF Document' },
            { id: 'docx', label: 'Word Document' },
            { id: 'bibtex', label: 'BibTeX File' },
            { id: 'ris', label: 'RIS Format' },
          ].map(format => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id as 'pdf' | 'docx' | 'bibtex' | 'ris')}
              className={`
                p-3 rounded-lg border transition-colors
                ${selectedFormat === format.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-300'
                }
              `}
            >
              {format.label}
            </button>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="pt-2">
        <button
          onClick={handleExport}
          disabled={exporting || citations.length === 0}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {exporting ? 'Exporting...' : 'Export Citation'}
        </button>
      </div>
      
      {/* Export Result (for text formats) */}
      {exportResult && (selectedFormat === 'bibtex' || selectedFormat === 'ris') && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Export Result
          </h4>
          <pre className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
            {exportResult}
          </pre>
        </div>
      )}
    </div>
  );
} 