// src/lib/citation/style-rules.ts
export interface StyleRule {
    id: string;
    title: string;
    description: string;
    examples?: string[];
    category: 'formatting' | 'punctuation' | 'order' | 'names' | 'dates';
  }
  
  export const styleRules: Record<string, Record<string, StyleRule>> = {
    'apa': {
      'author-names': {
        id: 'author-names',
        title: 'Author Names',
        description: 'Use last name followed by initials. For multiple authors, use "&" before the last author.',
        examples: [
          'Smith, J. D.',
          'Johnson, M. R., & Williams, P. K.',
          'Brown, A. B., Lee, C. D., & Wilson, E. F.'
        ],
        category: 'names'
      },
      'date-format': {
        id: 'date-format',
        title: 'Date Formatting',
        description: 'Use year only in parentheses for in-text citations. Include month and day for specific dates.',
        examples: [
          '(2023)',
          'March 15, 2023',
          '2023, Spring'
        ],
        category: 'dates'
      },
      'title-case': {
        id: 'title-case',
        title: 'Title Capitalization',
        description: 'Use sentence case for article and book titles. Capitalize proper nouns.',
        examples: [
          'The effects of climate change on marine ecosystems',
          'Social media and modern communication'
        ],
        category: 'formatting'
      }
    },
    'mla': {
      'author-names': {
        id: 'author-names',
        title: 'Author Names',
        description: 'Use full first name followed by last name. For three or more authors, use "et al."',
        examples: [
          'John Smith',
          'Jane Johnson and Peter Williams',
          'Sarah Brown et al.'
        ],
        category: 'names'
      },
      'title-case': {
        id: 'title-case',
        title: 'Title Capitalization',
        description: 'Capitalize all major words in titles.',
        examples: [
          'The Effects of Climate Change on Marine Ecosystems',
          'Social Media and Modern Communication'
        ],
        category: 'formatting'
      }
    }
    // Add rules for other styles...
  };