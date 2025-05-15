'use client';

import { useState } from 'react';
import { FieldConfig } from '@/lib/citation/form-config';

interface ContainerFieldProps {
  value: string;
  onChange: (value: string) => void;
  config: FieldConfig;
}

export function ContainerField({ value, onChange, config }: ContainerFieldProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (newValue.length >= 3) {
      setIsLoading(true);
      try {
        // Here you would typically fetch suggestions from an API
        // For now, we'll just simulate it
        const results = await simulateContainerSearch(newValue);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="relative space-y-2">
      <input
        type="text"
        value={value || ''}
        onChange={handleChange}
        placeholder={config.placeholder}
        className="w-full px-3 py-2 border rounded-md"
        required={config.required}
      />
      
      {isLoading && (
        <div className="absolute right-2 top-2">
          <span className="loading">...</span>
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Simulate container search (replace with actual API call)
async function simulateContainerSearch(query: string): Promise<string[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock data - replace with actual journal/publication database
  const mockData = [
    'Nature',
    'Science',
    'Cell',
    'PLOS ONE',
    'IEEE Transactions'
  ];
  
  return mockData.filter(item => 
    item.toLowerCase().includes(query.toLowerCase())
  );
}