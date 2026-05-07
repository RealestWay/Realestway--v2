'use client';

import { Suspense } from 'react';
import EmailVerificationPage from '@/src/pages/auth/EmailVerificationPage';

export default function EmailVerifyRoute() {
  return (
    <Suspense fallback={null}>
      <EmailVerificationPage />
    </Suspense>
  );
}
