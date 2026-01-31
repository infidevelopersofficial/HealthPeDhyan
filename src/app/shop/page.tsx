import Link from 'next/link';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { generateMetadata as genMeta } from '@/lib/seo';
import { cn } from '@/lib/utils';
import { ProductCardEnhanced } from '@/components/product/product-card-enhanced';
import { ShopFilters } from '@/components/shop/shop-filters';
import { ShopHeader } from '@/components/shop/shop-header';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import {
  Filter,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  ChevronRight,
  Leaf,
  Sparkles,
  Shield,
} from 'lucide-react';

export const metadata = genMeta({
  title: 'Shop Healthy Products',
  description:
    'Browse our curated selection of palm-oil-free, low-sugar products made with clean ingredients.',
});

export const dynamic = 'force-dynamic';

type SortOption = 'healthScore' | 'newest' | 'priceAsc' | 'priceDesc' | 'name';

async function getProducts(searchParams: any) {
  try {
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
    if (searchParams.artificialColorFree === 'true') {
      where.isArtificialColorFree = true;
    }
    if (searchParams.meetsStandard === 'true') {
      where.isMeetsStandard = true;
    }
    if (searchParams.category) {
      where.category = { slug: searchParams.category };
    }
    if (searchParams.brand) {
      where.brand = { slug: searchParams.brand };
    }
    if (searchParams.minScore) {
      where.healthScore = { gte: parseInt(searchParams.minScore) };
    }
    if (searchParams.search) {
      where.OR = [
        { title: { contains: searchParams.search, mode: 'insensitive' } },
        { description: { contains: searchParams.search, mode: 'insensitive' } },
      ];
    }

    // Sorting
    let orderBy: any = { healthScore: 'desc' };
    const sort = searchParams.sort as SortOption;
    if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'name') {
      orderBy = { title: 'asc' };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        badges: {
          include: { badge: true },
        },
        affiliateLinks: {
          where: { isActive: true },
        },
      },
      orderBy,
    });

    return products;
  } catch (error) {
    console.log('Database not available, using mock data');
    return null;
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return categories;
  } catch (error) {
    console.log('Database not available, using mock data');
    return null;
  }
}

async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return brands;
  } catch (error) {
    return null;
  }
}

async function getStats() {
  try {
    const [total, palmOilFree, lowSugar, meetsStandard] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isPalmOilFree: true } }),
      prisma.product.count({ where: { isLowSugar: true } }),
      prisma.product.count({ where: { isMeetsStandard: true } }),
    ]);
    return { total, palmOilFree, lowSugar, meetsStandard };
  } catch {
    return { total: 100, palmOilFree: 80, lowSugar: 60, meetsStandard: 50 };
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const [dbProducts, dbCategories, dbBrands, stats] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
    getBrands(),
    getStats(),
  ]);

  let products = dbProducts && dbProducts.length > 0 ? dbProducts : mockProducts;
  const categories =
    dbCategories && dbCategories.length > 0
      ? dbCategories
      : mockCategories.map((cat) => ({
          ...cat,
          _count: { products: mockProducts.filter((p) => p.category.name === cat.name).length },
        }));
  const brands = dbBrands || [];
  const usingMockData = !dbProducts || dbProducts.length === 0;

  // Apply filters to mock data
  if (usingMockData && searchParams) {
    products = products.filter((p: any) => {
      if (searchParams.palmOilFree === 'true' && !p.isPalmOilFree) return false;
      if (searchParams.lowSugar === 'true' && !p.isLowSugar) return false;
      if (searchParams.wholeGrain === 'true' && !p.isWholeGrain) return false;
      if (searchParams.artificialColorFree === 'true' && !p.isArtificialColorFree) return false;
      if (searchParams.meetsStandard === 'true' && !p.isMeetsStandard) return false;
      if (searchParams.category && p.category.slug !== searchParams.category) return false;
      if (searchParams.search) {
        const search = searchParams.search.toLowerCase();
        if (
          !p.title.toLowerCase().includes(search) &&
          !p.description?.toLowerCase().includes(search)
        )
          return false;
      }
      return true;
    }) as typeof products;
  }

  const activeCategory = searchParams.category;
  const activeBrand = searchParams.brand;

  // Count active filters
  const activeFilters = [
    searchParams.palmOilFree === 'true',
    searchParams.lowSugar === 'true',
    searchParams.wholeGrain === 'true',
    searchParams.artificialColorFree === 'true',
    searchParams.meetsStandard === 'true',
    !!searchParams.minScore,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilters > 0 || activeCategory || activeBrand || searchParams.search;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Demo Mode Banner */}
      {usingMockData && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <p className="text-sm font-medium">
              Demo Mode - Viewing Sample Products | Full catalog available after backend deployment
            </p>
          </div>
        </div>
      )}

      {/* Shop Header */}
      <ShopHeader
        productCount={products.length}
        stats={stats}
        searchParams={searchParams}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-primary-50 to-green-50 border-primary-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary-700">{stats.total}</p>
                    <p className="text-xs text-neutral-600">Total Products</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-700">{stats.meetsStandard}</p>
                    <p className="text-xs text-neutral-600">Meet Standards</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Filters */}
            {hasActiveFilters && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Active Filters</CardTitle>
                    <Link href="/shop">
                      <Badge variant="outline" className="cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-300">
                        Clear All
                      </Badge>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {searchParams.search && (
                      <Badge variant="secondary" className="gap-1">
                        Search: {searchParams.search}
                      </Badge>
                    )}
                    {activeCategory && (
                      <Badge variant="secondary" className="gap-1">
                        Category: {categories.find(c => c.slug === activeCategory)?.name}
                      </Badge>
                    )}
                    {searchParams.palmOilFree === 'true' && (
                      <Badge variant="success" className="gap-1">Palm Oil Free</Badge>
                    )}
                    {searchParams.lowSugar === 'true' && (
                      <Badge variant="success" className="gap-1">Low Sugar</Badge>
                    )}
                    {searchParams.wholeGrain === 'true' && (
                      <Badge variant="success" className="gap-1">Whole Grain</Badge>
                    )}
                    {searchParams.artificialColorFree === 'true' && (
                      <Badge variant="success" className="gap-1">No Artificial Colors</Badge>
                    )}
                    {searchParams.meetsStandard === 'true' && (
                      <Badge variant="success" className="gap-1">Meets Standards</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Categories */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <Link
                  href="/shop"
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all',
                    !activeCategory
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  )}
                >
                  <span>All Products</span>
                  <span className="text-xs px-2 py-0.5 bg-neutral-200 rounded-full">
                    {stats.total}
                  </span>
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop?category=${category.slug}`}
                    className={cn(
                      'flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all',
                      activeCategory === category.slug
                        ? 'bg-primary-100 text-primary-700 font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    )}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-neutral-200 rounded-full">
                      {category._count.products}
                    </span>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Health Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Leaf className="w-4 h-4" />
                  Health Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <ShopFilters searchParams={searchParams} />
              </CardContent>
            </Card>

            {/* Brands (if available) */}
            {brands.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Brands
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 max-h-64 overflow-y-auto space-y-1">
                  {brands.slice(0, 10).map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/shop?brand=${brand.slug}`}
                      className={cn(
                        'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all',
                        activeBrand === brand.slug
                          ? 'bg-primary-100 text-primary-700 font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      )}
                    >
                      <span>{brand.name}</span>
                      <span className="text-xs text-neutral-500">
                        {brand._count.products}
                      </span>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200">
              <div>
                <p className="font-semibold text-neutral-900">
                  {products.length} product{products.length !== 1 ? 's' : ''} found
                </p>
                {hasActiveFilters && (
                  <p className="text-sm text-neutral-500">
                    Filtered results based on your preferences
                  </p>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-600">Sort by:</span>
                <select
                  defaultValue={searchParams.sort || 'healthScore'}
                  onChange={(e) => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('sort', e.target.value);
                    window.location.href = url.toString();
                  }}
                  className="border border-neutral-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="healthScore">Health Score (High to Low)</option>
                  <option value="newest">Newest First</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product: any) => (
                  <ProductCardEnhanced key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-10 h-10 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No products found</h3>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  We couldn&apos;t find any products matching your current filters. Try adjusting your search criteria.
                </p>
                <Button asChild>
                  <Link href="/shop">Clear All Filters</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
