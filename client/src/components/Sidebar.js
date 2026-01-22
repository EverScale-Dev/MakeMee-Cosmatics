"use client"
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
  IconButton,
  useMediaQuery,
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu"; // Hamburger icon
import RateReviewIcon from '@mui/icons-material/RateReview';
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");
  const pathname = usePathname();

  const toggleDrawer = () => setOpen(!open);

  const handleLogout = () => localStorage.removeItem("token");

  // Menu items
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, href: "/admin" },
    { text: "Orders", icon: <ShoppingCartIcon />, href: "/admin/orders" },
    { text: "Products", icon: <InventoryIcon />, href: "/admin/products" },
    { text: "Customers", icon: <PeopleIcon />, href: "/admin/customers" },
    { text: "Reviews", icon: <RateReviewIcon />, href: "/admin/reviews" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2 }}>
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 240,
            backgroundColor: "#f9fafb",
            borderRight: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            overflowX: 'hidden',
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ px: 2, py: 3, display: "flex", justifyContent: "center" }}>
          <Link href="/">
            <img src="/logo.webp" alt="Logo" style={{ width: 140, cursor: "pointer" }} />
          </Link>
        </Box>

        <Divider />

        {/* Menu */}
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <ListItem
                key={index}
                component={Link}
                href={item.href}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  transition: "0.3s",
                  backgroundColor: isActive ? "#e0f2fe" : "transparent",
                  "&:hover": { backgroundColor: "#dbeafe" },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "#0284c7" : "#64748b" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: isActive ? "#0284c7" : "#1e293b",
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItem>
            );
          })}
        </List>

        <Divider />

        {/* Logout */}
        <Box sx={{ p: 2 }}>
          <Link href="/login" onClick={handleLogout} style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<ExitToAppIcon />}
              fullWidth
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                py: 1.2,
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                "&:hover": { boxShadow: "0 6px 15px rgba(0,0,0,0.12)" },
              }}
            >
              Logout
            </Button>
          </Link>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
