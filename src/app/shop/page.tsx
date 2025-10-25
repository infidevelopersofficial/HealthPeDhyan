import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateMetadata as genMeta } from '@/lib/seo';
import { cn } from '@/lib/utils';

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

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: 'asc' },
  });
  return categories;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  const activeCategory = searchParams.category;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900">Shop Healthy Products</h1>
        <p className="mt-2 text-neutral-600">
          All products meet our health standards for clean ingredients
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/shop"
                className={cn(
                  'block rounded-lg px-3 py-2 text-sm transition-colors',
                  !activeCategory
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-neutral-700 hover:bg-neutral-100'
                )}
              >
                All Products
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                    activeCategory === category.slug
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  )}
                >
                  <span>{category.name}</span>
                  <span className="text-xs text-neutral-500">
                    {category._count.products}
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Health Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href={`/shop${activeCategory ? `?category=${activeCategory}&` : '?'}palmOilFree=true`}
                className="block"
              >
                <Badge
                  variant={searchParams.palmOilFree === 'true' ? 'success' : 'outline'}
                  className="w-full justify-center cursor-pointer hover:opacity-80"
                >
                  Palm Oil Free
                </Badge>
              </Link>
              <Link
                href={`/shop${activeCategory ? `?category=${activeCategory}&` : '?'}lowSugar=true`}
                className="block"
              >
                <Badge
                  variant={searchParams.lowSugar === 'true' ? 'success' : 'outline'}
                  className="w-full justify-center cursor-pointer hover:opacity-80"
                >
                  Low Sugar
                </Badge>
              </Link>
              <Link
                href={`/shop${activeCategory ? `?category=${activeCategory}&` : '?'}wholeGrain=true`}
                className="block"
              >
                <Badge
                  variant={searchParams.wholeGrain === 'true' ? 'success' : 'outline'}
                  className="w-full justify-center cursor-pointer hover:opacity-80"
                >
                  Whole Grain
                </Badge>
              </Link>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          </div>

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
              <Button asChild variant="outline" className="mt-4">
                <Link href="/shop">Clear Filters</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
