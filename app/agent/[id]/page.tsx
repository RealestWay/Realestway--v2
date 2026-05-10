import { Metadata, ResolvingMetadata } from 'next';
import Box from '@mui/material/Box';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import AgentProfilePage from '@/src/pages/AgentProfilePage';
import ApiService from '@/src/services/api';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const response: any = await ApiService.agent.getProfile(id);
    const profile = response.data;
    const businessName = profile.business_name || profile.name;
    const description = `Find houses, apartments, and lands listed by ${businessName} on Realestway. ${profile.bio || ''}`.substring(0, 160);
    const title = `${businessName} | Realestway Real Estate Agency`;
    const image = profile.avatar || '/favicon.jpg';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [image],
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch (e) {
    return {
      title: 'Agent Profile | Realestway',
      description: 'View agent profile on Realestway.',
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
