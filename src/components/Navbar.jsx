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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!searchRef.current) return;

    if (isSearchOpen) {
      gsap.to(searchRef.current, {
        width: 220,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
        pointerEvents: "auto",
        onComplete: () => searchInputRef.current?.focus(),
      });
    } else {
      gsap.to(searchRef.current, {
        width: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
        pointerEvents: "none",
      });
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isSearchOpen &&
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isSearchOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
           {/* LOGO WRAPPER (LOCKED SIZE) */}
        <Link to="/" className="flex items-center">
          <div className="h-20 w-50 flex items-center justify-center overflow-hidden">
            <img
              src={makemee}
              alt="MAKEMEE Logo"
              className="h-40 w-40 object-contain"
            />
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-lg font-medium tracking-wide text-gray-700 hover:text-[#F0A400] transition-opacity"
            >
              {link.name}
            </Link>
          ))}
        </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-6">
            {/* SEARCH (optional – keep public) */}
            <div
              ref={searchWrapperRef}
              className="relative hidden md:flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* SEARCH INPUT */}
              <div
                ref={searchRef}
                className="overflow-hidden opacity-0 w-0 mr-2"
                style={{ pointerEvents: "none" }}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  className="
                  w-full px-4 py-1.5 rounded-full
                  bg-white/30 backdrop-blur-md
                  border border-white/40
                  text-sm text-gray-800
                  placeholder:text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-black/20
                "
                />
              </div>

              {/* SEARCH ICON */}
              <button
                onClick={() => setIsSearchOpen((prev) => !prev)}
                className="transition-colors text-gray-700 hover:text-[#F0A400]"
              >
                <Search size={20} />
              </button>
            </div>

            {/* 🔐 AUTHENTICATED ICONS */}
            {isAuthenticated && (
              <>
                <Link
                  to="/wishlist"
                  className={`relative transition-colors text-gray-700 hover:text-[#F0A400]`}
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className={`relative transition-colors text-gray-700 hover:text-[#F0A400]`}
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/account"
                  className={`hidden md:block transition-colors text-gray-700 hover:text-[#F0A400]`}
                >
                  <User size={20} />
                </Link>
              </>
            )}

            {/* 🔓 LOGIN / SIGNUP (only when NOT logged in) */}
            {!isAuthenticated && (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`text-sm font-medium 'text-gray-700' 
                  `}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`px-4 py-2 rounded-full ${
                    isScrolled ? "bg-black" : "bg-white"
                  } ${
                    isScrolled ? "text-white" : "text-black"
                  } text-sm font-medium hover:opacity-90 transition`}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden transition-colors text-gray-700 hover:text-[#F0A400]`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="bg-white md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-700 font-medium"
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <Link to="/account" className="text-gray-700 font-medium">
                  My Account
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 font-medium">
                    Login
                  </Link>
                  <Link to="/signup" className="text-gray-700 font-medium">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
