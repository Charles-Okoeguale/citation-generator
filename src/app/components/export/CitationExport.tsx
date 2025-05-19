'use client';

import { useState, useEffect } from 'react';
import type { CitationOutput } from '@/lib/citation/types';
import { ExportOptions, exportService } from '@/lib/citation/export/export-service';
import { useExportPreferences } from '@/lib/citation/hooks/useExportPreferences';
import { toast } from 'react-hot-toast';

interface CitationExportProps {
  citations: CitationOutput[];
  onExport?: () => void;
}

export function CitationExport({ citations, onExport }: CitationExportProps) {
  const { preferences, updateFormatUsage, setDefaultExportFormat, setIncludeInText } = useExportPreferences();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportOptions['format']>(preferences.defaultExportFormat || 'pdf');
  const [includeInText, setLocalIncludeInText] = useState(preferences.includeInText);

  // Update local state when preferences change
  useEffect(() => {
    setSelectedFormat(preferences.defaultExportFormat || 'pdf');
    setLocalIncludeInText(preferences.includeInText);
  }, [preferences.defaultExportFormat, preferences.includeInText]);

  const handleFormatChange = (format: ExportOptions['format']) => {
    setSelectedFormat(format);
    updateFormatUsage(format);
  };

  const handleIncludeInTextChange = (include: boolean) => {
    setLocalIncludeInText(include);
    setIncludeInText(include);
  };

  const handleExport = async () => {
    if (citations.length === 0) {
      toast.error('No citations to export');
      return;
    }

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

      // Update format preferences
      updateFormatUsage(selectedFormat);
      
      toast.success(`Citation exported as ${selectedFormat.toUpperCase()}`);
      onExport?.();
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export citation');
    } finally {
      setIsExporting(false);
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
            { id: 'pdf', label: 'PDF Document', icon: '📄' },
            { id: 'word', label: 'Word Document', icon: '📝' },
            { id: 'bibtex', label: 'BibTeX File', icon: '📚' },
            { id: 'ris', label: 'RIS Format', icon: '📋' },
          ].map(format => (
            <button
              key={format.id}
              onClick={() => handleFormatChange(format.id as ExportOptions['format'])}
              className={`
                flex items-center p-3 rounded-lg border transition-colors
                ${selectedFormat === format.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-300'
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Export Options
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="include-intext"
            checked={includeInText}
            onChange={(e) => handleIncludeInTextChange(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 dark:border-gray-600 dark:bg-gray-700"
          />
          <label htmlFor="include-intext" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            Include in-text citations
          </label>
        </div>
        <div className="flex items-center mt-2">
          <button
            onClick={() => setDefaultExportFormat(selectedFormat)}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Set as default format
          </button>
        </div>
      </div>

      {/* Export Button */}
      <div className="pt-2">
        <button
          onClick={handleExport}
          disabled={isExporting || citations.length === 0}
          className="w-full py-2 px-4 bg-brand hover:bg-brand-dark text-white rounded-md transition-colors duration-200 disabled:opacity-50 dark:bg-brand dark:hover:bg-brand-dark"
        >
          {isExporting ? 'Exporting...' : 'Export Citation'}
        </button>
      </div>
    </div>
  );
}