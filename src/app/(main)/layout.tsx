import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Navbar } from '@/app/components/navigation/Navbar';
import { Breadcrumbs } from '@/app/components/navigation/Breadcrumbs';
import { PageTransition } from '@/app/components/navigation/PageTransition';
import ScrollToTop from "../components/navigation/ScrollToTop";
import { AuthProvider } from '../components/providers/AuthProvider';

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
    <AuthProvider session={session}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <main className="container mx-auto py-6 px-4">
          <Breadcrumbs />
          <PageTransition>
            {children}
          </PageTransition>
          <ScrollToTop />
        </main>
      </div>
    </AuthProvider>
  );
}