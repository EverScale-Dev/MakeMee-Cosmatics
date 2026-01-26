import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Heart, User, Menu, X, Search } from "lucide-react";
import { gsap } from "gsap";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import makemee from "../assets/makemee.png";

const Navbar = ({ isAuthenticated = false }) => {
  const { getItemCount } = useCart();
  const { items: wishlist } = useWishlist();

  const cartCount = getItemCount();
  const wishlistCount = wishlist.length;

  const location = useLocation();
  const navRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);

  // ✅ MOBILE DETECTION (static – reliable)
  const isMobile = window.innerWidth < 768;

  // ✅ DESKTOP SCROLL EFFECT ONLY
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // ✅ GSAP NAV ENTRY (DESKTOP ONLY)
  useEffect(() => {
    if (isMobile || !navRef.current) return;

    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, [isMobile]);

  // CLOSE MENU ON ROUTE CHANGE
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // SEARCH ANIMATION (DESKTOP ONLY)
  useEffect(() => {
    if (isMobile || !searchRef.current) return;

    gsap.to(searchRef.current, {
      width: isSearchOpen ? 220 : 0,
      opacity: isSearchOpen ? 1 : 0,
      duration: isSearchOpen ? 0.4 : 0.3,
      ease: "power3.out",
      pointerEvents: isSearchOpen ? "auto" : "none",
      onComplete: () => isSearchOpen && searchInputRef.current?.focus(),
    });
  }, [isSearchOpen, isMobile]);

  // SEARCH CLOSE HANDLERS
  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (e) => {
      if (
        isSearchOpen &&
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    const handleKey = (e) => e.key === "Escape" && setIsSearchOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isSearchOpen, isMobile]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          isMobile
            ? "bg-white py-3 shadow-md"
            : isScrolled
            ? "bg-white shadow-md py-3"
            : "bg-transparent py-5"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img src={makemee} alt="MAKEMEE" className="h-18 object-contain" />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-lg font-medium text-gray-700 hover:text-[#F0A400]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-6">
            {/* DESKTOP SEARCH */}
            {!isMobile && (
              <div
                ref={searchWrapperRef}
                className="relative hidden md:flex items-center"
              >
                <div
                  ref={searchRef}
                  className="overflow-hidden opacity-0 w-0 mr-2"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border text-sm"
                  />
                </div>
                <button onClick={() => setIsSearchOpen((p) => !p)}>
                  <Search size={20} />
                </button>
              </div>
            )}

            {/* AUTH ICONS */}
            {isAuthenticated && (
              <>
                <Link to="/wishlist" className="relative">
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link to="/cart" className="relative">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link to="/account" className="hidden md:block">
                  <User size={20} />
                </Link>
              </>
            )}

            {/* DESKTOP AUTH */}
            {!isAuthenticated && !isMobile && (
              <>
                <Link to="/login" className="text-sm">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full bg-black text-white text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* MOBILE MENU */}
            {isMobile && (
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>

        {/* MOBILE DROPDOWN */}
        {isMobile && isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg ">
            <div className="flex flex-col items-center space-y-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-gray-800"
                >
                  {link.name}
                </Link>
              ))}

              <div className="w-24 h-px bg-gray-300" />

              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="text-sm">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 rounded-full bg-black text-white text-sm"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link to="/account" className="text-sm">
                  My Account
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
