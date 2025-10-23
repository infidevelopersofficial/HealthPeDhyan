export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <h1 className="text-4xl font-bold text-neutral-900 mb-8">Terms of Service</h1>
      <div className="prose prose-neutral">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using HealthPeDhyan, you agree to be bound by these Terms of Service.
        </p>

        <h2>Use of Service</h2>
        <p>
          Our service is provided for informational purposes only. Product recommendations are based
          on our research and standards, but individual health needs vary. Always consult with
          healthcare professionals for personalized advice.
        </p>

        <h2>Affiliate Links</h2>
        <p>
          HealthPeDhyan contains affiliate links. We earn commissions from qualifying purchases at
          no extra cost to you. This helps us keep our service free.
        </p>

        <h2>Accuracy of Information</h2>
        <p>
          While we strive for accuracy, product formulations may change. Always read product labels
          before purchasing.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on HealthPeDhyan is owned by us or our licensors and is protected by
          copyright laws.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          HealthPeDhyan is not liable for any damages arising from the use of our service or
          products purchased through affiliate links.
        </p>

        <h2>Contact</h2>
        <p>Questions about these Terms? Contact us at hello@healthpedhyan.com</p>
      </div>
    </div>
  );
}
