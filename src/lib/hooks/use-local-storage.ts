'use client';

import { useState, useEffect, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Create a ref for the initial value to avoid dependencies on objects/arrays
  const initialValueRef = useRef<T>(initialValue);
  
  // State to store our value
  // Initialize state lazily to avoid unnecessary operations on server
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });
  
  // Use a ref to track if this is first client-side render
  const isFirstMount = useRef(true);

  // Set up localStorage sync effect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Skip initial synchronization if we already loaded from localStorage
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    
    // Save to localStorage whenever storedValue changes
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  // Return a wrapped version of useState's setter function
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function
      const valueToStore = 
        value instanceof Function 
          ? value(storedValue) 
          : value;
      
      // Save state
      setStoredValue(valueToStore);
    } catch (error) {
      console.error('Error in localStorage setter:', error);
    }
  };

  return [storedValue, setValue];
}