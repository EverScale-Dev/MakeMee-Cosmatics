import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedSection = ({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  stagger = 0,
}) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const animations = {
      fadeUp: { y: 60, opacity: 0 },
      fadeDown: { y: -60, opacity: 0 },
      fadeLeft: { x: -60, opacity: 0 },
      fadeRight: { x: 60, opacity: 0 },
      scale: { scale: 0.8, opacity: 0 },
      fade: { opacity: 0 },
    };

    const fromProps = animations[animation] || animations.fadeUp;

    const ctx = gsap.context(() => {
      if (stagger > 0) {
        const children = element.children;
        gsap.fromTo(
          children,
          fromProps,
          {
            y: 0,
            x: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
            delay,
            stagger,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom-=100',
              toggleActions: 'play none none reverse',
            },
          }
        );
      } else {
        gsap.fromTo(
          element,
          fromProps,
          {
            y: 0,
            x: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom-=100',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, element);

    return () => ctx.revert();
  }, [animation, delay, stagger]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
};

export default AnimatedSection;
