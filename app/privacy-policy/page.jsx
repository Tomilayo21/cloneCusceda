'use client'
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
            {/* <div className="p-4 flex flex-col items-center pt-14 bg-white text-black dark:bg-black dark:text-white min-h-screen items-start px-6 md:px-16 lg:px-32 pt-20">
        <div className="flex flex-col items-center mt-8 mb-4">
          <p className="text-3xl font-medium">
            Privacy <span className="text-orange-600">Policy</span>
          </p>
          <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
        </div> */}

      <div className="max-w-4xl mx-auto p-6 text-gray-800 p-4 flex flex-col  pt-14 bg-white text-black dark:bg-black dark:text-white min-h-screen items-start px-6 md:px-16 lg:px-32 pt-20">
        <div className="flex flex-col items-center mt-8 mb-8">
          <p className="text-3xl font-medium">
            Privacy <span className="text-orange-600">Policy</span>
          </p>
          <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
        </div>

        {/* <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1> */}

        <p className="mb-4">
          At <strong>Cusceda</strong>, your privacy is a top priority. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services.
        </p>

        {/* Section: Information We Collect */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address, payment information, etc.</li>
          <li><strong>Account Information:</strong> Login credentials, profile details, preferences, etc.</li>
          <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, referring URLs, browser type, IP address.</li>
          <li><strong>Device Information:</strong> Mobile device ID, OS, and mobile network info.</li>
          <li><strong>Cookies and Tracking:</strong> We use cookies to improve user experience and personalize content.</li>
        </ul>

        {/* Section: How We Use Your Information */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>To provide and maintain our services.</li>
          <li>To process transactions and manage orders.</li>
          <li>To personalize your experience and provide relevant recommendations.</li>
          <li>To communicate with you, including promotions, newsletters, and support messages.</li>
          <li>To improve our platform, user experience, and security.</li>
          <li>To comply with legal obligations.</li>
        </ul>

        {/* Section: How We Share Your Information */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">3. How We Share Your Information</h2>
        <p className="mb-4">
          We do not sell your personal information. We may share your information with:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Service Providers:</strong> For payment processing, cloud storage, delivery, etc.</li>
          <li><strong>Legal Authorities:</strong> When required to comply with law enforcement or legal obligations.</li>
          <li><strong>Business Transfers:</strong> In case of a merger, acquisition, or asset sale.</li>
        </ul>

        {/* Section: Your Rights and Choices */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">4. Your Rights and Choices</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Access or update your personal information.</li>
          <li>Opt-out of marketing emails anytime.</li>
          <li>Request data deletion (subject to legal exceptions).</li>
          <li>Disable cookies in your browser settings.</li>
        </ul>

        {/* Section: Data Security */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">5. Data Security</h2>
        <p className="mb-4">
          We implement industry-standard measures like encryption, firewalls, and secure servers to protect your data. However, no system is 100% secure, so we cannot guarantee absolute security.
        </p>

        {/* Section: Children’s Privacy */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">6. Children’s Privacy</h2>
        <p className="mb-4">
          Cusceda is not intended for children under the age of 13. We do not knowingly collect personal information from children.
        </p>

        {/* Section: Third-Party Links */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">7. Third-Party Links</h2>
        <p className="mb-4">
          Our platform may contain links to third-party sites. We are not responsible for the content or privacy practices of these external websites.
        </p>

        {/* Section: Changes to This Policy */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">8. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this policy from time to time. We will notify users of significant changes via email or platform notice. Please review this policy periodically.
        </p>

        {/* Section: Contact Us */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">9. Contact Us</h2>
        <p className="mb-8">
          If you have any questions about this Privacy Policy, contact us at:
          <br />
          <strong>Email:</strong> support@cusceda.com
        </p>

        {/* FAQ Section */}
        <h2 className="text-3xl font-bold mb-6 mt-12">Frequently Asked Questions (FAQ)</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold">Q1: Do you share my personal information with third parties?</h3>
            <p>
              We only share your information with trusted service providers and legal authorities when required. We do not sell your personal data.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Q2: Can I delete my account and data?</h3>
            <p>
              Yes. You can request data deletion by contacting us at support@cusceda.com. Some data may be retained for legal or security purposes.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Q3: How do I unsubscribe from marketing emails?</h3>
            <p>
              Click the "unsubscribe" link in any marketing email or manage your preferences in your account settings.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Q4: How does Cusceda secure my payment information?</h3>
            <p>
              We use secure, PCI-compliant third-party payment processors. Cusceda does not store your card details directly.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Q5: Are cookies required to use Cusceda?</h3>
            <p>
              Cookies help us enhance user experience. While not strictly required, some features may not work properly if you disable them.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
