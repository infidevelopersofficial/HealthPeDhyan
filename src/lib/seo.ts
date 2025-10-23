import { Metadata } from 'next';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'HealthPeDhyan';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const APP_DESCRIPTION =
  'HealthPeDhyan helps you discover healthier products - palm-oil-free, low sugar, and made with clean ingredients. Shop smarter, live healthier.';

/**
 * Generate page metadata
 */
export function generateMetadata({
  title,
  description,
  image,
  canonical,
  noIndex = false,
}: {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title === APP_NAME ? title : `${title} | ${APP_NAME}`;
  const pageDescription = description || APP_DESCRIPTION;
  const pageImage = image || `${APP_URL}/og-image.jpg`;
  const pageUrl = canonical || APP_URL;

  return {
    title: pageTitle,
    description: pageDescription,
    applicationName: APP_NAME,
    authors: [{ name: APP_NAME }],
    keywords: [
      'healthy food',
      'palm oil free',
      'low sugar',
      'clean ingredients',
      'nutrition',
      'India',
    ],
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: APP_NAME,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
    },
  };
}

/**
 * Generate Organization JSON-LD
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: APP_URL,
    logo: `${APP_URL}/logo.png`,
    description: APP_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    sameAs: [
      // Add social media links here
    ],
  };
}

/**
 * Generate WebSite JSON-LD
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: APP_NAME,
    url: APP_URL,
    description: APP_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${APP_URL}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Product JSON-LD
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  brand: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    url: product.url,
  };
}

/**
 * Generate Article JSON-LD
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  author: string;
  publishedAt: Date;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: APP_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${APP_URL}/logo.png`,
      },
    },
    datePublished: article.publishedAt.toISOString(),
    url: article.url,
  };
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
