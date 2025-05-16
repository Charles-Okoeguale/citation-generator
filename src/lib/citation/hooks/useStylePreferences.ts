// src/lib/hooks/useStylePreferences.ts
import { useState, useEffect } from 'react';
import { UserStylePreferences } from '../types';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';

const MAX_RECENT_STYLES = 5;
const MAX_FAVORITE_STYLES = 10;

export function useStylePreferences() {
  const [preferences, setPreferences] = useLocalStorage<UserStylePreferences>(
    'user-style-preferences',
    {
      favoriteStyles: [],
      recentStyles: []
    }
  );
  const addToFavorites = (styleId: string) => {
    setPreferences((prev: UserStylePreferences) => {
      const existing = prev.favoriteStyles.find((s: { styleId: string; }) => s.styleId === styleId);
      if (existing) {
        return prev;
      }

      const newFavorites = [
        {
          styleId,
          lastUsed: new Date(),
          useCount: 1
        },
        ...prev.favoriteStyles
      ].slice(0, MAX_FAVORITE_STYLES);

      return {
        ...prev,
        favoriteStyles: newFavorites
      };
    });
  };
  const removeFromFavorites = (styleId: string) => {
    setPreferences((prev: UserStylePreferences) => ({
      ...prev,
      favoriteStyles: prev.favoriteStyles.filter((s: { styleId: string; }) => s.styleId !== styleId)
    }));
  };

  const updateStyleUsage = (styleId: string) => {
    setPreferences((prev: any) => {
      // Update favorites if style is favorited
      const updatedFavorites = prev.favoriteStyles.map((style: { styleId: string; useCount: number; }) =>
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
        ...prev.recentStyles.filter((id: string) => id !== styleId)
      ].slice(0, MAX_RECENT_STYLES);

      return {
        ...prev,
        favoriteStyles: updatedFavorites,
        recentStyles: newRecent
      };
    });
  };

  const setDefaultStyle = (styleId: string) => {
    setPreferences((prev: any) => ({
      ...prev,
      defaultStyle: styleId
    }));
  };

  return {
    preferences,
    addToFavorites,
    removeFromFavorites,
    updateStyleUsage,
    setDefaultStyle
  };
}