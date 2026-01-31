import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/seo';
import { ProductCardEnhanced } from '@/components/product/product-card-enhanced';
import { CategoryShowcase } from '@/components/home/category-showcase';
import { HeroSection } from '@/components/home/hero-section';
import { TrustIndicators } from '@/components/home/trust-indicators';
import { HowItWorks } from '@/components/home/how-it-works';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { mockProducts, mockArticles } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: {
        isMeetsStandard: true,
      },
      include: {
        brand: true,
        category: true,
        badges: {
          include: {
            badge: true,
          },
        },
        affiliateLinks: {
          where: { isActive: true },
        },
      },
      take: 8,
      orderBy: {
        healthScore: 'desc',
      },
    });
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
      orderBy: {
        products: {
          _count: 'desc',
        },
      },
      take: 8,
    });
    return categories;
  } catch (error) {
    console.log('Categories not available');
    return null;
  }
}

async function getRecentArticles() {
  try {
    return await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 3,
    });
  } catch (error) {
    console.log('Database not available, using mock data');
    return null;
  }
}

async function getStats() {
  try {
    const [productCount, articleCount, brandCount] = await Promise.all([
      prisma.product.count({ where: { isMeetsStandard: true } }),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.brand.count(),
    ]);
    return { productCount, articleCount, brandCount };
  } catch {
    return { productCount: 100, articleCount: 50, brandCount: 25 };
  }
}

export default async function HomePage() {
  const [dbProducts, dbArticles, categories, stats] = await Promise.all([
    getFeaturedProducts(),
    getRecentArticles(),
    getCategories(),
    getStats(),
  ]);

  const products = dbProducts && dbProducts.length > 0 ? dbProducts : mockProducts;
  const articles = dbArticles && dbArticles.length > 0 ? dbArticles : mockArticles;
  const usingMockData = !dbProducts || dbProducts.length === 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteSchema()) }}
      />

      {/* Demo Mode Banner */}
      {usingMockData && (
        <section className="bg-gradient-to-r from-amber-500 to-orange-500 py-3">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center text-white">
              <p className="text-sm font-medium">
                Demo Mode - Viewing Sample Products | Full catalog available after backend deployment
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <HeroSection stats={stats} />

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Shop by Category */}
      {categories && categories.length > 0 && (
        <CategoryShowcase categories={categories} />
      )}

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <Badge variant="secondary" className="mb-3">Curated Selection</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
                Top Healthy Products
              </h2>
              <p className="mt-2 text-neutral-600 max-w-xl">
                Hand-picked products that meet our strict health standards. No palm oil, no artificial colors, low sugar.
              </p>
            </div>
            <Button asChild variant="outline" size="lg" className="w-fit">
              <Link href="/shop">
                View All Products
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((product, index) => (
              <ProductCardEnhanced
                key={product.id}
                product={product}
                priority={index < 4}
              />
            ))}
          </div>

          {usingMockData && (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="text-sm text-blue-800">
                  <strong>Tip:</strong> Deploy your backend to see your full product catalog.
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Blog Highlights */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <Badge variant="secondary" className="mb-3">Health Education</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
                Latest Articles
              </h2>
              <p className="mt-2 text-neutral-600">
                Learn about ingredients, nutrition, and making healthier choices
              </p>
            </div>
            <Button asChild variant="outline" size="lg" className="w-fit">
              <Link href="/blog">
                All Articles
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-300">
                <CardHeader className="p-0">
                  <Link href={`/blog/${article.slug}`} className="block relative aspect-video overflow-hidden bg-neutral-100">
                    {article.coverImage ? (
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl opacity-30">📰</span>
                      </div>
                    )}
                  </Link>
                  <div className="p-6">
                    {article.category && (
                      <Badge variant="secondary" className="w-fit mb-3">
                        {article.category}
                      </Badge>
                    )}
                    <CardTitle className="text-xl leading-tight">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {article.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-xs mt-2">
                      {article.publishedAt ? formatDate(article.publishedAt) : 'Draft'}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-neutral-600 line-clamp-3 mb-4">{article.excerpt}</p>
                  <Button asChild variant="link" className="px-0 font-semibold">
                    <Link href={`/blog/${article.slug}`}>
                      Read Article <span className="ml-1">→</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  );
}
