import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-pink-50 to-orange-50 min-h-screen px-6 py-20">
      <div className="max-w-4xl mx-auto mt-4 mb-4">
        {/* Back to Home */}
        <Link to="/" className="flex items-center text-[#731162] hover:underline mb-4">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Home
        </Link>

        {/* Title */}
        <h1 className="text-3xl font-bold mt-2 mb-2 text-[#731162]">Terms and Conditions</h1>
        <p className="text-sm text-gray-600">Last updated: January 2026</p>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
        <div className="mt-2 space-y-6 text-gray-800 leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the MAKEMEE website and services, you accept and agree
              to be bound by the terms and provision of this agreement. If you do not agree
              to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials
              (information or software) on MAKEMEE's website for personal, non-commercial
              transitory viewing only. This is the grant of a license, not a transfer of
              title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">3. Product Information and Safety</h2>
            <p>
              All products sold by MAKEMEE are cosmetic products intended for external use only.
              Before using any product:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Read all product labels and instructions carefully</li>
              <li>Perform a patch test on a small area of skin before full application</li>
              <li>Discontinue use if irritation occurs</li>
              <li>Keep products out of reach of children</li>
              <li>Do not ingest or apply to eyes unless specifically directed</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">4. Disclaimer</h2>
            <p>
              The materials on MAKEMEE's website are provided on an 'as is' basis. MAKEMEE
              makes no warranties, expressed or implied, and hereby disclaims and negates
              all other warranties including without limitation, implied warranties or
              conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">5. Limitations</h2>
            <p>
              In no event shall MAKEMEE or its suppliers be liable for any damages (including,
              without limitation, damages for loss of data or profit, or due to business
              interruption) arising out of the use or inability to use the materials on MAKEMEE's
              website, even if MAKEMEE or a MAKEMEE authorized representative has been notified
              orally or in writing of the possibility of such damage.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">6. Accuracy of Materials</h2>
            <p>
              The materials appearing on MAKEMEE's website could include technical, typographical,
              or photographic errors. MAKEMEE does not warrant that any of the materials on its
              website are accurate, complete, or current. MAKEMEE may make changes to the materials
              contained on its website at any time without notice.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">7. Links</h2>
            <p>
              MAKEMEE has not reviewed all of the sites linked to its website and is not responsible
              for the contents of any such linked site. The inclusion of any link does not imply
              endorsement by MAKEMEE of the site. Use of any such linked website is at the user's
              own risk.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">8. Modifications</h2>
            <p>
              MAKEMEE may revise these terms of service for its website at any time without notice.
              By using this website you are agreeing to be bound by the then current version of these
              Terms and Conditions of Service.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">9. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of
              India and you irrevocably submit to the exclusive jurisdiction of the courts in that State
              or location.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <p className="mt-2">
              <strong>MAKEMEE Cosmetics</strong><br />
              Email: <a href="mailto:makemeecosmetics@gmail.com" className="text-[#FC6CB4]">makemeecosmetics@gmail.com</a><br />
              Phone: +91-9075141925
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
