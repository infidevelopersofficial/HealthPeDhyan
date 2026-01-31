'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Plus,
  Trash2,
  ExternalLink,
  Package,
  ShoppingBag,
  Leaf,
  Shield,
  Tag,
  Link as LinkIcon,
  DollarSign,
  Image as ImageIcon,
  Info,
} from 'lucide-react';

interface AffiliateLink {
  id?: string;
  merchant: 'AMAZON' | 'FLIPKART' | 'OTHER';
  url: string;
  isActive: boolean;
  paramsJson?: {
    price?: number;
    originalPrice?: number;
    inStock?: boolean;
    deliveryInfo?: string;
  };
}

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
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(
    product?.affiliateLinks || []
  );
  const [heroImage, setHeroImage] = useState(product?.heroImage || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      brandId: formData.get('brandId'),
      categoryId: formData.get('categoryId'),
      heroImage: heroImage || null,
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
      affiliateLinks: affiliateLinks.map((link) => ({
        id: link.id,
        merchant: link.merchant,
        url: link.url,
        isActive: link.isActive,
        paramsJson: link.paramsJson,
      })),
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
        const error = await response.json();
        alert(`Error saving product: ${error.message || 'Unknown error'}`);
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

  const addAffiliateLink = () => {
    setAffiliateLinks((prev) => [
      ...prev,
      {
        merchant: 'AMAZON',
        url: '',
        isActive: true,
        paramsJson: {
          price: undefined,
          originalPrice: undefined,
          inStock: true,
          deliveryInfo: '',
        },
      },
    ]);
  };

  const updateAffiliateLink = (index: number, updates: Partial<AffiliateLink>) => {
    setAffiliateLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, ...updates } : link))
    );
  };

  const removeAffiliateLink = (index: number) => {
    setAffiliateLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Enter the basic product details. All fields marked with * are required.
          </CardDescription>
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
                onChange={(e) => {
                  if (!product) {
                    const slugInput = document.getElementById('slug') as HTMLInputElement;
                    if (slugInput && !slugInput.value) {
                      slugInput.value = generateSlug(e.target.value);
                    }
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={product?.slug}
                required
                placeholder="e.g., true-elements-roasted-mixed-nuts"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Used in the product URL: /product/your-slug-here
              </p>
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
                className="flex h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                className="flex h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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

          {/* Hero Image */}
          <div>
            <Label htmlFor="heroImage" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Product Image URL
            </Label>
            <Input
              id="heroImage"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              placeholder="https://example.com/product-image.jpg"
            />
            {heroImage && (
              <div className="mt-2 flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 border">
                  <img
                    src={heroImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                      (e.target as HTMLImageElement).alt = 'Invalid URL';
                    }}
                  />
                </div>
                <p className="text-xs text-neutral-500">Image preview</p>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="shortSummary">Short Summary</Label>
            <textarea
              id="shortSummary"
              name="shortSummary"
              defaultValue={product?.shortSummary || ''}
              rows={2}
              className="flex w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Brief description shown on product cards (1-2 sentences)"
            />
          </div>

          <div>
            <Label htmlFor="description">Full Description</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={product?.description || ''}
              rows={5}
              className="flex w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Detailed product description with health benefits and reasons for recommendation"
            />
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Affiliate Links
              </CardTitle>
              <CardDescription>
                Add buying links from Amazon, Flipkart, or other vendors. This is how you earn commissions.
              </CardDescription>
            </div>
            <Button type="button" variant="outline" onClick={addAffiliateLink}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {affiliateLinks.length === 0 ? (
            <div className="text-center py-8 bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
              <ShoppingBag className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600 mb-2">No affiliate links added yet</p>
              <p className="text-sm text-neutral-500 mb-4">
                Add vendor links so users can buy this product
              </p>
              <Button type="button" variant="outline" onClick={addAffiliateLink}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Vendor
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {affiliateLinks.map((link, index) => (
                <div
                  key={index}
                  className="p-4 border border-neutral-200 rounded-xl bg-white space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <select
                        value={link.merchant}
                        onChange={(e) =>
                          updateAffiliateLink(index, { merchant: e.target.value as any })
                        }
                        className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm"
                      >
                        <option value="AMAZON">Amazon</option>
                        <option value="FLIPKART">Flipkart</option>
                        <option value="OTHER">Other</option>
                      </select>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={link.isActive}
                          onCheckedChange={(checked) =>
                            updateAffiliateLink(index, { isActive: checked })
                          }
                        />
                        <span className="text-sm text-neutral-600">
                          {link.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeAffiliateLink(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Affiliate URL *
                    </Label>
                    <Input
                      value={link.url}
                      onChange={(e) => updateAffiliateLink(index, { url: e.target.value })}
                      placeholder="https://www.amazon.in/dp/B07..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price (INR)
                      </Label>
                      <Input
                        type="number"
                        value={link.paramsJson?.price || ''}
                        onChange={(e) =>
                          updateAffiliateLink(index, {
                            paramsJson: {
                              ...link.paramsJson,
                              price: e.target.value ? parseInt(e.target.value) : undefined,
                            },
                          })
                        }
                        placeholder="299"
                      />
                    </div>
                    <div>
                      <Label>Original Price</Label>
                      <Input
                        type="number"
                        value={link.paramsJson?.originalPrice || ''}
                        onChange={(e) =>
                          updateAffiliateLink(index, {
                            paramsJson: {
                              ...link.paramsJson,
                              originalPrice: e.target.value ? parseInt(e.target.value) : undefined,
                            },
                          })
                        }
                        placeholder="399"
                      />
                    </div>
                    <div>
                      <Label>Delivery Info</Label>
                      <Input
                        value={link.paramsJson?.deliveryInfo || ''}
                        onChange={(e) =>
                          updateAffiliateLink(index, {
                            paramsJson: {
                              ...link.paramsJson,
                              deliveryInfo: e.target.value,
                            },
                          })
                        }
                        placeholder="2-3 days"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 h-11">
                        <input
                          type="checkbox"
                          checked={link.paramsJson?.inStock !== false}
                          onChange={(e) =>
                            updateAffiliateLink(index, {
                              paramsJson: {
                                ...link.paramsJson,
                                inStock: e.target.checked,
                              },
                            })
                          }
                          className="rounded border-neutral-300"
                        />
                        <span className="text-sm">In Stock</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Affiliate links will be automatically tagged with your affiliate IDs when displayed to users. Make sure to use clean product URLs.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients & Nutrition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            Ingredients & Nutrition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ingredientsText">Ingredients List</Label>
            <textarea
              id="ingredientsText"
              name="ingredientsText"
              defaultValue={product?.ingredientsText || ''}
              rows={3}
              className="flex w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Copy the full ingredients list from the product label"
            />
          </div>

          <div>
            <Label htmlFor="allergensText">Allergens</Label>
            <Input
              id="allergensText"
              name="allergensText"
              defaultValue={product?.allergensText || ''}
              placeholder="e.g., Contains: Tree nuts, Milk, Soy"
            />
          </div>

          <div>
            <Label htmlFor="healthScore">Health Score (0-100)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="healthScore"
                name="healthScore"
                type="number"
                min="0"
                max="100"
                defaultValue={product?.healthScore || 50}
                className="w-32"
              />
              <div className="flex-1">
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-red-50 text-red-700">0-59: Fair</Badge>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">60-79: Good</Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700">80-100: Excellent</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Health Flags
          </CardTitle>
          <CardDescription>
            Select the health benefits that apply to this product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer">
              <input
                type="checkbox"
                name="isPalmOilFree"
                defaultChecked={product?.isPalmOilFree}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <span className="font-medium text-neutral-900">Palm Oil Free</span>
                <p className="text-xs text-neutral-500">No palm oil or derivatives</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer">
              <input
                type="checkbox"
                name="isArtificialColorFree"
                defaultChecked={product?.isArtificialColorFree}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <span className="font-medium text-neutral-900">No Artificial Colors</span>
                <p className="text-xs text-neutral-500">Only natural coloring agents</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer">
              <input
                type="checkbox"
                name="isLowSugar"
                defaultChecked={product?.isLowSugar}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <span className="font-medium text-neutral-900">Low Sugar</span>
                <p className="text-xs text-neutral-500">Reduced sugar content</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer">
              <input
                type="checkbox"
                name="isWholeGrain"
                defaultChecked={product?.isWholeGrain}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <span className="font-medium text-neutral-900">Whole Grain</span>
                <p className="text-xs text-neutral-500">Made with whole grains</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-primary-200 bg-primary-50 rounded-xl hover:bg-primary-100 cursor-pointer md:col-span-2">
              <input
                type="checkbox"
                name="isMeetsStandard"
                defaultChecked={product?.isMeetsStandard}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <span className="font-medium text-primary-900">Meets HealthPeDhyan Standard</span>
                <p className="text-xs text-primary-700">Product passes all our health criteria and is recommended</p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Health Badges
          </CardTitle>
          <CardDescription>
            Select certification badges that apply to this product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <button
                key={badge.id}
                type="button"
                onClick={() => toggleBadge(badge.id)}
                className="transition-all hover:scale-105"
              >
                <Badge
                  variant={selectedBadges.includes(badge.id) ? 'success' : 'outline'}
                  className="cursor-pointer px-4 py-2"
                >
                  {badge.name}
                </Badge>
              </button>
            ))}
          </div>
          {badges.length === 0 && (
            <p className="text-sm text-neutral-500">
              No badges available. Create badges in the Badges section first.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4 sticky bottom-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-lg">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="px-8">
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
