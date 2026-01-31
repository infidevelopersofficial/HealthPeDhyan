import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Category icons mapping
const categoryIcons: Record<string, string> = {
  snacks: '🍿',
  breakfast: '🥣',
  beverages: '🥤',
  dairy: '🥛',
  condiments: '🫙',
  grains: '🌾',
  spreads: '🥜',
  sweets: '🍫',
  biscuits: '🍪',
  cereals: '🥣',
  oils: '🫒',
  default: '📦',
};

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
}

interface CategoryShowcaseProps {
  categories: Category[];
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  const getIcon = (slug: string) => {
    return categoryIcons[slug.toLowerCase()] || categoryIcons.default;
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <Badge variant="secondary" className="mb-3">Browse Categories</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
              Shop by Category
            </h2>
            <p className="mt-2 text-neutral-600">
              Find healthy alternatives in every food category
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit">
            <Link href="/shop">
              View All Categories
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary-300"
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(category.slug)}
                </span>
                <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {category._count.products} {category._count.products === 1 ? 'product' : 'products'}
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-primary-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
