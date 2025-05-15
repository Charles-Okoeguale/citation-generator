import { FormConfig } from "../types";


export const websiteConfig: FormConfig = {
  type: 'webpage',
  label: 'Website',
  description: 'Use this form for citing web pages and online articles',
  fields: {
    title: {
      type: 'text',
      label: 'Page Title',
      placeholder: 'Enter the title of the web page',
      help: 'Enter the title as it appears on the web page',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'Page title is required'
        }
      ]
    },
    authors: {
      type: 'author-list',
      label: 'Authors',
      help: 'Add authors if available (can be organization name)',
      required: false
    },
    website: {
      type: 'text',
      label: 'Website Name',
      placeholder: 'Enter the name of the website',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'Website name is required'
        }
      ]
    },
    url: {
      type: 'url',
      label: 'URL',
      placeholder: 'https://...',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'URL is required'
        },
        {
          type: 'pattern',
          pattern: /^https?:\/\/.+/,
          message: 'Please enter a valid URL'
        }
      ]
    },
    datePublished: {
      type: 'date',
      label: 'Publication Date',
      required: false
    },
    dateAccessed: {
      type: 'date',
      label: 'Access Date',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'Access date is required'
        }
      ]
    }
  },
  sections: {
    basic: {
      label: 'Basic Information',
      fields: ['title', 'authors', 'website']
    },
    location: {
      label: 'Location',
      fields: ['url']
    },
    dates: {
      label: 'Dates',
      fields: ['datePublished', 'dateAccessed']
    }
  },
  order: ['basic', 'location', 'dates']
};