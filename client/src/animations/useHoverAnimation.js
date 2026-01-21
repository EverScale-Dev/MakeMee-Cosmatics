import { useEffect } from 'react';
import { gsap } from 'gsap';

export const useHoverAnimation = (ref, options = {}) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const {
      scale = 1.05,
      duration = 0.3,
      ease = 'power2.out',
    } = options;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale,
        duration,
        ease,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        duration,
        ease,
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, options]);
};
