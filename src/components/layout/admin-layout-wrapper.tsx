'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminLayout } from './admin-layout';

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, just render children without layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session) {
    router.push('/admin/login');
    return null;
  }

  // Render with admin layout if authenticated
  return <AdminLayout>{children}</AdminLayout>;
}
