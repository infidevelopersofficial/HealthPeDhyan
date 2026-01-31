import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { buildAffiliateUrl } from '@/lib/affiliate';
import { generateMetadata as genMeta, generateProductSchema } from '@/lib/seo';
import { VendorPriceCard } from '@/components/product/vendor-price-card';
import { ProductCardEnhanced } from '@/components/product/product-card-enhanced';
import { ProductDetailClient } from '@/components/product/product-detail-client';
import {
  ChevronRight,
  Shield,
  Leaf,
  Award,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShoppingCart,
  Heart,
  Share2,
  Home,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
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
  } catch {
    return {};
  }
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  try {
    return await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: currentProductId },
        isMeetsStandard: true,
      },
      include: {
        brand: true,
        category: true,
        affiliateLinks: { where: { isActive: true } },
      },
      take: 4,
      orderBy: { healthScore: 'desc' },
    });
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product;
  try {
    product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        brand: true,
        category: true,
        badges: {
          include: { badge: true },
        },
        affiliateLinks: true,
        ingredientFlags: {
          include: { flag: true },
        },
      },
    });
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);
  const activeLinks = product.affiliateLinks.filter((link) => link.isActive);

  const productSchema = generateProductSchema({
    name: product.title,
    description: product.shortSummary || product.description || '',
    image: product.heroImage || '',
    brand: product.brand.name,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.slug}`,
  });

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Fair';
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Find best price
  const pricesWithLinks = activeLinks
    .map((link) => ({
      ...link,
      price: (link.paramsJson as any)?.price,
    }))
    .filter((link) => link.price);

  const bestPrice = pricesWithLinks.length > 0
    ? Math.min(...pricesWithLinks.map((l) => l.price!))
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-neutral-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-neutral-500 hover:text-primary-600 flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
              <Link href="/shop" className="text-neutral-500 hover:text-primary-600">
                Shop
              </Link>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
              <Link href={`/shop?category=${product.category.slug}`} className="text-neutral-500 hover:text-primary-600">
                {product.category.name}
              </Link>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
              <span className="text-neutral-900 font-medium truncate max-w-[200px]">{product.title}</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-white rounded-3xl border-2 border-neutral-200 overflow-hidden">
                {product.heroImage ? (
                  <Image
                    src={product.heroImage}
                    alt={product.title}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl opacity-30">📦</span>
                  </div>
                )}

                {/* Health Score Badge */}
                <div className={`absolute top-4 right-4 w-20 h-20 ${getHealthScoreBg(product.healthScore)} rounded-2xl flex flex-col items-center justify-center text-white shadow-xl`}>
                  <span className="text-3xl font-black">{product.healthScore}</span>
                  <span className="text-xs font-bold uppercase">{getHealthScoreLabel(product.healthScore)}</span>
                </div>

                {/* Top Choice Badge */}
                {product.healthScore >= 85 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    Top Choice
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails (placeholder) */}
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 bg-white rounded-xl border-2 border-neutral-200 flex items-center justify-center cursor-pointer hover:border-primary-400 transition-colors">
                    <span className="text-2xl opacity-30">📷</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.isMeetsStandard && (
                  <Badge className="bg-primary-100 text-primary-700 border-primary-200 gap-1">
                    <Shield className="w-3 h-3" />
                    Meets Our Standards
                  </Badge>
                )}
                {product.isPalmOilFree && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    🌴 Palm Oil Free
                  </Badge>
                )}
                {product.isLowSugar && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    🍯 Low Sugar
                  </Badge>
                )}
                {product.isArtificialColorFree && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    🎨 No Artificial Colors
                  </Badge>
                )}
                {product.isWholeGrain && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    🌾 Whole Grain
                  </Badge>
                )}
              </div>

              {/* Brand & Category */}
              <div className="flex items-center gap-2 text-sm">
                <Link href={`/shop?brand=${product.brand.slug}`} className="font-semibold text-primary-600 hover:underline uppercase tracking-wide">
                  {product.brand.name}
                </Link>
                <span className="text-neutral-400">•</span>
                <Link href={`/shop?category=${product.category.slug}`} className="text-neutral-600 hover:text-primary-600">
                  {product.category.name}
                </Link>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
                {product.title}
              </h1>

              {/* Summary */}
              {product.shortSummary && (
                <p className="text-lg text-neutral-600 leading-relaxed">
                  {product.shortSummary}
                </p>
              )}

              {/* Health Score Breakdown */}
              <Card className="bg-gradient-to-br from-neutral-50 to-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-neutral-900">Health Score</span>
                    <span className={`text-2xl font-bold ${getHealthScoreColor(product.healthScore)}`}>
                      {product.healthScore}/100
                    </span>
                  </div>
                  <Progress value={product.healthScore} className="h-3" indicatorClassName={getHealthScoreBg(product.healthScore)} />
                  <p className="text-sm text-neutral-500 mt-2">
                    Based on ingredients, nutrition, and our health standards
                  </p>
                </CardContent>
              </Card>

              <Separator />

              {/* Vendor Prices Section */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Buy from Trusted Vendors
                </h3>

                {activeLinks.length > 0 ? (
                  <div className="space-y-3">
                    {activeLinks.map((link) => {
                      const affiliateUrl = buildAffiliateUrl(link.url, link.merchant);
                      const params = link.paramsJson as any;
                      return (
                        <VendorPriceCard
                          key={link.id}
                          merchant={link.merchant}
                          url={affiliateUrl}
                          price={params?.price}
                          originalPrice={params?.originalPrice}
                          inStock={params?.inStock}
                          deliveryInfo={params?.deliveryInfo}
                          rating={params?.rating}
                          reviewCount={params?.reviewCount}
                          isBestPrice={bestPrice !== null && params?.price === bestPrice}
                          productId={product.id}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-xl border border-neutral-200">
                    <p className="text-neutral-500">No vendors available at the moment</p>
                    <p className="text-sm text-neutral-400 mt-1">Check back later for buying options</p>
                  </div>
                )}

                <p className="text-xs text-neutral-500 mt-4 flex items-start gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  We earn commissions from qualifying purchases. This helps us keep our service free and unbiased.
                </p>
              </div>

              {/* Client Actions (Bookmark, Share) */}
              <ProductDetailClient productId={product.id} productSlug={product.slug} productTitle={product.title} />
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start bg-white border border-neutral-200 rounded-xl p-1 mb-6">
                <TabsTrigger value="description" className="rounded-lg">Description</TabsTrigger>
                <TabsTrigger value="ingredients" className="rounded-lg">Ingredients</TabsTrigger>
                <TabsTrigger value="nutrition" className="rounded-lg">Nutrition</TabsTrigger>
                <TabsTrigger value="badges" className="rounded-lg">Health Badges</TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <Card>
                  <CardHeader>
                    <CardTitle>Why We Recommend This Product</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700 whitespace-pre-line leading-relaxed">
                      {product.description || 'No detailed description available.'}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ingredients">
                <Card>
                  <CardHeader>
                    <CardTitle>Ingredients & Allergens</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {product.ingredientsText ? (
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-2">Full Ingredients List</h3>
                        <p className="text-neutral-600 bg-neutral-50 p-4 rounded-lg text-sm">
                          {product.ingredientsText}
                        </p>
                      </div>
                    ) : (
                      <p className="text-neutral-500">No ingredients information available.</p>
                    )}

                    {product.allergensText && (
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          Allergen Information
                        </h3>
                        <p className="text-neutral-600 bg-amber-50 p-4 rounded-lg text-sm border border-amber-200">
                          {product.allergensText}
                        </p>
                      </div>
                    )}

                    {product.ingredientFlags.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-2">Ingredient Flags</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.ingredientFlags.map((pf) => (
                            <Badge key={pf.flag.id} variant="warning">
                              {pf.flag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nutrition">
                <Card>
                  <CardHeader>
                    <CardTitle>Nutrition Facts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.nutritionJson ? (
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="font-semibold text-neutral-900 mb-4">Per 100g Serving</h3>
                          <div className="space-y-3">
                            {Object.entries((product.nutritionJson as any).per100g || {}).map(
                              ([key, value]) => (
                                <div key={key} className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
                                  <span className="text-neutral-600 capitalize">{key}</span>
                                  <span className="font-semibold">{value as string}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div className="bg-neutral-50 rounded-xl p-6">
                          <h3 className="font-semibold text-neutral-900 mb-4">Health Indicators</h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              {product.isLowSugar ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                              )}
                              <span>{product.isLowSugar ? 'Low in sugar' : 'Contains sugar'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {product.isPalmOilFree ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                              )}
                              <span>{product.isPalmOilFree ? 'Palm oil free' : 'Contains palm oil'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {product.isWholeGrain ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <Info className="w-5 h-5 text-neutral-400" />
                              )}
                              <span>{product.isWholeGrain ? 'Made with whole grains' : 'Not whole grain'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-neutral-500">No nutrition information available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="badges">
                <Card>
                  <CardHeader>
                    <CardTitle>Health Certifications & Badges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.badges.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {product.badges.map((pb) => (
                          <div key={pb.badge.id} className="p-4 bg-green-50 rounded-xl border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                              <span className="font-semibold text-green-800">{pb.badge.name}</span>
                            </div>
                            <p className="text-sm text-green-700">{pb.badge.description}</p>
                            {pb.rationale && (
                              <p className="mt-2 text-xs text-green-600 italic">&quot;{pb.rationale}&quot;</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-500">No health badges for this product.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">You May Also Like</h2>
                  <p className="text-neutral-600 mt-1">Similar healthy products in {product.category.name}</p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/shop?category=${product.category.slug}`}>
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCardEnhanced key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
