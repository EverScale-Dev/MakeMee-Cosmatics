import { useSelector } from "react-redux";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
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
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  useEffect(() => setIsMounted(true), []);

  const handleSearch = useCallback(async () => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?search=${searchTerm}`
      );
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, handleSearch]);

  return (
    <header className="container">
      <AppBar
        position="static"
        elevation={0}
        sx={{ background: "#fff", padding: "8px 0px" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Link href="/">
            <Box
              component="img"
              src="/logo.webp"
              alt="Logo"
              sx={{ width: isMobile ? 140 : 160, objectFit: "contain" }}
            />
          </Link>

          {/* Desktop View */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexGrow: 1,
                justifyContent: "flex-start", // ⬅️ moved left near logo
                ml: 4, // add margin after logo
              }}
            >
              {/* Search Bar */}
              <Box
                sx={{
                  position: "relative",
                  width: "40%", // ⬅️ slightly smaller width
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <InputBase
                  placeholder="Search Products …"
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
              </Box>

              {/* Pages (About, Contact) */}
              <Box sx={{ display: "flex", gap: 3, ml: 10 }}>
                <Link
                  href="/about"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    fontWeight: "600", // bold text
                  }}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    fontWeight: "600", // bold text
                  }}
                >
                  Contact
                </Link>
              </Box>
            </Box>
          )}

          {/* Right Side Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Cart */}
            <IconButton sx={{ color: "black", width: "50px", height: "50px" }}>
              <Link href="/cart" style={{ position: "relative" }}>
                <ShoppingCartOutlinedIcon />
                {isMounted && totalQuantity > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 16,
                      height: 16,
                      fontSize: 10,
                      fontWeight: "bold",
                      backgroundColor: "#d32f2f",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {totalQuantity}
                  </Box>
                )}
              </Link>
            </IconButton>

            {/* User Icon (Desktop Only) */}
            {!isMobile && (
              <IconButton sx={{ color: "black", width: "50px", height: "50px" }}>
                <Link href="/profile">
                  <UserCircle />
                </Link>
              </IconButton>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <IconButton
                sx={{ color: "black", width: "50px", height: "50px" }}
                onClick={() => setMenuOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box sx={{ width: 250, padding: 2 }}>
          <IconButton onClick={() => setMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
          <List>
            <ListItem button component={Link} href="/about" onClick={() => setMenuOpen(false)}>
              <ListItemText primary="About" />
            </ListItem>
            <ListItem button component={Link} href="/contact" onClick={() => setMenuOpen(false)}>
              <ListItemText primary="Contact" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </header>
  );
};

export default Header;
