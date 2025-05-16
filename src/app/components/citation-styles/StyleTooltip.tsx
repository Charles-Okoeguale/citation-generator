'use client';

import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: {
    title: string;
    description: string;
    examples?: string[];
  };
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function StyleTooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block" ref={triggerRef}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex items-center cursor-help"
      >
        {children}
        <span className="ml-1 text-gray-400 text-sm">ⓘ</span>
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-72 bg-white border rounded-lg shadow-lg p-4 
            ${positionClasses[position]}`}
        >
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">{content.title}</h4>
            <p className="text-sm text-gray-600">{content.description}</p>
            {content.examples && (
              <div className="mt-2">
                <h5 className="text-xs font-medium text-gray-700">Examples:</h5>
                <ul className="mt-1 space-y-1">
                  {content.examples.map((example, index) => (
                    <li key={index} className="text-xs text-gray-600 italic">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}