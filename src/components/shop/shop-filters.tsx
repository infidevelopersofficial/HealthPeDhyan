'use client';

import { useRouter } from 'next/navigation';
import { Check, Leaf, Shield, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShopFiltersProps {
  searchParams: { [key: string]: string | undefined };
}

const filters = [
  {
    key: 'palmOilFree',
    label: 'Palm Oil Free',
    description: 'No palm oil or derivatives',
    icon: '🌴',
    color: 'green',
  },
  {
    key: 'lowSugar',
    label: 'Low Sugar',
    description: 'Reduced sugar content',
    icon: '🍯',
    color: 'amber',
  },
  {
    key: 'wholeGrain',
    label: 'Whole Grain',
    description: 'Made with whole grains',
    icon: '🌾',
    color: 'yellow',
  },
  {
    key: 'artificialColorFree',
    label: 'No Artificial Colors',
    description: 'Natural colors only',
    icon: '🎨',
    color: 'blue',
  },
  {
    key: 'meetsStandard',
    label: 'Meets Our Standards',
    description: 'Passes all health criteria',
    icon: '✓',
    color: 'primary',
  },
];

export function ShopFilters({ searchParams }: ShopFiltersProps) {
  const router = useRouter();

  const toggleFilter = (key: string) => {
    const url = new URL(window.location.href);
    const currentValue = url.searchParams.get(key);

    if (currentValue === 'true') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, 'true');
    }

    router.push(url.pathname + url.search);
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    if (!isActive) {
      return 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50';
    }

    const colorMap: Record<string, string> = {
      green: 'border-green-300 bg-green-50 text-green-700',
      amber: 'border-amber-300 bg-amber-50 text-amber-700',
      yellow: 'border-yellow-300 bg-yellow-50 text-yellow-700',
      blue: 'border-blue-300 bg-blue-50 text-blue-700',
      primary: 'border-primary-300 bg-primary-50 text-primary-700',
    };

    return colorMap[color] || colorMap.primary;
  };

  return (
    <div className="space-y-2">
      {filters.map((filter) => {
        const isActive = searchParams[filter.key] === 'true';

        return (
          <button
            key={filter.key}
            onClick={() => toggleFilter(filter.key)}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left',
              getColorClasses(filter.color, isActive)
            )}
          >
            <span className="text-lg flex-shrink-0">{filter.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={cn('font-medium text-sm', isActive ? '' : 'text-neutral-900')}>
                {filter.label}
              </p>
              <p className={cn('text-xs', isActive ? 'opacity-80' : 'text-neutral-500')}>
                {filter.description}
              </p>
            </div>
            <div
              className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                isActive
                  ? `bg-${filter.color === 'primary' ? 'primary' : filter.color}-600 text-white`
                  : 'border-2 border-neutral-300'
              )}
              style={isActive ? { backgroundColor: filter.color === 'primary' ? 'var(--primary-600)' : undefined } : undefined}
            >
              {isActive && <Check className="w-3 h-3" />}
            </div>
          </button>
        );
      })}

      {/* Health Score Filter */}
      <div className="pt-4 mt-4 border-t border-neutral-200">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Minimum Health Score
        </label>
        <div className="flex gap-2">
          {[60, 70, 80, 90].map((score) => {
            const isActive = searchParams.minScore === String(score);
            return (
              <button
                key={score}
                onClick={() => {
                  const url = new URL(window.location.href);
                  if (isActive) {
                    url.searchParams.delete('minScore');
                  } else {
                    url.searchParams.set('minScore', String(score));
                  }
                  router.push(url.pathname + url.search);
                }}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all',
                  isActive
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                )}
              >
                {score}+
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
