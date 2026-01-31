'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Star, Shield, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { VendorComparisonModal } from './vendor-comparison-modal';
import { VendorLogo, type Merchant } from './vendor-logo';
import { cn } from '@/lib/utils';

interface AffiliateLink {
  id: string;
  merchant: string;
  url: string;
  isActive: boolean;
  paramsJson?: any;
}

interface Product {
  id: string;
  slug: string;
  title: string;
  brand?: { name: string } | null;
  category?: { name: string } | null;
  heroImage?: string | null;
  shortSummary?: string | null;
  healthScore: number;
  isPalmOilFree: boolean;
  isLowSugar: boolean;
  isArtificialColorFree: boolean;
  isWholeGrain: boolean;
  isMeetsStandard: boolean;
  affiliateLinks?: AffiliateLink[];
}

interface ProductCardEnhancedProps {
  product: Product;
  onBookmark?: (productId: string) => void;
  isBookmarked?: boolean;
  showQuickBuy?: boolean;
  priority?: boolean;
}

export function ProductCardEnhanced({
  product,
  onBookmark,
  isBookmarked = false,
  showQuickBuy = true,
  priority = false,
}: ProductCardEnhancedProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const activeLinks = product.affiliateLinks?.filter((link) => link.isActive) || [];

  // Find lowest price
  const lowestPrice = activeLinks.reduce((min, link) => {
    const price = link.paramsJson?.price;
    if (price && (min === null || price < min)) return price;
    return min;
  }, null as number | null);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-br from-green-500 to-emerald-600';
    if (score >= 60) return 'bg-gradient-to-br from-amber-500 to-orange-600';
    return 'bg-gradient-to-br from-red-500 to-rose-600';
  };

  const getHealthScoreText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Fair';
  };

  const healthBenefits = [
    { key: 'isPalmOilFree', label: 'No Palm Oil', icon: '🌴', color: 'bg-green-50 border-green-200 text-green-700' },
    { key: 'isLowSugar', label: 'Low Sugar', icon: '🍯', color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { key: 'isArtificialColorFree', label: 'No Artificial Colors', icon: '🎨', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { key: 'isWholeGrain', label: 'Whole Grain', icon: '🌾', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  ];

  const activeHealthBenefits = healthBenefits.filter(
    (benefit) => product[benefit.key as keyof Product]
  );

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmark?.(product.id);
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <TooltipProvider>
      <Card
        className="group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:border-primary-400"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image Section */}
        <div className="relative aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">
          <Link href={`/product/${product.slug}`}>
            {product.heroImage ? (
              <Image
                src={product.heroImage}
                alt={product.title}
                fill
                priority={priority}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-7xl opacity-50">📦</span>
              </div>
            )}
          </Link>

          {/* Top Actions */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {/* Top Choice Badge */}
            {product.healthScore >= 85 && (
              <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold shadow-lg border-0">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Top Choice
              </Badge>
            )}

            {/* Bookmark Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleBookmarkClick}
                  className={cn(
                    'p-2 rounded-full shadow-lg transition-all duration-200',
                    isBookmarked
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 text-neutral-600 hover:bg-white hover:text-red-500'
                  )}
                >
                  <Heart className={cn('w-5 h-5', isBookmarked && 'fill-current')} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {isBookmarked ? 'Remove from saved' : 'Save for later'}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Health Score Badge */}
          {product.healthScore > 0 && (
            <div
              className={cn(
                'absolute top-3 right-3 w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-xl text-white',
                getHealthScoreColor(product.healthScore)
              )}
            >
              <span className="text-2xl font-black leading-none">{product.healthScore}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                {getHealthScoreText(product.healthScore)}
              </span>
            </div>
          )}

          {/* Hover Overlay with Quick Actions */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-4 transition-opacity duration-300',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="flex gap-2">
              <Link href={`/product/${product.slug}`}>
                <Button size="sm" variant="secondary" className="shadow-lg">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </Link>
              {showQuickBuy && activeLinks.length > 0 && (
                <Button size="sm" onClick={handleBuyClick} className="shadow-lg">
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  Buy Now
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-4">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">
              {product.brand.name}
            </p>
          )}

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-base text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors min-h-[3rem]">
              {product.title}
            </h3>
          </Link>

          {/* Health Benefits */}
          {activeHealthBenefits.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {activeHealthBenefits.slice(0, 3).map((benefit) => (
                <Tooltip key={benefit.key}>
                  <TooltipTrigger>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
                        benefit.color
                      )}
                    >
                      {benefit.icon}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{benefit.label}</TooltipContent>
                </Tooltip>
              ))}
              {activeHealthBenefits.length > 3 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                  +{activeHealthBenefits.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Meets Standard Badge */}
          {product.isMeetsStandard && (
            <div className="flex items-center gap-1 text-xs text-primary-600 mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span className="font-medium">Meets Our Health Standards</span>
            </div>
          )}

          {/* Price & Vendors */}
          {activeLinks.length > 0 && (
            <div className="pt-3 border-t border-neutral-100">
              <div className="flex items-center justify-between mb-2">
                {lowestPrice ? (
                  <div>
                    <p className="text-xs text-neutral-500">Starting from</p>
                    <p className="text-xl font-bold text-neutral-900">
                      ₹{lowestPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500">Check prices</p>
                )}

                {/* Vendor Logos */}
                <div className="flex -space-x-2">
                  {activeLinks.slice(0, 3).map((link) => (
                    <div
                      key={link.id}
                      className="relative w-8 h-8 rounded-lg bg-white border-2 border-white shadow-sm overflow-hidden"
                    >
                      <VendorLogo merchant={link.merchant} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Compare Prices Button */}
              <Button
                onClick={handleBuyClick}
                className="w-full gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
              >
                <ShoppingBag className="w-4 h-4" />
                Compare Prices & Buy
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          )}

          {/* No Vendors - Just View */}
          {activeLinks.length === 0 && (
            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href={`/product/${product.slug}`}>
                View Product Details
              </Link>
            </Button>
          )}
        </CardContent>

        {/* Vendor Comparison Modal */}
        <VendorComparisonModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBookmark={() => onBookmark?.(product.id)}
          isBookmarked={isBookmarked}
        />
      </Card>
    </TooltipProvider>
  );
}
