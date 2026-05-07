'use client';

import { Suspense } from 'react';
import OtpVerificationPage from '@/src/pages/auth/OtpVerificationPage';

export default function OtpVerifyRoute() {
  return (
    <Suspense fallback={null}>
      <OtpVerificationPage />
    </Suspense>
  );
}
