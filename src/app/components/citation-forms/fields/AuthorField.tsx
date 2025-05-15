'use client';

import { useState } from 'react';
import type { Author } from '@/lib/citation/types';

interface AuthorFieldProps {
  value: Author[];
  onChange: (authors: Author[]) => void;
  required?: boolean;
}

export function AuthorField({ value = [], onChange, required }: AuthorFieldProps) {
  const [newAuthor, setNewAuthor] = useState<Author>({ given: '', family: '' });

  const addAuthor = () => {
    if (newAuthor.given.trim() || newAuthor.family.trim()) {
      onChange([...value, newAuthor]);
      setNewAuthor({ given: '', family: '' });
    }
  };

  const removeAuthor = (index: number) => {
    const newAuthors = value.filter((_, i) => i !== index);
    onChange(newAuthors);
  };

  const updateAuthor = (index: number, field: keyof Author, fieldValue: string) => {
    const newAuthors = value.map((author, i) => 
      i === index ? { ...author, [field]: fieldValue } : author
    );
    onChange(newAuthors);
  };

  return (
    <div className="space-y-4">
      {/* Existing Authors */}
      {value.map((author, index) => (
        <div key={index} className="flex gap-4 items-start">
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={author.given}
              onChange={(e) => updateAuthor(index, 'given', e.target.value)}
              placeholder="Given name"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              value={author.family}
              onChange={(e) => updateAuthor(index, 'family', e.target.value)}
              placeholder="Family name"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <button
            type="button"
            onClick={() => removeAuthor(index)}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      ))}

      {/* New Author Form */}
      <div className="flex gap-4 items-start border-t pt-4">
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={newAuthor.given}
            onChange={(e) => setNewAuthor({ ...newAuthor, given: e.target.value })}
            placeholder="Given name"
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            value={newAuthor.family}
            onChange={(e) => setNewAuthor({ ...newAuthor, family: e.target.value })}
            placeholder="Family name"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="button"
          onClick={addAuthor}
          className="text-blue-500 hover:text-blue-700"
        >
          Add Author
        </button>
      </div>

      {required && value.length === 0 && (
        <p className="text-red-500 text-sm">At least one author is required</p>
      )}
    </div>
  );
}