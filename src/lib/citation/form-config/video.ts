import { FormConfig } from '../types';

export const videoConfig: FormConfig = {
  type: 'video',
  label: 'Video',
  description: 'Citation for a video',
  fields: {
    title: {
      type: 'text',
      label: 'Video Title',
      required: true,
      validation: [{ type: 'required', message: 'Title is required' }]
    },
    'container-title': {
      type: 'text',
      label: 'Platform/Channel',
      validation: []
    },
    author: {
      type: 'contributors',
      label: 'Creator(s)',
      validation: []
    },
    issued: {
      type: 'date',
      label: 'Upload/Release Date',
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
      defaultValue: 'Online Video',
      validation: []
    },
    URL: {
      type: 'text',
      label: 'URL',
      required: true,
      validation: [
        { type: 'required', message: 'URL is required' },
        { type: 'url', message: 'Please enter a valid URL' }
      ]
    },
    accessed: {
      type: 'date',
      label: 'Date Accessed',
      required: true,
      validation: [{ type: 'required', message: 'Access date is required' }]
    }
  },
  sections: {
    basic: {
      label: 'Basic Information',
      fields: ['title', 'container-title', 'author']
    },
    details: {
      label: 'Video Details',
      fields: ['issued', 'duration', 'medium']
    },
    access: {
      label: 'Access Information',
      fields: ['URL', 'accessed']
    }
  },
  order: ['basic', 'details', 'access']
};