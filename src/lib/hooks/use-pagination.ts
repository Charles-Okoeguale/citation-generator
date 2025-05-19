'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './use-local-storage';
import { useSession } from 'next-auth/react';

export interface PaginationOptions {
  defaultItemsPerPage?: number;
  defaultPage?: number;
}

export function usePagination<T>(
  items: T[],
  options: PaginationOptions = {}
) {
  const { defaultItemsPerPage = 10, defaultPage = 1 } = options;
  
  // Get the user session to check if user is logged in
  const { data: session, status } = useSession();
  
  // Use local storage to get the user's citationsPerPage preference
  const [localCitationsPerPage, setLocalCitationsPerPage] = useLocalStorage<number>('citationsPerPage', defaultItemsPerPage);
  
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [itemsPerPage, setItemsPerPage] = useState(localCitationsPerPage);
  const [loading, setLoading] = useState(false);
  
  // Use a ref to track if we've already fetched preferences to prevent infinite loops
  const prefsFetchedRef = useRef(false);

  // When localCitationsPerPage changes, update itemsPerPage
  useEffect(() => {
    setItemsPerPage(localCitationsPerPage);
  }, [localCitationsPerPage]);

  // Fetch user preferences from API when logged in - once per component lifecycle
  useEffect(() => {
    async function fetchUserPreferences() {
      // Only fetch if authenticated and we haven't fetched before
      if (status === 'authenticated' && session?.user && !prefsFetchedRef.current) {
        try {
          prefsFetchedRef.current = true;
          setLoading(true);
          const response = await fetch('/api/user/preferences');
          
          if (response.ok) {
            const data = await response.json();
            
            if (data && typeof data.citationsPerPage === 'number') {
              // Update local storage via the hook setter - not directly
              setLocalCitationsPerPage(data.citationsPerPage);
              // No need to call setItemsPerPage here as the useEffect above will handle it
            }
          }
        } catch (error) {
          console.error('Error fetching user preferences:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchUserPreferences();
    // Only depend on session and status for this effect
  }, [session, status, setLocalCitationsPerPage]);
  
  // Reset to page 1 when items length or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length, itemsPerPage]);
  
  // Recalculate when itemsPerPage changes
  useEffect(() => {
    // Make sure the current page is still valid with the new itemsPerPage
    const maxPage = Math.max(1, Math.ceil(items.length / itemsPerPage));
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [itemsPerPage, items.length, currentPage]);

  // Calculate pagination values
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Ensure current page is within bounds
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  
  // Get the current page of items
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = items.slice(startIndex, endIndex);

  // Navigation helpers - memoized to prevent recreation on each render
  const goToPage = useCallback((page: number) => {
    const targetPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(targetPage);
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);
  
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);
  
  // Update page size and save to user preferences if logged in
  const setPageSize = useCallback(async (size: number) => {
    // Update local storage through the hook instead of directly
    setLocalCitationsPerPage(size);
    
    // Update server-side preferences if user is logged in
    if (status === 'authenticated' && session?.user) {
      try {
        const response = await fetch('/api/user/preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            citationsPerPage: size
          })
        });
        
        if (!response.ok) {
          console.error('Failed to update user preferences');
        }
      } catch (error) {
        console.error('Error updating page size preference:', error);
      }
    }
    // Properly include all dependencies
  }, [session, status, setLocalCitationsPerPage]);

  return {
    // Current state
    currentPage: validCurrentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    currentItems,
    loading,
    
    // Actions
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    
    // Helper flags
    isFirstPage: validCurrentPage === 1,
    isLastPage: validCurrentPage === totalPages,
    hasPreviousPage: validCurrentPage > 1,
    hasNextPage: validCurrentPage < totalPages,
    
    // Helpers for rendering
    pageNumbers: Array.from({ length: totalPages }, (_, i) => i + 1),
  };
} 