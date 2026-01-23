import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto mt-4 mb-4">
        {/* Back to Home */}
        <a href="/" className="flex items-center text-yellow-600 hover:underline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5 mr-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </a>

        {/* Title */}
        <h1 className="text-3xl font-bold mt-2 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-600">Last updated: 12/12/2025</p>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
        <div className="mt-2 space-y-6 text-gray-800 leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>

            <h3 className="font-medium">Personal Information</h3>
            <p>
              We may collect personal information that you provide directly to us,
              such as when you:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Create an account or register on our website</li>
              <li>Make a purchase</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact our customer service</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p className="mt-2">
              This information may include your name, email address, phone number,
              shipping address, billing information, and any other information you
              choose to provide.
            </p>

            <h3 className="font-medium mt-4">Automatically Collected Information</h3>
            <p>
              When you visit our website, we automatically collect certain
              information about your device, including:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on each page</li>
              <li>Referring website</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your account or orders</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Provide customer support</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">3. Information Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except in the
              following circumstances:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Service Providers:</strong> We may share information with
                trusted third-party service providers who assist us in operating
                our website, conducting business, or servicing you
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose information
                if required by law or in response to valid legal requests
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger,
                acquisition, or sale of assets, your information may be transferred
              </li>
              <li>
                <strong>Safety and Security:</strong> We may share information to
                protect the safety and security of our users and the public
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">4. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your
              browsing experience and analyze website traffic. These technologies
              help us:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze how our website is used</li>
              <li>Provide personalized content and advertisements</li>
              <li>Improve website functionality and performance</li>
            </ul>
            <p className="mt-2">
              You can control cookie settings through your browser preferences,
              though disabling certain cookies may affect website functionality.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security
              measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method
              of transmission over the internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">6. Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal information:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, please contact us using the information
              provided below.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this privacy policy, unless a
              longer retention period is required or permitted by law. When we no
              longer need your information, we will securely delete or anonymize
              it.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">8. Children&#39;s Privacy</h2>
            <p>
              Our website is not intended for children under the age of 13. We do
              not knowingly collect personal information from children under 13.
              If you are a parent or guardian and believe your child has provided
              us with personal information, please contact us immediately.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your own. We ensure that such transfers comply with
              applicable data protection laws and implement appropriate safeguards
              to protect your information.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">10. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify
              you of any material changes by posting the new policy on this page
              and updating the &#39;Last updated&#39; date. Your continued use of our
              website after such changes constitutes acceptance of the updated
              policy.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">11. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our data
              practices, please contact us:
            </p>
            <p className="mt-2">
              <strong>MAKEMEE Manufacturing</strong><br />
              Email:{" "}
              <a href="mailto:makemeecosmetics@gmail.com" className="text-blue-600">
                makemeecosmetics@gmail.com
              </a>
              <br />
              Phone: +91-9075141925<br />
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
