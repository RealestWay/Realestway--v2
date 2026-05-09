'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

interface City {
  name: string;
  count: number;
  emoji: string;
}

interface PopularCitiesGridProps {
  popularCities: City[];
  visibleCitiesCount: number;
  setVisibleCitiesCount: (fn: (prev: number) => number) => void;
}

export default function PopularCitiesGrid({
  popularCities,
  visibleCitiesCount,
  setVisibleCitiesCount,
}: PopularCitiesGridProps) {
  const router = useRouter();

  if (!popularCities.length) return null;

  return (
    <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 10 }, borderTop: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" color="primary" sx={{ mb: 0.5, display: 'block' }}>
            Popular Locations
          </Typography>
          <Typography variant="h4" fontWeight={800}>Explore by City</Typography>
        </Box>

        <Grid container spacing={2}>
          {popularCities.slice(0, visibleCitiesCount).map((city) => (
            <Grid key={city.name} size={{ xs: 6, sm: 4, md: 2 }}>
              <Paper
                onClick={() => router.push(`/search?city=${city.name}`)}
                elevation={0}
                sx={{
                  p: 3, textAlign: 'center', border: '1.5px solid', borderColor: 'divider',
                  borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 20px rgba(0,162,85,0.15)',
                    transform: 'translateY(-2px)',
                    bgcolor: 'rgba(0,162,85,0.03)',
                  },
                }}
              >
                <Typography sx={{ fontSize: '2rem', mb: 1 }}>{city.emoji}</Typography>
                <Typography variant="subtitle2" fontWeight={700}>{city.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {city.count.toLocaleString()} listings
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {visibleCitiesCount < popularCities.length && (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setVisibleCitiesCount((prev) => prev + 12)}
              sx={{
                borderColor: 'primary.main', color: 'primary.main',
                px: 6, py: 1.2, borderRadius: '10px', fontWeight: 700,
                '&:hover': { bgcolor: 'primary.main', color: 'white', boxShadow: '0 4px 15px rgba(0,162,85,0.25)' },
                transition: 'all 0.2s ease',
              }}
            >
              See More Cities
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
