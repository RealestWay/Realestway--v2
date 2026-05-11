import Box from '@mui/material/Box';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import PropertyDetailPage from '@/src/pages/PropertyDetailPage';
import ApiService from '@/src/services/api';
import { Property } from '@/src/types';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const revalidate = 86400; // ISR: Revalidate every 24 hours

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugArray } = await params;
  const slug = slugArray[slugArray.length - 1]; // The actual slug is the last part
  
  // Check if it's a numeric ID for backward compatibility
  const isNumericId = /^\d+$/.test(slug);

  try {
    const res = isNumericId
      ? await ApiService.properties.getOne(slug) as { success: boolean, data: Property }
      : await ApiService.properties.getBySlug(slug) as { success: boolean, data: Property };

    if (res && res.success && res.data) {
      const p = res.data;
      const title = `${p.bedrooms ? p.bedrooms + ' Bedroom ' : ''}${p.house_type || 'Property'} for ${p.category} in ${p.city}, ${p.state} | Realestway`;
      const description = `Explore this ${p.bedrooms ? p.bedrooms + ' Bedroom ' : ''}${p.house_type} located at ${p.address}, ${p.city}. Price: ₦${(p.total_package || p.basic_rent || p.price || 0).toLocaleString()}. Sourced daily from property-sharing communities.`;
      const images = p.images && p.images.length > 0 ? [ApiService.getMediaUrl(p.images[0])] : ['/favicon.jpg'];
      
      const canonical = `https://realestway.com/properties/${p.category}/${p.state?.toLowerCase().replace(/\s+/g, '-')}/${p.city?.toLowerCase().replace(/\s+/g, '-')}/${p.slug || p.id}`;

      return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
          title,
          description,
          images,
          type: 'website',
          url: canonical,
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
    console.error('Metadata fetch failed for property slug:', slug, err);
  }

  return {
    title: 'Property Details | Realestway',
    description: 'View property details on Realestway.',
  };
}

export default async function PropertySlugPage({ params }: PageProps) {
  const { slug: slugArray } = await params;
  const slug = slugArray[slugArray.length - 1];
  const isNumericId = /^\d+$/.test(slug);
  
  let initialData: Property | undefined;

  try {
    const res = isNumericId
      ? await ApiService.properties.getOne(slug) as { success: boolean, data: Property }
      : await ApiService.properties.getBySlug(slug) as { success: boolean, data: Property };
      
    if (res && res.success) {
      initialData = res.data;
      
      // Redirect to canonical URL if accessed via numeric ID or incomplete slug
      const p = initialData;
      const stateSlug = p.state?.toLowerCase().replace(/\s+/g, '-') || 'nigeria';
      const citySlug = p.city?.toLowerCase().replace(/\s+/g, '-') || 'city';
      const canonicalPath = `/properties/${p.category}/${stateSlug}/${citySlug}/${p.slug || p.id}`;
      
      const currentPath = `/properties/${slugArray.join('/')}`;
      
      if (currentPath !== canonicalPath) {
        redirect(canonicalPath);
      }
    }
  } catch (err) {
    console.error('SSR fetch failed for property slug:', slug, err);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {initialData && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "RealEstateListing",
                "name": `${initialData.bedrooms ? initialData.bedrooms + ' Bedroom ' : ''}${initialData.house_type || initialData.type} for ${initialData.category} in ${initialData.city}`,
                "description": initialData.description,
                "url": `https://realestway.com/properties/${initialData.category}/${initialData.state?.toLowerCase().replace(/\s+/g, '-')}/${initialData.city?.toLowerCase().replace(/\s+/g, '-')}/${initialData.slug || initialData.id}`,
                "image": initialData.images?.map(img => ApiService.getMediaUrl(img)) || [],
                "datePosted": initialData.created_at || initialData.createdAt,
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": initialData.address,
                  "addressLocality": initialData.city,
                  "addressRegion": initialData.state,
                  "addressCountry": "NG"
                },
                "offers": {
                  "@type": "Offer",
                  "price": initialData.total_package || initialData.basic_rent || initialData.price || 0,
                  "priceCurrency": "NGN",
                  "availability": "https://schema.org/InStock"
                }
              })
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://realestway.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": initialData.category === 'rent' ? 'For Rent' : 'For Sale',
                    "item": `https://realestway.com/search?category=${initialData.category}`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": initialData.city,
                    "item": `https://realestway.com/search?city=${initialData.city}`
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "Property Details",
                    "item": `https://realestway.com/properties/${initialData.category}/${initialData.state?.toLowerCase().replace(/\s+/g, '-')}/${initialData.city?.toLowerCase().replace(/\s+/g, '-')}/${initialData.slug || initialData.id}`
                  }
                ]
              })
            }}
          />
        </>
      )}
      <Box component="main" sx={{ flex: 1 }}>
        <PropertyDetailPage initialData={initialData} />
      </Box>
      <Footer />
    </Box>
  );
}
