import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
  title: 'Ingredient Explorer',
  description: 'Learn about common food ingredients, their health impacts, and better alternatives.',
});

export default async function IngredientsPage() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { name: 'asc' },
  });

  const getRiskVariant = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'destructive';
      case 'MODERATE':
        return 'warning';
      default:
        return 'success';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-neutral-900">Ingredient Explorer</h1>
        <p className="mt-2 text-lg text-neutral-600">
          Understand what's in your food and make informed choices
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ingredients.map((ingredient) => (
          <Card key={ingredient.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle>
                  <Link
                    href={`/ingredients/${ingredient.slug}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {ingredient.name}
                  </Link>
                </CardTitle>
                <Badge variant={getRiskVariant(ingredient.riskLevel)}>{ingredient.riskLevel}</Badge>
              </div>
              <CardDescription className="line-clamp-3 mt-2">
                {ingredient.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/ingredients/${ingredient.slug}`}
                className="text-sm text-primary-600 hover:underline"
              >
                Read more →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
