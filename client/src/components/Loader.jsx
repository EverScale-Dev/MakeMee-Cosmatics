import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Loader = () => {
  const loaderRef = useRef(null);

  useEffect(() => {
    if (loaderRef.current) {
      const dots = loaderRef.current.children;
      gsap.to(dots, {
        y: -20,
        duration: 0.6,
        stagger: 0.1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div ref={loaderRef} className="flex space-x-2 mb-4">
          <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
        </div>
        <p className="text-gray-600 text-sm tracking-wide">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
