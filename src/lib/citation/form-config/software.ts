import { FormConfig } from '../types';

export const softwareConfig: FormConfig = {
  type: 'software',
  label: 'Software',
  description: 'Citation for software or applications',
  fields: {
    title: {
      type: 'text',
      label: 'Software Name',
      required: true,
      validation: [{ type: 'required', message: 'Software name is required' }]
    },
    author: {
      type: 'contributors',
      label: 'Developer',
      validation: []
    },
    issued: {
      type: 'date',
      label: 'Release Date',
      validation: []
    },
    version: {
      type: 'text',
      label: 'Version',
      validation: []
    },
    genre: {
      type: 'text',
      label: 'Type',
      defaultValue: 'Software',
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
      fields: ['title', 'author']
    },
    details: {
      label: 'Software Details',
      fields: ['issued', 'version', 'genre']
    },
    access: {
      label: 'Access Information',
      fields: ['URL', 'accessed']
    }
  },
  order: ['basic', 'details', 'access']
};