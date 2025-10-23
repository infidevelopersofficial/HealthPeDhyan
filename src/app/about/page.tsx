import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
  title: 'About Us',
  description:
    'Learn about HealthPeDhyan and our mission to make healthy food choices easier for everyone.',
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <h1 className="text-4xl font-bold text-neutral-900">About HealthPeDhyan</h1>

      <div className="prose prose-lg mt-8 text-neutral-700">
        <p>
          HealthPeDhyan was founded on a simple belief: choosing healthy food shouldn't require a
          nutrition degree.
        </p>

        <h2>Our Mission</h2>
        <p>
          We help Indian families discover healthier packaged foods by doing the research for you.
          Every product in our catalog is evaluated for palm oil, artificial additives, sugar
          content, and ingredient quality.
        </p>

        <h2>Why We Started</h2>
        <p>
          Reading nutrition labels is time-consuming and confusing. Terms like "vegetable oil" can
          hide palm oil. "Natural flavors" don't always mean healthy. We decode the labels so you
          can shop with confidence.
        </p>

        <h2>What Makes Us Different</h2>
        <ul>
          <li>Evidence-based standards backed by WHO, FSSAI, and peer-reviewed research</li>
          <li>No sponsored placements - products earn badges through quality alone</li>
          <li>Transparent methodology - see exactly how we evaluate each product</li>
          <li>Focus on accessibility - healthier choices for every budget</li>
        </ul>

        <h2>Our Values</h2>
        <p>
          <strong>Transparency:</strong> We clearly disclose affiliate relationships and how we make
          money.
          <br />
          <strong>Evidence:</strong> Every claim is backed by scientific research.
          <br />
          <strong>Independence:</strong> Brands can't pay for better ratings.
        </p>

        <h2>Get in Touch</h2>
        <p>
          Have questions or product suggestions? We'd love to hear from you. Visit our{' '}
          <a href="/contact" className="text-primary-600 hover:underline">
            contact page
          </a>
          .
        </p>
      </div>
    </div>
  );
}
