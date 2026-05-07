'use client';

import { Suspense } from 'react';
import LoginPage from '@/src/pages/auth/LoginPage';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function LoginPageRoute() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>}>
      <LoginPage />
    </Suspense>
  );
}
