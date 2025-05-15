'use client';

import { useState } from 'react';
import type { CitationInput, CitationOutput } from '@/lib/citation/types';

export default function CitationGenerator() {
  const [citation, setCitation] = useState<CitationOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCitation = async (input: CitationInput) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/citations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input, style: 'apa' }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate citation');
      }

      const data = await response.json();
      setCitation(data.citation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Component JSX here...
}