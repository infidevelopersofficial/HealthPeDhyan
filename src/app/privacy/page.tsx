export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <h1 className="text-4xl font-bold text-neutral-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-neutral">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account,
          subscribe to our newsletter, or contact us for support.
        </p>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Send you technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Track affiliate link clicks for commission purposes</li>
        </ul>

        <h2>Analytics</h2>
        <p>
          We use Google Analytics to understand how visitors use our site. This helps us improve our
          content and user experience.
        </p>

        <h2>Cookies</h2>
        <p>
          We use cookies to store your preferences and track affiliate link clicks. You can disable
          cookies in your browser settings.
        </p>

        <h2>Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us.</p>
      </div>
    </div>
  );
}
