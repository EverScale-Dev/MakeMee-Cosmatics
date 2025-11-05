"use client";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  CircularProgress,
  Box,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { UserCircle } from "lucide-react";

const Header = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  useEffect(() => setIsMounted(true), []);

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
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const delay = setTimeout(() => handleSearch(), 500);
    return () => clearTimeout(delay);
  }, [searchTerm, handleSearch]);

  // Close dropdown clicking outside
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
    <header className="container">
      <AppBar position="static" elevation={0} sx={{ background: "#fff", padding: "8px 0" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Logo */}
          <Link href="/">
            <Box component="img" src="/logo.webp" alt="Logo"
              sx={{ width: isMobile ? 140 : 160, objectFit: "contain" }}
            />
          </Link>

          {/* Desktop Search */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexGrow: 1, ml: 4 }}>
              
              <Box sx={{ position: "relative", width: "40%" }} ref={dropdownRef}>
                <InputBase
                  placeholder="Search Products…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    backgroundColor: "#e0e0e0",
                    borderRadius: 50,
                    padding: "8px 16px",
                    width: "100%",
                    pr: 5,
                  }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    right: 4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#000",
                  }}
                  onClick={handleSearch}
                >
                  {loading ? <CircularProgress size={24} /> : <SearchIcon />}
                </IconButton>

                {/* Search Dropdown */}
                {searchResults.length > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      mt: 1,
                      width: "100%",
                      background: "white",
                      borderRadius: 2,
                      boxShadow: 3,
                      zIndex: 2000,
                      maxHeight: 240,
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
                          padding: "8px",
                          color: "#4a4a4a",
                          textDecoration: "none",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          component="img"
                          src={product.images?.[0]}
                          alt={product.name}
                          sx={{
                            width: 28,
                            height: 28,
                            objectFit: "cover",
                            borderRadius: 1,
                            mr: 1,
                          }}
                        />
                        {product.name}
                      </Link>
                    ))}
                  </Box>
                )}
              </Box>

              {/* About + Contact */}
              <Box sx={{ display: "flex", gap: 3, ml: 10 }}>
                <Link href="/about" style={{ fontWeight: 600, color: "#000", fontSize: 16 }}>About</Link>
                <Link href="/productpage" style={{ fontWeight: 600, color: "#000", fontSize: 16 }}>Product</Link>
                <Link href="/contact" style={{ fontWeight: 600, color: "#000", fontSize: 16 }}>Contact</Link>
              </Box>
            </Box>
          )}

          {/* Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Link href="/cart">
              <IconButton sx={{ color: "black", position: "relative" }}>
                <ShoppingCartOutlinedIcon />
                {isMounted && totalQuantity > 0 && (
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

            {!isMobile && (
              <Link href="/profile">
                <IconButton sx={{ color: "black" }}>
                  <UserCircle />
                </IconButton>
              </Link>
            )}

            {isMobile && (
              <IconButton sx={{ color: "black" }} onClick={() => setMenuOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <IconButton onClick={() => setMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
          <List>
            <ListItem component={Link} href="/about" onClick={() => setMenuOpen(false)}>
              <ListItemText primary="About" />
            </ListItem>
            <ListItem component={Link} href="/productpage" onClick={() => setMenuOpen(false)}>
              <ListItemText primary="Product" />
            </ListItem>
            <ListItem component={Link} href="/contact" onClick={() => setMenuOpen(false)}>
              <ListItemText primary="Contact" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </header>
  );
};

export default Header;