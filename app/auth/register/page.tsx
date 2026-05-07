'use client';

import { Suspense } from 'react';
import RegisterPage from '@/src/pages/auth/RegisterPage';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function RegisterPageRoute() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>}>
      <RegisterPage />
    </Suspense>
  );
}
