'use client';

import { Suspense } from 'react';
import AddListingPage from '@/src/pages/dashboard/AddListingPage';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function AddListingPageRoute() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>}>
      <AddListingPage />
    </Suspense>
  );
}
