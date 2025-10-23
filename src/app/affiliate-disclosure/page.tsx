export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <h1 className="text-4xl font-bold text-neutral-900 mb-8">Affiliate Disclosure</h1>
      <div className="prose prose-neutral">
        <p>
          HealthPeDhyan is committed to transparency about how we make money and maintain our
          independence.
        </p>

        <h2>How We Make Money</h2>
        <p>
          When you click on a "Buy on Amazon" or "Buy on Flipkart" button and make a purchase, we
          may earn a small commission at no extra cost to you. These are called affiliate links.
        </p>

        <h2>Our Independence</h2>
        <p>
          <strong>Important:</strong> Our product recommendations are based solely on our health
          standards. Brands cannot pay to be featured or to receive better ratings.
        </p>
        <ul>
          <li>Every product is evaluated using the same criteria</li>
          <li>Affiliate commissions don't influence our reviews</li>
          <li>We decline partnerships that compromise our editorial independence</li>
        </ul>

        <h2>Why We Use Affiliate Links</h2>
        <p>
          Affiliate commissions allow us to keep HealthPeDhyan free for everyone. They fund our
          research, content creation, and platform maintenance.
        </p>

        <h2>Your Trust Matters</h2>
        <p>
          We take our responsibility seriously. If you ever feel a product recommendation is biased
          or inaccurate, please let us know immediately.
        </p>

        <h2>FTC Compliance</h2>
        <p>
          This disclosure is in accordance with the Federal Trade Commission's guidelines on
          endorsements and testimonials.
        </p>

        <p className="mt-8">
          Questions? Contact us at{' '}
          <a href="mailto:hello@healthpedhyan.com" className="text-primary-600 hover:underline">
            hello@healthpedhyan.com
          </a>
        </p>
      </div>
    </div>
  );
}
