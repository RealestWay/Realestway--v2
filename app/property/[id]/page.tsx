import Box from '@mui/material/Box';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import PropertyDetailPage from '@/src/pages/PropertyDetailPage';
import ApiService from '@/src/services/api';
import { Property } from '@/src/types';
import { Property } from '@/src/types';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await ApiService.properties.getOne(id) as { success: boolean, data: Property };
    if (res && res.success && res.data) {
      const p = res.data;
      const title = `${p.house_type || 'Property'} for ${p.category} in ${p.city}, ${p.state} | Realestway`;
      const description = `${p.bedrooms ? p.bedrooms + ' Bedroom ' : ''}${p.house_type} located at ${p.address}, ${p.city}. Price: ₦${(p.total_package || p.basic_rent || p.price || 0).toLocaleString()}.`;
      const images = p.images && p.images.length > 0 ? [ApiService.getMediaUrl(p.images[0])] : ['/favicon.jpg'];

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images,
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images,
        },
      };
    }
  } catch (err) {
    console.error('Metadata fetch failed for property:', id, err);
  }

  return {
    title: 'Property Details | Realestway',
    description: 'View property details on Realestway.',
  };
}

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
