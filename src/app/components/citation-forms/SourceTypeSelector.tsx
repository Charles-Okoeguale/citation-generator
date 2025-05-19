'use client';

import { 
  BookText, 
  FileText, 
  Globe, 
  Newspaper,
  Video,
  Mic,
  Mail,
  FileCode,
  Database,
  Image
} from 'lucide-react';
import { useState } from 'react';

interface SourceType {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sourceTypes: SourceType[] = [
  {
    id: 'book',
    label: 'Book',
    description: 'Printed or digital books',
    icon: BookText
  },
  {
    id: 'article-journal',
    label: 'Journal Article',
    description: 'Academic or scholarly articles',
    icon: FileText
  },
  {
    id: 'webpage',
    label: 'Website',
    description: 'Online resources and web pages',
    icon: Globe
  },
  {
    id: 'newspaper',
    label: 'Newspaper',
    description: 'News articles and press releases',
    icon: Newspaper
  },
  {
    id: 'video',
    label: 'Video',
    description: 'Online videos and films',
    icon: Video
  },
  {
    id: 'podcast',
    label: 'Podcast',
    description: 'Audio podcasts and broadcasts',
    icon: Mic
  },
  {
    id: 'email',
    label: 'Email',
    description: 'Personal communications',
    icon: Mail
  },
  {
    id: 'software',
    label: 'Software',
    description: 'Computer programs and apps',
    icon: FileCode
  },
  {
    id: 'dataset',
    label: 'Dataset',
    description: 'Research data and databases',
    icon: Database
  },
  {
    id: 'artwork',
    label: 'Artwork',
    description: 'Images and artistic works',
    icon: Image
  }
];

interface SourceTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  disabled?: boolean;
}

export function SourceTypeSelector({ selectedType, onTypeChange, disabled = false }: SourceTypeSelectorProps) {
  const [formData, setFormData] = useState(() => {
    return {
      title: '',
      author: [],
      date: null,
    };
  });

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Select Source Type</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sourceTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => !disabled && onTypeChange(type.id)}
              className={`p-4 rounded-lg border-2 transition-all ${!disabled ? 'hover:shadow-md' : 'cursor-not-allowed opacity-70'}
                ${selectedType === type.id
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
              disabled={disabled}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900 dark:text-white">{type.label}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{type.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}