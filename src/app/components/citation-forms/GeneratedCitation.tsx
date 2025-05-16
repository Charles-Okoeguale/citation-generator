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
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Bibliography Entry</h3>
        <div
          className="p-4 bg-gray-50 rounded-md font-serif"
          dangerouslySetInnerHTML={{ __html: citation.html }}
        />
        <button
          onClick={() => handleCopy(citation.text, 'bibliography')}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          {copied === 'bibliography' ? 'Copied!' : 'Copy Bibliography'}
        </button>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">In-text Citation</h3>
        <div className="p-4 bg-gray-50 rounded-md font-serif">
          {citation.inText}
        </div>
        <button
          onClick={() => handleCopy(citation.inText, 'inText')}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          {copied === 'inText' ? 'Copied!' : 'Copy In-text Citation'}
        </button>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <SaveCitation citation={citation} />
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Close
        </button>
      </div>
    </div>
  );
}