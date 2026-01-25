import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useReveal = (ref, options = {}) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const {
      delay = 0,
      duration = 1,
      y = 50,
      x = 0,
      opacity = 0,
      stagger = 0,
      ease = 'power3.out',
      start = 'top bottom-=100',
    } = options;

    const ctx = gsap.context(() => {
      if (stagger > 0 && element.children.length > 0) {
        gsap.fromTo(
          element.children,
          { y, x, opacity },
          {
            y: 0,
            x: 0,
            opacity: 1,
            duration,
            delay,
            stagger,
            ease,
            scrollTrigger: {
              trigger: element,
              start,
              toggleActions: 'play none none reverse',
            },
          }
        );
      } else {
        gsap.fromTo(
          element,
          { y, x, opacity },
          {
            y: 0,
            x: 0,
            opacity: 1,
            duration,
            delay,
            ease,
            scrollTrigger: {
              trigger: element,
              start,
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, element);

    return () => ctx.revert();
  }, [ref, options]);
};
