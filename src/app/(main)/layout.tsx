// app/(main)/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        {/* Add your navigation here */}
      </nav>
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}