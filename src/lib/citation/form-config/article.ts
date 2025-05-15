import { FormConfig } from "../types";

export const articleConfig: FormConfig = {
  type: 'article-journal',
  label: 'Journal Article',
  description: 'Use this form for citing articles from academic journals',
  fields: {
    title: {
      type: 'text',
      label: 'Article Title',
      placeholder: 'Enter the full title of the article',
      help: 'Enter the title of the article as it appears in the journal',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'Article title is required'
        }
      ]
    },
    authors: {
      type: 'author-list',
      label: 'Authors',
      help: 'Add all authors in the order they appear on the article',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'At least one author is required'
        }
      ]
    },
    journal: {
      type: 'container',
      label: 'Journal',
      placeholder: 'Enter journal name',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'Journal name is required'
        }
      ]
    },
    volume: {
      type: 'text',
      label: 'Volume',
      placeholder: 'e.g., 12',
      required: false
    },
    issue: {
      type: 'text',
      label: 'Issue',
      placeholder: 'e.g., 3',
      required: false
    },
    pages: {
      type: 'page-range',
      label: 'Pages',
      placeholder: 'e.g., 123-145',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'Page range is required'
        },
        {
          type: 'pattern',
          pattern: /^\d+(-\d+)?$/,
          message: 'Please enter a valid page range'
        }
      ]
    },
    doi: {
      type: 'identifier',
      label: 'DOI',
      placeholder: 'Enter DOI',
      help: 'Digital Object Identifier (e.g., 10.1000/xyz123)',
      validation: [
        {
          type: 'pattern',
          pattern: /^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i,
          message: 'Please enter a valid DOI'
        }
      ]
    },
    year: {
      type: 'date',
      label: 'Publication Year',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'Publication year is required'
        }
      ]
    }
  },
  sections: {
    basic: {
      label: 'Basic Information',
      fields: ['title', 'authors']
    },
    journal: {
      label: 'Journal Details',
      fields: ['journal', 'volume', 'issue', 'pages']
    },
    publication: {
      label: 'Publication Details',
      fields: ['year', 'doi']
    }
  },
  order: ['basic', 'journal', 'publication']
};