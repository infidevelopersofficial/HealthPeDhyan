import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { generateMetadata as genMeta } from '@/lib/seo';
export const dynamic = "force-dynamic";

export const metadata = genMeta({
  title: 'Blog - Health & Nutrition Articles',
  description:
    'Learn about ingredients, nutrition labels, and making healthier food choices for your family.',
});

export default async function BlogPage() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-neutral-900">Blog</h1>
        <p className="mt-2 text-lg text-neutral-600">
          Evidence-based articles on ingredients, nutrition, and healthier eating
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                {article.publishedAt && formatDate(article.publishedAt)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 line-clamp-3">{article.excerpt}</p>
              <Button asChild variant="link" className="mt-4 px-0">
                <Link href={`/blog/${article.slug}`}>Read article →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
