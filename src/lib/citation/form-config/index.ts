import { bookConfig } from './book';
import { articleConfig } from './article';
import { websiteConfig } from './website';
import { newspaperConfig } from './newspaper';
import { videoConfig } from './video';
import { podcastConfig } from './podcast';
import { emailConfig } from './email';
import { softwareConfig } from './software';
import { datasetConfig } from './dataset';
import { artworkConfig } from './artwork';
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
  },
  {
    id: 'newspaper',
    label: 'Newspaper',
    icon: '📰'
  },
  {
    id: 'video',
    label: 'Video',
    icon: '🎥'
  },
  {
    id: 'podcast',
    label: 'Podcast',
    icon: '🎙️'
  },
  {
    id: 'email',
    label: 'Email',
    icon: '📧'
  },
  {
    id: 'software',
    label: 'Software',
    icon: '💻'
  },
  {
    id: 'dataset',
    label: 'Dataset',
    icon: '📊'
  },
  {
    id: 'artwork',
    label: 'Artwork',
    icon: '🎨'
  }
] as const;

export const formConfigs: Record<string, FormConfig> = {
  book: bookConfig,
  'article-journal': articleConfig,
  webpage: websiteConfig,
  newspaper: newspaperConfig,
  video: videoConfig,
  podcast: podcastConfig,
  email: emailConfig,
  software: softwareConfig,
  dataset: datasetConfig,
  artwork: artworkConfig
};

export function getFormConfig(type: string): FormConfig {
  const config = formConfigs[type];
  if (!config) {
    throw new Error(`No form configuration found for source type: ${type}`);
  }
  return config;
}

export type SourceType = typeof sourceTypes[number]['id'];