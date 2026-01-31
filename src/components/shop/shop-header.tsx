'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Leaf, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ShopHeaderProps {
  productCount: number;
  stats: {
    total: number;
    palmOilFree: number;
    lowSugar: number;
    meetsStandard: number;
  };
  searchParams: { [key: string]: string | undefined };
}

export function ShopHeader({ productCount, stats, searchParams }: ShopHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    if (searchQuery.trim()) {
      url.searchParams.set('search', searchQuery.trim());
    } else {
      url.searchParams.delete('search');
    }
    router.push(url.pathname + url.search);
  };

  const clearSearch = () => {
    setSearchQuery('');
    const url = new URL(window.location.href);
    url.searchParams.delete('search');
    router.push(url.pathname + url.search);
  };

  return (
    <section className="bg-gradient-to-br from-primary-50 via-white to-green-50 py-12 border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          {/* Left Content */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-8 h-8 text-primary-600" />
              <Badge variant="secondary">Curated Collection</Badge>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">
              Shop Healthy Products
            </h1>
            <p className="text-neutral-600 max-w-xl">
              Every product is carefully vetted against our health standards. No palm oil, no artificial colors, low sugar. Compare prices and buy from your preferred vendor.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-neutral-200 shadow-sm">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">{stats.palmOilFree} Palm Oil Free</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-neutral-200 shadow-sm">
                <span className="text-sm">🍯</span>
                <span className="text-sm font-medium">{stats.lowSugar} Low Sugar</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-neutral-200 shadow-sm">
                <Shield className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium">{stats.meetsStandard} Meet Standards</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full lg:w-96">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                type="search"
                placeholder="Search products, brands, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-24 h-14 text-base rounded-2xl border-2 border-neutral-200 focus:border-primary-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-24 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded-full"
                >
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              )}
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
              >
                Search
              </Button>
            </form>
            <p className="text-xs text-neutral-500 mt-2 text-center lg:text-left">
              Try: &quot;muesli&quot;, &quot;oats&quot;, &quot;peanut butter&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
