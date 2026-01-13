import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
  if (!footerRef.current) return;

  const isInViewport =
    footerRef.current.getBoundingClientRect().top < window.innerHeight;

  gsap.fromTo(
    footerRef.current,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: isInViewport
        ? undefined
        : {
            trigger: footerRef.current,
            start: "top bottom-=100",
          },
    }
  );
}, []);


  return (
    <footer ref={footerRef} className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">MAKEMEE</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium natural beauty products crafted with care. Cruelty-free and sustainable.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-white text-sm transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?category=skincare" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Skincare
                </Link>
              </li>
              <li>
                <Link to="/shop?category=haircare" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Haircare
                </Link>
              </li>
              <li>
                <Link to="/shop?category=bodycare" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Body Care
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} MAKEMEE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
