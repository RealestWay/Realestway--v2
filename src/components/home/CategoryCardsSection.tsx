'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CategoryCard from './CategoryCard';
import ApiService from '@/src/services/api';

interface CategoryCardsSectionProps {
  homeData: any;
  loading: boolean;
}

export default function CategoryCardsSection({ homeData, loading }: CategoryCardsSectionProps) {
  const countStr = (n: number) =>
    n > 999 ? `${(n / 1000).toFixed(1)}k` : n.toString();

  const categories = [
    {
      title: 'Rent',
      description: 'Find apartments for yearly rent',
      image: ApiService.getMediaUrl(homeData.previews?.rent?.[0]),
      href: '/search?category=rent',
      previewImages: (homeData.previews?.rent || []).map((img: string) => ApiService.getMediaUrl(img)),
      count: homeData.counts?.rent ? countStr(homeData.counts.rent) : '0',
      priceOverlay: null,
      loading,
    },
    {
      title: 'Buy',
      description: 'Own your home with premium listings',
      image: ApiService.getMediaUrl(homeData.previews?.buy?.[0]),
      href: '/search?category=sale',
      previewImages: (homeData.previews?.buy || []).map((img: string) => ApiService.getMediaUrl(img)),
      count: homeData.counts?.sale ? countStr(homeData.counts.sale) : '0',
      priceOverlay: null,
      loading,
    },
    {
      title: 'Shortlet',
      description: 'Comfortable stays for short durations',
      image: ApiService.getMediaUrl(homeData.previews?.shortlet?.[0]),
      href: '/search?category=shortlet',
      previewImages: (homeData.previews?.shortlet || []).map((img: string) => ApiService.getMediaUrl(img)),
      count: homeData.counts?.shortlet ? countStr(homeData.counts.shortlet) : '0',
      priceOverlay: null,
      loading,
    },
    {
      title: 'Land',
      description: 'Invest in the future with prime land',
      image: ApiService.getMediaUrl(homeData.previews?.land?.[0]),
      href: '/search?category=sale&house_type[]=Land',
      previewImages: (homeData.previews?.land || []).map((img: string) => ApiService.getMediaUrl(img)),
      count: homeData.counts?.land ? countStr(homeData.counts.land) : '0',
      priceOverlay: null,
      loading,
    },
  ];

  return (
    <Box sx={{ bgcolor: 'white', pt: { xs: 6, md: 8 }, pb: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 6 }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
            Explore Categories
          </Typography>
          <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: '-0.03em', mb: 2 }}>
            Find exactly what you need.
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {categories.map((cat, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
              <CategoryCard {...cat} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
