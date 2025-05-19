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
      <div className="border-b dark:border-gray-700 pb-4">
        <h3 className="font-medium mb-3 text-gray-900 dark:text-white">Default Citation Style</h3>
        {preferences.defaultStyle ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="font-light text-sm text-gray-800 dark:text-gray-200">{preferences.defaultStyle}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {styles[preferences.defaultStyle]?.description}
              </div>
            </div>
            <button
              onClick={() => setDefaultStyle('')}
              className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 text-sm"
            >
              Remove Default
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No default style set
          </div>
        )}
      </div>

      {/* Favorite Styles Section */}
      <div>
        <h3 className="font-medium mb-3 text-gray-900 dark:text-white">Favorite Styles</h3>
        {preferences.favoriteStyles.length > 0 ? (
          <div className="space-y-2">
            {preferences.favoriteStyles.map((style: any) => (
              <div
                key={style.styleId}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <div className="font-light text-sm text-gray-800 dark:text-gray-200">{style.styleId}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Used {style.useCount} times • Last used {new Date(style.lastUsed).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onStyleSelect(style.styleId)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                  >
                    Use
                  </button>
                  <button
                    onClick={() => setDefaultStyle(style.styleId)}
                    className="text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400 text-sm"
                  >
                    Set as Default
                  </button>
                  <button
                    onClick={() => removeFromFavorites(style.styleId)}
                    className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            No favorite styles yet. Add styles to your favorites for quick access.
          </div>
        )}
      </div>

      {/* Recent Styles Section */}
      <div>
        <h3 className="font-medium mb-3 text-gray-900 dark:text-white">Recently Used</h3>
        {preferences.recentStyles.length > 0 ? (
          <div className="space-y-2">
            {preferences.recentStyles.map((styleId: any) => (
              <div
                key={styleId}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="font-light text-sm text-gray-800 dark:text-gray-200">{styleId}</div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onStyleSelect(styleId)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                  >
                    Use
                  </button>
                  <button
                    onClick={() => addToFavorites(styleId)}
                    className="text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400 text-sm"
                  >
                    Add to Favorites
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            No recently used styles. Start using citation styles to see them here.
          </div>
        )}
      </div>
    </div>
  );
}