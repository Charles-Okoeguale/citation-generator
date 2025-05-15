declare module '@citation-js/core' {
    export class Cite {
      static plugins: any;
      constructor(data: any);
      format(format: 'bibliography' | 'citation', options?: {
        format?: 'html' | 'text';
        template?: string;
        lang?: string;
      }): string;
      static async(data: any): Promise<Cite>;
    }
  }