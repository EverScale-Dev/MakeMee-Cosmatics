"use client"
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Button, Divider, IconButton, useMediaQuery, AppBar, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger icon
import Link from 'next/link';

const Sidebar = () => {
  const [open, setOpen] = useState(false); // For mobile view drawer
  const isMobile = useMediaQuery('(max-width: 768px)'); // Check for mobile screen size

  const handleLogout = () => {
    // Clear the token (assuming it's stored in localStorage)
    localStorage.removeItem('token');
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div>
      {/* AppBar with Hamburger Icon for Mobile */}
      {isMobile && (
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"} // Temporary on mobile, permanent on desktop
        open={isMobile ? open : true} // Show drawer when open is true on mobile
        onClose={toggleDrawer} // Close drawer on mobile when clicked outside
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
          <Link href="/" className="flex justify-center">
            <img src="/logo.webp" alt="Logo" className="px-2 py-3" />
          </Link>
          {/* Place Link on ListItem */}
          <ListItem component={Link} href="/admin">
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem component={Link} href="/admin/orders">
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
          <ListItem component={Link} href="/admin/products">
            <ListItemIcon><InventoryIcon /></ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem component={Link} href="/admin/customers">
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItem>
        </List>
        <Divider />

        {/* Logout Button */}
        <div className="mt-auto p-4">
          <Link href="/login" onClick={handleLogout} style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<ExitToAppIcon />}
              fullWidth
            >
              Logout
            </Button>
          </Link>
        </div>
      </Drawer>
    </div>
  );
};

export default Sidebar;
