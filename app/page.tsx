import Box from '@mui/material/Box';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import LandingPage from '@/src/pages/LandingPage';
import ApiService from '@/src/services/api';

/**
 * Root Home Page (SSR Optimized)
 * Fetches initial data on the server for SEO and instant loading.
 */
export default async function Home() {
  let initialHomeData = null;
  let initialCitiesData = [];

  try {
    // Parallel fetch for speed
    const [homeRes, citiesRes]: any = await Promise.all([
      ApiService.properties.getHome(),
      ApiService.properties.getCities()
    ]);

    initialHomeData = homeRes;
    
    if (citiesRes && citiesRes.data) {
      initialCitiesData = citiesRes.data.map((c: any, i: number) => ({
        name: c.name,
        count: c.count,
        emoji: ['🏙️', '🏛️', '⚓', '🏘️', '🌆', '🌿'][i % 6],
      }));
    }
  } catch (err) {
    console.error('Home SSR Fetch Failed:', err);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <LandingPage 
          initialHomeData={initialHomeData} 
          initialCitiesData={initialCitiesData} 
        />
      </Box>
      <Footer />
    </Box>
  );
}
