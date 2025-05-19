import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { UserStylePreferences } from '../types';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';

const MAX_RECENT_STYLES = 5;
const MAX_FAVORITE_STYLES = 10;

export function useStylePreferences() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);
  
  // Local storage as fallback and for immediate access
  const [preferences, setLocalPreferencesState] = useLocalStorage<UserStylePreferences>(
    'user-style-preferences',
    {
      favoriteStyles: [],
      recentStyles: []
    }
  );
  
  // Fetch user preferences from the server when logged in
  useEffect(() => {
    if (session?.user && !fetchedRef.current) {
      fetchedRef.current = true;
      setLoading(true);
      
      fetch('/api/user/preferences')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch preferences');
          return res.json();
        })
        .then(data => {
          setLocalPreferencesState(data);
        })
        .catch(err => {
          console.error('Error fetching preferences:', err);
          setError('Failed to load preferences');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session, setLocalPreferencesState]);
  
  // Sync changes to server with error handling
  const syncToServer = useCallback(async (updatedPreferences: UserStylePreferences) => {
    if (!session?.user) return;
    
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPreferences)
      });
      
      if (!res.ok) {
        throw new Error('Failed to sync preferences');
      }
    } catch (err) {
      console.error('Error syncing preferences:', err);
      // Don't break the user experience on sync error
    }
  }, [session]);
  
  const addToFavorites = useCallback((styleId: string) => {
    setLocalPreferencesState(prev => {
      const existing = prev.favoriteStyles.find(s => s.styleId === styleId);
      if (existing) return prev;
      
      const newFavorites = [
        {
          styleId,
          lastUsed: new Date(),
          useCount: 1
        },
        ...prev.favoriteStyles
      ].slice(0, MAX_FAVORITE_STYLES);
      
      const updatedPreferences = {
        ...prev,
        favoriteStyles: newFavorites
      };
      
      // Sync to server if logged in
      syncToServer(updatedPreferences);
      
      return updatedPreferences;
    });
  }, [setLocalPreferencesState, syncToServer]);
  
  const removeFromFavorites = useCallback((styleId: string) => {
    setLocalPreferencesState(prev => {
      const updatedPreferences = {
        ...prev,
        favoriteStyles: prev.favoriteStyles.filter(s => s.styleId !== styleId)
      };
      
      // Sync to server if logged in
      syncToServer(updatedPreferences);
      
      return updatedPreferences;
    });
  }, [setLocalPreferencesState, syncToServer]);
  
  const updateStyleUsage = useCallback((styleId: string) => {
    setLocalPreferencesState(prev => {
      // Update favorites if style is favorited
      const updatedFavorites = prev.favoriteStyles.map(style =>
        style.styleId === styleId
          ? {
              ...style,
              lastUsed: new Date(),
              useCount: style.useCount + 1
            }
          : style
      );
      
      // Update recent styles
      const newRecent = [
        styleId,
        ...prev.recentStyles.filter(id => id !== styleId)
      ].slice(0, MAX_RECENT_STYLES);
      
      const updatedPreferences = {
        ...prev,
        favoriteStyles: updatedFavorites,
        recentStyles: newRecent
      };
      
      // Sync to server if logged in
      syncToServer(updatedPreferences);
      
      return updatedPreferences;
    });
  }, [setLocalPreferencesState, syncToServer]);
  
  const setDefaultStyle = useCallback((styleId: string) => {
    setLocalPreferencesState(prev => {
      const updatedPreferences = {
        ...prev,
        defaultStyle: styleId
      };
      
      // Sync to server if logged in
      syncToServer(updatedPreferences);
      
      return updatedPreferences;
    });
  }, [setLocalPreferencesState, syncToServer]);
  
  return {
    preferences,
    addToFavorites,
    removeFromFavorites,
    updateStyleUsage,
    setDefaultStyle,
    loading,
    error
  };
}