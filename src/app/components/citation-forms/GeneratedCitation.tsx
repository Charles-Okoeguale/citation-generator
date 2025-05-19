'use client';

import { SaveCitation } from '../SaveCitation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface GeneratedCitationProps {
  citation: {
    html: string;
    text: string;
    inText: string;
  };
  onClose: () => void;
}

export function GeneratedCitation({ citation, onClose }: GeneratedCitationProps) {
  const [copied, setCopied] = useState<'bibliography' | 'inText' | null>(null);

  const handleCopy = async (text: string, type: 'bibliography' | 'inText') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6 border dark:border-gray-700">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Bibliography Entry</h3>
        <div
          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md font-serif dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: citation.html }}
        />
        <button
          onClick={() => handleCopy(citation.text, 'bibliography')}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {copied === 'bibliography' ? 'Copied!' : 'Copy Bibliography'}
        </button>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">In-text Citation</h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md font-serif dark:text-gray-200">
          {citation.inText}
        </div>
        <button
          onClick={() => handleCopy(citation.inText, 'inText')}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {copied === 'inText' ? 'Copied!' : 'Copy In-text Citation'}
        </button>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t dark:border-gray-700">
        <SaveCitation citation={citation} />
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  );
}