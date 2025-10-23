import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { generateMetadata as genMeta, generateArticleSchema } from '@/lib/seo';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article) return {};

  return genMeta({
    title: article.title,
    description: article.excerpt || '',
    image: article.coverImage || undefined,
    canonical: article.canonicalUrl || undefined,
  });
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, status: 'PUBLISHED' },
    include: { author: true },
  });

  if (!article) {
    notFound();
  }

  const articleSchema = generateArticleSchema({
    title: article.title,
    description: article.excerpt || '',
    image: article.coverImage || '',
    author: article.author?.name || 'HealthPeDhyan',
    publishedAt: article.publishedAt || article.createdAt,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${article.slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        {article.category && (
          <div className="mb-4">
            <span className="text-sm font-medium text-primary-600">{article.category}</span>
          </div>
        )}

        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 lg:text-5xl">
          {article.title}
        </h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-neutral-600">
          <span>By {article.author?.name || 'HealthPeDhyan'}</span>
          <span>·</span>
          <time dateTime={article.publishedAt?.toISOString()}>
            {article.publishedAt && formatDate(article.publishedAt)}
          </time>
        </div>

        {article.excerpt && (
          <p className="mt-6 text-xl text-neutral-600 leading-relaxed">{article.excerpt}</p>
        )}

        <div className="mt-12 prose prose-neutral prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.bodyMarkdown}</ReactMarkdown>
        </div>
      </article>
    </>
  );
}
