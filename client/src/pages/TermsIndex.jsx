import { Link } from "react-router-dom";
import {
  FileText,
  Shield,
  RefreshCw,
  Truck,
  HelpCircle,
} from "lucide-react";

const policies = [
  {
    title: "Terms & Conditions",
    description: "Rules and guidelines for using our website and services",
    path: "/terms/terms-and-conditions",
    icon: FileText,
  },
  {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information",
    path: "/terms/privacy",
    icon: Shield,
  },
  {
    title: "Refund & Return Policy",
    description: "Our policies on returns, refunds, and cancellations",
    path: "/terms/refund",
    icon: RefreshCw,
  },
  {
    title: "Shipping Policy",
    description: "Delivery times, charges, and shipping information",
    path: "/terms/shipping",
    icon: Truck,
  },
  {
    title: "FAQ",
    description: "Frequently asked questions about our products and services",
    path: "/terms/faq",
    icon: HelpCircle,
  },
];

export default function TermsIndex() {
  return (
    <main className="min-h-screen pt-28 pb-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#731162] mb-2">
          Legal & Policies
        </h1>
        <p className="text-gray-600 mb-10">
          Please review our policies to understand how we operate and protect your interests.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policies.map((policy) => {
            const Icon = policy.icon;
            return (
              <Link
                key={policy.path}
                to={policy.path}
                className="group block p-6 rounded-2xl border border-gray-200 hover:border-[#FC6CB4] hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FC6CB4]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FC6CB4]/20 transition">
                    <Icon className="w-6 h-6 text-[#FC6CB4]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[#731162] transition">
                      {policy.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {policy.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 text-sm">
            If you have any questions about our policies, please contact us at{" "}
            <a
              href="mailto:makemeecosmetics@gmail.com"
              className="text-[#FC6CB4] hover:underline"
            >
              makemeecosmetics@gmail.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
