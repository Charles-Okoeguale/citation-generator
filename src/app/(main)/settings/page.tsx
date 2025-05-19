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
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account and application preferences
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Customize how the application looks
          </p>
        </div>
        
        <div className="px-6 py-5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Theme</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose between light and dark mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="h-5 w-5 mr-2" />
                  Switch to Dark Mode
                </>
              ) : (
                <>
                  <Sun className="h-5 w-5 mr-2" />
                  Switch to Light Mode
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Citations</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure citation display preferences
          </p>
        </div>
        
        <div className="px-6 py-5 space-y-6">
          <div>
            <label htmlFor="citationsPerPage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Citations per page
            </label>
            <select
              id="citationsPerPage"
              value={citationsPerPage}
              onChange={(e) => setCitationsPerPage(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your account settings
          </p>
        </div>
        
        <div className="px-6 py-5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {session?.user?.email || 'User'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Signed in as {session?.user?.name || session?.user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className={`
            inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm 
            ${saving 
              ? 'bg-gray-300 text-gray-600' 
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }
          `}
        >
          <Save className="h-5 w-5 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
} 