import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { ExportFormat, UserExportPreferences } from '../types';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';

const MAX_RECENT_FORMATS = 3;

export function useExportPreferences() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);
  
  // Local storage as fallback and for immediate access
  const [preferences, setLocalPreferencesState] = useLocalStorage<UserExportPreferences>(
    'user-export-preferences',
    {
      defaultExportFormat: 'pdf',
      includeInText: true,
      recentExportFormats: []
    }
  );
  
  // Fetch user preferences from the server when logged in - only once
  useEffect(() => {
    // Only fetch if logged in and we haven't fetched yet
    if (session?.user && !fetchedRef.current) {
      fetchedRef.current = true;
      setLoading(true);
      
      fetch('/api/user/export-preferences')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch export preferences');
          return res.json();
        })
        .then(data => {
          if (data && Object.keys(data).length > 0) {
            setLocalPreferencesState(data);
          }
        })
        .catch(err => {
          console.error('Error fetching export preferences:', err);
          setError('Failed to load export preferences');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  // Stable dependency - only the presence of the session matters, not its contents
  }, [session?.user?.email, setLocalPreferencesState]);
  
  // Sync changes to server with error handling
  const syncToServer = useCallback(async (updatedPreferences: UserExportPreferences) => {
    if (!session?.user) return;
    
    try {
      const res = await fetch('/api/user/export-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPreferences)
      });
      
      if (!res.ok) {
        throw new Error('Failed to sync export preferences');
      }
    } catch (err) {
      console.error('Error syncing export preferences:', err);
      // Don't break the user experience on sync error
    }
  }, [session?.user]);
  
  const setDefaultExportFormat = useCallback((format: ExportFormat) => {
    setLocalPreferencesState(prev => {
      const updatedPreferences = {
        ...prev,
        defaultExportFormat: format
      };
      
      // Sync to server if logged in
      syncToServer(updatedPreferences);
      
      return updatedPreferences;
    });
  }, [setLocalPreferencesState, syncToServer]);
  
  const setIncludeInText = useCallback((include: boolean) => {
    setLocalPreferencesState(prev => {
      const updatedPreferences = {
        ...prev,
        includeInText: include
      };
      
      // Sync to server if logged in
      syncToServer(updatedPreferences);
      
      return updatedPreferences;
    });
  }, [setLocalPreferencesState, syncToServer]);
  
  const updateFormatUsage = useCallback((format: ExportFormat) => {
    setLocalPreferencesState(prev => {
      // Update recent formats
      const newRecent = [
        format,
        ...prev.recentExportFormats.filter(f => f !== format)
      ].slice(0, MAX_RECENT_FORMATS);
      
      const updatedPreferences = {
        ...prev,
        recentExportFormats: newRecent
      };
      
      // Sync to server if logged in
      syncToServer(updatedPreferences);
      
      return updatedPreferences;
    });
  }, [setLocalPreferencesState, syncToServer]);
  
  return {
    preferences,
    setDefaultExportFormat,
    setIncludeInText,
    updateFormatUsage,
    loading,
    error
  };
} 