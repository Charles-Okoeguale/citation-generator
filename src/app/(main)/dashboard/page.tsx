"use client"

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePagination } from '@/lib/hooks/use-pagination';
import { Pagination } from '@/app/components/ui/Pagination';
import { toast } from 'react-hot-toast';

// Define the Citation type
interface Citation {
  id: string;
  title: string;
  style: string;
  createdAt: string;
  userId: string;
  [key: string]: any; // For any additional properties
}

// Client component version of the dashboard page
export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [savedCitations, setSavedCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);

  // Use our pagination hook with the citations
  const pagination = usePagination(savedCitations, {
    defaultItemsPerPage: 10,
    defaultPage: 1
  });

  useEffect(() => {
    // Check authentication
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Fetch data if authenticated
    if (status === 'authenticated' && session?.user) {
      fetchCitations();
    }
  }, [status, session, router]);

  async function fetchCitations() {
    try {
      setLoading(true);
      const response = await fetch('/api/citations');
      
      if (!response.ok) {
        throw new Error('Failed to fetch citations');
      }
      
      const data = await response.json();
      setSavedCitations(data);
    } catch (error) {
      console.error('Error fetching citations:', error);
      toast.error('Failed to load your citations. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(citationId: string) {
    if (confirm("Are you sure you want to delete this citation?")) {
      try {
        toast.loading('Deleting citation...', { id: 'deleteToast' });
        
        const response = await fetch(`/api/citations?id=${citationId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Citation deleted successfully', { id: 'deleteToast' });
          // Refresh the citations list
          fetchCitations();
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to delete citation', { id: 'deleteToast' });
        }
      } catch (error) {
        console.error('Error deleting citation:', error);
        toast.error('An error occurred while deleting the citation', { id: 'deleteToast' });
      }
    }
  }

  // Loading state
  if (status === 'loading' || loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-900 dark:text-gray-100">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Citations</h1>
        <Link
          href="/new-citation"
          className="bg-brand dark:bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-dark dark:hover:bg-brand-dark transition-colors"
        >
          Create New Citation
        </Link>
      </div>

      {savedCitations.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50">
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No citations</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new citation.
          </p>
          <div className="mt-6">
            <Link
              href="/new-citation"
              className="inline-flex items-center rounded-md bg-brand dark:bg-brand px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark dark:hover:bg-brand-light"
            >
              Create your first citation
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            {pagination.currentItems.map((citation) => (
              <div
                key={citation.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {citation.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Style: {citation.style}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Link
                      href={`/citations/${citation.id}`}
                      className="text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand-light text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(citation.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Created {new Date(citation.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          
          {/* Add pagination controls */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.goToPage}
              isFirstPage={pagination.isFirstPage}
              isLastPage={pagination.isLastPage}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={pagination.totalItems}
              onItemsPerPageChange={pagination.setPageSize}
              showItemsPerPage={true}
            />
          )}
        </>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/settings"
            className="flex flex-col p-4 bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/50 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l-4 border-brand dark:border-brand"
          >
            <h3 className="font-medium text-gray-900 dark:text-white">Settings</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your preferences and account settings
            </p>
          </Link>
          <Link
            href="/citation-styles"
            className="flex flex-col p-4 bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/50 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l-4 border-brand dark:border-brand"
          >
            <h3 className="font-medium text-gray-900 dark:text-white">Citation Styles</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Browse and select citation styles
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}