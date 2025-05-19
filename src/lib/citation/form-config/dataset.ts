import { FormConfig } from '../types';

export const datasetConfig: FormConfig = {
  type: 'dataset',
  label: 'Dataset',
  description: 'Citation for a dataset',
  fields: {
    title: {
      type: 'text',
      label: 'Dataset Title',
      required: true,
      validation: [{ type: 'required', message: 'Dataset title is required' }]
    },
    author: {
      type: 'contributors',
      label: 'Authors/Creators',
      validation: []
    },
    issued: {
      type: 'date',
      label: 'Publication Date',
      validation: []
    },
    'container-title': {
      type: 'text',
      label: 'Repository',
      validation: []
    },
    version: {
      type: 'text',
      label: 'Version',
      validation: []
    },
    DOI: {
      type: 'text',
      label: 'DOI',
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
      fields: ['title', 'author', 'issued']
    },
    details: {
      label: 'Dataset Details',
      fields: ['container-title', 'version', 'DOI']
    },
    access: {
      label: 'Access Information',
      fields: ['URL', 'accessed']
    }
  },
  order: ['basic', 'details', 'access']
};