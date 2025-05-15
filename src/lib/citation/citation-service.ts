import { Cite } from '@citation-js/core'
import '@citation-js/plugin-bibtex'
import '@citation-js/plugin-doi'
import '@citation-js/plugin-csl'
import type { 
  CitationInput, 
  CitationStyle, 
  CitationOutput, 
  CitationFormat,
  BibliographyOptions 
} from './types'
import { styleService } from './style-service'

class CitationService {
  /**
   * Creates a citation object from various input types
   */
  private async createCitation(input: CitationInput | string): Promise<Cite> {
    try {
      // Handle DOI input
      if (typeof input === 'string' && this.isValidDOI(input)) {
        return new Cite(input);
      }

      // Handle URL input
      if (typeof input === 'string' && this.isValidURL(input)) {
        const metadata = await this.fetchMetadataFromURL(input);
        return new Cite(metadata);
      }

      // Handle BibTeX input
      if (typeof input === 'string' && this.isBibTeX(input)) {
        return new Cite(input);
      }

      // Handle direct CSL-JSON input
      return new Cite(input);
    } catch (error) {
      console.error('Error creating citation:', error);
      throw new Error(`Failed to create citation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generates a citation in the specified style and format
   */
  async generateCitation(
    input: CitationInput | string,
    options: {
      style?: CitationStyle;
      format?: CitationFormat;
      locale?: string;
      inText?: boolean;
    } = {}
  ): Promise<CitationOutput> {
    const { 
      style = 'apa', 
      format = 'text',
      locale = 'en-US',
      inText = false 
    } = options;

    try {
      const cite : any = await this.createCitation(input);
      
      const formatOptions = {
        format,
        template: style,
        lang: locale
      };

      return {
        html: cite.format('bibliography', { ...formatOptions, format: 'html' }),
        text: cite.format('bibliography', { ...formatOptions, format: 'text' }),
        inText: cite.format('citation', formatOptions),
        bibtex: cite.format('bibtex'),
        json: cite.format('data', { format: 'object' })
      };
    } catch (error) {
      console.error('Citation generation error:', error);
      throw new Error('Failed to generate citation');
    }
  }

  /**
   * Generates a bibliography from multiple citations
   */
  async generateBibliography(
    inputs: (CitationInput | string)[],
    options: BibliographyOptions = {}
  ): Promise<CitationOutput> {
    const { 
      style = 'apa', 
      format = 'text',
      locale = 'en-US',
      sorting = 'ascending'
    } = options;

    try {
      const citations = await Promise.all(
        inputs.map(input => this.createCitation(input))
      );
      
      const cite : any = Cite.async(citations);
      
      const formatOptions = {
        format,
        template: style,
        lang: locale,
        sort: sorting
      };

      return {
        html: cite.format('bibliography', { ...formatOptions, format: 'html' }),
        text: cite.format('bibliography', { ...formatOptions, format: 'text' }),
        inText: cite.format('citation', formatOptions),
        bibtex: cite.format('bibtex'),
        json: cite.format('data', { format: 'object' })
      };
    } catch (error) {
      console.error('Bibliography generation error:', error);
      throw new Error('Failed to generate bibliography');
    }
  }

  // Get all available citation styles
  async getAvailableStyles() {
    return styleService.getAllStyles();
  }

  // Search for citation styles
  async searchStyles(query: string) {
    return styleService.searchStyles(query);
  }

  /**
   * Validates a DOI string
   */
  private isValidDOI(doi: string): boolean {
    const doiRegex = /^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i;
    return doiRegex.test(doi);
  }

  /**
   * Validates a URL string
   */
  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if a string is BibTeX format
   */
  private isBibTeX(text: string): boolean {
    return text.trim().startsWith('@') && 
           /^@\w+\s*\{[^}]+\}/.test(text.trim());
  }

  /**
   * Fetches metadata from a URL
   */
  private async fetchMetadataFromURL(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      // Extract metadata from HTML
      const metadata = this.extractMetadata(html);
      
      if (!metadata) {
        throw new Error('No metadata found');
      }

      return metadata;
    } catch (error) {
      throw new Error(`Failed to fetch metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extracts metadata from HTML content
   */
  private extractMetadata(html: string): any {
    // Basic metadata extraction from meta tags
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    const metadata: Record<string, string> = {};
    
    // Dublin Core metadata
    const dcTags = doc.querySelectorAll('meta[name^="dc."]');
    dcTags.forEach(tag => {
      const name = tag.getAttribute('name')?.replace('dc.', '') || '';
      const content = tag.getAttribute('content') || '';
      if (name && content) {
        metadata[name] = content;
      }
    });

    // Schema.org metadata
    const schemaJson = doc.querySelector('script[type="application/ld+json"]');
    if (schemaJson?.textContent) {
      try {
        const schemaData = JSON.parse(schemaJson.textContent);
        Object.assign(metadata, this.flattenSchemaData(schemaData));
      } catch (e) {
        console.warn('Failed to parse Schema.org JSON-LD:', e);
      }
    }

    return metadata;
  }

  /**
   * Flattens Schema.org JSON-LD data
   */
  private flattenSchemaData(data: any, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(data)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        Object.assign(result, this.flattenSchemaData(value, fullKey));
      } else if (typeof value === 'string' || typeof value === 'number') {
        result[fullKey] = String(value);
      }
    }
    
    return result;
  }
}

// Export singleton instance
export const citationService = new CitationService();