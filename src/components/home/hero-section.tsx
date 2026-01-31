'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Scan, ArrowRight, Shield, Leaf, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  stats: {
    productCount: number;
    articleCount: number;
    brandCount: number;
  };
}

export function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-green-50 py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              India&apos;s Trusted Health Product Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-tight">
              Discover{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-green-600">
                Healthier
              </span>{' '}
              Products for Your Family
            </h1>

            <p className="mt-6 text-lg lg:text-xl text-neutral-600 max-w-xl leading-relaxed">
              We analyze ingredients, compare prices across vendors, and recommend only products that meet our strict health standards. No palm oil, low sugar, no artificial colors.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base px-8 py-6 rounded-xl shadow-lg shadow-primary-500/25">
                <Link href="/shop">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Shop Healthy Products
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 py-6 rounded-xl">
                <Link href="/scan-label">
                  <Scan className="w-5 h-5 mr-2" />
                  Scan a Product Label
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-neutral-900">{stats.productCount}+</p>
                <p className="text-sm text-neutral-600 mt-1">Healthy Products</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-neutral-900">{stats.brandCount}+</p>
                <p className="text-sm text-neutral-600 mt-1">Trusted Brands</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-neutral-900">{stats.articleCount}+</p>
                <p className="text-sm text-neutral-600 mt-1">Health Articles</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:pl-8"
          >
            <div className="grid gap-4">
              {/* Feature Card 1 */}
              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg border border-neutral-100 hover:shadow-xl transition-shadow">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Palm Oil Free</h3>
                  <p className="text-sm text-neutral-600 mt-1">All products verified free from palm oil and its derivatives</p>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg border border-neutral-100 hover:shadow-xl transition-shadow">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Health Score Rating</h3>
                  <p className="text-sm text-neutral-600 mt-1">Every product rated 0-100 based on nutritional value</p>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg border border-neutral-100 hover:shadow-xl transition-shadow">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Best Price Comparison</h3>
                  <p className="text-sm text-neutral-600 mt-1">Compare prices from Amazon, Flipkart and more</p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 lg:top-0 lg:right-0 bg-gradient-to-br from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
              100% Free
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
