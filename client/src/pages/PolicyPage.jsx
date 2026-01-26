import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const policyMeta = {
  "terms-and-conditions": {
    title: "Terms & Conditions",
    file: "terms-and-conditions.html",
  },
  privacy: {
    title: "Privacy Policy",
    file: "privacy.html",
  },
  refund: {
    title: "Refund & Return Policy",
    file: "refund.html",
  },
  shipping: {
    title: "Shipping Policy",
    file: "shipping.html",
  },
  faq: {
    title: "Frequently Asked Questions",
    file: "faq.html",
  },
};

export default function PolicyPage() {
  const { type } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const policy = policyMeta[type];

  useEffect(() => {
    if (!policy) {
      setError("Policy not found");
      setLoading(false);
      return;
    }

    const fetchPolicy = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/policies/${policy.file}`);
        if (!response.ok) {
          throw new Error("Failed to load policy");
        }
        const html = await response.text();
        setContent(html);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [type, policy]);

  if (loading) {
    return (
      <main className="min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FC6CB4]"></div>
      </main>
    );
  }

  if (error || !policy) {
    return (
      <main className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Policy Not Found</h1>
          <Link to="/terms" className="text-[#FC6CB4] hover:underline">
            ← Back to Policies
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/terms"
          className="inline-flex items-center gap-2 text-[#731162] hover:text-[#FC6CB4] mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back to Policies
        </Link>

        <article
          className="prose prose-lg max-w-none
            prose-headings:text-[#731162] prose-headings:font-semibold
            prose-h1:text-3xl prose-h1:mb-6
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-ul:my-4 prose-li:text-gray-700
            prose-a:text-[#FC6CB4] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </main>
  );
}
