import { useEffect } from 'react';
import { gsap } from 'gsap';

export const useHeroAnimation = (refs) => {
  useEffect(() => {
    const { titleRef, subtitleRef, ctaRef, imageRef } = refs;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (titleRef?.current) {
      tl.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        0.2
      );
    }

    if (subtitleRef?.current) {
      tl.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0.4
      );
    }

    if (ctaRef?.current) {
      tl.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.6
      );
    }

    if (imageRef?.current) {
      tl.fromTo(
        imageRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5 },
        0.3
      );
    }

    return () => {
      tl.kill();
    };
  }, [refs]);
};
