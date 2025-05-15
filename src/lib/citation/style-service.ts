import { Cite } from '@citation-js/core'

interface StyleMetadata {
  id: string;
  title: string;
  category: string;
  updated: string;
}

interface StyleCategory {
  name: string;
  styles: StyleMetadata[];
}

class StyleService {
  private styles: Map<string, StyleMetadata> = new Map();
  private categories: StyleCategory[] = [];
  private initialized: boolean = false;

  constructor() {
    this.initializeStyles();
  }

  private async initializeStyles() {
    try {
      // Fetch styles from Citation.js
      const availableStyles = await Cite.plugins.config.get('@csl/styles');
      
      // Create categories
      const categorizedStyles: Record<string, StyleMetadata[]> = {
        'General': [],
        'Science': [],
        'Humanities': [],
        'Social Sciences': [],
        'Engineering': [],
        'Medicine': [],
        'Law': [],
        'Other': []
      };

      // Process each style
      Object.entries(availableStyles).forEach(([id, data]: [string, any]) => {
        const metadata: StyleMetadata = {
          id,
          title: data.title || id,
          category: this.determineCategory(data.fields || []),
          updated: data.updated || 'Unknown'
        };

        this.styles.set(id, metadata);
        categorizedStyles[metadata.category].push(metadata);
      });

      // Convert to array format and sort
      this.categories = Object.entries(categorizedStyles).map(([name, styles]) => ({
        name,
        styles: styles.sort((a, b) => a.title.localeCompare(b.title))
      }));

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize citation styles:', error);
      throw new Error('Failed to load citation styles');
    }
  }

  private determineCategory(fields: string[]): string {
    // Logic to determine style category based on fields
    if (fields.includes('science')) return 'Science';
    if (fields.includes('medicine')) return 'Medicine';
    if (fields.includes('law')) return 'Law';
    if (fields.includes('humanities')) return 'Humanities';
    if (fields.includes('engineering')) return 'Engineering';
    if (fields.includes('social-science')) return 'Social Sciences';
    return 'Other';
  }

  async getStyle(styleId: string): Promise<any> {
    if (!this.initialized) {
      await this.initializeStyles();
    }

    const style = this.styles.get(styleId);
    if (!style) {
      throw new Error(`Style ${styleId} not found`);
    }

    try {
      // Load the actual CSL data
      const styleData = await Cite.plugins.config.get('@csl/styles')[styleId];
      return styleData;
    } catch (error) {
      console.error(`Failed to load style ${styleId}:`, error);
      throw new Error(`Failed to load style ${styleId}`);
    }
  }

  async getAllStyles(): Promise<StyleCategory[]> {
    if (!this.initialized) {
      await this.initializeStyles();
    }
    return this.categories;
  }

  async searchStyles(query: string): Promise<StyleMetadata[]> {
    if (!this.initialized) {
      await this.initializeStyles();
    }

    const searchTerm = query.toLowerCase();
    return Array.from(this.styles.values()).filter(style => 
      style.title.toLowerCase().includes(searchTerm) ||
      style.id.toLowerCase().includes(searchTerm)
    );
  }

  async validateStyle(styleId: string): Promise<boolean> {
    if (!this.initialized) {
      await this.initializeStyles();
    }
    return this.styles.has(styleId);
  }
}

// Export singleton instance
export const styleService = new StyleService();