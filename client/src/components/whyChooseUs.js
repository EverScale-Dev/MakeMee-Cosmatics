import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Leaf, ShieldCheck, PackageOpen } from "lucide-react";

// Elegant and minimal "Why Choose MakeMee" section with smooth organic shapes

export default function whyChooseUs({ className = "" }) {
  const features = [
    {
      id: "made",
      title: "Made with Love",
      desc: "Each product is made thoughtfully with care and attention, bringing authentic results for your skin.",
      icon: <Heart className="w-6 h-6" />, 
      accent: "from-pink-400 to-rose-600",
    },
    {
      id: "skin",
      title: "Skin-Friendly",
      desc: "We use only safe, effective ingredients that are gentle and suitable for all skin types.",
      icon: <ShieldCheck className="w-6 h-6" />, 
      accent: "from-emerald-400 to-teal-600",
    },
    {
      id: "premium",
      title: "Premium Quality",
      desc: "Our products maintain the highest quality standards to deliver visible, lasting results.",
      icon: <Sparkles className="w-6 h-6" />, 
      accent: "from-yellow-400 to-amber-500",
    },
    {
      id: "natural",
      title: "Natural Ingredients",
      desc: "We carefully choose natural, eco-conscious ingredients for gentle yet effective skincare.",
      icon: <Leaf className="w-6 h-6" />, 
      accent: "from-lime-400 to-green-600",
    },
    {
      id: "movement",
      title: "Self-Love Movement",
      desc: "Empowering everyone to embrace confidence, self-care, and authentic beauty.",
      icon: <PackageOpen className="w-6 h-6" />, 
      accent: "from-violet-400 to-indigo-600",
    },
    {
      id: "accessible",
      title: "Accessible Beauty",
      desc: "We make quality skincare accessible so everyone can feel confident in their own skin.",
      icon: <Heart className="w-6 h-6" />, 
      accent: "from-sky-400 to-blue-600",
    },
  ];

  return (
    <section className={`relative overflow-hidden px-6 md:px-16 ${className}`}>
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F0A400] mb-2 text-center">
          Why Choose MakeMee
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 text-gray-700 max-w-2xl mx-auto"
        >
          Discover what makes us unique elegance, care, and a love for natural beauty.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group"
            >
              <div className={`rounded-3xl p-[1px] bg-gradient-to-r ${f.accent}`}> 
                <div className="rounded-3xl bg-white/90 backdrop-blur-md p-6 md:p-8 transition-transform duration-300 group-hover:scale-[1.02] shadow-xl">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br ${f.accent} text-white shadow-md`}>{f.icon}</div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">{f.title}</h3>
                    <p className="text-gray-600 text-sm md:text-base">{f.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}