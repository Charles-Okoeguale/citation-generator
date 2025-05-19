'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ItemNavigationProps {
  prevItem?: {
    id: string;
    label: string;
    onClick: () => void;
  };
  nextItem?: {
    id: string;
    label: string;
    onClick: () => void;
  };
}

export function ItemNavigation({ prevItem, nextItem }: ItemNavigationProps) {
  if (!prevItem && !nextItem) {
    return null;
  }

  return (
    <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 mt-8 pt-4">
      {prevItem ? (
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={prevItem.onClick}
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="text-sm">{prevItem.label}</span>
        </motion.button>
      ) : (
        <div></div>
      )}
      
      {nextItem ? (
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextItem.onClick}
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <span className="text-sm">{nextItem.label}</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </motion.button>
      ) : (
        <div></div>
      )}
    </div>
  );
} 