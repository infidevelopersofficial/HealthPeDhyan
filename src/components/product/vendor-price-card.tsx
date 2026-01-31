'use client';

import { ExternalLink, TrendingDown, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VendorLogo, type Merchant } from './vendor-logo';
import { cn } from '@/lib/utils';

interface VendorPriceCardProps {
  merchant: Merchant;
  url: string;
  price?: number;
  originalPrice?: number;
  inStock?: boolean;
  deliveryInfo?: string;
  rating?: number;
  reviewCount?: number;
  isBestPrice?: boolean;
  productId: string;
  onBuyClick?: (merchant: Merchant, url: string) => void;
}

export function VendorPriceCard({
  merchant,
  url,
  price,
  originalPrice,
  inStock = true,
  deliveryInfo,
  rating,
  reviewCount,
  isBestPrice = false,
  productId,
  onBuyClick,
}: VendorPriceCardProps) {
  const discount = originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleClick = () => {
    // Track affiliate click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        product_id: productId,
        merchant: merchant,
        url: url,
      });
    }

    onBuyClick?.(merchant, url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all hover:shadow-md',
        isBestPrice ? 'border-green-300 bg-green-50/50' : 'border-neutral-200 bg-white hover:border-primary-300'
      )}
    >
      {/* Best Price Badge */}
      {isBestPrice && (
        <div className="absolute -top-3 left-4">
          <Badge variant="success" className="shadow-sm">
            <TrendingDown className="w-3 h-3 mr-1" />
            Best Price
          </Badge>
        </div>
      )}

      {/* Left: Vendor Info */}
      <div className="flex items-center gap-4">
        <VendorLogo merchant={merchant} size="lg" />
        <div>
          <p className="font-semibold text-neutral-900">
            {merchant === 'AMAZON' ? 'Amazon India' : merchant === 'FLIPKART' ? 'Flipkart' : 'Other Store'}
          </p>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            {rating && (
              <span className="flex items-center gap-1">
                <span className="text-amber-500">★</span>
                {rating.toFixed(1)}
                {reviewCount && <span className="text-neutral-400">({reviewCount.toLocaleString()})</span>}
              </span>
            )}
            {inStock ? (
              <span className="flex items-center gap-1 text-green-600">
                <Check className="w-3 h-3" />
                In Stock
              </span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </div>
          {deliveryInfo && (
            <p className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
              <Clock className="w-3 h-3" />
              {deliveryInfo}
            </p>
          )}
        </div>
      </div>

      {/* Right: Price & CTA */}
      <div className="text-right">
        {price ? (
          <div className="mb-2">
            <div className="flex items-center justify-end gap-2">
              {discount > 0 && (
                <Badge variant="success" className="text-xs">
                  {discount}% OFF
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-neutral-900">
              ₹{price.toLocaleString('en-IN')}
            </p>
            {originalPrice && originalPrice > price && (
              <p className="text-sm text-neutral-500 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 mb-2">Check price on site</p>
        )}

        <Button
          onClick={handleClick}
          disabled={!inStock}
          className={cn(
            'gap-2',
            isBestPrice && 'bg-green-600 hover:bg-green-700'
          )}
        >
          Buy Now
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Compact version for product cards
export function VendorPriceCompact({
  merchant,
  price,
  url,
  productId,
}: {
  merchant: Merchant;
  price?: number;
  url: string;
  productId: string;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Track affiliate click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        product_id: productId,
        merchant: merchant,
        url: url,
      });
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 transition-all text-sm"
    >
      <VendorLogo merchant={merchant} size="sm" />
      <div className="text-left">
        <p className="font-medium text-neutral-900 text-xs">
          {merchant === 'AMAZON' ? 'Amazon' : merchant === 'FLIPKART' ? 'Flipkart' : 'Store'}
        </p>
        {price && (
          <p className="font-bold text-primary-600">₹{price.toLocaleString('en-IN')}</p>
        )}
      </div>
    </button>
  );
}
