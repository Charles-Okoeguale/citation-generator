'use client';

import { unifiedStyleService } from '@/lib/citation/style-service';
import { useEffect, useState } from 'react';

interface StyleExample {
  sourceType: string;
  title: string;
  citation: string;
  inText: string;
}

interface StylePreviewProps {
  styleId: string;
}

export function StylePreview({ styleId }: StylePreviewProps) {
  const [examples, setExamples] = useState<StyleExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('book');

  useEffect(() => {
    generatePreviews();
  }, [styleId]);

  async function generatePreviews() {
    try {
      setLoading(true);
      
      // Generate examples for different source types
      const exampleSources = [
        {
          sourceType: 'book',
          title: 'Book Example',
          data: {
            type: 'book',
            title: 'The Great Gatsby',
            author: [{ given: 'F. Scott', family: 'Fitzgerald' }],
            issued: { 'date-parts': [[1925]] },
            publisher: 'Charles Scribner\'s Sons',
            'publisher-place': 'New York'
          }
        },
        {
          sourceType: 'journal',
          title: 'Journal Article Example',
          data: {
            type: 'article-journal',
            title: 'Climate Change Effects',
            author: [
              { given: 'Jane', family: 'Smith' },
              { given: 'John', family: 'Doe' }
            ],
            'container-title': 'Environmental Science Journal',
            volume: '45',
            issue: '2',
            page: '123-145',
            issued: { 'date-parts': [[2023]] }
          }
        },
        {
          sourceType: 'website',
          title: 'Website Example',
          data: {
            type: 'webpage',
            title: 'Modern Web Development',
            author: [{ given: 'Alex', family: 'Johnson' }],
            URL: 'https://example.com/web-dev',
            issued: { 'date-parts': [[2023, 6, 15]] },
            'container-title': 'Tech Blog'
          }
        }
      ];

      const results = await Promise.all(
        exampleSources.map(async (source : any) => {
          const citation : any = await unifiedStyleService.generateExample(styleId);
          return {
            sourceType: source.sourceType,
            title: source.title,
            citation: citation.bibliography,
            inText: citation.inText
          };
        })
      );

      setExamples(results);
    } catch (error) {
      console.error('Failed to generate previews:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 mt-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded" />
        <div className="h-20 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Source Type Tabs */}
      <div className="flex space-x-2 border-b">
        {examples.map((example) => (
          <button
            key={example.sourceType}
            onClick={() => setActiveTab(example.sourceType)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
              ${activeTab === example.sourceType
                ? 'bg-gray-100 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            {example.title}
          </button>
        ))}
      </div>

      {/* Example Display */}
      {examples.map((example) => (
        <div
          key={example.sourceType}
          className={`space-y-4 ${activeTab === example.sourceType ? 'block' : 'hidden'}`}
        >
          {/* Bibliography Format */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Bibliography Entry</h4>
            <div className="p-3 bg-gray-50 rounded-md font-serif">
              <div dangerouslySetInnerHTML={{ __html: example.citation }} />
            </div>
          </div>

          {/* In-text Citation */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">In-text Citation</h4>
            <div className="p-3 bg-gray-50 rounded-md font-serif">
              {example.inText}
            </div>
          </div>

          {/* Copy Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => navigator.clipboard.writeText(example.citation)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Copy Bibliography
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(example.inText)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Copy In-text Citation
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}