// src/app/components/citation-styles/StylePreferences.tsx
'use client';

import { useStylePreferences } from '@/lib/citation/hooks/useStylePreferences';

interface StylePreferencesProps {
  onStyleSelect: (styleId: string) => void;
  styles: Record<string, { title: string; description: string }>;
}

export function StylePreferences({ onStyleSelect, styles }: StylePreferencesProps) {
  const {
    preferences,
    addToFavorites,
    removeFromFavorites,
    setDefaultStyle
  } = useStylePreferences();

  return (
    <div className="space-y-6">
      {/* Default Style Section */}
      <div className="border-b pb-4">
        <h3 className="font-medium mb-3">Default Citation Style</h3>
        {preferences.defaultStyle ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{styles[preferences.defaultStyle]?.title}</div>
              <div className="text-sm text-gray-600">
                {styles[preferences.defaultStyle]?.description}
              </div>
            </div>
            <button
              onClick={() => setDefaultStyle('')}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove Default
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            No default style set
          </div>
        )}
      </div>

      {/* Favorite Styles Section */}
      <div>
        <h3 className="font-medium mb-3">Favorite Styles</h3>
        <div className="space-y-2">
          {preferences.favoriteStyles.map((style: any) => (
            <div
              key={style.styleId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="font-medium">{styles[style.styleId]?.title}</div>
                <div className="text-sm text-gray-600">
                  Used {style.useCount} times • Last used {new Date(style.lastUsed).toLocaleDateString()}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onStyleSelect(style.styleId)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Use
                </button>
                <button
                  onClick={() => setDefaultStyle(style.styleId)}
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  Set as Default
                </button>
                <button
                  onClick={() => removeFromFavorites(style.styleId)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Styles Section */}
      <div>
        <h3 className="font-medium mb-3">Recently Used</h3>
        <div className="space-y-2">
          {preferences.recentStyles.map((styleId: any) => (
            <div
              key={styleId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="font-medium">{styles[styleId]?.title}</div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onStyleSelect(styleId)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Use
                </button>
                <button
                  onClick={() => addToFavorites(styleId)}
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  Add to Favorites
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}