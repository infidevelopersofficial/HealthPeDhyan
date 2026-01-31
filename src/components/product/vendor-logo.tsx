'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

type Merchant = 'AMAZON' | 'FLIPKART' | 'OTHER';

interface VendorLogoProps {
  merchant: Merchant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

const vendorConfig: Record<Merchant, { name: string; bgColor: string; textColor: string; icon: string }> = {
  AMAZON: {
    name: 'Amazon',
    bgColor: 'bg-[#FF9900]/10',
    textColor: 'text-[#FF9900]',
    icon: '🛒',
  },
  FLIPKART: {
    name: 'Flipkart',
    bgColor: 'bg-[#2874F0]/10',
    textColor: 'text-[#2874F0]',
    icon: '🛍️',
  },
  OTHER: {
    name: 'Store',
    bgColor: 'bg-neutral-100',
    textColor: 'text-neutral-700',
    icon: '🏪',
  },
};

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

export function VendorLogo({ merchant, size = 'md', className, showLabel = false }: VendorLogoProps) {
  const config = vendorConfig[merchant] || vendorConfig.OTHER;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-xl flex items-center justify-center font-bold',
          config.bgColor,
          sizeClasses[size]
        )}
      >
        <span>{config.icon}</span>
      </div>
      {showLabel && (
        <span className={cn('font-semibold', config.textColor)}>{config.name}</span>
      )}
    </div>
  );
}

export function VendorBadge({ merchant, className }: { merchant: Merchant; className?: string }) {
  const config = vendorConfig[merchant] || vendorConfig.OTHER;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <span>{config.icon}</span>
      {config.name}
    </span>
  );
}

export { vendorConfig };
export type { Merchant };
