// src/app/(main)/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getSavedCitations(userId: string) {
  return await db.savedCitation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function DashboardPage() {
  const session : any = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const savedCitations = await getSavedCitations(session.user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Citations</h1>
        <Link
          href="/new-citation"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Create New Citation
        </Link>
      </div>

      {savedCitations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No citations</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new citation.
          </p>
          <div className="mt-6">
            <Link
              href="/new-citation"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Create your first citation
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {savedCitations.map((citation : any) => (
            <div
              key={citation.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {citation.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Style: {citation.style}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Link
                    href={`/citations/${citation.id}`}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {/* Add delete handler */}}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Created {new Date(citation.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/settings"
            className="p-4 bg-white shadow rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Settings</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage your preferences and account settings
            </p>
          </Link>
          <Link
            href="/styles"
            className="p-4 bg-white shadow rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Citation Styles</h3>
            <p className="mt-1 text-sm text-gray-500">
              Browse and select citation styles
            </p>
          </Link>
          <Link
            href="/help"
            className="p-4 bg-white shadow rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Help Center</h3>
            <p className="mt-1 text-sm text-gray-500">
              Learn how to use the citation generator
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}