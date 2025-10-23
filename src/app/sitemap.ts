import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Get all products
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
  });

  // Get all published articles
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  });

  // Get all ingredients
  const ingredients = await prisma.ingredient.findMany({
    select: { slug: true, updatedAt: true },
  });

  // Static pages
  const staticPages = [
    '',
    '/shop',
    '/blog',
    '/ingredients',
    '/evidence',
    '/standards',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/affiliate-disclosure',
  ];

  const staticUrls: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const ingredientUrls: MetadataRoute.Sitemap = ingredients.map((ingredient) => ({
    url: `${baseUrl}/ingredients/${ingredient.slug}`,
    lastModified: ingredient.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticUrls, ...productUrls, ...articleUrls, ...ingredientUrls];
}
