import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

// --- Framer Motion Variants ---

const bannerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const itemVariants = {
  initial: { y: 40, opacity: 0, filter: 'blur(8px)' },
  animate: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 18,
    }
  }
};

// New variant for the internal lightning shine effect, applied via background-position
const shineTextVariants = {
  shine: {
    // Animate the background-position from left (0%) to right (100%)
    backgroundPosition: ['100% 50%', '0% 50%'], 
    transition: {
      duration: 5,
      ease: "linear",
      // repeat: Infinity,
      repeatDelay: 2, // Wait 2 seconds between shines
    }
  }
};
// --- Main Component ---

export const Banner = () => {
  // Keeping state for text content
  const initialHeadline = "Premium Beauty Products";
  const initialSubtext = "Discover our exclusive collection of premium beauty products crafted with natural ingredients for radiant, healthy skin.";

  const [headline] = useState(initialHeadline);
  const [subtext] = useState(initialSubtext);

  // State for controllable bubbles
  const step = 25; // Movement distance per key press
  const [bubblePositions, setBubblePositions] = useState({
    bubble1: { x: 0, y: 0 },
    bubble2: { x: 0, y: 0 },
    bubble3: { x: 0, y: 0 },
  });

  // Effect to handle keyboard controls for bubble movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      setBubblePositions(prev => {
        let newPositions = { ...prev };

        switch (e.key) {
          case 'ArrowUp':
            newPositions.bubble1.y -= step;
            newPositions.bubble2.y -= step;
            newPositions.bubble3.y -= step;
            break;
          case 'ArrowDown':
            newPositions.bubble1.y += step;
            newPositions.bubble2.y += step;
            newPositions.bubble3.y += step;
            break;
          case 'ArrowLeft':
            newPositions.bubble1.x -= step;
            newPositions.bubble2.x -= step;
            newPositions.bubble3.x -= step;
            break;
          case 'ArrowRight':
            newPositions.bubble1.x += step;
            newPositions.bubble2.x += step;
            newPositions.bubble3.x += step;
            break;
          default:
            return prev;
        }
        return newPositions;
      });
    };

    // Add event listener to the window
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty dependency array means this runs once on mount

  // Ref for the scroll indicator
  const scrollRef = React.useRef(null);
  

  return (
    <div className="relative h-screen w-full overflow-hidden  font-['Inter',_sans-serif] text-gray-900 focus:outline-none" tabIndex={-1}>

      {/* Midground - Floating Geometric Shapes and Controllable Bubbles */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
      >
        {/* Shape 1: Top Left - Blue Accent (Rotates 360) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-[10%] left-[10%] h-32 w-32 rounded-3xl bg-blue-300/20 backdrop-blur-sm shadow-xl"
        />
        {/* Shape 2: Bottom Right - Orange Accent (Rotates -360) */}
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[5%] h-28 w-28 rounded-full bg-orange-300/20 backdrop-blur-sm shadow-xl"
        />
        {/* Shape 3: Bottom Left - Teal Square (New shape - Rotates -180 slowly) */}
        <motion.div
          animate={{ rotate: -180 }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="absolute bottom-[20%] right-[15%] h-40 w-40 rounded-xl bg-teal-300/20 backdrop-blur-sm shadow-xl"
        />
        
        {/* --- Controllable Bubbles (Replaces the Subtle Ring) --- */}
        
        {/* Bubble 1: Medium Blue */}
        <motion.div
          style={{ 
            x: bubblePositions.bubble2.x, 
            y: bubblePositions.bubble2.y 
          }}
          animate={{ y: [0, 15, 0] }} // Gentle automatic floating motion
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute right-[10%] top-[20%] h-24 w-24 rounded-full bg-blue-400/30 shadow-2xl"
        />
        
        {/* Bubble 2: Small Teal */}
        <motion.div
          style={{ 
            x: bubblePositions.bubble3.x, 
            y: bubblePositions.bubble3.y 
          }}
          animate={{ y: [0, -15, 0] }} // Gentle automatic floating motion
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute left-[42%] bottom-[5%] h-16 w-16 rounded-full bg-teal-400/30 shadow-2xl"
        />

      </motion.div>

      {/* 3. Foreground - Central Content (Static positioning) */}
      <div className="relative z-20 flex h-full w-full items-center justify-center p-6 sm:p-12">
        <motion.div
          className="max-w-4xl text-center"
          variants={bannerVariants}
          initial="initial"
          animate="animate"
        >
          {/* Headline with Internal Shine Effect */}
          <motion.h1
            className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-8xl bg-clip-text text-transparent pb-2 relative z-10"
            variants={itemVariants}
            // Inline styles defining the gradient, including the white streak for the shine
            style={{
              // Multi-stop gradient: Dark -> Indigo -> White Shine -> Indigo -> Dark
              backgroundImage: 'linear-gradient(90deg, #1f2937 0%, #4f46e5 35%, #eff6ff 50%, #4f46e5 65%, #1f2937 100%)',
              backgroundSize: '300% 100%', // Make background wide so shine appears as a moving streak
            }}
            // Apply the continuous shine animation
            animate={shineTextVariants.shine}
          >
            {headline}
          </motion.h1>

          {/* Subtext (Dark gray text) */}
          <motion.p
            className="mt-6 max-w-xl text-lg sm:text-xl text-gray-600 mx-auto"
            variants={itemVariants}
          >
            {subtext}
          </motion.p>         
        </motion.div>
      </div>

      {/* 4. Smooth Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30" ref={scrollRef}>
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <p className="text-xs text-gray-500 mb-1 tracking-widest">SCROLL</p>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.div>
      </div>
    </div>
  );
};


