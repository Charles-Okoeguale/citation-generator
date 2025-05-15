import { FormConfig } from "../types";


export const bookConfig: FormConfig = {
  type: 'book',
  label: 'Book',
  description: 'Use this form for citing books, including e-books',
  fields: {
    title: {
      type: 'text',
      label: 'Book Title',
      placeholder: 'Enter the full title of the book',
      help: 'Enter the main title of the book as it appears on the title page',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'Book title is required'
        }
      ]
    },
    authors: {
      type: 'author-list',
      label: 'Authors',
      help: 'Add all authors in the order they appear on the book',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'At least one author is required'
        }
      ]
    },
    edition: {
      type: 'text',
      label: 'Edition',
      placeholder: 'e.g., 2nd edition',
      help: 'Enter the edition number if specified (leave blank for first editions)',
      required: false
    },
    publisher: {
      type: 'text',
      label: 'Publisher',
      placeholder: 'Enter the publisher name',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'Publisher is required'
        }
      ]
    },
    publisherPlace: {
      type: 'text',
      label: 'Place of Publication',
      placeholder: 'e.g., New York, NY',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'Place of publication is required'
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
    },
    isbn: {
      type: 'identifier',
      label: 'ISBN',
      placeholder: 'Enter ISBN (optional)',
      help: 'Enter the 10 or 13 digit ISBN number',
      validation: [
        {
          type: 'pattern',
          pattern: /^(?:\d{10}|\d{13})$/,
          message: 'Please enter a valid 10 or 13 digit ISBN'
        }
      ]
    }
  },
  sections: {
    basic: {
      label: 'Basic Information',
      fields: ['title', 'authors']
    },
    publication: {
      label: 'Publication Details',
      fields: ['edition', 'publisher', 'publisherPlace', 'year']
    },
    identifiers: {
      label: 'Identifiers',
      fields: ['isbn']
    }
  },
  order: ['basic', 'publication', 'identifiers']
};