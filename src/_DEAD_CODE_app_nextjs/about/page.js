"use client";
import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Leaf,
  Target,
  Eye,
  Wrench,
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Helper components
const IconCircle = ({ Icon, colorClass, bgColorClass }) => (
  <div className={`p-3 rounded-full ${bgColorClass}`}>
    <Icon className={`w-8 h-8 ${colorClass}`} />
  </div>
);

// const TopValueCard = ({ Icon, title, desc, colorClass, bgColorClass }) => (
//   <motion.div
//     className="flex flex-col items-center text-center p-4 cursor-pointer"
//     variants={itemVariants}
//     whileHover={{ scale: 1.05, y: -5 }}
//     transition={{ type: "spring", stiffness: 300, damping: 20 }}
//   >
//     <IconCircle Icon={Icon} colorClass={colorClass} bgColorClass={bgColorClass} />
//     <h4 className="mt-3 text-lg font-semibold text-gray-800">{title}</h4>
//     <p className="text-sm text-gray-500">{desc}</p>
//   </motion.div>
// );

const MissionVisionCard = ({ Icon, title, content, colorClass, bgColorClass, cardBgColor }) => (
  <motion.div
    className={`p-8 rounded-3xl shadow-md border ${cardBgColor} cursor-pointer`}
    variants={itemVariants}
    whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <div className="flex items-start gap-4 mb-4">
      <IconCircle Icon={Icon} colorClass={colorClass} bgColorClass={bgColorClass} />
      <h3 className="text-2xl font-bold text-gray-800 mt-1">{title}</h3>
    </div>
    <p className="text-gray-700 leading-relaxed text-base pl-12">{content}</p>
  </motion.div>
);

const BottomValueCard = ({ Icon, title, desc, colorClass, bgColorClass, cardBgColor }) => (
  <motion.div
    className={`flex flex-col items-center text-center p-6 md:p-8 rounded-2xl ${cardBgColor} shadow-md border border-white cursor-pointer`}
    variants={itemVariants}
    whileHover={{ scale: 1.05, boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <div className="flex flex-col items-center space-y-3">
      <div className="p-2 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: bgColorClass }}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <h4 className="text-lg font-bold text-gray-800">{title}</h4>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  </motion.div>
);

const About = () => {
  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-white flex flex-col items-center overflow-hidden">
        {/* Brand Story Banner */}
        <div className="w-full text-center py-4 md:py-8">
          <span className="text-xs uppercase tracking-widest text-gray-500 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
            MakeMee Brand Story
          </span>
        </div>

        {/* Hero Section */}
        <motion.section
          className="text-center px-4 py-8 md:py-10 w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug">
            Your Glow, <span className="text-pink-600">Our Promise</span>
          </h1>
          <p className="mt-4 text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At MakeMee, we believe skincare is not just about looking good—it’s about feeling confident in your own skin. Our journey began with a simple vision: to create products that combine the power of nature with the science of skincare.
          </p>
        </motion.section>

        {/* Top Values */}
        {/* <motion.section
          className="w-full px-6 md:px-10 py-8"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8">
            <TopValueCard Icon={Heart} title="Designed with" desc="Care & Love" colorClass="text-purple-600" bgColorClass="bg-purple-100/50" />
            <TopValueCard Icon={Wrench} title="Skin-Friendly" desc="Ingredients" colorClass="text-orange-600" bgColorClass="bg-orange-100/50" />
            <TopValueCard Icon={ShieldCheck} title="Accessible &" desc="Trustworthy" colorClass="text-blue-600" bgColorClass="bg-blue-100/50" />
            <TopValueCard Icon={Sparkles} title="Self-Love" desc="Movement" colorClass="text-red-600" bgColorClass="bg-red-100/50" />
          </div>
        </motion.section> */}

        {/* Mission & Vision */}
        <motion.section
          className="w-full px-6 md:px-10 py-12"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <MissionVisionCard
              Icon={Target}
              title="Our Mission"
              content="To make skincare accessible, trustworthy, and joyful. We want every person to look in the mirror and see not just radiant skin—but also the confidence that comes with it."
              colorClass="text-blue-600"
              bgColorClass="bg-blue-100"
              cardBgColor="bg-blue-50 border-blue-100"
            />
            <MissionVisionCard
              Icon={Eye}
              title="Our Vision"
              content="Your glow becomes our biggest reward. We envision a world where beauty meets wellness, and where every person feels confident and beautiful in their own skin."
              colorClass="text-orange-600"
              bgColorClass="bg-orange-100"
              cardBgColor="bg-orange-50 border-orange-100"
            />
          </div>
        </motion.section>

        {/* Where Beauty Meets Wellness */}
        <section className="w-full px-6 md:px-10 py-10">
          <motion.div
            className="max-w-6xl mx-auto p-8 md:p-16 rounded-3xl bg-yellow-50/50 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="w-full text-center mb-10">
              <span className="text-xs uppercase tracking-widest text-orange-500 bg-orange-100 px-3 py-1 rounded-full shadow-sm">
                ~ Our Brand Story
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900">
                Where Beauty Meets Wellness
              </h2>
            </div>

            {/* LEFT RIGHT FIX */}
            <div className="w-full grid md:grid-cols-2 gap-12 items-center">
              
              {/* LEFT TEXT */}
              <motion.div
                className="text-gray-700 space-y-4 leading-relaxed"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <p>Every product we create is designed with care, using skin-friendly ingredients that work gently yet effectively. From refreshing face washes to nourishing serums and protective creams, MakeMee is here to be part of your everyday self-care ritual.</p>
                <p>Our mission is to make skincare accessible, trustworthy, and joyful. We want every person to look in the mirror and see not just clear, radiant skin—but also the confidence that comes with it.</p>
                <p>MakeMee is not just a cosmetic brand it is a movement of self-love, where beauty meets wellness, and where your glow becomes our biggest reward. ✨</p>
              </motion.div>

              {/* RIGHT IMAGE */}
              <motion.div
                className="relative w-full flex justify-center"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <img
                  src="/Product-Img/Makemee_allproducts_image.webp"
                  alt="MakeMee Products"
                  className="w-64 md:w-72 drop-shadow-xl rounded-xl"
                />
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* Bottom Core Values */}
        <motion.section
          className="w-full px-6 md:px-10 py-16"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <BottomValueCard Icon={Heart} title="Designed with Care" desc="Every product is crafted with love and attention to detail, ensuring the highest quality for your skin." colorClass="text-blue-800" bgColorClass="#97A6E5" cardBgColor="bg-blue-50" />
              <BottomValueCard Icon={Wrench} title="Skin-Friendly" desc="We use only gentle, effective ingredients that work with your skin's natural processes." colorClass="text-orange-800" bgColorClass="#E5C797" cardBgColor="bg-yellow-50" />
              <BottomValueCard Icon={Sparkles} title="Self-Love Movement" desc="We believe in empowering everyone to feel confident and beautiful in their own skin." colorClass="text-purple-800" bgColorClass="#C797E5" cardBgColor="bg-purple-50" />
            </div>
          </div>
        </motion.section>
      </div>
      <Footer />
    </>
  );
};

export default About;
