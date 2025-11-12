"use client";
import { Building2, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function B2BInfluencerSection() {
  return (
    <section className="py-20 px-6 md:px-16">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-[#F0A400]">
          Partner With Us
        </h2>
        <p className="text-gray-600 mt-3">
          Join the MakeMee community whether you’re a business or an influencer!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* B2B Card */}
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="rounded-[3rem] shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/70 backdrop-blur-md p-10 border border-[#731162]/10"
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Building2 className="w-14 h-14 text-[#731162] mb-6" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              B2B Partnership
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Get exclusive wholesale pricing, customized packaging, and dedicated support for your business.
              Perfect for salons, retailers, and distributors.
            </p>
            <Link
              href="/contact?type=b2b"
              className="bg-[#731162] text-white px-8 py-3 rounded-full hover:bg-[#5a0d4d] transition-transform hover:scale-105"
            >
              Become a Partner
            </Link>
          </div>
        </motion.div>

        {/* Influencer Card */}
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="rounded-[3rem] shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/70 backdrop-blur-md p-10 border border-[#ff0080]/10"
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-14 h-14 text-[#ff0080] mb-6" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Influencer Collaboration
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Are you a beauty influencer? Partner with us for campaigns, PR gifts,
              and brand collaborations to grow together.
            </p>
            <Link
              href="/contact?type=influencer"
              className="bg-[#ff0080] text-white px-8 py-3 rounded-full hover:bg-[#cc0066] transition-transform hover:scale-105"
            >
              Apply Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
