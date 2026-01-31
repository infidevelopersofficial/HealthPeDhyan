'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Heart, Share2, ExternalLink, Shield, Leaf, Award } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VendorPriceCard } from './vendor-price-card';
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

interface VendorComparisonModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export function VendorComparisonModal({
  product,
  isOpen,
  onClose,
  onBookmark,
  isBookmarked = false,
}: VendorComparisonModalProps) {
  const [copied, setCopied] = useState(false);

  const activeLinks = product.affiliateLinks?.filter((link) => link.isActive) || [];

  // Find best price
  const pricesWithLinks = activeLinks
    .map((link) => ({
      ...link,
      price: link.paramsJson?.price,
    }))
    .filter((link) => link.price);

  const bestPrice = pricesWithLinks.length > 0
    ? Math.min(...pricesWithLinks.map((l) => l.price!))
    : null;

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${product.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this healthy product: ${product.title}`,
          url,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            {/* Product Header */}
            <DialogHeader className="mb-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                  {product.heroImage ? (
                    <Image
                      src={product.heroImage}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">📦</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  {product.brand && (
                    <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                      {product.brand.name}
                    </p>
                  )}
                  <DialogTitle className="text-lg font-bold text-neutral-900 line-clamp-2">
                    {product.title}
                  </DialogTitle>

                  {/* Health Score */}
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-bold',
                        getHealthScoreColor(product.healthScore)
                      )}
                    >
                      <Award className="w-4 h-4" />
                      Health Score: {product.healthScore}
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Health Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.isPalmOilFree && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Leaf className="w-3 h-3 mr-1" />
                  No Palm Oil
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
              {product.isMeetsStandard && (
                <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Meets Our Standards
                </Badge>
              )}
            </div>

            <Separator className="my-4" />

            {/* Action Buttons */}
            <div className="flex gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={onBookmark}
                className={cn(isBookmarked && 'text-red-500 border-red-300 bg-red-50')}
              >
                <Heart className={cn('w-4 h-4 mr-1', isBookmarked && 'fill-current')} />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-1" />
                {copied ? 'Copied!' : 'Share'}
              </Button>
            </div>

            {/* Vendor Prices */}
            <div className="space-y-3">
              <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Buy from Trusted Vendors
              </h3>

              {activeLinks.length > 0 ? (
                <div className="space-y-3">
                  {activeLinks.map((link) => (
                    <VendorPriceCard
                      key={link.id}
                      merchant={link.merchant}
                      url={link.url}
                      price={link.paramsJson?.price}
                      originalPrice={link.paramsJson?.originalPrice}
                      inStock={link.paramsJson?.inStock}
                      deliveryInfo={link.paramsJson?.deliveryInfo}
                      rating={link.paramsJson?.rating}
                      reviewCount={link.paramsJson?.reviewCount}
                      isBestPrice={bestPrice !== null && link.paramsJson?.price === bestPrice}
                      productId={product.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-neutral-50 rounded-xl">
                  <p className="text-neutral-500">No vendors available at the moment</p>
                  <p className="text-sm text-neutral-400 mt-1">Check back later for buying options</p>
                </div>
              )}
            </div>

            {/* Affiliate Disclaimer */}
            <p className="text-xs text-neutral-500 mt-6 p-3 bg-neutral-50 rounded-lg">
              💡 <strong>Affiliate Disclosure:</strong> We may earn a commission when you purchase through these links.
              This helps us maintain the platform and continue providing healthy product recommendations at no extra cost to you.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
