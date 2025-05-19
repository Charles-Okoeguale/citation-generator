'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sun, Moon, LogOut, Save } from 'lucide-react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { useTheme } from '@/lib/contexts/theme-context';
import { useExportPreferences } from '@/lib/citation/hooks/useExportPreferences';
import type { ExportFormat } from '@/lib/citation/types';

interface UserSettings {
  defaultStyle: string;
  theme: 'light' | 'dark';
  citationsPerPage: number;
  favoriteStyles: any[];
  recentStyles: string[];
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { theme, setTheme, toggleTheme } = useTheme();
  const [citationsPerPage, setCitationsPerPage] = useLocalStorage<number>('citationsPerPage', 10);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const { preferences: exportPreferences, setDefaultExportFormat, setIncludeInText } = useExportPreferences();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch user settings
  useEffect(() => {
    if (status === 'authenticated') {
      fetchSettings();
    }
  }, [status]);

  async function fetchSettings() {
    try {
      setLoading(true);
      const response = await fetch('/api/user/preferences');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      setSettings(data);
      
      // Update theme from server if available
      if (data.theme) {
        setTheme(data.theme);
      }
      
      // Use the hook setter to update citationsPerPage
      // This will also update localStorage automatically
      if (data && typeof data.citationsPerPage === 'number') {
        setCitationsPerPage(data.citationsPerPage);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load settings'
      });
    } finally {
      setLoading(false);
    }
  }

  const saveSettings = useCallback(async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          theme,
          citationsPerPage
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      
      setMessage({
        type: 'success',
        text: 'Settings saved successfully'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save settings'
      });
    } finally {
      setSaving(false);
    }
  }, [theme, citationsPerPage]);
  
  // Handle logout
  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: '/login' });
  }, []);

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h1>
      
      <div className="space-y-6">
        {/* Existing settings sections ... */}
        
        {/* Citation Style Preferences */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Citation Style Preferences</h2>
          {/* ... existing settings ... */}
        </div>
        
        {/* Export Format Preferences */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Export Format Preferences</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Export Format
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'pdf', label: 'PDF', icon: '📄' },
                  { id: 'word', label: 'Word', icon: '📝' },
                  { id: 'bibtex', label: 'BibTeX', icon: '📚' },
                  { id: 'ris', label: 'RIS', icon: '📋' },
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setDefaultExportFormat(format.id as ExportFormat)}
                    className={`
                      flex items-center justify-center py-2 px-3 rounded-md border transition-colors
                      ${exportPreferences.defaultExportFormat === format.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-300'
                      }
                    `}
                  >
                    <span className="mr-1">{format.icon}</span>
                    <span>{format.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="include-intext-setting"
                checked={exportPreferences.includeInText}
                onChange={(e) => setIncludeInText(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="include-intext-setting" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Include in-text citations in exports by default
              </label>
            </div>
            
            {exportPreferences.recentExportFormats.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recently Used Formats</h3>
                <div className="flex flex-wrap gap-2">
                  {exportPreferences.recentExportFormats.map((format) => (
                    <div 
                      key={format} 
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded dark:bg-gray-700 dark:text-gray-300"
                    >
                      {format.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Appearance</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`
                flex items-center space-x-2 p-4 rounded-md border transition-colors
                ${theme === 'light' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-300' 
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-300'
                }
              `}
            >
              <Sun size={20} />
              <span>Light Mode</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`
                flex items-center space-x-2 p-4 rounded-md border transition-colors
                ${theme === 'dark' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-300' 
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-300'
                }
              `}
            >
              <Moon size={20} />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>
        
        {/* Account */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account</h2>
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
          >
            <LogOut size={20} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
} 