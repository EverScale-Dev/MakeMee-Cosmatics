"use client";
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Box, CssBaseline, CircularProgress } from '@mui/material';
import useAdminAuth from './withauth';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { isAuthorized, loading } = useAdminAuth();

  // Don't show sidebar on admin login page
  if (pathname === '/admin/login') {
    return children;
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f5f5f5"
      >
        <CircularProgress sx={{ color: "#1a1a2e" }} />
      </Box>
    );
  }

  // Don't render if not authorized
  if (!isAuthorized) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { xs: 0, md: 30 } }}>
        {children}
      </Box>
    </Box>
  );
}
