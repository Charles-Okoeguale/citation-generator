export type CitationStyle = string;

export type CitationFormat = 'text' | 'html' | 'bibtex' | 'json';

export interface StyleInfo {
  id: string;
  title: string;
  category: string;
  updated: string;
}

export type SourceType = 
  | 'book'
  | 'article-journal'
  | 'webpage'
  | 'paper-conference'
  | 'chapter'
  | 'thesis'
  | 'report';

export interface Author {
  given: string;
  family: string;
}

export interface CitationInput {
  type: SourceType;
  title: string;
  author?: Author[];
  issued?: {
    'date-parts': number[][];
  };
  'container-title'?: string; // Journal/Book title
  DOI?: string;
  URL?: string;
  page?: string;
  volume?: string;
  issue?: string;
  ISBN?: string;
  publisher?: string;
  'publisher-place'?: string;
  edition?: string;
}

export interface CitationOutput {
  html: string;
  text: string;
  inText: string;
  bibtex: string;
  json: any;
}

export interface BibliographyOptions {
  style?: CitationStyle;
  format?: CitationFormat;
  locale?: string;
  sorting?: 'ascending' | 'descending' | 'none';
}

export type FieldType = 
  | 'text'
  | 'author-list'
  | 'date'
  | 'page-range'
  | 'identifier'
  | 'container'
  | 'select'
  | 'url';

export type ValidationRule = {
  type: 'required' | 'pattern' | 'custom';
  message: string;
  validator?: (value: any) => boolean;
  pattern?: RegExp;
};

export interface FieldConfig {
  type: FieldType;
  label: string;
  placeholder?: string;
  help?: string;
  required?: boolean;
  validation?: ValidationRule[];
  defaultValue?: any;
  depends?: {
    field: string;
    value: any;
  };
  options?: { label: string; value: string }[]; // For select fields
}

export interface FormSection {
  label: string;
  fields: string[];
}

export interface FormConfig {
  type: string;
  label: string;
  description: string;
  fields: Record<string, FieldConfig>;
  sections: Record<string, FormSection>; // Now properly typed
  order: string[];
}