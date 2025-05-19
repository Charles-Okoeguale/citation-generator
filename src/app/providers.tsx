'use client';

import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/lib/contexts/theme-context';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AnimatePresence mode="wait" initial={true}>
        {children}
      </AnimatePresence>
    </ThemeProvider>
  );
} 