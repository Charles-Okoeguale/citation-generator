'use client';

import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/lib/contexts/theme-context';
import { Toaster } from 'react-hot-toast';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AnimatePresence mode="wait" initial={true}>
        {children}
      </AnimatePresence>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'var(--toast-bg, #fff)',
            color: 'var(--toast-color, #000)',
            border: '1px solid var(--toast-border, #e2e8f0)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '1rem',
            borderRadius: '0.5rem',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#ECFDF5',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FEF2F2',
            },
          },
        }}
      />
    </ThemeProvider>
  );
} 