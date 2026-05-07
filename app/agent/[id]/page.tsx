import { Metadata, ResolvingMetadata } from 'next';
import Box from '@mui/material/Box';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import AgentProfilePage from '@/src/pages/AgentProfilePage';
import ApiService from '@/src/services/api';

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  
  try {
    const response: any = await ApiService.agent.getProfile(id);
    const profile = response.data;
    const businessName = profile.business_name || profile.name;
    const description = profile.business_metadata?.description || `View properties listed by ${businessName} on Realestway.`;
    
    return {
      title: `${businessName} | Realestway Agency Profile`,
      description: description.substring(0, 160),
      openGraph: {
        title: businessName,
        description: description.substring(0, 160),
        images: profile.avatar ? [profile.avatar] : [],
        type: 'profile',
      },
    };
  } catch (e) {
    return {
      title: 'Agent Profile | Realestway',
    };
  }
}

export default function Page() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <AgentProfilePage />
      </Box>
      <Footer />
    </Box>
  );
}
