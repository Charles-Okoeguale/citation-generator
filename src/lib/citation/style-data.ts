import { loadStylesClient } from './style-loader';
import { StyleMetadata } from './style-service';

// Initially use fallback styles
const defaultStyles: Record<string, StyleMetadata> = {
  'apa': {
    id: 'apa',
    title: 'APA (7th edition)',
    description: 'The American Psychological Association 7th edition citation style.',
    tags: ['author-date'],
    disciplines: ['psychology', 'social-sciences'],
    categories: ['academic'],
    version: '7'
  },
  'mla': {
    id: 'mla',
    title: 'MLA (9th edition)',
    description: 'Modern Language Association 9th edition style.',
    tags: ['humanities'],
    disciplines: ['humanities', 'literature'],
    categories: ['academic'],
    version: '9'
  }
  // Add a few more default styles
};

// Export a function to get styles with dynamic loading
let stylesCache: Record<string, StyleMetadata> = { ...defaultStyles };
let stylesLoaded = false;

export async function getStyles(): Promise<Record<string, StyleMetadata>> {
  if (!stylesLoaded) {
    try {
      const response = await fetch('/api/styles');
      if (response.ok) {
        const data = await response.json();
        stylesCache = data;
        stylesLoaded = true;
      }
    } catch (error) {
      console.error('Error fetching styles:', error);
    }
  }
  return stylesCache;
}


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

export const styles = stylesCache;