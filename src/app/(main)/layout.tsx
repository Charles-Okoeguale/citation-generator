import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AuthProvider } from '@/app/components/providers/AuthProvider';

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
      <main className="container mx-auto py-6 px-4">
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </main>
    </div>
  );
}