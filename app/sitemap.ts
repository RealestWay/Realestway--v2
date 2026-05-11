import { MetadataRoute } from 'next';
import ApiService from '@/src/services/api';
import { Property, Agent } from '@/src/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = 'https://realestway.com';

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/blogs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    { url: `${BASE_URL}/requests`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ];

  // 2. Fetch Properties (recent 1000)
  let propertyPages: MetadataRoute.Sitemap = [];
  try {
    const res = await ApiService.properties.getAll('limit=1000') as { data: Property[] };
    if (res && res.data) {
      propertyPages = res.data.map((p) => ({
        url: `${BASE_URL}/property/${p.id}`,
        lastModified: new Date(p.updatedAt || p.updated_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (e) {
    console.error('Sitemap: Failed to fetch properties', e);
  }

  // 3. Fetch Blogs
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const res = await ApiService.blogs.getAll() as { data: any[] };
    if (res && res.data) {
      blogPages = res.data.map((b) => ({
        url: `${BASE_URL}/blogs/${b.slug}`,
        lastModified: new Date(b.updated_at || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
    }
  } catch (e) {
    console.error('Sitemap: Failed to fetch blogs', e);
  }

  // 4. City Pages (Programmatic Categories)
  let cityPages: MetadataRoute.Sitemap = [];
  try {
    const res = await ApiService.properties.getCities() as { data: any[] };
    if (res && res.data) {
      // For each city, add Rent, Sale, Shortlet pages
      cityPages = res.data.flatMap((city) => {
        const citySlug = city.city.toLowerCase().replace(/\s+/g, '-');
        return [
          { url: `${BASE_URL}/search?city=${city.city}&category=rent`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
          { url: `${BASE_URL}/search?city=${city.city}&category=sale`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
          { url: `${BASE_URL}/search?city=${city.city}&category=shortlet`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
        ];
      });
    }
  } catch (e) {
    console.error('Sitemap: Failed to fetch cities', e);
  }

  return [...staticPages, ...propertyPages, ...blogPages, ...cityPages];
}
