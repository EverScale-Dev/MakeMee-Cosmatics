import Sidebar from '@/components/Sidebar';
import { Box, CssBaseline } from '@mui/material';

export default function AdminLayout({ children }) {
  return (
    <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        {children}
      </Box>
    </Box>
    </>
  );
}
