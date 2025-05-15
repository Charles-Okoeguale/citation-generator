'use client';

import { useState, useEffect } from 'react';
import { getFormConfig } from '@/lib/citation/form-config';

interface FormPersistenceOptions {
  storageKey?: string;
  debounceMs?: number;
}

export function useFormPersistence(sourceType: string, options: FormPersistenceOptions = {}) {
  const {
    storageKey = 'citation-form-data',
    debounceMs = 1000
  } = options;

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Load saved form data on mount and source type change
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedData = localStorage.getItem(`${storageKey}-${sourceType}`);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
        } else {
          // Initialize with empty form data based on config
          const config = getFormConfig(sourceType);
          const initialData: Record<string, any> = {};
          Object.keys(config.fields).forEach(fieldName => {
            initialData[fieldName] = config.fields[fieldName].defaultValue ?? null;
          });
          setFormData(initialData);
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
        setFormData({});
      }
    };

    loadSavedData();
  }, [sourceType, storageKey]);

  // Auto-save form data when it changes
  useEffect(() => {
    if (!isDirty) return;

    const saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(
          `${storageKey}-${sourceType}`,
          JSON.stringify(formData)
        );
        setIsDirty(false);
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    }, debounceMs);

    return () => clearTimeout(saveTimeout);
  }, [formData, sourceType, storageKey, debounceMs, isDirty]);

  // Update form data with new values
  const updateFormData = (updates: Record<string, any>) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        ...updates
      };

      // Remove null or undefined values
      Object.keys(newData).forEach(key => {
        if (newData[key] == null) {
          delete newData[key];
        }
      });

      return newData;
    });
    setIsDirty(true);
  };

  // Update a single field
  const updateField = (fieldName: string, value: any) => {
    updateFormData({ [fieldName]: value });
  };

  // Save form data immediately
  const saveForm = async () => {
    try {
      localStorage.setItem(
        `${storageKey}-${sourceType}`,
        JSON.stringify(formData)
      );
      setIsDirty(false);
      return true;
    } catch (error) {
      console.error('Error saving form:', error);
      return false;
    }
  };

  // Clear form data
  const clearForm = () => {
    try {
      localStorage.removeItem(`${storageKey}-${sourceType}`);
      const config = getFormConfig(sourceType);
      const initialData: Record<string, any> = {};
      Object.keys(config.fields).forEach(fieldName => {
        initialData[fieldName] = config.fields[fieldName].defaultValue ?? null;
      });
      setFormData(initialData);
      setIsDirty(false);
      return true;
    } catch (error) {
      console.error('Error clearing form:', error);
      return false;
    }
  };

  // Check if form is complete (all required fields filled)
  const isFormComplete = () => {
    try {
      const config = getFormConfig(sourceType);
      return Object.entries(config.fields).every(([fieldName, fieldConfig]) => {
        if (!fieldConfig.required) return true;
        const value = formData[fieldName];
        if (value == null) return false;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value.trim().length > 0;
        return true;
      });
    } catch (error) {
      console.error('Error checking form completion:', error);
      return false;
    }
  };

  return {
    formData,
    updateFormData,
    updateField,
    saveForm,
    clearForm,
    isFormComplete,
    isDirty
  };
}

// Example usage with user accounts
export function useAuthenticatedFormPersistence(
  sourceType: string,
  userId?: string,
  options: FormPersistenceOptions = {}
) {
  const {
    formData,
    updateFormData,
    updateField,
    saveForm: localSaveForm,
    clearForm: localClearForm,
    isFormComplete,
    isDirty
  } = useFormPersistence(sourceType, options);

  // Save to both local storage and server
  const saveForm = async () => {
    const localSaved = await localSaveForm();
    
    if (userId && localSaved) {
      try {
        // Save to server (implement your API call here)
        await fetch('/api/citations/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            sourceType,
            formData
          }),
        });
        return true;
      } catch (error) {
        console.error('Error saving to server:', error);
        return false;
      }
    }

    return localSaved;
  };

  // Clear from both local storage and server
  const clearForm = async () => {
    const localCleared = localClearForm();

    if (userId && localCleared) {
      try {
        // Clear from server (implement your API call here)
        await fetch('/api/citations/clear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            sourceType
          }),
        });
        return true;
      } catch (error) {
        console.error('Error clearing from server:', error);
        return false;
      }
    }

    return localCleared;
  };

  return {
    formData,
    updateFormData,
    updateField,
    saveForm,
    clearForm,
    isFormComplete,
    isDirty
  };
}