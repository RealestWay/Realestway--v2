import { Suspense } from 'react';
import Box from '@mui/material/Box';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import SearchResultsPage from '@/src/pages/SearchResultsPage';

export default function SearchPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <Navbar position="absolute" />
      <Box component="main" sx={{ flex: 1 }}>
        <Suspense fallback={<Box sx={{ p: 5, textAlign: 'center' }}>Loading search results...</Box>}>
          <SearchResultsPage />
        </Suspense>
      </Box>
      <Footer />
    </Box>
  );
}
