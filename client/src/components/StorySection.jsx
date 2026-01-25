import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedSection from "./AnimatedSection";

import heroImg from "../assets/img1.jpeg";
import serumImg from "../assets/img2.jpeg";
import lifestyleImg from "../assets/img3.jpeg";

gsap.registerPlugin(ScrollTrigger);

const StorySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => "+=" + sectionRef.current.offsetHeight,
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            pinSpacing: true,
          },
        });

        tl.fromTo(
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
            clearProps: "transform",
          }
        );

        // 🔥 Refresh ScrollTrigger after images load
        const images = sectionRef.current.querySelectorAll("img");
        images.forEach((img) => {
          if (!img.complete) {
            img.addEventListener("load", () => {
              ScrollTrigger.refresh();
            });
          }
        });

        ScrollTrigger.refresh();
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white overflow-hidden px-6 lg:px-24 py-24 lg:py-32
                 min-h-screen lg:min-h-[800px]"
    >
      {/* ================= TEXT ================= */}
      <AnimatedSection className="grid gap-12 lg:gap-16 items-center justify-center relative z-10 lg:-top-10">
        <div className="max-w-xl mx-auto text-center">
          <p className="uppercase tracking-widest text-[#FC6CB4] text-sm mb-4">
            Our Story
          </p>

          <h1 className="font-serif text-4xl lg:text-5xl leading-tight mb-6 text-[#731162]">
            Beauty in Its Purest Form
          </h1>

          <p className="text-neutral-600 mb-6 leading-relaxed">
            At Lumière, we believe beauty is intentional.
            Crafted with nature, refined by science.
          </p>
        </div>
      </AnimatedSection>

      {/* ================= IMAGES ================= */}

      {/* MOBILE: stacked layout */}
      <div className="relative mt-16 space-y-6 lg:hidden">
        <img
          src={heroImg}
          alt="Hero"
          className="w-full rounded-3xl shadow-xl"
          loading="lazy"
        />
        <img
          src={serumImg}
          alt="Serum"
          className="w-full rounded-3xl shadow-xl"
          loading="lazy"
        />
        <img
          src={lifestyleImg}
          alt="Lifestyle"
          className="w-full rounded-3xl shadow-xl"
          loading="lazy"
        />
      </div>

      {/* DESKTOP: parallax floating */}
      <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-4xl mx-auto">
          {/* MAIN IMAGE */}
          <div className="parallax-img absolute top-10 left-1/2 -translate-x-1/2 w-[85%] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={heroImg}
              className="w-full h-full object-cover"
              alt="Hero"
              loading="eager"
            />
          </div>

          {/* LEFT IMAGE */}
          <div className="parallax-img absolute -left-10 top-44 w-[40%] rounded-3xl overflow-hidden shadow-xl">
            <img
              src={serumImg}
              className="w-full h-full object-cover"
              alt="Serum"
              loading="eager"
            />
          </div>

          {/* RIGHT IMAGE */}
          <div className="parallax-img absolute -right-10 top-58 w-[40%] rounded-3xl overflow-hidden shadow-xl">
            <img
              src={lifestyleImg}
              className="w-full h-full object-cover"
              alt="Lifestyle"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
