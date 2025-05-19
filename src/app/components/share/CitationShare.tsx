'use client';

import { useState } from 'react';
import type { CitationOutput } from '@/lib/citation/types';

interface CitationShareProps {
  citations: CitationOutput[];
}

export function CitationShare({ citations }: CitationShareProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const generateShareLink = async () => {
    setIsGeneratingLink(true);
    try {
      // Here you would typically make an API call to create a shareable link
      // For now, we'll create a mock URL
      const shareId = Math.random().toString(36).substring(2);
      const url = `${window.location.origin}/share/${shareId}`;
      setShareUrl(url);
      setShowShareDialog(true);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={generateShareLink}
        disabled={isGeneratingLink}
        className="flex items-center px-4 py-2 text-sm text-[rgb(200,75,110)] hover:text-[rgb(180,65,100)]"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share Citations
      </button>

      {showShareDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Share Citations</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shareable Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    defaultValue={shareUrl}
                    readOnly
                    className="flex-1 p-2 border rounded-l-lg focus:ring-[rgb(200,75,110)]"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                    className="px-4 bg-gray-100 border border-l-0 rounded-r-lg hover:bg-gray-200"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowShareDialog(false)}
                  className="px-4 py-2 text-[rgb(200,75,110)] hover:text-[rgb(180,65,100)]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}