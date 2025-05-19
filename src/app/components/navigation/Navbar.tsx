'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, BookOpen, Settings, Menu, X, ChevronLeft, Sun, Moon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useTheme } from '@/lib/contexts/theme-context';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState<string | null>(null);
  const [showBackButton, setShowBackButton] = useState(false);
  const { toggleTheme, theme } = useTheme();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/new-citation', label: 'New Citation', icon: FileText },
    { href: '/citation-styles', label: 'Citation Styles', icon: BookOpen },
  ];

  // Track pathname changes to determine if back button should be shown
  useEffect(() => {
    if (prevPathname) {
      // Show back button if we've navigated deeper (e.g., from list to detail)
      const prevParts = prevPathname.split('/').filter(Boolean);
      const currentParts = pathname.split('/').filter(Boolean);
      
      if (currentParts.length > prevParts.length && 
          currentParts[0] === prevParts[0]) {
        setShowBackButton(true);
      } else {
        setShowBackButton(false);
      }
    }
    
    setPrevPathname(pathname);
  }, [pathname, prevPathname]);

  function isActive(path: string) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  function handleGoBack() {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }

  return (
    <header className="bg-white shadow dark:bg-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {showBackButton && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-shrink-0 flex items-center mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleGoBack}
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            )}
            
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">
                Citation Generator
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {links.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <Icon className="mr-1.5 h-5 w-5" />
                    {link.label}
                    
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-md bg-brand-light/10 dark:bg-brand/30 -z-10"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand dark:bg-brand-light"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="sm:hidden bg-white dark:bg-gray-800 overflow-hidden"
      >
        <div className="space-y-1 px-4 pb-3 pt-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative block rounded-md px-3 py-2 text-base font-medium flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {link.label}
                
                {active && (
                  <motion.div
                    layoutId="activeMobileTab"
                    className="absolute inset-0 rounded-md bg-brand-light/10 dark:bg-brand/30 -z-10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/settings"
            className="relative block rounded-md px-3 py-2 text-base font-medium flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
            
            {isActive('/settings') && (
              <motion.div
                layoutId="activeMobileTab"
                className="absolute inset-0 rounded-md bg-brand-light/10 dark:bg-brand/30 -z-10"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </Link>
          
          <button
            className="relative block w-full rounded-md px-3 py-2 text-base font-medium flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={() => { setIsOpen(false); toggleTheme(); }}
          >
            <span className="mr-3 h-5 w-5 flex items-center justify-center">
              {/* Simplified icon for the mobile menu */}
              {theme === 'light' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </span>
            Toggle Theme
          </button>
        </div>
      </motion.div>
    </header>
  );
} 