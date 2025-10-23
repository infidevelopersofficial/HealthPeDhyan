import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/seo';

async function getFeaturedProducts() {
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
    },
    take: 6,
    orderBy: {
      healthScore: 'desc',
    },
  });
}

async function getRecentArticles() {
  return await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 3,
  });
}

export default async function HomePage() {
  const [products, articles] = await Promise.all([getFeaturedProducts(), getRecentArticles()]);

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

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
              Healthy choices made easy
            </h1>
            <p className="mt-6 text-lg leading-8 text-neutral-600 max-w-2xl mx-auto">
              Discover products free from palm oil, low in sugar, and made with clean ingredients.
              We do the research, you make healthier choices.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/shop">Shop Healthier Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/standards">Our Standards</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                Featured Products
              </h2>
              <p className="mt-2 text-neutral-600">
                Curated picks that meet our health standards
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/shop">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="group">
                <CardHeader>
                  <div className="aspect-square bg-neutral-100 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-neutral-400 text-sm">Product Image</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.badges.slice(0, 2).map((pb) => (
                      <Badge key={pb.badge.id} variant="success">
                        {pb.badge.name}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary-600 transition-colors">
                    <Link href={`/product/${product.slug}`}>{product.title}</Link>
                  </CardTitle>
                  <CardDescription className="text-xs text-neutral-500">
                    {product.brand.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 line-clamp-2">{product.shortSummary}</p>
                  <div className="mt-4 flex gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/product/${product.slug}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How We Choose */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              How We Choose Products
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Every product is evaluated against our strict health standards. We check for palm oil,
              artificial colors, trans fats, and sugar content.
            </p>
            <Button asChild className="mt-8">
              <Link href="/standards">See Our Complete Standards</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Highlights */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Latest Articles</h2>
              <p className="mt-2 text-neutral-600">
                Learn about ingredients, nutrition, and healthier choices
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/blog">View All Articles</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <div className="aspect-video bg-neutral-100 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-neutral-400 text-sm">Article Cover</span>
                  </div>
                  {article.category && (
                    <Badge variant="secondary" className="w-fit">
                      {article.category}
                    </Badge>
                  )}
                  <CardTitle className="mt-2">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {article.publishedAt ? formatDate(article.publishedAt) : 'Draft'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 line-clamp-3">{article.excerpt}</p>
                  <Button asChild variant="link" className="mt-4 px-0">
                    <Link href={`/blog/${article.slug}`}>Read more →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
