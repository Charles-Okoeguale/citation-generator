import { FormConfig } from '../types';

export const newspaperConfig: FormConfig = {
  type: 'newspaper',
  label: 'Newspaper Article',
  description: 'Citation for a newspaper article',
  fields: {
    title: {
      type: 'text',
      label: 'Article Title',
      required: true,
      validation: [{ type: 'required', message: 'Title is required' }]
    },
    'container-title': {
      type: 'text',
      label: 'Newspaper Name',
      required: true,
      validation: [{ type: 'required', message: 'Newspaper name is required' }]
    },
    author: {
      type: 'contributors',
      label: 'Authors',
      validation: []
    },
    issued: {
      type: 'date',
      label: 'Publication Date',
      required: true,
      validation: [{ type: 'required', message: 'Publication date is required' }]
    },
    section: {
      type: 'text',
      label: 'Section',
      validation: []
    },
    page: {
      type: 'page-range',
      label: 'Page Range',
      validation: []
    },
    URL: {
      type: 'text',
      label: 'URL',
      validation: [{ type: 'url', message: 'Please enter a valid URL' }]
    },
    accessed: {
      type: 'date',
      label: 'Date Accessed',
      validation: []
    }
  },
  sections: {
    basic: {
      label: 'Basic Information',
      fields: ['title', 'container-title', 'author', 'issued']
    },
    details: {
      label: 'Additional Details',
      fields: ['section', 'page']
    },
    access: {
      label: 'Access Information',
      fields: ['URL', 'accessed']
    }
  },
  order: ['basic', 'details', 'access']
};