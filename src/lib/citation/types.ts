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
  | 'newspaper'
  | 'video'
  | 'podcast'
  | 'email'
  | 'software'
  | 'dataset'
  | 'artwork'
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
  | 'contributors'
  | 'url';

export type ValidationRule = {
  type: 'required' | 'pattern' | 'custom' | 'url';
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

export interface FormatPreferences {
  defaultFormat: CitationFormat;
  showPreview: boolean;
  autoSave: boolean;
}

export type StyleField = 
  | 'author'
  | 'title'
  | 'container-title'
  | 'issued'
  | 'page'
  | 'volume'
  | 'issue'
  | 'DOI'
  | 'URL'
  | 'ISBN'
  | 'ISSN'
  | 'publisher'
  | 'publisher-place'
  | 'edition';

export interface StyleVersion {
  major: number;
  minor: number;
  patch: number;
  toString(): string;
}

export interface StyleExample {
  input: Record<string, any>;
  output: {
    bibliography: string;
    inText: string;
  };
}

export interface EnhancedStyleMetadata {
  id: string;
  title: string;
  titleShort?: string;
  version: StyleVersion;
  updated: string;
  categories: string[];
  description: string;
  example: StyleExample;
  fields: StyleField[];
  dependencies?: string[];
  isDeprecated?: boolean;
  defaultLocale?: string;
  supportedLocales?: string[];
  documentationUrl?: string;
}

export interface StyleValidationResult {
  isValid: boolean;
  errors: StyleValidationError[];
  warnings: StyleValidationWarning[];
}

export interface StyleValidationError {
  code: string;
  message: string;
  field?: string;
}

export interface StyleValidationWarning {
  code: string;
  message: string;
  suggestion?: string;
}

export interface StyleUpdateInfo {
  hasUpdate: boolean;
  currentVersion: StyleVersion;
  latestVersion?: StyleVersion;
  changelogUrl?: string;
}

export interface StyleCategory {
  id: string;
  name: string;
  description: string;
  count: number;
  subcategories?: StyleCategory[];
}

// src/lib/citation/types/disciplines.ts
export interface AcademicDiscipline {
  id: string;
  name: string;
  description: string;
  subfields: string[];
}

export const academicDisciplines: any = [
  {
    id: 'humanities',
    name: 'Humanities',
    description: 'Literature, Philosophy, History, and Arts',
    subfields: ['literature', 'philosophy', 'history', 'arts', 'religion', 'languages']
  },
  {
    id: 'social-sciences',
    name: 'Social Sciences',
    description: 'Psychology, Sociology, Political Science, and Economics',
    subfields: ['psychology', 'sociology', 'political-science', 'economics', 'anthropology']
  },
  {
    id: 'sciences',
    name: 'Sciences',
    description: 'Biology, Chemistry, Physics, and Mathematics',
    subfields: ['biology', 'chemistry', 'physics', 'mathematics', 'computer-science']
  },
  {
    id: 'medicine',
    name: 'Medicine & Health Sciences',
    description: 'Medicine, Nursing, Public Health, and Allied Health',
    subfields: ['medicine', 'nursing', 'public-health', 'pharmacology']
  },
  {
    id: 'engineering',
    name: 'Engineering & Technology',
    description: 'Engineering, Technology, and Applied Sciences',
    subfields: ['engineering', 'technology', 'computer-science', 'information-systems']
  },
  {
    id: 'law',
    name: 'Law & Legal Studies',
    description: 'Law, Legal Studies, and Jurisprudence',
    subfields: ['law', 'legal-studies', 'international-law']
  }
];

// src/lib/citation/types/style-tags.ts
export interface StyleTag {
  id: string;
  label: string;
  category: 'format' | 'feature' | 'region' | 'publisher' | 'complexity';
  description?: string;
}

// src/lib/citation/types/user-preferences.ts
export interface StylePreference {
  styleId: string;
  lastUsed: Date;
  useCount: number;
  notes?: string;
}

export interface UserStylePreferences {
  defaultStyle?: string;
  favoriteStyles: StylePreference[];
  recentStyles: string[];
}

export const styleTags: Record<string, StyleTag> = {
  'author-date': {
    id: 'author-date',
    label: 'Author-Date',
    category: 'format',
    description: 'Citations use author names and dates (e.g., Smith 2023)'
  },
  'numeric': {
    id: 'numeric',
    label: 'Numeric',
    category: 'format',
    description: 'Citations use numbers [1], [2], etc.'
  },
  'note': {
    id: 'note',
    label: 'Footnote/Endnote',
    category: 'format',
    description: 'Citations appear as numbered notes'
  },
  'multilingual': {
    id: 'multilingual',
    label: 'Multilingual Support',
    category: 'feature',
    description: 'Supports multiple languages and scripts'
  },
  'doi-support': {
    id: 'doi-support',
    label: 'DOI Support',
    category: 'feature',
    description: 'Includes DOI in citations'
  },
  'url-required': {
    id: 'url-required',
    label: 'URL Required',
    category: 'feature',
    description: 'Requires URLs for online sources'
  },
  'north-america': {
    id: 'north-america',
    label: 'North American',
    category: 'region',
    description: 'Common in North American institutions'
  },
  'europe': {
    id: 'europe',
    label: 'European',
    category: 'region',
    description: 'Common in European institutions'
  },
  'journal-publisher': {
    id: 'journal-publisher',
    label: 'Journal Publisher',
    category: 'publisher',
    description: 'Used by academic journals'
  },
  'university': {
    id: 'university',
    label: 'University',
    category: 'publisher',
    description: 'Used by universities'
  },
  'simple': {
    id: 'simple',
    label: 'Simple',
    category: 'complexity',
    description: 'Basic citation format with minimal requirements'
  },
  'complex': {
    id: 'complex',
    label: 'Complex',
    category: 'complexity',
    description: 'Detailed citation format with specific requirements'
  }
};

export const tagCategories = {
  format: 'Citation Format',
  feature: 'Features',
  region: 'Regional Usage',
  publisher: 'Publisher Type',
  complexity: 'Complexity Level'
};