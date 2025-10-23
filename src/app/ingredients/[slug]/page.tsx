import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateMetadata as genMeta } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const ingredient = await prisma.ingredient.findUnique({
    where: { slug: params.slug },
  });

  if (!ingredient) return {};

  return genMeta({
    title: `${ingredient.name} - Ingredient Guide`,
    description: ingredient.description || '',
  });
}

export default async function IngredientPage({ params }: { params: { slug: string } }) {
  const ingredient = await prisma.ingredient.findUnique({
    where: { slug: params.slug },
  });

  if (!ingredient) {
    notFound();
  }

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
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <Badge variant={getRiskVariant(ingredient.riskLevel)} className="mb-4">
          {ingredient.riskLevel} RISK
        </Badge>
        <h1 className="text-4xl font-bold text-neutral-900">{ingredient.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What is it?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-700 whitespace-pre-line">{ingredient.description}</p>
        </CardContent>
      </Card>

      {ingredient.aliasesJson && (ingredient.aliasesJson as any).aliases && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Also Known As</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {((ingredient.aliasesJson as any).aliases as string[]).map((alias) => (
                <Badge key={alias} variant="secondary">
                  {alias}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {ingredient.referencesJson && (ingredient.referencesJson as any).references && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>References</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-neutral-600">
              {((ingredient.referencesJson as any).references as string[]).map((ref) => (
                <li key={ref}>{ref}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
