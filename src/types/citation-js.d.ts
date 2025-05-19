declare module '@citation-js/core' {
  // Cite class definition
  export class Cite {
    constructor(data?: any);
    format(format: string, options?: any): string;
  }

  // Plugin system definition
  export const plugins: {
    add: {
      (name: string, plugin: any): void;
      (plugin: any): void;
    };
    config: {
      get: (path: string) => any;
      has: (path: string) => boolean;
      set: (path: string, value: any) => void;
    }
  };

  // Default export is the Cite class
  export default Cite;
}

// Declare plugin modules to avoid import errors
declare module '@citation-js/plugin-csl' {
  const plugin: any;
  export default plugin;
}

declare module '@citation-js/plugin-bibtex' {
  const plugin: any;
  export default plugin;
}

declare module '@citation-js/plugin-doi' {
  const plugin: any;
  export default plugin;
} 