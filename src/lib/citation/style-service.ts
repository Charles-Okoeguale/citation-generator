import { Cite } from '@citation-js/core';
import '@citation-js/plugin-csl';
import type {
  EnhancedStyleMetadata,
  StyleCategory,
  StyleValidationResult,
  StyleVersion,
  StyleExample,
  StyleValidationError,
  StyleValidationWarning,
  StyleUpdateInfo,
  StyleField
} from './types';

// Define initialization states for state machine
type InitializationState = 'not_started' | 'in_progress' | 'completed' | 'failed';

export interface StyleMetadata {
  id: string;
  title: string;
  description: string;
  version?: string;
  url?: string;
  documentation?: string;
  tags: string[];
  disciplines: string[];
  lastUpdated?: string;
  isDeprecated?: boolean;
  dependencies?: string[];
  publisher?: any
  categories?: any
}

class UnifiedStyleService {
  private static instance: UnifiedStyleService;
  private styles: Map<string, EnhancedStyleMetadata> = new Map();
  private styleCache: Map<string, any> = new Map();
  private categories: StyleCategory[] = [];
  private initialized: boolean = false;
  private lastUpdateCheck: Date | null = null;
  
  // Initialization state machine
  private static initializationState: InitializationState = 'not_started';
  private static initializationPromise: Promise<void> | null = null;
  private static initializationError: Error | null = null;

  private constructor() {}

  static getInstance(): UnifiedStyleService {
    if (!UnifiedStyleService.instance) {
      UnifiedStyleService.instance = new UnifiedStyleService();
    }
    return UnifiedStyleService.instance;
  }

  /**
   * Checks if the CSL registry is properly initialized and has styles
   */
  private async isRegistryReady(): Promise<boolean> {
    try {
      // First verify plugins object exists
      const core = await import('@citation-js/core');
      const { plugins } = core;
      
      if (!plugins || !plugins.config || typeof plugins.config.get !== 'function') {
        console.debug('Citation.js plugin system not available');
        return false;
      }
      
      // Then check if styles registry exists and has entries
      const styles = plugins.config.get('@csl/styles');
      if (!styles || Object.keys(styles).length === 0) {
        console.debug('CSL styles registry not available or empty');
        return false;
      }
      
      return true;
    } catch (error) {
      console.debug('Error checking CSL registry:', error);
      return false;
    }
  }
  
  /**
   * Waits for the CSL registry to be ready with exponential backoff
   */
  private async waitForRegistry(attempt = 1, maxAttempts = 5): Promise<void> {
    if (await this.isRegistryReady()) {
      return;
    }
    
    if (attempt >= maxAttempts) {
      throw new Error('CSL styles plugin registration failed');
    }
    
    const delay = 100 * Math.pow(2, attempt);
    console.debug(`Waiting for CSL registry, attempt ${attempt}/${maxAttempts} (${delay}ms delay)`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return this.waitForRegistry(attempt + 1, maxAttempts);
  }
  
  /**
   * Loads Citation.js plugins sequentially with completion verification
   */
  private async loadPluginsSequentially(): Promise<void> {
    try {
      // Step 1: Import core and get plugins registry
      const { Cite } = await import('@citation-js/core');
      
      // Step 2: Import plugins in sequence with forced await between them
      await import('@citation-js/plugin-csl');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await import('@citation-js/plugin-bibtex');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await import('@citation-js/plugin-doi');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Step 3: Wait for registry to become available with retry logic
      await this.waitForRegistry();
      
      // Step 4: Create Cite instance only after successful plugin registration
      // Use minimal citation to ensure proper initialization
      this.citeInstance = new Cite({
        type: 'article-journal',
        title: 'Test Citation',
        author: [{ given: 'Test', family: 'Author' }],
        issued: { 'date-parts': [[2023]] }
      });
      
      console.log('Plugins loaded successfully');
    } catch (error) {
      console.error('Failed to load Citation.js plugins:', error);
      throw new Error('Failed to load Citation.js plugins');
    }
  }
  
  private citeInstance: any;

  async initialize(): Promise<void> {
    // Part of state machine: Check current state and return existing promise if in progress
    if (UnifiedStyleService.initializationState === 'in_progress' && UnifiedStyleService.initializationPromise) {
      return UnifiedStyleService.initializationPromise;
    }
    
    // Return early if already completed successfully
    if (UnifiedStyleService.initializationState === 'completed' && this.initialized) {
      return;
    }
    
    // Create new initialization promise
    UnifiedStyleService.initializationState = 'in_progress';
    UnifiedStyleService.initializationPromise = (async () => {
      try {
        // Only run in browser environment
        if (typeof window === 'undefined') {
          console.log('Skipping style service initialization in server environment');
          this.initialized = true;
          UnifiedStyleService.initializationState = 'completed';
          return;
        }
        
        // Sequentially load plugins with completion verification
        await this.loadPluginsSequentially();
        
        // Verify registry is ready before proceeding
        if (!await this.isRegistryReady()) {
          throw new Error('CSL registry failed to initialize properly');
        }
        
        // Load all available styles from now-initialized Citation.js
        const core = await import('@citation-js/core');
        const availableStyles = core.plugins.config.get('@csl/styles');
        
        // Check if availableStyles is defined and not null
        if (!availableStyles) {
          throw new Error('Citation.js styles configuration is not available');
        }
        
        // Process each style
        await Promise.all(
          Object.entries(availableStyles).map(async ([id, data]) => {
            if (!data) {
              console.warn(`Style data for ${id} is undefined or null, skipping`);
              return;
            }
            try {
              const metadata = await this.extractStyleMetadata(id, data);
              this.styles.set(id, metadata);
            } catch (styleError) {
              console.warn(`Failed to extract metadata for style ${id}:`, styleError);
              // Skip this style but continue processing others
            }
          })
        );

        // Generate categories
        this.categories = this.generateCategories();
        
        this.initialized = true;
        UnifiedStyleService.initializationState = 'completed';
      } catch (error) {
        console.error('Failed to initialize citation styles:', error);
        UnifiedStyleService.initializationState = 'failed';
        UnifiedStyleService.initializationError = error instanceof Error ? error : new Error(String(error));
        this.initialized = false;
        throw new Error('Style initialization failed');
      }
    })();
    
    return UnifiedStyleService.initializationPromise;
  }

  private async extractStyleMetadata(id: string, data: any): Promise<EnhancedStyleMetadata> {
    const style = await this.loadStyle(id);
    const version = this.parseVersion(data.version || '1.0.0');
    const example = await this.generateStyleExample(id);

    return {
      id,
      title: data.title || id,
      titleShort: data.titleShort,
      version,
      updated: data.updated || new Date().toISOString(),
      categories: this.determineCategories(data, style),
      description: this.generateDescription(data, style),
      example,
      fields: this.extractRequiredFields(style),
      dependencies: data.dependencies || [],
      isDeprecated: data.isDeprecated || false,
      defaultLocale: data.defaultLocale || 'en-US',
      supportedLocales: data.supportedLocales || ['en-US'],
      documentationUrl: this.getDocumentationUrl(id)
    };
  }

  private async loadStyle(styleId: string): Promise<any> {
    if (this.styleCache.has(styleId)) {
      return this.styleCache.get(styleId);
    }

    try {
      // Ensure we are initialized before loading styles
      if (!this.initialized && UnifiedStyleService.initializationState !== 'completed') {
        await this.initialize();
      }
      
      // Load style with proper error handling
      const core = await import('@citation-js/core');
      const { plugins } = core;
      const styles = plugins.config.get('@csl/styles');
      
      if (!styles) {
        throw new Error('CSL styles not available');
      }
      
      const style = styles[styleId];
      if (!style) {
        throw new Error(`Style ${styleId} not found`);
      }
      
      this.styleCache.set(styleId, style);
      return style;
    } catch (error) {
      console.error(`Failed to load style ${styleId}:`, error);
      throw error;
    }
  }

  private parseVersion(versionString: string): StyleVersion {
    const [major = 1, minor = 0, patch = 0] = versionString.split('.').map(Number);
    return {
      major,
      minor,
      patch,
      toString: () => `${major}.${minor}.${patch}`
    };
  }

  private async generateStyleExample(styleId: string): Promise<StyleExample> {
    // Return a simplified example to maintain type compatibility
    // but avoid loading Citation.js for preview generation since it's no longer needed
    return {
      input: {
        type: 'article-journal',
        title: 'The Evolution of Citation Styles',
        author: [{ given: 'John', family: 'Smith' }],
        'container-title': 'Journal of Documentation',
        volume: '45',
        issue: '2',
        page: '123-145',
        issued: { 'date-parts': [[2023]] }
      },
      output: {
        bibliography: 'Example not available - preview disabled',
        inText: 'Citation not available - preview disabled'
      }
    };
  }

  private determineCategories(data: any, style: any): string[] {
    const categories = new Set<string>();
    
    // Add primary category
    if (data.field) categories.add(this.normalizeCategory(data.field));
    
    // Add categories based on style analysis
    if (style.citation?.['citation-format'] === 'author-date') {
      categories.add('author-date');
    }
    if (style.citation?.['citation-format'] === 'numeric') {
      categories.add('numeric');
    }
    if (style.citation?.['citation-format'] === 'note') {
      categories.add('note');
    }

    // Add discipline-specific categories
    if (style.info?.disciplines) {
      style.info.disciplines.forEach((discipline: string) => {
        categories.add(this.normalizeCategory(discipline));
      });
    }

    return Array.from(categories);
  }

  private normalizeCategory(category: string): string {
    return category.toLowerCase().replace(/\s+/g, '-');
  }

  private generateDescription(data: any, style: any): string {
    const parts = [];
    
    if (data.title) {
      parts.push(`${data.title} citation style`);
    }
    
    if (style.citation?.['citation-format']) {
      parts.push(`uses ${style.citation['citation-format']} format`);
    }
    
    if (data.field) {
      parts.push(`commonly used in ${data.field}`);
    }
    
    return parts.join(' ') || 'No description available';
  }

  private extractRequiredFields(style: any): StyleField[] {
    const fields = new Set<StyleField>();
    
    // Extract fields from style definition
    const extractFields = (node: any) => {
      if (node.variable && typeof node.variable === 'string') {
        // Only add if it's a valid StyleField
        if (this.isValidStyleField(node.variable)) {
          fields.add(node.variable as StyleField);
        }
      }
      if (node.names && typeof node.names === 'string') {
        // Only add if it's a valid StyleField
        if (this.isValidStyleField(node.names)) {
          fields.add(node.names as StyleField);
        }
      }
      if (node.children) node.children.forEach(extractFields);
    };

    if (style.bibliography) {
      extractFields(style.bibliography);
    }
    if (style.citation) {
      extractFields(style.citation);
    }

    return Array.from(fields);
  }

  // Helper method to check if a string is a valid StyleField
  private isValidStyleField(field: string): field is StyleField {
    const validFields: StyleField[] = [
      'author',
      'title',
      'container-title',
      'issued',
      'page',
      'volume',
      'issue',
      'DOI',
      'URL',
      'ISBN',
      'ISSN',
      'publisher',
      'publisher-place',
      'edition'
    ];
    return validFields.includes(field as StyleField);
  }

  private getDocumentationUrl(styleId: string): string {
    return `https://editor.citationstyles.org/documentation/#${styleId}`;
  }

  private generateCategories(): StyleCategory[] {
    const categoryMap = new Map<string, StyleCategory>();
    
    // Process all styles and count categories
    this.styles.forEach(style => {
      style.categories.forEach(catId => {
        const existing = categoryMap.get(catId);
        if (existing) {
          existing.count++;
        } else {
          categoryMap.set(catId, {
            id: catId,
            name: this.formatCategoryName(catId),
            description: this.getCategoryDescription(catId),
            count: 1
          });
        }
      });
    });

    // Convert to array and sort by count
    return Array.from(categoryMap.values())
      .sort((a, b) => b.count - a.count);
  }

  private formatCategoryName(categoryId: string): string {
    return categoryId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getCategoryDescription(categoryId: string): string {
    const descriptions: Record<string, string> = {
      'author-date': 'Styles that use author-year citations',
      'numeric': 'Styles that use numbered citations',
      'note': 'Styles that use footnotes or endnotes',
      'science': 'Citation styles commonly used in scientific publications',
      'humanities': 'Citation styles used in humanities disciplines',
      'social-sciences': 'Citation styles for social science research',
      'legal': 'Citation styles for legal documents and research'
    };
    
    return descriptions[categoryId] || `Citation styles in the ${this.formatCategoryName(categoryId)} category`;
  }

  async getStyle(styleId: string): Promise<EnhancedStyleMetadata | null> {
    try {
      // Initialize if not already done
      if (!this.initialized) {
        await this.initialize();
      }
      
      // Check if we already have the style in our metadata collection
      if (this.styles.has(styleId)) {
        return this.styles.get(styleId) || null;
      }
      
      // Try to load the style directly since it might not be in our metadata collection
      const core = await import('@citation-js/core');
      const { plugins } = core;
      const styles = plugins.config.get('@csl/styles');
      
      if (!styles || !styles[styleId]) {
        // Try loading a fallback style if the requested one isn't available
        if (styleId !== 'apa' && this.styles.has('apa')) {
          console.warn(`Style '${styleId}' not found, falling back to APA style`);
          return this.styles.get('apa') || null;
        }
        
        console.error(`Style '${styleId}' not found and no fallback available`);
        return null;
      }
      
      // If the style exists but wasn't in our metadata collection, extract its metadata now
      try {
        const metadata = await this.extractStyleMetadata(styleId, styles[styleId]);
        this.styles.set(styleId, metadata);
        return metadata;
      } catch (error) {
        console.error(`Failed to extract metadata for style '${styleId}':`, error);
        return null;
      }
    } catch (error) {
      console.error(`Error retrieving style '${styleId}':`, error);
      return null;
    }
  }

  async getAllStyles(): Promise<EnhancedStyleMetadata[]> {
    if (!this.initialized) await this.initialize();
    return Array.from(this.styles.values());
  }

  async generateExample(styleId: string): Promise<{ bibliography: string; inText: string }> {
    // Return placeholder content instead of attempting to initialize Citation.js
    return {
      bibliography: 'Example not available - preview disabled',
      inText: 'Citation not available - preview disabled'
    };
  }

  async getStylesByCategory(categoryId: string): Promise<EnhancedStyleMetadata[]> {
    if (!this.initialized) await this.initialize();
    return Array.from(this.styles.values())
      .filter(style => style.categories.includes(categoryId));
  }

  async searchStyles(query: string): Promise<EnhancedStyleMetadata[]> {
    if (!this.initialized) await this.initialize();
    
    const searchTerm = query.toLowerCase();
    return Array.from(this.styles.values())
      .filter(style => 
        style.title.toLowerCase().includes(searchTerm) ||
        style.id.toLowerCase().includes(searchTerm) ||
        style.description.toLowerCase().includes(searchTerm) ||
        style.categories.some(cat => cat.toLowerCase().includes(searchTerm))
      );
  }

  async validateStyle(styleId: string): Promise<StyleValidationResult> {
    if (!this.initialized) await this.initialize();
    
    const style : any = await this.getStyle(styleId);
    const errors: StyleValidationError[] = [];
    const warnings: StyleValidationWarning[] = [];

    try {
      // Validate style existence
      const styleData : any = await this.loadStyle(styleId);
      
      // Check required properties
      if (!styleData.citation) {
        errors.push({
          code: 'MISSING_CITATION',
          message: 'Style is missing citation formatting rules'
        });
      }
      
      if (!styleData.bibliography) {
        warnings.push({
          code: 'MISSING_BIBLIOGRAPHY',
          message: 'Style is missing bibliography formatting rules',
          suggestion: 'Add bibliography formatting for complete citation support'
        });
      }

      // Check for deprecated features
      if (style.isDeprecated) {
        warnings.push({
          code: 'DEPRECATED_STYLE',
          message: 'This style is marked as deprecated',
          suggestion: 'Consider using an updated version of this style'
        });
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          code: 'VALIDATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown validation error'
        }],
        warnings: []
      };
    }
  }

  async checkForUpdates(styleId: string): Promise<StyleUpdateInfo> {
    if (!this.initialized) await this.initialize();
    
    const style : any= await this.getStyle(styleId);
    
    if (this.lastUpdateCheck && 
        (new Date().getTime() - this.lastUpdateCheck.getTime()) < 3600000) {
      return {
        hasUpdate: false,
        currentVersion: style.version
      };
    }

    try {
      const latestStyle = await Cite.plugins.config.get('@csl/styles')[styleId];
      const latestVersion = this.parseVersion(latestStyle.version || '1.0.0');
      
      this.lastUpdateCheck = new Date();
      
      return {
        hasUpdate: this.isNewerVersion(latestVersion, style.version),
        currentVersion: style.version,
        latestVersion,
        changelogUrl: `https://github.com/citation-style-language/styles/commits/master/${styleId}.csl`
      };
    } catch (error) {
      console.error(`Failed to check for updates for style ${styleId}:`, error);
      return {
        hasUpdate: false,
        currentVersion: style.version
      };
    }
  }

  private isNewerVersion(v1: StyleVersion, v2: StyleVersion): boolean {
    if (v1.major !== v2.major) return v1.major > v2.major;
    if (v1.minor !== v2.minor) return v1.minor > v2.minor;
    return v1.patch > v2.patch;
  }

  getCategories(): StyleCategory[] {
    return this.categories;
  }

  getStyles(): Map<string, EnhancedStyleMetadata> {
    if (!this.initialized) {
      throw new Error('UnifiedStyleService must be initialized before getting styles');
    }
    return this.styles;
  }

  hasStyle(styleId: string): boolean {
    if (!this.initialized) {
      throw new Error('UnifiedStyleService must be initialized before checking styles');
    }
    return this.styles.has(styleId);
  }
}

// Export singleton instance
export const unifiedStyleService = UnifiedStyleService.getInstance();

// Style metadata cache
const styleMetadataCache = new Map<string, StyleMetadata>();

// Base metadata for common citation styles
const baseStyleMetadata: Record<string, StyleMetadata> = {
  'apa': {
    id: 'apa',
    title: 'APA (American Psychological Association)',
    description: 'APA Style is widely used in the social sciences, education, and business.',
    version: '7th edition',
    documentation: 'https://apastyle.apa.org/',
    tags: ['author-date', 'doi-support', 'url-required', 'north-america'],
    disciplines: ['social-sciences', 'psychology', 'education'],
    lastUpdated: '2023-01-01'
  },
  'mla': {
    id: 'mla',
    title: 'MLA (Modern Language Association)',
    description: 'MLA Style is widely used in the humanities, especially in writing about language and literature.',
    version: '9th edition',
    documentation: 'https://style.mla.org/',
    tags: ['author-page', 'multilingual', 'north-america'],
    disciplines: ['humanities', 'literature', 'languages'],
    lastUpdated: '2023-01-01'
  },
  'chicago': {
    id: 'chicago',
    title: 'Chicago Manual of Style',
    description: 'Chicago Style is widely used in history and some humanities disciplines.',
    version: '17th edition',
    documentation: 'https://www.chicagomanualofstyle.org/',
    tags: ['note', 'author-date', 'complex', 'north-america'],
    disciplines: ['humanities', 'history', 'arts'],
    lastUpdated: '2023-01-01'
  },
  'harvard': {
    id: 'harvard',
    title: 'Harvard',
    description: 'Harvard Style is commonly used in universities across the UK and other countries.',
    version: '2023',
    tags: ['author-date', 'europe', 'university'],
    disciplines: ['social-sciences', 'business', 'humanities'],
    lastUpdated: '2023-01-01'
  },
  'ieee': {
    id: 'ieee',
    title: 'IEEE',
    description: 'IEEE Style is used in engineering and computer science publications.',
    version: '2023',
    documentation: 'https://ieee-dataport.org/sites/default/files/analysis/27/IEEE%20Citation%20Guidelines.pdf',
    tags: ['numeric', 'journal-publisher', 'doi-support'],
    disciplines: ['engineering', 'computer-science', 'technology'],
    lastUpdated: '2023-01-01'
  }
};

/**
 * Fetches metadata for a specific citation style
 * @param styleId The identifier of the citation style
 * @returns The style metadata or null if not found
 */
export async function getStyleMetadata(styleId: string): Promise<StyleMetadata | null> {
  // Check cache first
  if (styleMetadataCache.has(styleId)) {
    return styleMetadataCache.get(styleId)!;
  }

  try {
    // First check if it's a base style
    if (baseStyleMetadata[styleId]) {
      styleMetadataCache.set(styleId, baseStyleMetadata[styleId]);
      return baseStyleMetadata[styleId];
    }

    // If not in base styles, fetch from CSL repository
    const response = await fetch(
      `https://raw.githubusercontent.com/citation-style-language/styles/master/${styleId}.csl`
    );

    if (!response.ok) {
      console.error(`Failed to fetch style ${styleId}: ${response.statusText}`);
      return null;
    }

    const cslData = await response.text();
    
    // Parse CSL XML to extract metadata
    const parser = new DOMParser();
    const doc = parser.parseFromString(cslData, 'text/xml');
    
    const info = doc.getElementsByTagName('info')[0];
    const title = info.getElementsByTagName('title')[0]?.textContent || styleId;
    const description = info.getElementsByTagName('summary')[0]?.textContent || '';
    
    // Extract additional metadata from CSL
    const metadata: any = {
      id: styleId,
      title,
      description,
      version: info.getElementsByTagName('version')[0]?.textContent,
      url: info.getElementsByTagName('link')[0]?.getAttribute('href') || undefined,
      tags: inferStyleTags(cslData),
      disciplines: inferStyleDisciplines(cslData),
      lastUpdated: info.getElementsByTagName('updated')[0]?.textContent
    };

    // Cache the metadata
    styleMetadataCache.set(styleId, metadata);
    return metadata;

  } catch (error) {
    console.error(`Error fetching style metadata for ${styleId}:`, error);
    return null;
  }
}

/**
 * Infers style tags based on CSL content
 */
function inferStyleTags(cslContent: string): string[] {
  const tags: string[] = [];

  // Infer format
  if (cslContent.includes('citation-format="author-date"')) {
    tags.push('author-date');
  } else if (cslContent.includes('citation-format="numeric"')) {
    tags.push('numeric');
  } else if (cslContent.includes('citation-format="note"')) {
    tags.push('note');
  }

  // Infer features
  if (cslContent.includes('<text variable="DOI"')) {
    tags.push('doi-support');
  }
  if (cslContent.includes('<text variable="URL"')) {
    tags.push('url-required');
  }
  if (cslContent.includes('xml:lang=')) {
    tags.push('multilingual');
  }

  return tags;
}

/**
 * Infers disciplines based on CSL content and style metadata
 */
function inferStyleDisciplines(cslContent: string): string[] {
  const disciplines: string[] = [];

  // Infer disciplines based on content patterns
  if (cslContent.includes('psychology') || cslContent.includes('behavioral')) {
    disciplines.push('psychology');
  }
  if (cslContent.includes('humanities') || cslContent.includes('literature')) {
    disciplines.push('humanities');
  }
  if (cslContent.includes('science') || cslContent.includes('scientific')) {
    disciplines.push('sciences');
  }
  if (cslContent.includes('engineering') || cslContent.includes('technical')) {
    disciplines.push('engineering');
  }

  return disciplines;
}

/**
 * Gets a list of all available citation styles
 */
export async function getAllStyles(): Promise<StyleMetadata[]> {
  // Start with base styles
  const styles = Object.values(baseStyleMetadata);

  // Could extend this to fetch from CSL repository
  // or other sources as needed

  return styles;
}