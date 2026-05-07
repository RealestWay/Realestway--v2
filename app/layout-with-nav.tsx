import Box from '@mui/material/Box';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';

const DASHBOARD_ROUTES = ['/dashboard', '/dashboard/add-listing'];

export default function LayoutWithNav({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname: string;
}) {
  const isDashboard = DASHBOARD_ROUTES.some((r) => pathname === r);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      {!isDashboard && <Footer />}
    </Box>
  );
}
