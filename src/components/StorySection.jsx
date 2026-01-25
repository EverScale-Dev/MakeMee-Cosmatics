import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedSection from "./AnimatedSection";

import heroImg from "../assets/img1.jpeg";
import slide1 from "../assets/img2.jpeg";
import slide2 from "../assets/img3.jpeg";

gsap.registerPlugin(ScrollTrigger);

const StorySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".parallax-img",
        {
          y: 120,
          scale: 0.95,
          opacity: 0,
        },
        {
          y: -120,
          scale: 1,
          opacity: 1,
          stagger: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1.2,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative bg-base overflow-hidden
        px-6 lg:px-24
        py-24 lg:py-32
        min-h-[900px]
      "
    >
      {/* ================= TEXT ================= */}
      <AnimatedSection className="grid gap-12 items-center justify-center relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <p className="uppercase tracking-widest text-[#FC6CB4] text-sm mb-4">
            Our Story
          </p>

          <h1 className="font-serif text-4xl lg:text-5xl leading-tight mb-6 text-[#731162]">
            Beauty in Its Purest Form
          </h1>

          <p className="text-neutral-600 leading-relaxed">
            At Lumière, we believe beauty is intentional.
            Crafted with nature, refined by science.
          </p>
        </div>
      </AnimatedSection>

      {/* ================= IMAGES ================= */}
      {/* MOBILE */}
      <div className="relative mt-16 space-y-6 lg:hidden">
        <img src={heroImg} className="w-full rounded-3xl shadow-xl" />
        <img src={slide1} className="w-full rounded-3xl shadow-xl" />
        <img src={slide2} className="w-full rounded-3xl shadow-xl" />
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-4xl mx-auto">
          {/* MAIN */}
          <div className="parallax-img absolute top-20 left-1/2 -translate-x-1/2 w-[85%] rounded-3xl overflow-hidden shadow-2xl">
            <img src={heroImg} className="w-full h-full object-cover" />
          </div>

          {/* LEFT */}
          <div className="parallax-img absolute -left-10 top-60 w-[40%] rounded-3xl overflow-hidden shadow-xl">
            <img src={slide1} className="w-full h-full object-cover" />
          </div>

          {/* RIGHT */}
          <div className="parallax-img absolute -right-10 top-56 w-[40%] rounded-3xl overflow-hidden shadow-xl">
            <img src={slide2} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
