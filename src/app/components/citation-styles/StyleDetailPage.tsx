'use client';

import { useState } from 'react';
import { unifiedStyleService } from '@/lib/citation/style-service';
import { academicDisciplines, styleTags } from '@/lib/citation/types';
import { StyleTooltip } from './StyleTooltip';
import { styleRules } from '@/lib/citation/style-rules';

interface StyleDetailProps {
  styleId: string;
  style: {
    title: string;
    description: string;
    url?: string;
    documentation?: string;
    tags: string[];
    disciplines: string[];
  };
}

export function StyleDetailPage({ styleId, style }: StyleDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'examples' | 'guidelines'>('overview');
  const [examples, setExamples] = useState<Record<string, { bibliography: string; inText: string }>>({});


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Style Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">{style.title}</h1>
        <p className="text-gray-600 mb-4">{style.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {style.tags.map(tagId => (
            <span
              key={tagId}
              className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
            >
              {styleTags[tagId].label}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {style.disciplines.map(disciplineId => (
            <span
              key={disciplineId}
              className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm"
            >
              {academicDisciplines.find((d: { id: string; }) => d.id === disciplineId)?.name}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-4">
          {(['overview', 'examples', 'guidelines'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-medium mb-3">Key Features</h2>
              <ul className="space-y-2">
                {style.tags.map(tagId => (
                  <li key={tagId} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <div>
                      <strong>{styleTags[tagId].label}:</strong>
                      <span className="text-gray-600 ml-2">{styleTags[tagId].description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium mb-3">Usage</h2>
              <div className="prose max-w-none">
                <p>This style is commonly used in:</p>
                <ul>
                  {style.disciplines.map(disciplineId => (
                    <li key={disciplineId}>
                      {academicDisciplines.find((d: { id: string; }) => d.id === disciplineId)?.description}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {style.documentation && (
              <section>
                <h2 className="text-lg font-medium mb-3">Official Documentation</h2>
                <a
                  href={style.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Style Guide →
                </a>
              </section>
            )}
          </div>
        )}

        {/* Examples Tab */}
        {activeTab === 'examples' && (
          <div className="space-y-6">
            {Object.entries(examples).map(([sourceType, citation]) => (
              <section key={sourceType}>
                <h2 className="text-lg font-medium mb-3">
                  {sourceType.charAt(0).toUpperCase() + sourceType.slice(1)} Citation
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Bibliography Entry</h3>
                    <div className="p-4 bg-gray-50 rounded-md font-serif">
                      <div dangerouslySetInnerHTML={{ __html: citation.bibliography }} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">In-text Citation</h3>
                    <div className="p-4 bg-gray-50 rounded-md font-serif">
                      {citation.inText}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Guidelines Tab */}
        {activeTab === 'guidelines' && (
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-medium mb-3">Formatting Rules</h2>
              <div className="space-y-4">
                {Object.values(styleRules[styleId] || {})
                  .filter(rule => rule.category === 'formatting')
                  .map(rule => (
                    <div key={rule.id} className="bg-gray-50 rounded-lg p-4">
                      <StyleTooltip
                        content={{
                          title: rule.title,
                          description: rule.description,
                          examples: rule.examples
                        }}
                      >
                        <h3 className="text-md font-medium">{rule.title}</h3>
                      </StyleTooltip>
                      <p className="text-sm text-gray-600 mt-2">{rule.description}</p>
                    </div>
                  ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-medium mb-3">Citation Elements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['names', 'dates', 'punctuation', 'order'].map(category => (
                  <div key={category} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3 capitalize">{category}</h3>
                    <div className="space-y-2">
                      {Object.values(styleRules[styleId] || {})
                        .filter(rule => rule.category === category)
                        .map(rule => (
                          <div key={rule.id}>
                            <StyleTooltip
                              content={{
                                title: rule.title,
                                description: rule.description,
                                examples: rule.examples
                              }}
                            >
                              <span className="text-sm text-blue-600 hover:text-blue-800 cursor-help">
                                {rule.title}
                              </span>
                            </StyleTooltip>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-medium mb-3">Common Mistakes to Avoid</h2>
              <div className="bg-red-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {[
                    'Incorrect author name formatting',
                    'Missing punctuation in titles',
                    'Wrong date format',
                    'Inconsistent capitalization'
                  ].map((mistake, index) => (
                    <li key={index} className="text-sm text-red-700 flex items-center">
                      <span className="mr-2">⚠️</span>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}