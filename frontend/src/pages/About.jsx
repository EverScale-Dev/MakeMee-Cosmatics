import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger)
export default function About() {
  const bgRef = useRef(null);
  const cardRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    gsap.set(bgRef.current, { opacity: 0, scale: 1.05 });
    gsap.set(cardRef.current, { x: 120, opacity: 0 });
    gsap.set(textRef.current, { y: 40, opacity: 0 });

    gsap.to(bgRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.8,
      ease: "power3.out",
    });

    gsap.to(textRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      delay: 0.6,
      ease: "power3.out",
    });

    gsap.to(cardRef.current, {
      x: 0,
      opacity: 1,
      duration: 2.2,
      delay: 1,
      ease: "power2.out",
    });
  }, []);

  return (
    <section className="relative min-h-screen bg-luxuryBlack overflow-hidden">
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-20 items-center">
        {/* LEFT TEXT */}
        <div ref={textRef}>
          <h1 className="font-serif text-white text-5xl lg:text-6xl leading-tight">
            Essentiality
            <br />
            of Beauty
          </h1>

          <p className="mt-6 max-w-lg text-gray-300 text-sm leading-relaxed">
            An immersive experience inspired by the universal language of beauty.
            Rooted in culture, art, and identity, our philosophy celebrates beauty
            as an essential force shaping confidence, self-expression, and
            human connection.
          </p>

          <button className="mt-10 inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-xs tracking-widest uppercase hover:bg-gray-200 transition">
            Read the Story
          </button>
        </div>

        {/* RIGHT CARD */}
        <div
          ref={cardRef}
          className="bg-[#FFF1F7] rounded-xl shadow-2xl p-10 max-w-md ml-auto"
        >
          <h3 className="text-center font-serif text-sm tracking-widest mb-6">
            WHEN ART MEETS BEAUTY
          </h3>

          <div className="flex justify-center mb-6">
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c"
              alt="art"
              className="w-40 h-52 object-cover rounded-md shadow-md"
            />
          </div>

          <p className="text-xs text-gray-600 leading-relaxed text-center">
            Inspired by artistic heritage, our beauty rituals merge timeless
            craftsmanship with modern innovation. Each creation tells a story
            of elegance, authenticity, and individuality.
          </p>

          <div className="flex justify-center mt-8">
            <button className="bg-black text-white px-6 py-3 rounded-full text-xs tracking-widest uppercase hover:bg-gray-900 transition">
              Discover
            </button>
          </div>
        </div>
      </div>
    </section>
    
  );
}
