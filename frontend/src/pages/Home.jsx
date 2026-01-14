import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ProductCard from '../components/ProductCard';
import AnimatedSection from '../components/AnimatedSection';
import StorySection from '../components/StorySection';
import { getFeaturedProducts } from '../data/products';
import { useHeroAnimation } from '../animations/useHeroAnimation';

gsap.registerPlugin(ScrollTrigger);

const Home = ({ onAddToCart, onAddToWishlist }) => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const imageRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = getFeaturedProducts();

  const heroImages = [
    'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ];

  useHeroAnimation({ titleRef, subtitleRef, ctaRef, imageRef });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!imageRef.current) return;

    gsap.to(imageRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.to(imageRef.current, { opacity: 1, duration: 0.5 });
      },
    });
  }, [currentSlide]);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'These products have completely transformed my skincare routine.',
      rating: 5,
    },
    {
      name: 'Emily Chen',
      text: 'Cruelty-free, natural, and incredibly effective.',
      rating: 5,
    },
    {
      name: 'Maria Garcia',
      text: 'Premium quality and visible results.',
      rating: 5,
    },
  ];

  return (
    <div className="bg-white text-black">

      {/* ================= HERO ================= */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#731162] to-[#FC6CB4]">
        <div
          ref={imageRef}
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${heroImages[currentSlide]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Natural Beauty,
            <br />
            Redefined
          </h1>

          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto"
          >
            Premium skincare crafted with nature's finest ingredients.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <button className="px-8 py-4 text-lg font-semibold rounded-full
                bg-[#FC6CB4] text-white
                hover:bg-[#F0A400] transition">
                Shop Now
              </button>
            </Link>

            <Link to="/about">
              <button className="px-8 py-4 text-lg font-semibold rounded-full
                border-2 border-white text-white
                hover:bg-white hover:text-[#731162] transition">
                Our Story
              </button>
            </Link>
          </div>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index
                  ? 'bg-[#F0A400] w-8'
                  : 'bg-white/50 w-2'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <AnimatedSection className="py-20 bg-base">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#731162] mb-4">
              Bestselling Products
            </h2>
            <p className="text-black/70 text-lg">
              Our most loved skincare essentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop">
              <button className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold
                rounded-full border-2 border-[#731162] text-[#731162]
                hover:bg-[#731162] hover:text-white transition">
                View All Products
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <StorySection />

      {/* ================= TESTIMONIALS ================= */}
      <AnimatedSection className="py-20 bg-[#FC6CB4]/5 ">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[#731162] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-black/70 mb-12 text-lg">
            Trusted by thousands worldwide.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-[#731162]/20 hover:shadow-xl transition"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} className="text-[#F0A400] text-xl">★</span>
                  ))}
                </div>
                <p className="text-black/70 mb-4">"{t.text}"</p>
                <p className="font-semibold text-[#731162]">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Home;
