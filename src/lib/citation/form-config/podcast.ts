import { FormConfig } from '../types';

export const podcastConfig: FormConfig = {
  type: 'podcast',
  label: 'Podcast',
  description: 'Citation for a podcast episode',
  fields: {
    title: {
      type: 'text',
      label: 'Episode Title',
      required: true,
      validation: [{ type: 'required', message: 'Episode title is required' }]
    },
    'container-title': {
      type: 'text',
      label: 'Podcast Name',
      required: true,
      validation: [{ type: 'required', message: 'Podcast name is required' }]
    },
    author: {
      type: 'contributors',
      label: 'Host(s)',
      validation: []
    },
    issued: {
      type: 'date',
      label: 'Release Date',
      validation: []
    },
    episode: {
      type: 'text',
      label: 'Episode Number',
      validation: []
    },
    duration: {
      type: 'text',
      label: 'Duration',
      validation: []
    },
    medium: {
      type: 'text',
      label: 'Format',
      defaultValue: 'Podcast',
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
      fields: ['title', 'container-title', 'author']
    },
    details: {
      label: 'Episode Details',
      fields: ['issued', 'episode', 'duration', 'medium']
    },
    access: {
      label: 'Access Information',
      fields: ['URL', 'accessed']
    }
  },
  order: ['basic', 'details', 'access']
};