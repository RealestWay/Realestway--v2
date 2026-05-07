import type { AppProps } from 'next/app';

// FIX: This project uses the Next.js App Router (app/ directory).
// The components in src/pages/ are just view components mapped to App Router pages.
// However, because they are inside a "pages" directory, Next.js natively attempts 
// to treat them as Pages Router routes and prerenders them during the build.
// Since the App Router's providers (like GoogleOAuthProvider) are missing here, the build crashes.
// By completely replacing the Pages Router root with this dummy component, 
// we prevent the view components from being executed in the Pages Router context,
// guaranteeing a successful build while preserving the real App Router routes.
export default function DummyApp({ Component, pageProps }: AppProps) {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>404 - Not Found</h1>
      <p>This route is not accessible directly.</p>
    </div>
  );
}
