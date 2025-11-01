'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface AffiliateButtonProps {
  href: string;
  merchant: string;
  productId: string;
  onClick?: () => void;
}

export function AffiliateButton({ href, merchant, productId, onClick }: AffiliateButtonProps) {
  const handleClick = () => {
    // GA4 event tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        product_id: productId,
        merchant: merchant,
        url: href,
      });
    }

    onClick?.();
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block"
      onClick={handleClick}
    >
      <Button className="w-full" size="lg">
        <ExternalLink className="mr-2 h-4 w-4" />
        Buy on {merchant}
      </Button>
    </a>
  );
}
