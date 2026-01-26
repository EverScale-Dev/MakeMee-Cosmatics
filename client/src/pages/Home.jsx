import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";

import ProductCard from "../components/ProductCard";
import AnimatedSection from "../components/AnimatedSection";
import StorySection from "../components/StorySection";
import { productService } from "../services";
import { useHeroAnimation } from "../animations/useHeroAnimation";

import pcbanner from "../assets/banner-desktop.jpeg";
import pcbannerMobile from "../assets/banner-mobile.jpeg";

import Hero1 from "../assets/hero/HERO1.png";
import Hero2 from "../assets/hero/HERO2.png";
import Hero3 from "../assets/hero/HERO3.png";
import Hero4 from "../assets/hero/HERO4.png";

// ---------------- utils ----------------
const transformProduct = (p) => ({
  ...p,
  id: p._id || p.id,
  images: p.images || ["/placeholder.png"],
  rating: p.rating || 4.5,
});

const Home = ({ onAddToCart, onAddToWishlist }) => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  // 🔥 two image layers
  const bg1 = useRef(null);
  const bg2 = useRef(null);
  const active = useRef(0);

  const heroImages = [Hero1, Hero2, Hero3, Hero4];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [featuredProducts, setFeaturedProducts] = useState([]);

  useHeroAnimation({ titleRef, subtitleRef, ctaRef });

  // autoplay
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // ✅ smooth image cross-fade (NO background color)
  useEffect(() => {
    const current = active.current === 0 ? bg1.current : bg2.current;
    const next = active.current === 0 ? bg2.current : bg1.current;

    if (!current || !next) return;

    next.style.backgroundImage = `url(${heroImages[currentSlide]})`;

    gsap.set(next, { opacity: 0, scale: 1.05 });

    gsap.to(next, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "power2.out",
    });

    gsap.to(current, {
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
    });

    active.current = active.current === 0 ? 1 : 0;
  }, [currentSlide]);

  // products
 useEffect(() => {
  const fetchFeatured = async () => {
    try {
      setLoadingProducts(true);
      const products = await productService.getFeatured(4);

      if (products?.length > 0) {
        setFeaturedProducts(products.map(transformProduct));
      } else {
        setFeaturedProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
      setFeaturedProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  fetchFeatured();
}, []);

  

  return (
    <div className="bg-white text-black">
      {/* ================= HERO ================= */}
      <section className="relative h-screen overflow-hidden">
        {/* image layer 1 (always present initially) */}
        <div
          ref={bg1}
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: `url(${heroImages[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(2px)",
          }}
        />

        {/* image layer 2 */}
        <div
          ref={bg2}
          className="absolute inset-0 opacity-0"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(2px)",
          }}
        />

        {/* content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-7xl mx-auto">
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

            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/shop">
                <button className="px-8 py-4 text-lg font-semibold rounded-full bg-[#FC6CB4] text-white hover:bg-[#F0A400] transition">
                  Shop Now
                </button>
              </Link>

              <Link to="/about">
                <button className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-white text-white hover:bg-white hover:text-[#731162] transition">
                  Our Story
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === i ? "bg-[#F0A400] w-8" : "bg-white/50 w-2"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      {featuredProducts.length > 0 && (
        <AnimatedSection className="py-20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
              />
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* ================= BANNER ================= */}
      <section className="mt-10">
        <img src={pcbanner} className="hidden md:block w-full" />
        <img src={pcbannerMobile} className="md:hidden w-full" />
      </section>

      <div className="hidden md:block">
        <StorySection />
      </div>
    </div>
  );
};

export default Home;
