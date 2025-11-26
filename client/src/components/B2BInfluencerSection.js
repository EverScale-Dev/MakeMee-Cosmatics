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

        {/* B2B */}
        <motion.div
          whileHover={{ y: -10 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative group"
        >
          {/* Soft Highlight Strip */}
          <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-white/40 to-transparent rounded-l-3xl opacity-60 group-hover:opacity-100 transition-all" />

          {/* Card */}
          <div className="rounded-[2.5rem] bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 p-10 text-center relative overflow-hidden">

            {/* Light Wave */}
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#731162]/10 rounded-tl-full blur-3xl"></div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <Building2 className="w-14 h-14 text-[#731162] mb-6" />
            </motion.div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-3 relative z-10">
              B2B Partnership
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed relative z-10">
              Get exclusive wholesale pricing, customized packaging,
              and dedicated support for your business.
            </p>

            <Link
              href="/contact?type=b2b"
              className="bg-[#731162] text-white px-8 py-3 rounded-full hover:scale-105 transition-transform relative z-10"
            >
              Become a Partner
            </Link>
          </div>
        </motion.div>

        {/* Influencer */}
        <motion.div
          whileHover={{ y: -10 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative group"
        >
          {/* Soft Highlight Strip */}
          <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-white/40 to-transparent rounded-l-3xl opacity-60 group-hover:opacity-100 transition-all" />

          <div className="rounded-[2.5rem] bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 p-10 text-center relative overflow-hidden">
            {/* Light Wave */}
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#ff0080]/10 rounded-tl-full blur-3xl"></div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <Sparkles className="w-14 h-14 text-[#ff0080] mb-6" />
            </motion.div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-3 relative z-10">
              Influencer Collaboration
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed relative z-10">
              Are you a beauty influencer? Partner with us for campaigns,
              PR gifts, and brand collaborations to grow together.
            </p>

            <Link
              href="/contact?type=influencer"
              className="bg-[#ff0080] text-white px-8 py-3 rounded-full hover:scale-105 transition-transform relative z-10"
            >
              Apply Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
