import { FormConfig } from '../types';

export const emailConfig: FormConfig = {
  type: 'email',
  label: 'Email',
  description: 'Citation for an email communication',
  fields: {
    title: {
      type: 'text',
      label: 'Subject',
      required: true,
      validation: [{ type: 'required', message: 'Email subject is required' }]
    },
    author: {
      type: 'contributors',
      label: 'Sender',
      required: true,
      validation: [{ type: 'required', message: 'Sender information is required' }]
    },
    recipient: {
      type: 'contributors',
      label: 'Recipient',
      validation: []
    },
    issued: {
      type: 'date',
      label: 'Date Sent',
      required: true,
      validation: [{ type: 'required', message: 'Date sent is required' }]
    },
    medium: {
      type: 'text',
      label: 'Format',
      defaultValue: 'Email',
      validation: []
    }
  },
  sections: {
    basic: {
      label: 'Basic Information',
      fields: ['title', 'author', 'recipient']
    },
    details: {
      label: 'Email Details',
      fields: ['issued', 'medium']
    }
  },
  order: ['basic', 'details']
};