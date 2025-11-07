"use client";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  IconButton,
  InputBase,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import axios from "axios";

const Header = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  // scroll shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // search logic
  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?search=${searchTerm}`
      );
      setSearchResults(data || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const delay = setTimeout(() => handleSearch(), 500);
    return () => clearTimeout(delay);
  }, [searchTerm, handleSearch]);

  // close dropdown clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`w-full z-50 bg-white transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-[1300px] mx-auto flex items-center justify-between px-6 py-2">
        {/* ==== Logo ==== */}
        <Link href="/">
          <img
            src="/logo.webp"
            alt="Logo"
            className="w-[170px] h-auto object-contain"
          />
        </Link>

        {/* ==== Center Section ==== */}
        {!isMobile && (
          <div className="flex items-center gap-8 flex-1 justify-center">
            {/* Search bar */}
            <div
              className={`relative transition-all duration-500 ease-in-out ${
                isFocused ? "w-[420px]" : "w-[280px]"
              }`}
              ref={dropdownRef}
            >
              <InputBase
                placeholder="Search products..."
                value={searchTerm}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-100 rounded-full pl-5 pr-10 py-2 w-full transition-all duration-500 focus:bg-white focus:shadow-md"
              />
              <IconButton
                sx={{
                  position: "absolute",
                  right: 5,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#000",
                }}
                onClick={handleSearch}
              >
                {loading ? <CircularProgress size={22} /> : <SearchIcon />}
              </IconButton>

              {/* Search dropdown */}
              {searchResults.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    mt: 1,
                    width: "100%",
                    background: "white",
                    borderRadius: 2,
                    boxShadow: 3,
                    zIndex: 2000,
                    maxHeight: 250,
                    overflowY: "auto",
                  }}
                >
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product._id}`}
                      onClick={() => setSearchResults([])}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px 12px",
                        textDecoration: "none",
                        color: "#333",
                      }}
                    >
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 4,
                          objectFit: "cover",
                          marginRight: 8,
                        }}
                      />
                      {product.name}
                    </Link>
                  ))}
                </Box>
              )}
            </div>

            {/* Menu Links */}
            <nav className="flex items-center gap-8">
              {["About", "Products", "Contact"].map((item) => {
                const path =
                  item === "Products" ? "/productpage" : `/${item.toLowerCase()}`;
                return (
                  <Link
                    key={item}
                    href={path}
                    className="font-medium text-black text-[16px] relative after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all hover:after:w-full"
                  >
                    {item}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* ==== Right Icons ==== */}
        <div className="flex items-center gap-3">
          <Link href="/cart">
            <IconButton sx={{ color: "#000", position: "relative" }}>
              <ShoppingCartOutlinedIcon />
              {totalQuantity > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 16,
                    height: 16,
                    background: "#d32f2f",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: "bold",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {totalQuantity}
                </Box>
              )}
            </IconButton>
          </Link>

          {isMobile && (
            <IconButton sx={{ color: "#000" }} onClick={() => setMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </div>
      </div>

      {/* ==== Mobile Drawer ==== */}
      <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box sx={{ width: 260, p: 2 }}>
          <IconButton onClick={() => setMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
          <List>
            {["About", "Products", "Contact"].map((item) => {
              const path =
                item === "Products" ? "/productpage" : `/${item.toLowerCase()}`;
              return (
                <ListItem
                  key={item}
                  component={Link}
                  href={path}
                  onClick={() => setMenuOpen(false)}
                >
                  <ListItemText primary={item} />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </header>
  );
};

export default Header;
