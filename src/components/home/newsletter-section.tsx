'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative rounded-3xl bg-white/10 backdrop-blur-sm p-8 lg:p-12 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
                <Mail className="w-4 h-4" />
                Join 10,000+ Health-Conscious Shoppers
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Get Weekly Health Product Recommendations
              </h2>

              <p className="text-lg text-white/80 mb-6">
                Subscribe to receive curated healthy product picks, exclusive deals, and nutrition tips straight to your inbox. No spam, unsubscribe anytime.
              </p>

              <ul className="space-y-3">
                {[
                  'New healthy product discoveries',
                  'Exclusive discount codes',
                  'Nutrition tips and recipes',
                  'Early access to new features',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/90">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Content - Form */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">You&apos;re subscribed!</h3>
                  <p className="text-neutral-600">
                    Check your inbox for a confirmation email. Welcome to the HealthPeDhyan community!
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    Subscribe to Our Newsletter
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Join our community and never miss a healthy product recommendation.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 text-base"
                    >
                      {isLoading ? (
                        'Subscribing...'
                      ) : (
                        <>
                          Subscribe Now
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="text-xs text-neutral-500 mt-4 text-center">
                    By subscribing, you agree to our Privacy Policy. We respect your inbox.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
