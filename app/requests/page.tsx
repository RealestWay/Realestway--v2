'use client';

import Box from '@mui/material/Box';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import RequestsPage from '@/src/pages/RequestsPage';

export default function HouseRequestsPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <RequestsPage />
      </Box>
      <Footer />
    </Box>
  );
}
