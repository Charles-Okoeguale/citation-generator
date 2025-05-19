'use client';

import { useEffect, useState } from 'react';
import { CitationForm } from '@/app/components/CitationForm';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function EditCitationPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [citation, setCitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchCitation();
    }
  }, [status, id, router]);

  const fetchCitation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/citations/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Citation not found');
        } else {
          setError('Failed to load citation');
        }
        return;
      }
      
      const data = await response.json();
      setCitation(data);
    } catch (error) {
      console.error('Error fetching citation:', error);
      setError('An error occurred while loading the citation');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-brand"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 my-6">
          <p className="text-red-800 dark:text-red-300">{error}</p>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="mt-4 bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-dark"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!citation) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 my-6">
          <p className="text-yellow-800 dark:text-yellow-300">Citation not found</p>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="mt-4 bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-dark"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Citation</h1>
      <CitationForm 
        initialData={citation} 
        citationId={id}
        isEditing={true}
      />
    </div>
  );
} 