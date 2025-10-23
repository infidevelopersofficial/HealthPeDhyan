import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
  title: 'Our Health Standards',
  description:
    'Learn how we evaluate products for palm oil, sugar content, artificial additives, and more.',
});

export default function StandardsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-neutral-900">HealthPeDhyan Standards</h1>
        <p className="mt-4 text-lg text-neutral-600">
          We evaluate every product against strict health and sustainability criteria.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Badge variant="success" className="w-fit mb-2">
              EXCLUSIONS
            </Badge>
            <CardTitle>What We Avoid</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-neutral-900">Palm Oil</h3>
              <p className="text-sm text-neutral-600 mt-1">
                We exclude products containing palm oil and its derivatives due to environmental
                concerns and high saturated fat content.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Trans Fats</h3>
              <p className="text-sm text-neutral-600 mt-1">
                Products with partially hydrogenated oils or trans fats are automatically excluded.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Artificial Colors</h3>
              <p className="text-sm text-neutral-600 mt-1">
                Synthetic food dyes linked to hyperactivity in children are not permitted.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">High Fructose Corn Syrup</h3>
              <p className="text-sm text-neutral-600 mt-1">
                HFCS and similar refined sweeteners are excluded in favor of natural alternatives.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Badge variant="default" className="w-fit mb-2">
              THRESHOLDS
            </Badge>
            <CardTitle>Nutrient Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-neutral-900">Sugar Content</h3>
              <p className="text-sm text-neutral-600 mt-1">
                <strong>Low Sugar Badge:</strong> Less than 5g sugar per 100g
                <br />
                <strong>Acceptable:</strong> Less than 15g per 100g (natural sources preferred)
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Sodium</h3>
              <p className="text-sm text-neutral-600 mt-1">
                Maximum 400mg per 100g for most products
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Fiber</h3>
              <p className="text-sm text-neutral-600 mt-1">
                Preference for products with 3g+ fiber per serving
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Badge variant="default" className="w-fit mb-2">
              BADGES
            </Badge>
            <CardTitle>How Products Earn Badges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge variant="success">Palm Oil Free</Badge>
              <p className="text-sm text-neutral-600 mt-2">
                Contains no palm oil or palm oil derivatives in any form.
              </p>
            </div>
            <div>
              <Badge variant="success">Low Sugar</Badge>
              <p className="text-sm text-neutral-600 mt-2">
                Contains less than 5g sugar per 100g serving.
              </p>
            </div>
            <div>
              <Badge variant="success">Whole Grain</Badge>
              <p className="text-sm text-neutral-600 mt-2">
                Made primarily from whole grain ingredients (51% or more).
              </p>
            </div>
            <div>
              <Badge variant="success">No Artificial Colors</Badge>
              <p className="text-sm text-neutral-600 mt-2">
                Free from synthetic food coloring agents.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Commitment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-700">
              Every product is manually reviewed by our team. We read ingredient lists, check
              nutrition labels, and cross-reference with scientific evidence. Our standards are
              based on recommendations from WHO, FSSAI, and peer-reviewed research.
            </p>
            <p className="mt-4 text-neutral-700">
              We're transparent about our methodology and update our criteria as new research
              emerges.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
