'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { User, UserProfile } from '@prisma/client';

interface ProfileFormProps {
  user: User;
  profile: UserProfile | null;
}

const HEALTH_GOALS = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'heart_health', label: 'Heart Health' },
  { value: 'digestive_health', label: 'Digestive Health' },
  { value: 'energy_boost', label: 'Energy Boost' },
  { value: 'immunity', label: 'Immunity Boost' },
  { value: 'stress_management', label: 'Stress Management' },
  { value: 'better_sleep', label: 'Better Sleep' },
];

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Account info
    name: user.name || '',

    // Dietary preferences
    isVegetarian: profile?.isVegetarian || false,
    isVegan: profile?.isVegan || false,
    isGlutenFree: profile?.isGlutenFree || false,
    isDairyFree: profile?.isDairyFree || false,
    isNutFree: profile?.isNutFree || false,
    isKeto: profile?.isKeto || false,
    isPaleo: profile?.isPaleo || false,

    // Health goals (stored as JSON array)
    healthGoals: (profile?.healthGoals as string[]) || [],

    // Allergies (comma-separated input, stored as JSON array)
    allergies: ((profile?.allergies as string[]) || []).join(', '),

    // Ingredients to avoid (comma-separated input, stored as JSON array)
    avoidIngredients: ((profile?.avoidIngredients as string[]) || []).join(', '),

    // Preferred merchant
    preferredMerchant: profile?.preferredMerchant || '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleHealthGoalToggle = (goalValue: string) => {
    setFormData(prev => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goalValue)
        ? prev.healthGoals.filter(g => g !== goalValue)
        : [...prev.healthGoals, goalValue]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      // Convert comma-separated strings to arrays
      const allergiesArray = formData.allergies
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      const avoidIngredientsArray = formData.avoidIngredients
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0);

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          profile: {
            isVegetarian: formData.isVegetarian,
            isVegan: formData.isVegan,
            isGlutenFree: formData.isGlutenFree,
            isDairyFree: formData.isDairyFree,
            isNutFree: formData.isNutFree,
            isKeto: formData.isKeto,
            isPaleo: formData.isPaleo,
            healthGoals: formData.healthGoals,
            allergies: allergiesArray,
            avoidIngredients: avoidIngredientsArray,
            preferredMerchant: formData.preferredMerchant || null,
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update profile');
        return;
      }

      setSuccess(true);
      router.refresh();

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>Profile updated successfully!</AlertDescription>
        </Alert>
      )}

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dietary Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Dietary Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'isVegetarian', label: 'Vegetarian' },
              { key: 'isVegan', label: 'Vegan' },
              { key: 'isGlutenFree', label: 'Gluten-Free' },
              { key: 'isDairyFree', label: 'Dairy-Free' },
              { key: 'isNutFree', label: 'Nut-Free' },
              { key: 'isKeto', label: 'Keto' },
              { key: 'isPaleo', label: 'Paleo' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <Label htmlFor={key}>{label}</Label>
                <Switch
                  id={key}
                  checked={formData[key as keyof typeof formData] as boolean}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, [key]: checked })
                  }
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Health Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HEALTH_GOALS.map((goal) => (
              <button
                key={goal.value}
                type="button"
                onClick={() => handleHealthGoalToggle(goal.value)}
                disabled={isLoading}
                className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.healthGoals.includes(goal.value)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {goal.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Allergies & Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle>Allergies & Restrictions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="allergies">Allergies</Label>
            <Input
              id="allergies"
              type="text"
              placeholder="e.g., peanuts, shellfish, soy"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple items with commas
            </p>
          </div>

          <div>
            <Label htmlFor="avoidIngredients">Ingredients to Avoid</Label>
            <Input
              id="avoidIngredients"
              type="text"
              placeholder="e.g., high fructose corn syrup, artificial sweeteners"
              value={formData.avoidIngredients}
              onChange={(e) => setFormData({ ...formData, avoidIngredients: e.target.value })}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple items with commas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Shopping Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="preferredMerchant">Preferred Merchant (Optional)</Label>
            <Input
              id="preferredMerchant"
              type="text"
              placeholder="e.g., Amazon, BigBasket, Flipkart"
              value={formData.preferredMerchant}
              onChange={(e) => setFormData({ ...formData, preferredMerchant: e.target.value })}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll prioritize links from your preferred merchant when available
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard')}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
