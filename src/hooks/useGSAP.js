import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* -------------------- REVEAL -------------------- */
export const useReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            ...options,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [options]);

  return ref;
};

/* -------------------- STAGGER REVEAL -------------------- */
export const useStaggerReveal = (containerSelector, options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const selector = containerSelector || ':scope > *';
    const children = container.querySelectorAll(selector);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        {
          y: options.y || 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: options.stagger || 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [containerSelector, options]);

  return ref;
};

/* -------------------- HERO ANIMATION -------------------- */
export const useHeroAnimation = () => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        element.querySelectorAll('.hero-title'),
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 }
      )
        .fromTo(
          element.querySelectorAll('.hero-subtitle'),
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=0.8'
        )
        .fromTo(
          element.querySelectorAll('.hero-cta'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          element.querySelectorAll('.hero-image'),
          { scale: 1.1, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.4 },
          '-=1.2'
        );
    });

    return () => ctx.revert();
  }, []);

  return ref;
};

/* -------------------- PARALLAX -------------------- */
export const useParallax = (speed = 0.5) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        yPercent: -20 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
};

/* -------------------- CARD HOVER -------------------- */
export const useHoverAnimation = () => {
  const ref = useRef(null);

  const onMouseEnter = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      scale: 1.02,
      y: -4,
      boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.18)',
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      scale: 1,
      y: 0,
      boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.08)',
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  return { ref, onMouseEnter, onMouseLeave };
};

/* -------------------- BUTTON HOVER -------------------- */
export const useButtonHover = () => {
  const ref = useRef(null);

  const onMouseEnter = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return { ref, onMouseEnter, onMouseLeave };
};

/* -------------------- PAGE TRANSITION -------------------- */
export const usePageTransition = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        'main',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, []);
};
