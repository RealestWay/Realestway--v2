import { Suspense } from 'react';
import { Metadata } from 'next';
import Box from '@mui/material/Box';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import SearchResultsPage from '@/src/pages/SearchResultsPage';

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;

  const city = typeof params.city === 'string' ? params.city : '';
  const state = typeof params.state === 'string' ? params.state : '';
  const category = typeof params.category === 'string' ? params.category : '';
  const type = typeof params.type === 'string' ? params.type : '';
  const bedrooms = typeof params.bedrooms === 'string' ? params.bedrooms : '';

  // Build human-readable title parts
  const typeLabel = type || 'Properties';
  const bedroomLabel = bedrooms ? `${bedrooms} Bedroom ` : '';
  const actionLabel =
    category === 'rent' ? 'for Rent' :
    category === 'sale' ? 'for Sale' :
    category === 'shortlet' ? 'Shortlet' : '';
  const locationLabel = city ? `in ${city}${state ? `, ${state}` : ''}` : state ? `in ${state}` : 'in Nigeria';

  const titleParts = [`${bedroomLabel}${typeLabel}`, actionLabel, locationLabel]
    .filter(Boolean)
    .join(' ');

  const title = titleParts
    ? `${titleParts} | Realestway`
    : 'Search Properties in Nigeria | Realestway';

  const description = `Explore a wide range of ${bedroomLabel.trim() }${type ? ' ' + type.toLowerCase() + 's' : ' properties'} ${actionLabel ? actionLabel + ' ' : ''}${locationLabel}, sourced daily from live listings and property-sharing communities. Find your ideal home on Realestway.`;

  // Canonical: clean URL with only meaningful params
  const canonicalParams = new URLSearchParams();
  if (category) canonicalParams.set('category', category);
  if (city) canonicalParams.set('city', city);
  if (state) canonicalParams.set('state', state);
  if (type) canonicalParams.set('type', type);
  if (bedrooms) canonicalParams.set('bedrooms', bedrooms);
  const canonicalQuery = canonicalParams.toString();
  const canonical = `https://realestway.com/search${canonicalQuery ? '?' + canonicalQuery : ''}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'Realestway',
      images: [{ url: '/favicon.jpg', width: 1200, height: 630, alt: 'Realestway — Find Properties in Nigeria' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/favicon.jpg'],
    },
  };
}

import ApiService from '@/src/services/api';

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  
  // Construct search query for the server-side fetch (matching client-side logic in SearchResultsPage.tsx)
  const query = new URLSearchParams();
  const q = params.q || params.search || '';
  if (q) query.set('search', typeof q === 'string' ? q : q[0]);
  
  const city = params.city || '';
  if (city) query.set('city', typeof city === 'string' ? city : city[0]);
  
  const category = params.category || 'rent';
  query.set('category', typeof category === 'string' ? category : category[0]);
  
  if (params.type) {
    const types = Array.isArray(params.type) ? params.type : [params.type];
    types.forEach(t => query.append('house_type[]', t as string));
  }
  
  const sort = params.sort || 'newest';
  query.set('sort', typeof sort === 'string' ? sort : sort[0]);

  // Note: limit and page are added inside the hook on the client, so we don't add them to the key string here

  let initialData = null;
  try {
    // Fetch with limit/page, but the 'query' object remains clean to match client key
    const fetchUrl = `${query.toString()}${query.toString() ? '&' : ''}limit=20&page=1`;
    const response: any = await ApiService.properties.getAll(fetchUrl);
    initialData = response; 
  } catch (err) {
    console.error('SSR Search Fetch Failed:', err);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <Navbar position="absolute" />
      <Box component="main" sx={{ flex: 1 }}>
        <Suspense fallback={<Box sx={{ p: 5, textAlign: 'center' }}>Loading search results...</Box>}>
          <SearchResultsPage initialData={initialData} />
        </Suspense>
      </Box>
      <Footer />
    </Box>
  );
}

