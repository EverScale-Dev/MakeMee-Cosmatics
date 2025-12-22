// import React, { useState, useEffect } from 'react';
// import { motion, useInView } from 'framer-motion';

// // --- Framer Motion Variants ---

// const bannerVariants = {
//   animate: {
//     transition: {
//       staggerChildren: 0.1,
//       delayChildren: 0.3,
//     }
//   }
// };

// const itemVariants = {
//   initial: { y: 40, opacity: 0, filter: 'blur(8px)' },
//   animate: {
//     y: 0,
//     opacity: 1,
//     filter: 'blur(0px)',
//     transition: {
//       type: "spring",
//       stiffness: 100,
//       damping: 18,
//     }
//   }
// };

// // New variant for the internal lightning shine effect, applied via background-position
// const shineTextVariants = {
//   shine: {
//     // Animate the background-position from left (0%) to right (100%)
//     backgroundPosition: ['100% 50%', '0% 50%'], 
//     transition: {
//       duration: 5,
//       ease: "linear",
//       // repeat: Infinity,
//       repeatDelay: 2, // Wait 2 seconds between shines
//     }
//   }
// };
// // --- Main Component ---

// export const Banner = () => {
//   // Keeping state for text content
//   const initialHeadline = "Premium Beauty Products";
//   const initialSubtext = "Discover our exclusive collection of premium beauty products crafted with natural ingredients for radiant, healthy skin.";

//   const [headline] = useState(initialHeadline);
//   const [subtext] = useState(initialSubtext);

//   // State for controllable bubbles
//   const step = 25; // Movement distance per key press
//   const [bubblePositions, setBubblePositions] = useState({
//     bubble1: { x: 0, y: 0 },
//     bubble2: { x: 0, y: 0 },
//     bubble3: { x: 0, y: 0 },
//   });

//   // Effect to handle keyboard controls for bubble movement
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       setBubblePositions(prev => {
//         let newPositions = { ...prev };

//         switch (e.key) {
//           case 'ArrowUp':
//             newPositions.bubble1.y -= step;
//             newPositions.bubble2.y -= step;
//             newPositions.bubble3.y -= step;
//             break;
//           case 'ArrowDown':
//             newPositions.bubble1.y += step;
//             newPositions.bubble2.y += step;
//             newPositions.bubble3.y += step;
//             break;
//           case 'ArrowLeft':
//             newPositions.bubble1.x -= step;
//             newPositions.bubble2.x -= step;
//             newPositions.bubble3.x -= step;
//             break;
//           case 'ArrowRight':
//             newPositions.bubble1.x += step;
//             newPositions.bubble2.x += step;
//             newPositions.bubble3.x += step;
//             break;
//           default:
//             return prev;
//         }
//         return newPositions;
//       });
//     };

//     // Add event listener to the window
//     window.addEventListener('keydown', handleKeyDown);

//     // Clean up the event listener on component unmount
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, []); // Empty dependency array means this runs once on mount

//   // Ref for the scroll indicator
//   const scrollRef = React.useRef(null);
  

//   return (
//     <div className="relative h-screen w-full overflow-hidden  font-['Inter',_sans-serif] text-gray-900 focus:outline-none" tabIndex={-1}>

//       {/* Midground - Floating Geometric Shapes and Controllable Bubbles */}
//       <motion.div
//         className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
//       >
//         {/* Shape 1: Top Left - Blue Accent (Rotates 360) */}
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
//           className="absolute top-[10%] left-[10%] h-32 w-32 rounded-3xl bg-blue-300/20 backdrop-blur-sm shadow-xl"
//         />
//         {/* Shape 2: Bottom Right - Orange Accent (Rotates -360) */}
//         <motion.div
//           animate={{ y: [0, 30, 0] }}
//           transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
//           className="absolute bottom-[20%] left-[5%] h-28 w-28 rounded-full bg-orange-300/20 backdrop-blur-sm shadow-xl"
//         />
//         {/* Shape 3: Bottom Left - Teal Square (New shape - Rotates -180 slowly) */}
//         <motion.div
//           animate={{ rotate: -180 }}
//           transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
//           className="absolute bottom-[20%] right-[15%] h-40 w-40 rounded-xl bg-teal-300/20 backdrop-blur-sm shadow-xl"
//         />
        
//         {/* --- Controllable Bubbles (Replaces the Subtle Ring) --- */}
        
//         {/* Bubble 1: Medium Blue */}
//         <motion.div
//           style={{ 
//             x: bubblePositions.bubble2.x, 
//             y: bubblePositions.bubble2.y 
//           }}
//           animate={{ y: [0, 15, 0] }} // Gentle automatic floating motion
//           transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
//           className="absolute right-[10%] top-[20%] h-24 w-24 rounded-full bg-blue-400/30 shadow-2xl"
//         />
        
//         {/* Bubble 2: Small Teal */}
//         <motion.div
//           style={{ 
//             x: bubblePositions.bubble3.x, 
//             y: bubblePositions.bubble3.y 
//           }}
//           animate={{ y: [0, -15, 0] }} // Gentle automatic floating motion
//           transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
//           className="absolute left-[42%] bottom-[5%] h-16 w-16 rounded-full bg-teal-400/30 shadow-2xl"
//         />

//       </motion.div>

//       {/* 3. Foreground - Central Content (Static positioning) */}
//       <div className="relative z-20 flex h-full w-full items-center justify-center p-6 sm:p-12">
//         <motion.div
//           className="max-w-4xl text-center"
//           variants={bannerVariants}
//           initial="initial"
//           animate="animate"
//         >
//           {/* Headline with Internal Shine Effect */}
//           <motion.h1
//             className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-8xl bg-clip-text text-transparent pb-2 relative z-10"
//             variants={itemVariants}
//             // Inline styles defining the gradient, including the white streak for the shine
//             style={{
//               // Multi-stop gradient: Dark -> Indigo -> White Shine -> Indigo -> Dark
//               backgroundImage: 'linear-gradient(90deg, #1f2937 0%, #4f46e5 35%, #eff6ff 50%, #4f46e5 65%, #1f2937 100%)',
//               backgroundSize: '300% 100%', // Make background wide so shine appears as a moving streak
//             }}
//             // Apply the continuous shine animation
//             animate={shineTextVariants.shine}
//           >
//             {headline}
//           </motion.h1>

//           {/* Subtext (Dark gray text) */}
//           <motion.p
//             className="mt-6 max-w-xl text-lg sm:text-xl text-gray-600 mx-auto"
//             variants={itemVariants}
//           >
//             {subtext}
//           </motion.p>         
//         </motion.div>
//       </div>

//       {/* 4. Smooth Scroll Indicator */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30" ref={scrollRef}>
//         <motion.div
//           className="flex flex-col items-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1.5, duration: 0.5 }}
//         >
//           <p className="text-xs text-gray-500 mb-1 tracking-widest">SCROLL</p>
//           <motion.svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-8 w-8 text-indigo-600"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//             animate={{ y: [0, 8, 0] }}
//             transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//           </motion.svg>
//         </motion.div>
//       </div>
//     </div>
//   );
// };


// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link"; // ✅ Import Link for navigation
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const slides = [
//   {
//     id: 1,
//     title: "Redefine Radiance",
//     subtitle:
//       "Luxury skincare, reimagined for the modern world. Pure. Potent. Purposeful.",
//     bg: "linear-gradient(135deg, #ff9ab8, #8c38ff 80%)",
//   },
//   {
//     id: 2,
//     title: "Confidence in Every Shade",
//     subtitle:
//       "Inclusive beauty designed to empower every tone, every story, every you.",
//     bg: "linear-gradient(135deg, #7b4397, #dc2430 80%)",
//   },
//   {
//     id: 3,
//     title: "Luxury, Simplified",
//     subtitle:
//       "Clean ingredients meet timeless design. Because elegance is effortless.",
//     bg: "linear-gradient(135deg, #ff9966, #ff5e62 80%)",
//   },
// ];

// export const Banner = () => {
//   const [index, setIndex] = useState(0);

//   // Auto change every 6 seconds
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setIndex((prev) => (prev + 1) % slides.length);
//     }, 6000);
//     return () => clearInterval(timer);
//   }, []);

//   const prevSlide = () =>
//     setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//   const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);

//   return (
//     <div className="relative w-full h-[90vh] md:h-[85vh] overflow-hidden bg-black">
//       {/* --- Smooth Background Crossfade --- */}
//       {slides.map((slide, i) => (
//         <motion.div
//           key={slide.id}
//           initial={{ opacity: i === index ? 1 : 0 }}
//           animate={{ opacity: i === index ? 1 : 0 }}
//           transition={{ duration: 1.6, ease: "easeInOut" }}
//           className="absolute inset-0"
//           style={{
//             background: slide.bg,
//             backgroundSize: "200% 200%",
//             transform: i === index ? "scale(1.05)" : "scale(1)",
//             transition: "transform 6s ease",
//           }}
//         />
//       ))}

//       {/* --- Light Motion Overlay --- */}
//       <motion.div
//         animate={{
//           backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
//         }}
//         transition={{
//           duration: 10,
//           repeat: Infinity,
//           ease: "linear",
//         }}
//         className="absolute inset-0 opacity-30"
//         style={{
//           background:
//             "linear-gradient(120deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.3) 100%)",
//           backgroundSize: "200% 200%",
//           mixBlendMode: "overlay",
//         }}
//       />

//       {/* --- Dark Overlay for Text Contrast --- */}
//       <div className="absolute inset-0 bg-black/35" />

//       {/* --- Text Content --- */}
//       <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={slides[index].title}
//             initial={{ opacity: 0, y: 40, scale: 0.97 }}
//             animate={{
//               opacity: 1,
//               y: 0,
//               scale: 1,
//               transition: { duration: 1, ease: "easeOut" },
//             }}
//             exit={{
//               opacity: 0,
//               y: -30,
//               scale: 0.98,
//               transition: { duration: 0.8 },
//             }}
//             className="max-w-3xl"
//           >
//             <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_3px_15px_rgba(0,0,0,0.4)]">
//               {slides[index].title}
//             </h1>
//             <p className="mt-5 text-white/90 text-base sm:text-lg md:text-xl font-light leading-relaxed">
//               {slides[index].subtitle}
//             </p>

//             {/* ✅ Button Redirects to Product Page */}
//             <Link href="/products">
//               <motion.button
//                 whileHover={{ scale: 1.07 }}
//                 whileTap={{ scale: 0.96 }}
//                 className="mt-8 px-8 py-3 bg-white/15 backdrop-blur-md border border-white/30 rounded-full hover:bg-white/25 text-white text-sm md:text-base tracking-wide transition-all duration-300"
//               >
//                 Explore Now →
//               </motion.button>
//             </Link>
//           </motion.div>
//         </AnimatePresence>
//       </div>

//       {/* --- Arrows (fade in on hover) --- */}
//       <div className="absolute inset-0 flex justify-between items-center px-4 sm:px-10 z-20 opacity-0 hover:opacity-100 transition-opacity duration-500">
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={prevSlide}
//           className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
//         >
//           <ChevronLeft className="w-6 h-6 text-white" />
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={nextSlide}
//           className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
//         >
//           <ChevronRight className="w-6 h-6 text-white" />
//         </motion.button>
//       </div>

//       {/* --- Progress Dots --- */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
//         {slides.map((_, i) => (
//           <motion.div
//             key={i}
//             animate={{
//               scale: index === i ? 1.3 : 1,
//               opacity: index === i ? 1 : 0.5,
//             }}
//             className={`h-2.5 rounded-full ${
//               index === i ? "bg-white w-6" : "bg-white/50 w-2.5"
//             } transition-all duration-300`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };


"use client";
import { useState, useEffect } from "react";

export default function Banner() {
  const slides = [
    {
      desktop: "/banners/desktop/desktop_banner_10percentage_01.webp",
      mobile: "/banners/mobile/mobile_banner_10percentage_01.webp",
      alt: "Cosmetic Banner 1",
    },
    {
      desktop: "/banners/desktop/desktop_banner_10percentage_02.webp",
      mobile: "/banners/mobile/mobile_banner_10percentage_02.webp",
      alt: "Cosmetic Banner 2",
    },
    {
      desktop: "/banners/desktop/desktop_banner_10percentage_03.webp",
      mobile: "/banners/mobile/mobile_banner_10percentage_01.webp",
      alt: "Cosmetic Banner 3",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden pt-2">  {/* very little space */}
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0 px-2">  {/* rounded spacing */}
            
            {/* Desktop */}
            <img
              src={slide.desktop}
              alt={slide.alt}
              className="hidden md:block w-full aspect-[1920/700] object-cover rounded-2xl"
            />

            {/* Mobile */}
            <img
              src={slide.mobile}
              alt={slide.alt}
              className="block md:hidden w-full h-auto object-cover rounded-xl"
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 w-full flex justify-center gap-3 z-10">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all h-[3px] cursor-pointer rounded-full ${
              current === index ? "w-8 bg-[#F0A400]" : "w-4 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

