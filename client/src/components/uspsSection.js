import React from "react";
import { motion } from "framer-motion";

export default function FuturisticFeatureCards() {
  const features = [
    {
      title: "Skin-Friendly",
      subtitle: "Gentle on all skin types with carefully selected ingredients",
      accent: "from-pink-400 to-purple-500",
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M12 21s8-4.5 8-10.5S15.313 2 12 5.5 4 6.5 4 10.5 12 21 12 21z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Premium Quality",
      subtitle: "High-quality ingredients for maximum effectiveness",
      accent: "from-cyan-400 to-blue-500",
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M12 2l3 6 6 .5-4.5 4 1 6L12 16l-5.5 2.5 1-6L3 8.5 9 8 12 2z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Made with Care",
      subtitle: "Crafted with love and attention to detail",
      accent: "from-yellow-400 to-orange-500",
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M20.8 4.6a5 5 0 0 0-7.07 0L12 6.29l-1.73-1.73a5 5 0 1 0-7.07 7.07L12 21.12l8.8-9.45a5 5 0 0 0 0-7.07z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative py-16 px-6 sm:px-10 lg:px-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h3 className="text-sm uppercase tracking-wider text-[#1E3A8A]">
            <b>Why Choose This Product?</b>
          </h3>
          <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-extrabold bg-clip-text text-[#F0A400]">
            Experience the benefits of our carefully formulated skincare
            solution
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                delay: index * 0.12,
                duration: 0.6,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.05, // zoom in slightly
                transition: { type: "spring", stiffness: 150, damping: 15 },
              }}
              className="relative group isolate rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden border border-white/6 bg-white/30 backdrop-blur-md"
              aria-labelledby={`feature-${index}`}
            >
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                {/* Icon */}
                <motion.div
                  className={`flex-shrink-0 w-16 h-16 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${feature.accent} p-2 shadow-lg shadow-${feature.accent.split(" ")[0]}-600/30 flex items-center justify-center`}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="text-white/95">{feature.icon}</div>
                </motion.div>

                {/* Text */}
                <div className="text-center sm:text-left">
                  <h4
                    id={`feature-${index}`}
                    className="text-lg sm:text-xl font-semibold text-black"
                  >
                    {feature.title}
                  </h4>
                  <p className="mt-1 text-sm sm:text-base text-gray-500">
                    {feature.subtitle}
                  </p>
                </div>
              </div>

              {/* Separator */}
              <div className="mt-6 h-0.5 bg-gradient-to-r from-transparent via-black/20 to-transparent rounded-full" />

              {/* Subtle shine */}
              <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
