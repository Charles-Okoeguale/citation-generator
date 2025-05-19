'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sun, Moon, LogOut, Save } from 'lucide-react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { useTheme } from '@/lib/contexts/theme-context';

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
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[rgb(200,75,110)] border-r-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h1>
      
      <div className="space-y-6">
        {/* Citation Style Preferences */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Citation Style Preferences</h2>
          {/* ... existing settings ... */}
        </div>
        
        {/* Display Preferences */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Display Preferences</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="citationsPerPage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Citations Per Page
              </label>
              <select
                id="citationsPerPage"
                value={citationsPerPage}
                onChange={(e) => setCitationsPerPage(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(200,75,110)] focus:ring-[rgb(200,75,110)] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {[5, 10, 15, 20, 25, 50].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Number of citations to display per page in the dashboard.
              </p>
            </div>
          </div>
        </div>
        
        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Appearance</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`
                flex items-center space-x-2 p-4 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(200,75,110)] focus:ring-opacity-50
                ${theme === 'light' 
                  ? 'border-[rgb(200,75,110)] bg-[rgba(200,75,110,0.1)] text-[rgb(200,75,110)] dark:border-[rgb(200,75,110)] dark:bg-[rgba(200,75,110,0.1)] dark:text-[rgb(220,120,150)]' 
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
                flex items-center space-x-2 p-4 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(200,75,110)] focus:ring-opacity-50
                ${theme === 'dark' 
                  ? 'border-[rgb(200,75,110)] bg-[rgba(200,75,110,0.1)] text-[rgb(200,75,110)] dark:border-[rgb(200,75,110)] dark:bg-[rgba(200,75,110,0.15)] dark:text-[rgb(220,120,150)]' 
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
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-4 py-2 bg-[rgb(200,75,110)] text-white rounded-md hover:bg-[rgb(180,65,100)] focus:outline-none focus:ring-2 focus:ring-[rgb(200,75,110)] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
        
        {/* Message */}
        {message && (
          <div className={`px-4 py-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300'}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
} 