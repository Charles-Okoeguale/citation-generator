// src/app/components/citation/SaveCitation.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { CitationOutput } from '@/lib/citation/types';

interface SaveCitationProps {
  citation: any
}

export function SaveCitation({ citation }: SaveCitationProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!session) {
      toast.error('Please log in to save citations');
      router.push('/login');
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch('/api/citations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: citation.text.split('.')[0] || 'Untitled Citation', // Use first sentence as title
          sourceType: citation.sourceType || 'generic',
          citationData: citation,
          style: citation.style || 'apa',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save citation');
      }

      toast.success('Citation saved successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to save citation');
      console.error('Save citation error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSaving ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving...
        </>
      ) : (
        <>
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
          Save Citation
        </>
      )}
    </button>
  );
}