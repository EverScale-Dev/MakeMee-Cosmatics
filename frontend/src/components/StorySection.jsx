import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import heroImg from "../assets/img1.jpg";
import serumImg from "../assets/img2.jpg";
import lifestyleImg from "../assets/img3.jpg";

import FadeContent from "./AnimatedComponents/FadeContent";

gsap.registerPlugin(ScrollTrigger);

const StorySection = () => {
  useEffect(() => {
    const section = document.querySelector(".story-section");
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".story-text > *", {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="story-section px-6 lg:px-24 py-24 bg-cream">
      <div className="grid lg:grid-cols-2 gap-16 items-start">

        {/* LEFT TEXT */}
        <div className="story-text max-w-xl pt-24">
          <p className="uppercase tracking-widest text-accent text-sm mb-4">
            Our Story
          </p>

          <h1 className="font-serif text-4xl lg:text-5xl leading-tight mb-6">
            Beauty in Its Purest Form
          </h1>

          <p className="text-neutral-600 mb-6 leading-relaxed">
            At Lumière, we believe that true beauty comes from within.
            Our carefully crafted formulas combine the power of nature
            with modern science.
          </p>

          <p className="text-neutral-600 leading-relaxed">
            Every product is thoughtfully designed to enhance your
            natural radiance.
          </p>
        </div>

        {/* RIGHT IMAGE GRID */}
        <div className="grid grid-cols-2 gap-6">

          {/* MAIN IMAGE */}
<FadeContent
  blur
  duration={2}
  delay={0}
  className="col-span-2"
>
  <div className="aspect-[16/9] rounded-2xl overflow-hidden">
    <img
      src={heroImg}
      alt="Beauty product"
      className="w-full h-full object-cover"
    />
  </div>
</FadeContent>

{/* SUB IMAGE 1 */}
<FadeContent blur duration={2} delay={0.25}>
  <div className="aspect-[4/5] rounded-2xl overflow-hidden">
    <img
      src={serumImg}
      alt="Serum bottle"
      className="w-full h-full object-cover"
    />
  </div>
</FadeContent>

{/* SUB IMAGE 2 */}
<FadeContent blur duration={2} delay={0.5}>
  <div className="aspect-[4/5] rounded-2xl overflow-hidden">
    <img
      src={lifestyleImg}
      alt="Lifestyle"
      className="w-full h-full object-cover"
    />
  </div>
</FadeContent>

        </div>
      </div>
    </section>
  );
};

export default StorySection;
