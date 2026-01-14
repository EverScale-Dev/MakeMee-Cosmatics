import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import heroImg from "../assets/img1.jpg";
import serumImg from "../assets/img2.jpg";
import lifestyleImg from "../assets/img3.jpg";

gsap.registerPlugin(ScrollTrigger);

const StorySection = () => {
  const sectionRef = useRef(null);
  const imagesRef = useRef(null);
  

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* FLOATING PARALLAX TIMELINE */
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom bottom",
          end: "+=120%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      })
        .fromTo(
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
          }
        )
        .fromTo(
          ".overlay-content",
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.4"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

   

  

  return (
    <section
      ref={sectionRef}
      className="relative h-screen px-6 lg:px-24 py-32 bg-white overflow-hidden"
    >
      
      <div className="grid lg:grid-cols-2 gap-16 items-start relative z-10 -top-40">
        <div className="max-w-xl pt-24">
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

          <p className="text-neutral-600 leading-relaxed">
            Designed to elevate your everyday ritual.
          </p>
        </div>
      </div>

      {/* FLOATING IMAGE OVERLAY */}
      <div
        ref={imagesRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none "
      >
        <div className="relative w-full max-w-4xl mx-auto">
          {/* MAIN IMAGE */}
          <div className="parallax-img absolute top-0 left-1/2 -translate-x-1/2 w-[85%] rounded-3xl overflow-hidden shadow-2xl">
            <img src={heroImg} className="w-full h-full object-cover" />
          </div>

          {/* IMAGE LEFT */}
          <div className="parallax-img absolute -left-10 top-32 w-[40%] rounded-3xl overflow-hidden shadow-xl">
            <img src={serumImg} className="w-full h-full object-cover" />
          </div>

          {/* IMAGE RIGHT */}
          <div className="parallax-img absolute -right-10 top-52 w-[40%] rounded-3xl overflow-hidden shadow-xl">
            <img src={lifestyleImg} className="w-full h-full object-cover" />
          </div>


        </div>
      </div>
    </section>
  );
};

export default StorySection;
