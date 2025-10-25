import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, FolderTree, Tag } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  // Get stats
  const [productsCount, articlesCount, categoriesCount, brandsCount] = await Promise.all([
    prisma.product.count(),
    prisma.article.count(),
    prisma.category.count(),
    prisma.brand.count(),
  ]);

  const stats = [
    {
      name: 'Total Products',
      value: productsCount,
      icon: Package,
      href: '/admin/products',
    },
    {
      name: 'Total Articles',
      value: articlesCount,
      icon: FileText,
      href: '/admin/articles',
    },
    {
      name: 'Categories',
      value: categoriesCount,
      icon: FolderTree,
      href: '/admin/categories',
    },
    {
      name: 'Brands',
      value: brandsCount,
      icon: Tag,
      href: '/admin/brands',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-2 text-neutral-600">
          Welcome back, {session.user?.name || session.user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-neutral-600">
                  {stat.name}
                </CardTitle>
                <Icon className="h-4 w-4 text-neutral-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-neutral-900">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="/admin/products"
                className="rounded-lg border-2 border-dashed border-neutral-300 p-6 text-center hover:border-primary-500 transition-colors"
              >
                <Package className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                <p className="font-medium text-neutral-900">Add Product</p>
              </a>
              <a
                href="/admin/articles"
                className="rounded-lg border-2 border-dashed border-neutral-300 p-6 text-center hover:border-primary-500 transition-colors"
              >
                <FileText className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                <p className="font-medium text-neutral-900">Write Article</p>
              </a>
              <a
                href="/admin/categories"
                className="rounded-lg border-2 border-dashed border-neutral-300 p-6 text-center hover:border-primary-500 transition-colors"
              >
                <FolderTree className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                <p className="font-medium text-neutral-900">Manage Categories</p>
              </a>
              <a
                href="/admin/brands"
                className="rounded-lg border-2 border-dashed border-neutral-300 p-6 text-center hover:border-primary-500 transition-colors"
              >
                <Tag className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                <p className="font-medium text-neutral-900">Manage Brands</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
