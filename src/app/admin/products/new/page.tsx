import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/product-form';

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  const [brands, categories, badges] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.badge.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Add New Product</h1>
        <p className="mt-2 text-neutral-600">Create a new product in your catalog</p>
      </div>

      <ProductForm brands={brands} categories={categories} badges={badges} />
    </div>
  );
}
