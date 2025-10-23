import { Suspense } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
  title: 'Shop Healthy Products',
  description:
    'Browse our curated selection of palm-oil-free, low-sugar products made with clean ingredients.',
});

async function getProducts(searchParams: any) {
  const where: any = {};

  if (searchParams.palmOilFree === 'true') {
    where.isPalmOilFree = true;
  }
  if (searchParams.lowSugar === 'true') {
    where.isLowSugar = true;
  }
  if (searchParams.wholeGrain === 'true') {
    where.isWholeGrain = true;
  }
  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      brand: true,
      category: true,
      badges: {
        include: { badge: true },
      },
    },
    orderBy: {
      healthScore: 'desc',
    },
  });

  return products;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const products = await getProducts(searchParams);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900">Shop Healthy Products</h1>
        <p className="mt-2 text-neutral-600">
          All products meet our health standards for clean ingredients
        </p>
      </div>

      {/* Quick Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/shop">
          <Badge variant="outline">All Products</Badge>
        </Link>
        <Link href="/shop?palmOilFree=true">
          <Badge variant="success">Palm Oil Free</Badge>
        </Link>
        <Link href="/shop?lowSugar=true">
          <Badge variant="success">Low Sugar</Badge>
        </Link>
        <Link href="/shop?wholeGrain=true">
          <Badge variant="success">Whole Grain</Badge>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="group">
            <CardHeader>
              <div className="aspect-square bg-neutral-100 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-neutral-400 text-sm">Product Image</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {product.badges.slice(0, 3).map((pb) => (
                  <Badge key={pb.badge.id} variant="success">
                    {pb.badge.name}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-xl group-hover:text-primary-600 transition-colors">
                <Link href={`/product/${product.slug}`}>{product.title}</Link>
              </CardTitle>
              <CardDescription className="text-xs">
                {product.brand.name} · {product.category.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 line-clamp-2">{product.shortSummary}</p>
              <Button asChild className="mt-4 w-full">
                <Link href={`/product/${product.slug}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-600">No products found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
