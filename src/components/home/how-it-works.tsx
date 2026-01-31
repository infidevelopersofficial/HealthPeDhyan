import { Search, Shield, ShoppingCart, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Browse or Search',
    description: 'Explore our curated catalog of healthy products or search for specific items. Filter by dietary preferences and health goals.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    step: '02',
    icon: Shield,
    title: 'Check Health Score',
    description: 'Every product has a health score (0-100) based on ingredients, nutrition, and our strict standards. Make informed decisions.',
    color: 'bg-green-100 text-green-600',
  },
  {
    step: '03',
    icon: ShoppingCart,
    title: 'Compare & Buy',
    description: 'Compare prices across Amazon, Flipkart, and other vendors. Click to buy from your preferred store at the best price.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    step: '04',
    icon: Heart,
    title: 'Save & Track',
    description: 'Bookmark your favorites, create shopping lists, and track your journey to healthier eating. Get personalized recommendations.',
    color: 'bg-rose-100 text-rose-600',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">Simple Process</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
            How HealthPeDhyan Works
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            We make it easy to find and buy healthy products. No complicated research needed - we&apos;ve done the hard work for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector Line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-neutral-300 to-transparent -translate-x-8 z-0" />
              )}

              <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-lg transition-shadow z-10">
                {/* Step Number */}
                <div className="absolute -top-4 -left-2 text-6xl font-bold text-neutral-100 select-none">
                  {step.step}
                </div>

                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${step.color}`}>
                  <step.icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-neutral-600 mb-4">
            Ready to start your healthy shopping journey?
          </p>
          <a
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25"
          >
            <ShoppingCart className="w-5 h-5" />
            Start Shopping Now
          </a>
        </div>
      </div>
    </section>
  );
}
