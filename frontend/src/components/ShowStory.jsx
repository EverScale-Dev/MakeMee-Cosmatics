// components/ShowStory.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowLeft } from "lucide-react";

import productImg from "../assets/fasewash.png";
import aftervsbefore from "../assets/about/aftervsbefore.png";
import guidebynature from "../assets/about/guidebynature.png";

gsap.registerPlugin(ScrollTrigger);

export default function ShowStory({ onClose }) {
  const storyRef = useRef(null);
  const imageRef = useRef(null);
  const storyTextRef = useRef(null);

  /* OPEN ANIMATION */
  useEffect(() => {
    gsap.fromTo(
      storyRef.current,
      { y: "100%" },
      { y: 0, duration: 1, ease: "power4.out" }
    );

    gsap.fromTo(
      imageRef.current,
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, delay: 0.6, duration: 1.2 }
    );

    gsap.fromTo(
      storyTextRef.current,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, delay: 0.4, duration: 1.2 }
    );
  }, []);

  /* SCROLL ANIMATIONS */
  useEffect(() => {
    gsap.utils.toArray(".fade-image").forEach((img) => {
      const section = img.closest(".story-section");

      gsap.fromTo(
        img,
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 0%",
            end: "bottom 40%",
            once: true,
          },
        }
      );
    });

    gsap.utils.toArray(".slide-text").forEach((text) => {
      const section = text.closest(".story-section");
      const direction = text.dataset.direction === "right" ? 80 : -80;

      gsap.fromTo(
        text,
        { x: direction, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        }
      );
    });
  }, []);

  const closeStory = () => {
    gsap.to(storyRef.current, {
      y: "100%",
      duration: 0.8,
      ease: "power3.in",
      onComplete: onClose,
    });
  };

  return (
    <section
      ref={storyRef}
      className="fixed inset-0 z-50 bg-primary overflow-y-auto pt-20 sm:pt-0 no-scrollbar"
    >
      {/* BACK BUTTON */}
      <button
        onClick={closeStory}
        className="fixed top-6 left-6 z-50 text-black flex items-center gap-2"
      >
        <ArrowLeft size={22} />
        Back
      </button>

      {/* GLASS WRAPPER */}
      <div className="relative w-full min-h-screen p-10 mt-10">
        <div className="w-full min-h-full bg-white/30 rounded-xl backdrop-blur-3xl shadow-[inset_0_0_150px_rgba(255,255,255,1.5)]">

          {/* STORY HERO */}
          <div className="min-h-screen flex items-center ml-10 mr-10">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
              <div ref={storyTextRef}>
                <h2 className="font-serif text-main text-6xl lg:text-7xl mb-8">
                  How MakeMee
                  <br />
                  Began
                </h2>

                <p className="text-[#444] text-lg max-w-xl leading-relaxed">
                  MakeMee was founded with a clear purpose — to create skincare
                  that feels balanced, reliable, and easy to trust.
                </p>
              </div>

              <div ref={imageRef} className="flex justify-center">
                <img
                  src={productImg}
                  alt="product"
                  className="w-[420px] lg:w-[520px]"
                  style={{
                    filter:
                      "drop-shadow(0 35px 50px rgba(115, 17, 98, 0.8))",
                  }}
                />
              </div>
            </div>
          </div>

          {/* STORY SECTIONS */}
          <section className="py-40">
            <div className="max-w-7xl mx-auto px-6 space-y-40">
              <div className="story-section grid lg:grid-cols-2 gap-20 items-center parallax">
                <div className="slide-text" data-direction="left">
                  <h3 className="font-serif text-5xl text-main mb-6">
                    A Thoughtful Approach
                  </h3>
                  <p className="text-[#444] text-lg leading-relaxed">
                    Each formulation is designed with intention and care.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl fade-image">
                  <img
                    src={aftervsbefore}
                    alt="formulation"
                    className="rounded-xl w-full"
                  />
                </div>
              </div>

              <div className="story-section grid lg:grid-cols-2 gap-20 items-center parallax">
                <div className="order-2 lg:order-1 bg-white p-6 rounded-2xl shadow-xl fade-image">
                  <img
                    src={guidebynature}
                    alt="nature"
                    className="rounded-xl w-full h-[420px] object-cover"
                  />
                </div>

                <div
                  className="order-1 lg:order-2 slide-text"
                  data-direction="right"
                >
                  <h3 className="font-serif text-5xl text-main mb-6">
                    Guided by Nature
                  </h3>
                  <p className="text-[#444] text-lg leading-relaxed">
                    Inspired by nature, refined by science.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
