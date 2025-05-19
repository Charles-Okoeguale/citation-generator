import { FormConfig } from '../types';

export const artworkConfig: FormConfig = {
  type: 'artwork',
  label: 'Artwork',
  description: 'Citation for artwork',
  fields: {
    title: {
      type: 'text',
      label: 'Title of Work',
      required: true,
      validation: [{ type: 'required', message: 'Title is required' }]
    },
    author: {
      type: 'contributors',
      label: 'Artist',
      required: true,
      validation: [{ type: 'required', message: 'Artist name is required' }]
    },
    issued: {
      type: 'date',
      label: 'Creation Date',
      validation: []
    },
    medium: {
      type: 'text',
      label: 'Medium',
      validation: []
    },
    genre: {
      type: 'text',
      label: 'Type',
      defaultValue: 'Artwork',
      validation: []
    },
    dimensions: {
      type: 'text',
      label: 'Dimensions',
      validation: []
    },
    'archive-place': {
      type: 'text',
      label: 'Location of Work',
      validation: []
    },
    'archive': {
      type: 'text',
      label: 'Museum/Collection',
      validation: []
    },
    URL: {
      type: 'text',
      label: 'URL',
      validation: [{ type: 'url', message: 'Please enter a valid URL' }]
    }
  },
  sections: {
    basic: {
      label: 'Basic Information',
      fields: ['title', 'author', 'issued']
    },
    details: {
      label: 'Artwork Details',
      fields: ['medium', 'genre', 'dimensions']
    },
    location: {
      label: 'Location Information',
      fields: ['archive-place', 'archive', 'URL']
    }
  },
  order: ['basic', 'details', 'location']
};