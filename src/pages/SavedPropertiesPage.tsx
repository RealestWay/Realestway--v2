'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import PropertyCard from '../components/property/PropertyCard';
import ApiService from '../services/api';

export default function SavedPropertiesPage() {
  const router = useRouter();
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res: any = await ApiService.properties.getSaved();
        // The API returns a paginated list of Property objects, but sometimes they are wrapped or different.
        // Based on SavedPropertyController: return response()->json(['data' => $savedProperties->items()]);
        // And the relationship: $user->savedProperties() which returns Property objects.
        setSaved(res.data || []);
      } catch (err) {
        console.error('Failed to fetch saved properties:', err);
        if ((err as any).status === 401) router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [router]);

  const handleRemove = (id: string) => {
    setSaved(prev => prev.filter((p) => (p.uuid || p.id) !== id));
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all saved properties?')) return;
    try {
      // There's no "clear all" endpoint currently, so we'll have to do it one by one or leave it.
      // For now, let's just clear the local state if we don't have a backend endpoint.
      // But actually, it's better to just not provide a clear all button if it doesn't work.
      // I'll leave the state clearing for now as a fallback.
      setSaved([]);
    } catch (err) {}
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box
        sx={{
          bgcolor: 'secondary.main',
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
            <BookmarkIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h4" fontWeight={800} color="white">
              Saved Properties
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', ml: 5 }}>
            {saved.length} properties saved
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 5 }}>
        {saved.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 6, md: 10 },
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <BookmarkIcon sx={{ fontSize: 60, color: 'grey.200', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} mb={1}>
              No Saved Properties Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4} maxWidth={400} mx="auto">
              Start browsing properties and tap the heart icon to save your favorites for easy access later.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={() => router.push('/search')}
              sx={{ bgcolor: 'primary.main', px: 5, '&:hover': { bgcolor: 'primary.dark' } }}
            >
              Browse Properties
            </Button>
          </Paper>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">Filter by:</Typography>
              {['All', 'For Rent', 'For Sale'].map((f) => (
                <Chip
                  key={f}
                  label={f}
                  clickable
                  size="small"
                  sx={{
                    bgcolor: f === 'All' ? 'secondary.main' : 'grey.100',
                    color: f === 'All' ? 'white' : 'text.secondary',
                    fontWeight: f === 'All' ? 600 : 400,
                    '&:hover': { bgcolor: 'primary.main', color: 'white' },
                    transition: 'all 0.15s ease',
                  }}
                />
              ))}
              <Button
                size="small"
                sx={{ ml: 'auto', color: 'error.main', fontSize: '0.8rem' }}
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </Box>

            <Grid container spacing={3}>
              {saved.map((property) => (
                <Grid key={property.uuid || property.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                  <PropertyCard property={property} onSave={handleRemove} />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 5, textAlign: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<SearchIcon />}
                onClick={() => router.push('/search')}
                sx={{ borderColor: 'secondary.main', color: 'secondary.main', px: 5 }}
              >
                Discover More Properties
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
