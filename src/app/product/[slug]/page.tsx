import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildAffiliateUrl } from '@/lib/affiliate';
import { generateMetadata as genMeta, generateProductSchema } from '@/lib/seo';
import { AffiliateButton } from '@/components/product/affiliate-button';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { brand: true },
  });

  if (!product) return {};

  return genMeta({
    title: product.title,
    description: product.shortSummary || product.description || '',
    image: product.heroImage || undefined,
  });
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      brand: true,
      category: true,
      badges: {
        include: { badge: true },
      },
      affiliateLinks: true,
    },
  });

  if (!product) {
    notFound();
  }

  const productSchema = generateProductSchema({
    name: product.title,
    description: product.shortSummary || product.description || '',
    image: product.heroImage || '',
    brand: product.brand.name,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-square bg-neutral-100 rounded-2xl flex items-center justify-center">
            <span className="text-neutral-400">Product Image</span>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.badges.map((pb) => (
                <Badge key={pb.badge.id} variant="success">
                  {pb.badge.name}
                </Badge>
              ))}
              {product.isMeetsStandard && (
                <Badge variant="default">Meets HealthPeDhyan Standard</Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold text-neutral-900">{product.title}</h1>
            <p className="mt-2 text-lg text-neutral-600">
              {product.brand.name} · {product.category.name}
            </p>

            <p className="mt-6 text-neutral-700">{product.shortSummary}</p>

            {/* Affiliate Links */}
            <div className="mt-8 space-y-3">
              {product.affiliateLinks
                .filter((link) => link.isActive)
                .map((link) => {
                  const affiliateUrl = buildAffiliateUrl(link.url, link.merchant);
                  return (
                    <AffiliateButton
                      key={link.id}
                      href={affiliateUrl}
                      merchant={link.merchant}
                      productId={product.id}
                    />
                  );
                })}
            </div>

            <p className="mt-4 text-xs text-neutral-500">
              We earn commissions from qualifying purchases. This helps us keep our service free.
            </p>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Description */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Why We Recommend This</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700 whitespace-pre-line">{product.description}</p>

              {product.ingredientsText && (
                <div className="mt-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">Ingredients</h3>
                  <p className="text-sm text-neutral-600">{product.ingredientsText}</p>
                </div>
              )}

              {product.allergensText && (
                <div className="mt-4">
                  <h3 className="font-semibold text-neutral-900 mb-2">Allergens</h3>
                  <p className="text-sm text-neutral-600">{product.allergensText}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nutrition */}
          {product.nutritionJson && (
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries((product.nutritionJson as any).per100g || {}).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-neutral-600 capitalize">{key}</span>
                        <span className="font-medium">{value as string}</span>
                      </div>
                    )
                  )}
                </div>
                <p className="mt-4 text-xs text-neutral-500">Per 100g serving</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Badge Details */}
        {product.badges.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Health Badges</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {product.badges.map((pb) => (
                <Card key={pb.badge.id}>
                  <CardHeader>
                    <Badge variant="success" className="w-fit">
                      {pb.badge.name}
                    </Badge>
                    <CardTitle className="text-lg mt-2">{pb.badge.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600">{pb.badge.description}</p>
                    {pb.rationale && (
                      <p className="mt-2 text-xs text-neutral-500 italic">{pb.rationale}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
