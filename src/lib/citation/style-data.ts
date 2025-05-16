import { loadStylesClient } from './style-loader';
import { StyleMetadata } from './style-service';

// Initially use fallback styles
let stylesCache: Record<string, StyleMetadata> = {
  'apa': {
    id: 'apa',
    title: 'APA',
    description: 'American Psychological Association',
    tags: ['author-date'],
    disciplines: ['psychology'],
    categories: ['academic'],
    version: '7'
  },
};

// Export a function to get styles with dynamic loading
export async function getStyles(): Promise<Record<string, StyleMetadata>> {
  if (Object.keys(stylesCache).length <= 10) {
    try {
      const loadedStyles = await loadStylesClient();
      stylesCache = loadedStyles;
    } catch (error) {
      console.error('Error loading styles:', error);
    }
  }
  return stylesCache;
}

// For immediate use (will be updated when getStyles is called)
export const styles = stylesCache;

// Helper function to get all available disciplines
export function getAllDisciplines(): string[] {
  const disciplineSet = new Set<string>();
  Object.values(styles).forEach(style => {
    style.disciplines.forEach(discipline => disciplineSet.add(discipline));
  });
  return Array.from(disciplineSet).sort();
}

// Helper function to get all available tags
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  Object.values(styles).forEach(style => {
    style.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

// Helper function to get styles by discipline
export function getStylesByDiscipline(discipline: string): StyleMetadata[] {
  return Object.values(styles).filter(style => 
    style.disciplines.includes(discipline)
  );
}

// Helper function to get styles by tag
export function getStylesByTag(tag: string): StyleMetadata[] {
  return Object.values(styles).filter(style => 
    style.tags.includes(tag)
  );
}