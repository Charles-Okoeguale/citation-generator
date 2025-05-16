// src/lib/citation/style-loader.ts
import fs from 'fs';
import path from 'path';
import { StyleMetadata } from './style-service';

// For server-side loading
export async function loadStylesServer(): Promise<Record<string, StyleMetadata>> {
  try {
    // Load from pregenerated metadata file
    const metadataPath = path.join(process.cwd(), 'data/style-metadata.json');
    
    if (fs.existsSync(metadataPath)) {
      const data = fs.readFileSync(metadataPath, 'utf-8');
      return JSON.parse(data);
    }
    
    // Fallback to base styles if metadata file doesn't exist
    return getBaseStyles();
  } catch (error) {
    console.error('Error loading styles:', error);
    return getBaseStyles();
  }
}

// For client-side loading
export async function loadStylesClient(): Promise<Record<string, StyleMetadata>> {
  try {
    const response = await fetch('/api/styles');
    if (!response.ok) throw new Error('Failed to fetch styles');
    return await response.json();
  } catch (error) {
    console.error('Error loading styles:', error);
    return getBaseStyles();
  }
}

// Base styles as fallback
function getBaseStyles(): Record<string, StyleMetadata> {
  return {
    'apa': {
      id: 'apa',
      title: 'APA (American Psychological Association)',
      description: 'The standard style for social sciences.',
      tags: ['author-date', 'doi-support'],
      disciplines: ['social-sciences', 'psychology'],
      categories: ['academic'],
      version: '7'
    },
    'mla': {
      id: 'mla',
      title: 'MLA (Modern Language Association)',
      description: 'Commonly used in humanities.',
      tags: ['author-page'],
      disciplines: ['humanities', 'literature'],
      categories: ['academic'],
      version: '9'
    },
    // Add a few more default styles
  };
}