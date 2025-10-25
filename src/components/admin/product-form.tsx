'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductFormProps {
  product?: any;
  brands: any[];
  categories: any[];
  badges: any[];
}

export function ProductForm({ product, brands, categories, badges }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(
    product?.badges?.map((b: any) => b.badgeId) || []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      brandId: formData.get('brandId'),
      categoryId: formData.get('categoryId'),
      shortSummary: formData.get('shortSummary'),
      description: formData.get('description'),
      ingredientsText: formData.get('ingredientsText'),
      allergensText: formData.get('allergensText'),
      healthScore: parseInt(formData.get('healthScore') as string) || 0,
      isPalmOilFree: formData.get('isPalmOilFree') === 'on',
      isArtificialColorFree: formData.get('isArtificialColorFree') === 'on',
      isLowSugar: formData.get('isLowSugar') === 'on',
      isWholeGrain: formData.get('isWholeGrain') === 'on',
      isMeetsStandard: formData.get('isMeetsStandard') === 'on',
      badges: selectedBadges,
    };

    try {
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        alert('Error saving product');
      }
    } catch (error) {
      alert('Error saving product');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBadge = (badgeId: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badgeId) ? prev.filter((id) => id !== badgeId) : [...prev, badgeId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={product?.title}
                required
                placeholder="e.g., True Elements Roasted Mixed Nuts"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={product?.slug}
                required
                placeholder="e.g., true-elements-roasted-mixed-nuts"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="brandId">Brand *</Label>
              <select
                id="brandId"
                name="brandId"
                defaultValue={product?.brandId}
                required
                className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="categoryId">Category *</Label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={product?.categoryId}
                required
                className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="shortSummary">Short Summary</Label>
            <textarea
              id="shortSummary"
              name="shortSummary"
              defaultValue={product?.shortSummary || ''}
              rows={2}
              className="flex w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
              placeholder="Brief description for product cards"
            />
          </div>

          <div>
            <Label htmlFor="description">Full Description</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={product?.description || ''}
              rows={4}
              className="flex w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
              placeholder="Detailed product description"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingredients & Nutrition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ingredientsText">Ingredients List</Label>
            <textarea
              id="ingredientsText"
              name="ingredientsText"
              defaultValue={product?.ingredientsText || ''}
              rows={3}
              className="flex w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
              placeholder="e.g., Almonds, Cashews, Walnuts, Sea Salt"
            />
          </div>

          <div>
            <Label htmlFor="allergensText">Allergens</Label>
            <Input
              id="allergensText"
              name="allergensText"
              defaultValue={product?.allergensText || ''}
              placeholder="e.g., Tree nuts"
            />
          </div>

          <div>
            <Label htmlFor="healthScore">Health Score (0-100)</Label>
            <Input
              id="healthScore"
              name="healthScore"
              type="number"
              min="0"
              max="100"
              defaultValue={product?.healthScore || 50}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPalmOilFree"
              defaultChecked={product?.isPalmOilFree}
              className="rounded border-neutral-300"
            />
            <span className="text-sm">Palm Oil Free</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isArtificialColorFree"
              defaultChecked={product?.isArtificialColorFree}
              className="rounded border-neutral-300"
            />
            <span className="text-sm">No Artificial Colors</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isLowSugar"
              defaultChecked={product?.isLowSugar}
              className="rounded border-neutral-300"
            />
            <span className="text-sm">Low Sugar</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isWholeGrain"
              defaultChecked={product?.isWholeGrain}
              className="rounded border-neutral-300"
            />
            <span className="text-sm">Whole Grain</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isMeetsStandard"
              defaultChecked={product?.isMeetsStandard}
              className="rounded border-neutral-300"
            />
            <span className="text-sm font-medium">Meets HealthPeDhyan™ Standard</span>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <button
                key={badge.id}
                type="button"
                onClick={() => toggleBadge(badge.id)}
                className="transition-opacity hover:opacity-80"
              >
                <Badge variant={selectedBadges.includes(badge.id) ? 'success' : 'outline'}>
                  {badge.name}
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
