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

// Animation variants for smooth staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Helper components for the various cards
const IconCircle = ({ Icon, colorClass, bgColorClass }) => (
  <div className={`p-3 rounded-full ${bgColorClass}`}>
    <Icon className={`w-8 h-8 ${colorClass}`} />
  </div>
);

const TopValueCard = ({ Icon, title, desc, colorClass, bgColorClass }) => (
  <motion.div
    className="flex flex-col items-center text-center p-4 cursor-pointer"
    variants={itemVariants}
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <IconCircle
      Icon={Icon}
      colorClass={colorClass}
      bgColorClass={bgColorClass}
    />
    <h4 className="mt-3 text-lg font-semibold text-gray-800">{title}</h4>
    <p className="text-sm text-gray-500">{desc}</p>
  </motion.div>
);

const MissionVisionCard = ({
  Icon,
  title,
  content,
  colorClass,
  bgColorClass,
  cardBgColor,
}) => (
  <motion.div
    // Corrected the typo: using cardBgColor instead of cardBgBgColor
    className={`p-8 rounded-3xl shadow-md border ${cardBgColor} cursor-pointer`}
    variants={itemVariants}
    whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <div className="flex items-start gap-4 mb-4">
      <IconCircle
        Icon={Icon}
        colorClass={colorClass}
        bgColorClass={bgColorClass}
      />
      <h3 className="text-2xl font-bold text-gray-800 mt-1">{title}</h3>
    </div>
    <p className="text-gray-700 leading-relaxed text-base pl-12">{content}</p>
  </motion.div>
);

const BottomValueCard = ({
  Icon,
  title,
  desc,
  colorClass,
  bgColorClass,
  cardBgColor,
}) => (
  <motion.div
    className={`flex flex-col items-center text-center p-6 md:p-8 rounded-2xl ${cardBgColor} shadow-md border border-white cursor-pointer`}
    variants={itemVariants}
    whileHover={{ scale: 1.05, boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <div className="flex flex-col items-center space-y-3">
      <div
        className="p-2 rounded-full border-2 border-white shadow-lg"
        style={{ backgroundColor: bgColorClass }}
      >
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

        {/* Hero Section - Title and Intro */}
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
            At MakeMee, we believe skincare is not just about looking good—it’s
            about feeling confident in your own skin. Our journey began with a
            simple vision: to create products that combine the power of nature
            with the science of skincare.
          </p>
        </motion.section>

        {/* Top Values Section (4 Columns) */}
        <motion.section
          className="w-full px-6 md:px-10 py-8"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8">
            <TopValueCard
              Icon={Heart}
              title="Designed with"
              desc="Care & Love"
              colorClass="text-purple-600"
              bgColorClass="bg-purple-100/50"
            />
            <TopValueCard
              Icon={Wrench}
              title="Skin-Friendly"
              desc="Ingredients"
              colorClass="text-orange-600"
              bgColorClass="bg-orange-100/50"
            />
            <TopValueCard
              Icon={ShieldCheck}
              title="Accessible &"
              desc="Trustworthy"
              colorClass="text-blue-600"
              bgColorClass="bg-blue-100/50"
            />
            <TopValueCard
              Icon={Sparkles}
              title="Self-Love"
              desc="Movement"
              colorClass="text-red-600"
              bgColorClass="bg-red-100/50"
            />
          </div>
        </motion.section>

        {/* Mission & Vision Section (2 Cards) */}
        <motion.section
          className="w-full px-6 md:px-10 py-12"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Our Mission Card */}
            <MissionVisionCard
              Icon={Target}
              title="Our Mission"
              content="To make skincare accessible, trustworthy, and joyful. We want every person to look in the mirror and see not just radiant skin—but also the confidence that comes with it."
              colorClass="text-blue-600"
              bgColorClass="bg-blue-100"
              cardBgColor="bg-blue-50 border-blue-100"
            />
            {/* Our Vision Card */}
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

{/* Where Beauty Meets Wellness Section */}
        <section className="w-full px-6 md:px-10 py-10">
          <motion.div
            className="max-w-6xl mx-auto p-8 md:p-16 rounded-3xl bg-yellow-50/50 shadow-lg flex flex-col items-center"
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

            <div className="w-full grid md:grid-cols-2 gap-12 items-center">
              {/* Text Column */}
              <motion.div
                className="text-gray-700 space-y-4 leading-relaxed order-2 md:order-1"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <p>
                  Every product we create is designed with care, using
                  skin-friendly ingredients that work gently yet effectively.
                  From refreshing face washes to nourishing serums and
                  protective creams, MakeMee is here to be part of your everyday
                  self-care ritual.
                </p>
                <p>
                  Our mission is to make skincare accessible, trustworthy, and
                  joyful. We want every person to look in the mirror and see not
                  just clear, radiant skin—but also the confidence that comes
                  with it.
                </p>
                <p>
                  MakeMee isn’t just a cosmetic brand; it's a movement of
                  self-love, where beauty meets wellness, and where your glow
                  becomes our biggest reward. ✨
                </p>
              </motion.div>


              {/* ANIMATED SVG COLUMN - REPLACING THE PLACEHOLDER */}
              <motion.div
                className="relative w-full aspect-square mx-auto order-1 md:order-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                {/* THE NEW SVG CODE BLOCK STARTS HERE */}
                <div className="relative">
                  <div className="w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center">
                    <svg
                      viewBox="0 0 500 400"
                      className="w-full h-full max-w-sm sm:max-w-md lg:max-w-lg"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        className="animate-pulse"
                        style={{ animationDuration: "4s" }}
                      >
                        {" "}
                        {/* FIXED */}
                        <circle
                          cx="100"
                          cy="100"
                          r="40"
                          fill="url(#orb1)"
                          opacity="0.3"
                        ></circle>
                        <circle
                          cx="400"
                          cy="80"
                          r="35"
                          fill="url(#orb2)"
                          opacity="0.25"
                        ></circle>
                        <circle
                          cx="80"
                          cy="320"
                          r="30"
                          fill="url(#orb3)"
                          opacity="0.2"
                        ></circle>
                        <circle
                          cx="420"
                          cy="320"
                          r="45"
                          fill="url(#orb4)"
                          opacity="0.3"
                        ></circle>
                      </g>
                      <g
                        className="animate-bounce"
                        style={{ animationDuration: "3s" }}
                      >
                        {" "}
                        {/* FIXED */}
                        <ellipse
                          cx="250"
                          cy="200"
                          rx="80"
                          ry="90"
                          fill="url(#faceGlow)"
                          opacity="0.2"
                          className="animate-pulse"
                          style={{ animationDuration: "2s" }}
                        ></ellipse>{" "}
                        {/* FIXED */}
                        <ellipse
                          cx="250"
                          cy="200"
                          rx="70"
                          ry="80"
                          fill="url(#faceGradient)"
                          stroke="url(#faceStroke)"
                          strokeWidth="2"
                          className="animate-pulse"
                          style={{ animationDuration: "1.5s" }}
                        ></ellipse>{" "}
                        {/* FIXED */}
                        <g
                          className="animate-pulse"
                          style={{ animationDuration: "2s" }}
                        >
                          {" "}
                          {/* FIXED */}
                          <ellipse
                            cx="230"
                            cy="180"
                            rx="12"
                            ry="8"
                            fill="url(#eyeGradient)"
                          ></ellipse>
                          <ellipse
                            cx="270"
                            cy="180"
                            rx="12"
                            ry="8"
                            fill="url(#eyeGradient)"
                          ></ellipse>
                          <circle
                            cx="230"
                            cy="180"
                            r="4"
                            fill="url(#pupilGradient)"
                          ></circle>
                          <circle
                            cx="270"
                            cy="180"
                            r="4"
                            fill="url(#pupilGradient)"
                          ></circle>
                        </g>
                        <path
                          d="M 210 165 Q 230 160 250 165"
                          stroke="url(#browGradient)"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                        ></path>
                        <path
                          d="M 250 165 Q 270 160 290 165"
                          stroke="url(#browGradient)"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                        ></path>
                        <ellipse
                          cx="250"
                          cy="200"
                          rx="3"
                          ry="8"
                          fill="url(#noseGradient)"
                          opacity="0.6"
                        ></ellipse>
                        <path
                          d="M 200 230 Q 250 250 300 230"
                          stroke="url(#smileGradient)"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          className="animate-pulse"
                          style={{ animationDuration: "1.8s" }}
                        ></path>{" "}
                        {/* FIXED */}
                      </g>
                      <g
                        className="animate-spin"
                        style={{ animationDuration: "6s" }}
                      >
                        {" "}
                        {/* FIXED */}
                        <polygon
                          points="150,120 155,130 165,130 157,137 160,147 150,140 140,147 143,137 135,130 145,130"
                          fill="url(#sparkle1)"
                          opacity="0.8"
                        ></polygon>
                        <polygon
                          points="350,100 355,110 365,110 357,117 360,127 350,120 340,127 343,117 335,110 345,110"
                          fill="url(#sparkle2)"
                          opacity="0.7"
                        ></polygon>
                        <polygon
                          points="120,280 125,290 135,290 127,297 130,307 120,300 110,307 113,297 105,290 115,290"
                          fill="url(#sparkle3)"
                          opacity="0.6"
                        ></polygon>
                        <polygon
                          points="380,300 385,310 395,310 387,317 390,327 380,320 370,327 373,317 365,310 375,310"
                          fill="url(#sparkle4)"
                          opacity="0.9"
                        ></polygon>
                      </g>
                      <g
                        className="animate-bounce"
                        style={{ animationDuration: "2.5s" }}
                      >
                        {" "}
                        {/* FIXED */}
                        <path
                          d="M 180 150 C 180 140, 190 140, 190 150 C 190 140, 200 140, 200 150 C 200 160, 190 170, 190 150 C 190 170, 180 160, 180 150 Z"
                          fill="url(#heart1)"
                          opacity="0.7"
                        ></path>
                        <path
                          d="M 300 160 C 300 150, 310 150, 310 160 C 310 150, 320 150, 320 160 C 320 170, 310 180, 310 160 C 310 180, 300 170, 300 160 Z"
                          fill="url(#heart2)"
                          opacity="0.6"
                        ></path>
                      </g>
                      <g
                        className="animate-bounce"
                        style={{ animationDuration: "3.5s" }}
                      >
                        {" "}
                        {/* FIXED */}
                        <polygon
                          points="100,200 105,210 115,210 107,217 110,227 100,220 90,227 93,217 85,210 95,210"
                          fill="url(#star1)"
                          opacity="0.8"
                        ></polygon>
                        <polygon
                          points="400,180 405,190 415,190 407,197 410,207 400,200 390,207 393,197 385,190 395,190"
                          fill="url(#star2)"
                          opacity="0.7"
                        ></polygon>
                      </g>
                      <g
                        className="animate-bounce"
                        style={{ animationDuration: "2.2s" }}
                      >
                        {" "}
                        {/* FIXED */}
                        <circle
                          cx="150"
                          cy="250"
                          r="4"
                          fill="url(#circle1)"
                          opacity="0.6"
                        ></circle>
                        <circle
                          cx="350"
                          cy="240"
                          r="3"
                          fill="url(#circle2)"
                          opacity="0.5"
                        ></circle>
                        <circle
                          cx="120"
                          cy="180"
                          r="5"
                          fill="url(#circle3)"
                          opacity="0.7"
                        ></circle>
                        <circle
                          cx="380"
                          cy="200"
                          r="4"
                          fill="url(#circle4)"
                          opacity="0.6"
                        ></circle>
                      </g>
                      <defs>
                        <linearGradient
                          id="orb1"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#3B82F6"></stop>
                          <stop offset="100%" stopColor="#60A5FA"></stop>
                        </linearGradient>
                        <linearGradient
                          id="orb2"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#F97316"></stop>
                          <stop offset="100%" stopColor="#FB923C"></stop>
                        </linearGradient>
                        <linearGradient
                          id="orb3"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#8B5CF6"></stop>
                          <stop offset="100%" stopColor="#A78BFA"></stop>
                        </linearGradient>
                        <linearGradient
                          id="orb4"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#10B981"></stop>
                          <stop offset="100%" stopColor="#34D399"></stop>
                        </linearGradient>
                        <linearGradient
                          id="faceGlow"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#3B82F6"></stop>
                          <stop offset="50%" stopColor="#F97316"></stop>
                          <stop offset="100%" stopColor="#8B5CF6"></stop>
                        </linearGradient>
                        <linearGradient
                          id="faceGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#FEF3C7"></stop>
                          <stop offset="100%" stopColor="#FDE68A"></stop>
                        </linearGradient>
                        <linearGradient
                          id="faceStroke"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#3B82F6"></stop>
                          <stop offset="100%" stopColor="#F97316"></stop>
                        </linearGradient>
                        <linearGradient
                          id="eyeGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#1E40AF"></stop>
                          <stop offset="100%" stopColor="#3B82F6"></stop>
                        </linearGradient>
                        <linearGradient
                          id="pupilGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#1F2937"></stop>
                          <stop offset="100%" stopColor="#374151"></stop>
                        </linearGradient>
                        <linearGradient
                          id="browGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#92400E"></stop>
                          <stop offset="100%" stopColor="#D97706"></stop>
                        </linearGradient>
                        <linearGradient
                          id="noseGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#F59E0B"></stop>
                          <stop offset="100%" stopColor="#FBBF24"></stop>
                        </linearGradient>
                        <linearGradient
                          id="smileGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#DC2626"></stop>
                          <stop offset="100%" stopColor="#F97316"></stop>
                        </linearGradient>
                        <linearGradient
                          id="sparkle1"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#3B82F6"></stop>
                          <stop offset="100%" stopColor="#60A5FA"></stop>
                        </linearGradient>
                        <linearGradient
                          id="sparkle2"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#F97316"></stop>
                          <stop offset="100%" stopColor="#FB923C"></stop>
                        </linearGradient>
                        <linearGradient
                          id="sparkle3"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#8B5CF6"></stop>
                          <stop offset="100%" stopColor="#A78BFA"></stop>
                        </linearGradient>
                        <linearGradient
                          id="sparkle4"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#10B981"></stop>
                          <stop offset="100%" stopColor="#34D399"></stop>
                        </linearGradient>
                        <linearGradient
                          id="heart1"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#EC4899"></stop>
                          <stop offset="100%" stopColor="#F472B6"></stop>
                        </linearGradient>
                        <linearGradient
                          id="heart2"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#DC2626"></stop>
                          <stop offset="100%" stopColor="#F87171"></stop>
                        </linearGradient>
                        <linearGradient
                          id="star1"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#F59E0B"></stop>
                          <stop offset="100%" stopColor="#FBBF24"></stop>
                        </linearGradient>
                        <linearGradient
                          id="star2"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#8B5CF6"></stop>
                          <stop offset="100%" stopColor="#C4B5FD"></stop>
                        </linearGradient>
                        <linearGradient
                          id="circle1"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#3B82F6"></stop>
                          <stop offset="100%" stopColor="#60A5FA"></stop>
                        </linearGradient>
                        <linearGradient
                          id="circle2"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#F97316"></stop>
                          <stop offset="100%" stopColor="#FB923C"></stop>
                        </linearGradient>
                        <linearGradient
                          id="circle3"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#10B981"></stop>
                          <stop offset="100%" stopColor="#34D399"></stop>
                        </linearGradient>
                        <linearGradient
                          id="circle4"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#8B5CF6"></stop>
                          <stop offset="100%" stopColor="#A78BFA"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  {/* Keyword Bubbles with TailWind animations */}
                  <div
                    className="absolute top-2 sm:top-4 lg:top-6 left-2 sm:left-4 lg:left-6 animate-bounce"
                    style={{ animationDuration: "2.5s" }}
                  >
                    {" "}
                    {/* FIXED */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-blue-700 shadow-lg border border-blue-200">
                      ✨ Natural
                    </div>
                  </div>
                  <div
                    className="absolute top-4 sm:top-8 lg:top-12 right-2 sm:right-4 lg:right-6 animate-bounce"
                    style={{ animationDuration: "3s" }}
                  >
                    {" "}
                    {/* FIXED */}
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-orange-700 shadow-lg border border-orange-200">
                      🛡️ Safe
                    </div>
                  </div>
                  <div
                    className="absolute bottom-8 sm:bottom-12 lg:bottom-12 left-4 sm:left-8 lg:left-12 animate-bounce"
                    style={{ animationDuration: "2.8s" }}
                  >
                    {" "}
                    {/* FIXED */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-green-700 shadow-lg border border-green-200">
                      ⚡ Effective
                    </div>
                  </div>
                  <div
                    className="absolute bottom-2 sm:bottom-4 lg:bottom-6 right-4 sm:right-8 lg:right-12 animate-bounce"
                    style={{ animationDuration: "3.2s" }}
                  >
                    {" "}
                    {/* FIXED */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-purple-700 shadow-lg border border-purple-200">
                      💎 Pure
                    </div>
                  </div>
                  <div
                    className="absolute top-1/2 left-1 sm:left-2 lg:left-4 animate-bounce"
                    style={{ animationDuration: "2.2s" }}
                  >
                    {" "}
                    {/* FIXED */}
                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-pink-700 shadow-lg border border-pink-200">
                      💖 Love
                    </div>
                  </div>
                  <div
                    className="absolute top-1/2 right-1 sm:right-2 lg:right-4 animate-bounce"
                    style={{ animationDuration: "2.7s" }}
                  >
                    {" "}
                    {/* FIXED */}
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-yellow-700 shadow-lg border border-yellow-200">
                      🌟 Glow
                    </div>
                  </div>
                </div>
                {/* THE NEW SVG CODE BLOCK ENDS HERE */}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Bottom Core Values Section (3 Columns) */}
        <motion.section
          className="w-full px-6 md:px-10 py-16"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <BottomValueCard
                Icon={Heart}
                title="Designed with Care"
                desc="Every product is crafted with love and attention to detail, ensuring the highest quality for your skin."
                colorClass="text-blue-800"
                bgColorClass="#97A6E5"
                cardBgColor="bg-blue-50"
              />
              <BottomValueCard
                Icon={Wrench}
                title="Skin-Friendly"
                desc="We use only gentle, effective ingredients that work with your skin's natural processes."
                colorClass="text-orange-800"
                bgColorClass="#E5C797"
                cardBgColor="bg-yellow-50"
              />
              <BottomValueCard
                Icon={Sparkles}
                title="Self-Love Movement"
                desc="We believe in empowering everyone to feel confident and beautiful in their own skin."
                colorClass="text-purple-800"
                bgColorClass="#C797E5"
                cardBgColor="bg-purple-50"
              />
            </div>
          </div>
        </motion.section>
      </div>
      <Footer />
    </>
  );
};

export default About;
