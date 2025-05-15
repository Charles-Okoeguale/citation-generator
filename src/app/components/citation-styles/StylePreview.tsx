'use client';

import { unifiedStyleService } from '@/lib/citation/style-service';
import { useEffect, useState } from 'react';

interface StylePreviewProps {
  styleId: string;
}

export function StylePreview({ styleId }: StylePreviewProps) {
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generatePreview();
  }, [styleId]);

  async function generatePreview() {
    try {
      setLoading(true);
      const example = await unifiedStyleService.generateExample(styleId);
      setPreview(example);
    } catch (error) {
      console.error('Failed to generate preview:', error);
      setPreview('Preview not available');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="h-6 bg-gray-200 animate-pulse rounded mt-2" />;
  }

  return (
    <div className="mt-2 text-sm text-gray-600 font-serif">
      {preview}
    </div>
  );
}