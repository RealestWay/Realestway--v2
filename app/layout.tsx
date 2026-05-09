import type { Metadata, Viewport } from 'next';
import Box from '@mui/material/Box';
import ThemeRegistry from './ThemeRegistry';
import TrackingProvider from '../src/components/TrackingProvider';
import { AuthProvider } from '../src/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PWAInstallButton from '../src/components/layout/PWAInstallButton';
import CookieConsent from '../src/components/layout/CookieConsent';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export const metadata: Metadata = {
  title: 'Realestway | Houses, Apartments, Lands for Sale or Rent in Nigeria',
  description: 'Find houses, apartments, lands, and commercial properties for sale or rent across Nigeria. Browse thousands of listings, connect with agents, and discover properties faster.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.jpg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Realestway',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#00A255',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <ThemeRegistry>
              <TrackingProvider />
              <PWAInstallButton />
              <CookieConsent />
              {children}
            </ThemeRegistry>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
