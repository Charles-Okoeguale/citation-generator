'use client';

import { useState, useEffect } from 'react';

interface DateFieldProps {
  value: string | null;
  onChange: (date: string | null) => void;
  required?: boolean;
}

export function DateField({ value, onChange, required }: DateFieldProps) {
  // Add client-side only rendering for date fields
  const [isClient, setIsClient] = useState(false);
  
  // Always initialize with an empty string, never undefined
  const [inputValue, setInputValue] = useState('');
  
  // Month names without date objects to ensure consistency
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Initialize years array with empty array to avoid hydration mismatch
  const [years, setYears] = useState<number[]>([]);
  
  // Set isClient flag after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Set up years array after component mounts
  useEffect(() => {
    if (isClient) {
      const currentYear = new Date().getFullYear();
      setYears(Array.from({ length: 101 }, (_, i) => currentYear - i));
    }
  }, [isClient]);
  
  // Update the input value when the prop changes or client mounts
  useEffect(() => {
    // Ensure value is always a string, never null or undefined
    setInputValue(value || '');
  }, [value]);
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setInputValue(date); // Update local state first
    onChange(date || null); // Then propagate to parent
  };

  const handleMonthYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isClient) return; // Skip server-side processing
    
    const { name, value: selectedValue } = e.target;
    
    // Create a safe date object - start with current date if value is empty
    let currentDate;
    try {
      currentDate = value ? new Date(value) : new Date();
      // Handle invalid dates by falling back to current date
      if (isNaN(currentDate.getTime())) {
        currentDate = new Date();
      }
    } catch (e) {
      currentDate = new Date();
    }
    
    if (name === 'month' && selectedValue !== '') {
      currentDate.setMonth(parseInt(selectedValue));
    } else if (name === 'year' && selectedValue !== '') {
      currentDate.setFullYear(parseInt(selectedValue));
    }
    
    // Only update if we have valid selections
    if (selectedValue !== '') {
      const newDateString = currentDate.toISOString().split('T')[0];
      setInputValue(newDateString); // Update local state
      onChange(newDateString); // Propagate to parent
    }
  };
  
  // Safe parsing of date values
  const getMonthValue = () => {
    if (!value) return '';
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? '' : date.getMonth().toString();
    } catch (e) {
      return '';
    }
  };

  const getYearValue = () => {
    if (!value) return '';
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? '' : date.getFullYear().toString();
    } catch (e) {
      return '';
    }
  };

  // For server rendering, return a simplified version that matches client structure
  if (!isClient) {
    return (
      <div className="space-y-2" suppressHydrationWarning>
        <div className="flex gap-4">
          <select className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white">
            <option>Select Month</option>
          </select>
          <select className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white">
            <option>Select Year</option>
          </select>
        </div>
        <input
          type="date"
          defaultValue="" 
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          required={required}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2" suppressHydrationWarning>
      <div className="flex gap-4">
        <select
          name="month"
          onChange={handleMonthYearChange}
          value={getMonthValue()}
          className="flex-1 px-3 py-2 border rounded-md focus:border-[rgb(200,75,110)] focus:ring-[rgb(200,75,110)] dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="">Select Month</option>
          {monthNames.map((month, i) => (
            <option key={i} value={i}>
              {month}
            </option>
          ))}
        </select>

        <select
          name="year"
          onChange={handleMonthYearChange}
          value={getYearValue()}
          className="flex-1 px-3 py-2 border rounded-md focus:border-[rgb(200,75,110)] focus:ring-[rgb(200,75,110)] dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="">Select Year</option>
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <input
        type="date"
        value={inputValue}
        onChange={handleDateChange}
        className="w-full px-3 py-2 border rounded-md focus:border-[rgb(200,75,110)] focus:ring-[rgb(200,75,110)] dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        required={required}
      />
    </div>
  );
}