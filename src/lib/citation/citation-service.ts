'use client';

import { Cite } from '@citation-js/core'
import '@citation-js/plugin-bibtex'
import '@citation-js/plugin-doi'
import '@citation-js/plugin-csl'
import type { 
  CitationInput, 
  CitationOutput,
  CitationFormat,
  BibliographyOptions 
} from './types'
import { unifiedStyleService } from './style-service'

class CitationService {
  private initialized: boolean = false;
  private styleCache: Map<string, any> = new Map();

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Only run in browser environment
      if (typeof window === 'undefined') {
        console.log('Skipping citation service initialization in server environment');
        this.initialized = true;
        return;
      }

      // Initialize Citation.js plugins with dynamic import
      const Cite = (await import('@citation-js/core')).Cite;
      
      // Make sure plugins are available
      if (!Cite.plugins?.config) {
        console.warn('Citation.js plugins not available, trying to load them');
        await import('@citation-js/plugin-bibtex');
        await import('@citation-js/plugin-doi');
        await import('@citation-js/plugin-csl');
      }
      
      // Now try to access the styles
      if (Cite.plugins?.config?.get) {
        await Cite.plugins.config.get('@csl/styles');
      } else {
        console.warn('Citation.js plugins.config.get not available, continuing anyway');
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize citation service:', error);
      console.error('Error details:', error);
      // Set initialized to true anyway to prevent repeated failures
      this.initialized = true;
    }
  }

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
    styleId: string = 'apa'
  ): Promise<CitationOutput> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Ensure style is available
      const style = await unifiedStyleService.getStyle(styleId);
      if (!style) {
        throw new Error(`Style ${styleId} not found`);
      }

      const cite = await this.createCitation(input);
      
      return {
        html: cite.format('bibliography', {
          format: 'html',
          template: styleId,
          lang: 'en-US'
        }),
        text: cite.format('bibliography', {
          format: 'text',
          template: styleId,
          lang: 'en-US'
        }),
        inText: cite.format('citation', {
          template: styleId,
          lang: 'en-US'
        }),
        bibtex: cite.format('bibliography', {
          format: 'text',
        }),
        // For JSON output
        json: cite.format('bibliography', {
          format: 'text',
        })
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
    if (!this.initialized) {
      await this.initialize();
    }

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
      
      const cite = await Cite.async(citations);
      
      return {
        html: cite.format('bibliography', {
          format: 'html',
          template: style,
          lang: locale,
        }),
        text: cite.format('bibliography', {
          format: 'text',
          template: style,
          lang: locale,
        }),
        inText: cite.format('citation', {
          template: style,
          lang: locale
        }),
        bibtex: cite.format('bibliography', {
          format: 'text',
          template: style,
          lang: locale,
        }),
        json: cite.format('bibliography', {
          format: 'text',
          template: style,
          lang: locale,
        })
      };
    } catch (error) {
      console.error('Bibliography generation error:', error);
      throw new Error('Failed to generate bibliography');
    }
  }

  /**
   * Get available citation styles
   */
  async getAvailableStyles(): Promise<string[]> {
    await unifiedStyleService.initialize();
    return Array.from(unifiedStyleService.getStyles().keys());
  }

  /**
   * Check if a style is available
   */
  async isStyleAvailable(styleId: string): Promise<boolean> {
    await unifiedStyleService.initialize();
    return unifiedStyleService.hasStyle(styleId);
  }

  // Utility methods remain the same
  private isValidDOI(doi: string): boolean {
    const doiRegex = /^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i;
    return doiRegex.test(doi);
  }

  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isBibTeX(text: string): boolean {
    return text.trim().startsWith('@') && 
           /^@\w+\s*\{[^}]+\}/.test(text.trim());
  }

  private async fetchMetadataFromURL(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const metadata = this.extractMetadata(html);
      
      if (!metadata) {
        throw new Error('No metadata found');
      }

      return metadata;
    } catch (error) {
      throw new Error(`Failed to fetch metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractMetadata(html: string): any {
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