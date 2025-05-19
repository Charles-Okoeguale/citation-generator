'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

// Map of path segments to readable names
const pathNameMap: Record<string, string> = {
  'dashboard': 'Dashboard',
  'new-citation': 'New Citation',
  'citation-styles': 'Citation Styles',
  'settings': 'Settings',
  'citations': 'Citations'
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const [crumbs, setCrumbs] = useState<Array<{ name: string; href: string; id: string }>>([]);

  useEffect(() => {
    if (!pathname) return;

    // Build breadcrumb trail
    const pathSegments = pathname.split('/').filter(Boolean);
    
    const breadcrumbs = pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const name = pathNameMap[segment] || segment;
      
      // Create a unique ID for each crumb combining index and href
      const id = `crumb-${index}-${href}`;
      
      return { name, href, id };
    });
    
    // Check if we already have /dashboard in the path
    const hasDashboard = breadcrumbs.some(crumb => crumb.href === '/dashboard');
    
    // Only include home if we don't already have dashboard
    const homeCrumb = { 
      name: 'Home', 
      href: '/dashboard', 
      id: 'crumb-home' 
    };
    
    // Set crumbs with or without home based on if dashboard is already in the path
    setCrumbs(hasDashboard ? breadcrumbs : [homeCrumb, ...breadcrumbs]);
  }, [pathname]);

  // Skip rendering if we're on the dashboard (home) page
  if (pathname === '/dashboard' || crumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 flex-wrap">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          
          return (
            <motion.li 
              key={crumb.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="inline-flex items-center"
            >
              {index > 0 && (
                <ChevronRight className="mx-1 h-4 w-4 text-gray-400" aria-hidden="true" />
              )}
              
              {index === 0 && (
                <Home className="mr-1 h-4 w-4 text-gray-500" aria-hidden="true" />
              )}
              
              {isLast ? (
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {crumb.name}
                </Link>
              )}
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
} 