import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function IngredientsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Ingredients</h1>
        <p className="mt-2 text-neutral-600">Manage ingredient database</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            Ingredient management interface will be available here. You can manage ingredient information, health risks, and references.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
