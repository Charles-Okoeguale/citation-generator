'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <h2 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Something went wrong</h2>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            An error occurred while rendering this component.
          </p>
          <details className="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded">
            <summary className="cursor-pointer">Error details</summary>
            <p className="mt-2 font-mono whitespace-pre-wrap">
              {this.state.error?.toString()}
            </p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
} 