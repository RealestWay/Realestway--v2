import Box from '@mui/material/Box';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import PropertyDetailPage from '@/src/pages/PropertyDetailPage';
import ApiService from '@/src/services/api';
import { Property } from '@/src/types';

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let initialData: Property | undefined;

  try {
    const res = await ApiService.properties.getOne(id) as { success: boolean, data: Property };
    if (res && res.success) {
      initialData = res.data;
    }
  } catch (err) {
    console.error('SSR fetch failed for property:', id, err);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <PropertyDetailPage initialData={initialData} />
      </Box>
      <Footer />
    </Box>
  );
}
