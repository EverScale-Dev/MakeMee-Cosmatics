import Sidebar from '@/components/Sidebar';
import { Box, CssBaseline } from '@mui/material';

export default function AdminLayout({ children }) {
  return (
    <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { xs: 0, md: 30 } }}>
        {children}
      </Box>
    </Box>
    </>
  );
}
