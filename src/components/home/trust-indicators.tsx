import { Shield, Users, Award, BadgeCheck, FileCheck, Microscope } from 'lucide-react';

const trustItems = [
  {
    icon: Shield,
    title: 'Strict Standards',
    description: 'Every product vetted against our health criteria',
  },
  {
    icon: Microscope,
    title: 'Ingredient Analysis',
    description: 'Deep dive into every ingredient list',
  },
  {
    icon: BadgeCheck,
    title: 'No Hidden Nasties',
    description: 'No palm oil, trans fats, or artificial colors',
  },
  {
    icon: FileCheck,
    title: 'Research-Backed',
    description: 'Recommendations based on scientific evidence',
  },
  {
    icon: Award,
    title: 'Health Score',
    description: 'Clear 0-100 rating for easy decisions',
  },
  {
    icon: Users,
    title: 'Community Trusted',
    description: 'Thousands of health-conscious families',
  },
];

export function TrustIndicators() {
  return (
    <section className="py-12 bg-neutral-50 border-y border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustItems.map((item) => (
            <div key={item.title} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm border border-neutral-200 mb-3">
                <item.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 text-sm">{item.title}</h3>
              <p className="text-xs text-neutral-500 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
