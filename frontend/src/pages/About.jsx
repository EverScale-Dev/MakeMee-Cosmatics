import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowLeft } from "lucide-react";
import productImg from "../assets/fasewash.png";
import ShowStory from "@/components/ShowStory";


import herobg from "../assets/about/hero.png";
import aftervsbefore from "../assets/about/aftervsbefore.png";
import guidebynature from "../assets/about/guidebynature.png";
import aboutside from "../assets/about/about-side.png";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const bgRef = useRef(null);
  const cardRef = useRef(null);
  const textRef = useRef(null);
  const storyRef = useRef(null);
  const imageRef = useRef(null);
  const storyTextRef = useRef(null);
  

  const [showStory, setShowStory] = useState(false);

  /* HERO ANIMATION */
  useEffect(() => {
    gsap.set(bgRef.current, { opacity: 0, scale: 1.08 });
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
    });

    gsap.to(cardRef.current, {
      x: 0,
      opacity: 1,
      duration: 2,
      delay: 1,
    });
  }, []);

  /* PARALLAX SCROLL */
  useEffect(() => {
    gsap.utils.toArray(".parallax").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 80 },
        {
          y: -80,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
  }, []);

  /* STORY OPEN */
  useEffect(() => {
    if (showStory) {
      gsap.fromTo(
        storyRef.current,
        { y: "100%" },
        { y: 0, duration: 1, ease: "power4.out" },
      );

      gsap.fromTo(
        imageRef.current,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, delay: 0.6, duration: 1.2 },
      );

      gsap.fromTo(
        storyTextRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, delay: 0.4, duration: 1.2 },
      );
    }
  }, [showStory]);

  const closeStory = () => {
    gsap.to(storyRef.current, {
      y: "100%",
      duration: 0.8,
      ease: "power3.in",
      onComplete: () => setShowStory(false),
    });
  };

  useEffect(() => {
    // IMAGE FADE-IN
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
        },
      );
    });

    // TEXT SLIDE-IN
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
        },
      );
    });
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-screen bg-black overflow-hidden">
        <div
          ref={bgRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${herobg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-20 items-center">
          <div ref={textRef}>
            <h1 className="font-serif text-white text-5xl lg:text-6xl">
              Essentiality
              <br />
              of Beauty
            </h1>

            <p className="mt-6 max-w-lg text-gray-300 text-sm leading-relaxed">
              MakeMee was founded to create skincare that feels balanced,
              reliable, and easy to trust—focused on comfort, consistency, and
              everyday use.
            </p>

            <button
              onClick={() => setShowStory(true)}
              className="mt-10 inline-flex rounded-full bg-white px-6 py-3 text-xs uppercase tracking-widest"
            >
              Read the Story
            </button>
          </div>

          <div
            ref={cardRef}
            className="bg-[#FFF1F7] rounded-xl p-10 max-w-md ml-auto shadow-2xl flex flex-col items-center gap-4 mt-10"
          >
            <h3 className="text-center text-xs tracking-widest mb-3">
              WHEN CARE MEETS SCIENCE
            </h3>
            <img
              src={aboutside}
              alt="art"
              className="w-40 h-52 object-cover rounded-md shadow-md"
            />

            <p className="text-xs text-gray-600 leading-relaxed text-center">
              Designed for everyday routines, our formulations balance
              effectiveness, safety, and skin compatibility.
            </p>
          </div>
        </div>
      </section>

      {/* PARALLAX CONTENT */}
      {showStory && (
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
          
          {/* GLASS + CONTENT WRAPPER */}
         
          <div className="relative w-full min-h-screen p-10 mt-10">
            <div className="w-full min-h-full bg-white/30 rounded-xl backdrop-blur-3xl shadow-[inset_0_0_150px_rgba(255,255,255,1.5)]">
              {/* STORY HERO */}
              <div className="min-h-screen flex items-center ml-10 mr-10">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
                  {/* TEXT */}
                  <div ref={storyTextRef}>
                    <h2 className="font-serif text-main text-6xl lg:text-7xl leading-tight mb-8">
                      How MakeMee
                      <br />
                      Began
                    </h2>

                    <p className="text-[#444] text-lg leading-relaxed max-w-xl">
                      MakeMee was founded with a clear purpose — to create
                      skincare that feels balanced, reliable, and easy to trust.
                      <br />
                      <br />
                      We focus on skin comfort, consistency, and everyday
                      usability rather than unnecessary complexity.
                    </p>
                  </div>

                  {/* PRODUCT IMAGE */}
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

              {/* STORY PARALLAX SECTIONS */}
              <section className="py-40">
                <div className="max-w-7xl mx-auto px-6 space-y-40">
                  {/* SECTION 1 — TEXT LEFT / IMAGE RIGHT */}
                  <div className="story-section grid lg:grid-cols-2 gap-20 items-center parallax">
                    <div className="slide-text" data-direction="left">
                      <h3 className="font-serif text-5xl text-main mb-6">
                        A Thoughtful
                        <br />
                        Approach to Skincare
                      </h3>
                      <p className="text-[#444] text-lg max-w-xl leading-relaxed">
                        From the outset, MakeMee has followed a considered
                        approach to product development. Each formulation is
                        designed with intention, focusing on performance,
                        texture, and skin compatibility.
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-xl fade-image">
                      <img
                        src={aftervsbefore}
                        alt="formulation"
                        className="rounded-xl w-full object-cover"
                      />
                    </div>
                  </div>

                  {/* SECTION 2 — IMAGE LEFT / TEXT RIGHT */}
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
                        Guided by Nature,
                        <br />
                        Refined by Care
                      </h3>
                      <p className="text-[#444] text-lg max-w-xl leading-relaxed">
                        We draw inspiration from nature while applying a modern,
                        disciplined approach to formulation. Ingredients are
                        chosen for their effectiveness, safety, and long-term
                        skin health.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        
        </section>
      )}
    </>
  );
}
