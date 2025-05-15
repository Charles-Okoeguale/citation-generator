import { bookConfig } from './book';
import { articleConfig } from './article';
import { websiteConfig } from './website';
import { FormConfig } from '../types';


export const sourceTypes = [
  {
    id: 'book',
    label: 'Book',
    icon: '📚'
  },
  {
    id: 'article-journal',
    label: 'Journal Article',
    icon: '📰'
  },
  {
    id: 'webpage',
    label: 'Website',
    icon: '🌐'
  }
] as const;

export const formConfigs: Record<string, FormConfig> = {
  book: bookConfig,
  'article-journal': articleConfig,
  webpage: websiteConfig
};

export function getFormConfig(type: string): FormConfig {
  const config = formConfigs[type];
  if (!config) {
    throw new Error(`No form configuration found for source type: ${type}`);
  }
  return config;
}

export type SourceType = typeof sourceTypes[number]['id'];

export * from '../types';