'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface City {
  name: string;
  count: number;
  emoji: string;
  avg_price?: number;
}

interface CitiesCarouselProps {
  popularCities: City[];
}

export default function CitiesCarousel({ popularCities }: CitiesCarouselProps) {
  const router = useRouter();

  if (!popularCities.length) return null;

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 5 }}>
          <Box>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
              Popular Locations
            </Typography>
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: '-0.03em' }}>
              Search by City
            </Typography>
          </Box>
          <Button endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 700 }}>
            View all cities
          </Button>
        </Box>

        {/* Horizontal scroll carousel */}
        <Box sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          pb: 4,
          '&::-webkit-scrollbar': { display: 'none' },
          mx: { xs: -2, md: 0 },
          px: { xs: 2, md: 0 },
        }}>
          {popularCities.map((city, idx) => (
            <Box
              key={idx}
              onClick={() => router.push(`/search?city=${city.name}`)}
              sx={{
                minWidth: { xs: 240, md: 300 },
                height: 380,
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                flexShrink: 0,
                '&:hover img': { transform: 'scale(1.1)' },
              }}
            >
              <img
                src={`/building${(idx % 5) + 1}.jpg`}
                alt={city.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
              />
              <Box sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                p: 3,
                color: 'white',
              }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>{city.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>{city.count} Listings</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    Avg. ₦{(Number(city.avg_price || 0) / 1000000).toFixed(1)}M
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
