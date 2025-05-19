'use client';

import { useTheme } from '@/lib/contexts/theme-context';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3, type: 'spring' }}
        className="relative w-6 h-6"
      >
        {theme === 'light' ? (
          <Sun className="w-6 h-6 text-gray-700" />
        ) : (
          <Moon className="w-6 h-6 text-gray-300" />
        )}
      </motion.div>
    </button>
  );
} 