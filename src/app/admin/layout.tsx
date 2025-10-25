import { AdminLayoutWrapper } from '@/components/layout/admin-layout-wrapper';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
