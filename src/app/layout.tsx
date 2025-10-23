import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer';
import { FloatingBanner } from '@/components/layout/floating-banner';
import { generateMetadata as genMeta } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = genMeta({
  title: 'HealthPeDhyan',
  description:
    'Discover healthier products - palm-oil-free, low sugar, and made with clean ingredients. Shop smarter, live healthier.',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1">{children}</main>
        <AppFooter />
        <FloatingBanner
          messageId="affiliate-disclosure-v1"
          message="We review products for palm-oil-free, low sugar, and cleaner ingredients."
          linkText="Learn more about our standards →"
          linkUrl="/standards"
          variant="info"
        />
      </body>
    </html>
  );
}
