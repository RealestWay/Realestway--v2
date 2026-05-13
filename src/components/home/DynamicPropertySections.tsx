'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PropertyCard from '../property/PropertyCard';
import PropertySkeleton from '../property/PropertySkeleton';

interface DynamicPropertySectionsProps {
  loading: boolean;
  homeData: any;
  shuffledSections: string[];
  quickFilters: string[];
  globalCategory: 'rent' | 'sale';
  filterProperties: (list: any[]) => any[];
  searching: boolean;
  totalResults: number;
  searchResults: any[];
}

export default function DynamicPropertySections({
  loading,
  homeData,
  shuffledSections,
  quickFilters,
  globalCategory,
  filterProperties,
  searching,
  totalResults,
  searchResults,
}: DynamicPropertySectionsProps) {
  const router = useRouter();

  /* ── Loading skeletons ── */
  if (loading) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <Box key={`skeleton-sec-${i}`} sx={{ bgcolor: i % 2 === 0 ? 'white' : 'background.default', py: { xs: 6, md: 8 } }}>
            <Container maxWidth="xl">
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ width: '100%', maxWidth: 300 }}>
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="90%" height={40} />
                </Box>
              </Box>
              <Grid container spacing={3}>
                {[1, 2, 3, 4].map((j) => (
                  <Grid key={`skeleton-card-${i}-${j}`} size={{ xs: 12, sm: 6, md: 3 }}>
                    <PropertySkeleton />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        ))}
      </>
    );
  }

  return (
    <>
      {/* ════ SEARCH RESULTS (when quick-filters active) ════ */}
      {quickFilters.length > 0 && (
        <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 8 }, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="overline" color="primary" sx={{ mb: 0.5, display: 'block', fontWeight: 700 }}>
                  Filter Results
                </Typography>
                <Typography variant="h4" fontWeight={800}>
                  {searching ? 'Searching...' : `Found ${totalResults} ${globalCategory === 'rent' ? 'Properties for Rent' : 'Properties for Sale'}`}
                </Typography>
              </Box>
              {totalResults > 0 && (
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => {
                    const q = new URLSearchParams();
                    q.append('category', globalCategory);
                    if (quickFilters.length > 0) q.append('q', quickFilters.join(' '));
                    router.push(`/search?${q.toString()}`);
                  }}
                >
                  Advanced Search
                </Button>
              )}
            </Box>

            {searching ? (
              <Grid container spacing={3}>
                {[1, 2, 3, 4].map((i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}><PropertySkeleton /></Grid>
                ))}
              </Grid>
            ) : totalResults > 0 ? (
              <Grid container spacing={3}>
                {searchResults.map((property: any) => (
                  <Grid key={property.id} size={{ xs: 12, sm: 6, md: 3 }}>
                    <PropertyCard property={property} compact />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper elevation={0} sx={{
                p: { xs: 4, md: 8 }, textAlign: 'center',
                bgcolor: 'rgba(0,162,86,0.03)', borderRadius: 4,
                border: '2px dashed', borderColor: 'rgba(0,162,86,0.2)',
              }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  No matches found in this section
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                  We couldn&apos;t find any {quickFilters.join(' + ')} {globalCategory} listings matching exactly what you&apos;re looking for here.
                </Typography>
                <Button
                  variant="contained" size="large"
                  onClick={() => {
                    const q = new URLSearchParams();
                    q.append('category', globalCategory);
                    q.append('q', quickFilters.join(' '));
                    router.push(`/search?${q.toString()}`);
                  }}
                  sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 700, boxShadow: '0 8px 24px rgba(0,162,86,0.25)' }}
                >
                  Search Everywhere on Realestway
                </Button>
              </Paper>
            )}
          </Container>
        </Box>
      )}

      {/* ════ NEARBY PROPERTIES ════ */}
      {(() => {
        const nearby = filterProperties(homeData.sections?.nearby || []);
        if (nearby.length < 1) return null;
        return (
          <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 8 } }}>
            <Container maxWidth="xl">
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="overline" color="primary" sx={{ mb: 0.5, display: 'block' }}>Local Listings</Typography>
                  <Typography variant="h4" fontWeight={800}>Properties Near You</Typography>
                </Box>
                <Button endIcon={<ArrowForwardIcon />} onClick={() => router.push('/search')} sx={{ color: 'primary.main', fontWeight: 600 }}>
                  View All
                </Button>
              </Box>
              <Grid container spacing={3}>
                {nearby.slice(0, 4).map((p: any) => (
                  <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
                    <PropertyCard property={p} compact />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        );
      })()}

      {/* ════ HOT DEALS ════ */}
      {(() => {
        const deals = filterProperties(homeData.sections?.hot_deals || []);
        if (deals.length < 1) return null;
        return (
          <Box sx={{ bgcolor: '#fff9e6', py: { xs: 6, md: 8 } }}>
            <Container maxWidth="xl">
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="overline" sx={{ color: '#d97706', mb: 0.5, display: 'block' }}>Exclusive Offers</Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#d97706' }}>Hot Deals 🔥</Typography>
                </Box>
                <Button endIcon={<ArrowForwardIcon />} onClick={() => router.push('/search?category=sale')} sx={{ color: '#d97706', fontWeight: 600 }}>
                  View All
                </Button>
              </Box>
              <Grid container spacing={3}>
                {deals.slice(0, 4).map((p: any) => (
                  <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
                    <PropertyCard property={p} compact />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        );
      })()}

      {/* ════ SHUFFLED SECTIONS (recent, featured, popular, recommended, luxury, affordable) ════ */}
      {shuffledSections.map((sectionId, index) => {
        let sectionData: any[] = [];
        let sectionTitle = '';
        let sectionSubtitle = '';
        const bgColor = index % 2 === 0 ? 'white' : 'background.default';
        const viewAllPath = '/search';

        const isCalculated = ['recommended', 'luxury', 'affordable'].includes(sectionId);
        const fixedSection = homeData.sections?.[sectionId];
        
        if (fixedSection || isCalculated) {
          sectionData = fixedSection || [];
          switch (sectionId) {
            case 'recent':
              sectionTitle = 'Recently Added Properties';
              sectionSubtitle = 'Latest Listings';
              break;
            case 'featured':
              sectionTitle = 'Featured Properties';
              sectionSubtitle = 'Handpicked for you';
              break;
            case 'popular':
              sectionTitle = 'Trending Now';
              sectionSubtitle = 'Most viewed properties';
              break;
            case 'recommended':
              sectionData = [...(homeData.sections?.featured || []), ...(homeData.sections?.popular || [])].slice(0, 8);
              sectionTitle = 'Recommended For You';
              sectionSubtitle = 'Tailored to your preference';
              break;
            case 'luxury':
              sectionData = [...(homeData.sections?.recent || []), ...(homeData.sections?.featured || [])]
                .filter((p: any) => (p.price || p.total_package) > 10000000)
                .slice(0, 8);
              sectionTitle = 'Luxury Homes';
              sectionSubtitle = 'Premium living spaces';
              break;
            case 'affordable':
              sectionData = [...(homeData.sections?.recent || []), ...(homeData.sections?.featured || [])]
                .filter((p: any) => (p.price || p.total_package) > 0 && (p.price || p.total_package) < 2000000)
                .slice(0, 8);
              sectionTitle = 'Affordable Homes';
              sectionSubtitle = 'Budget friendly options';
              break;
            default:
              return null;
          }
        } else {
          return null;
        }

        const filtered = filterProperties(sectionData);
        if (filtered.length < 4) return null;

        return (
          <Box key={sectionId} sx={{ bgcolor: bgColor, py: { xs: 6, md: 8 } }}>
            <Container maxWidth="xl">
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  {sectionSubtitle && (
                    <Typography variant="overline" color="primary" sx={{ mb: 0.5, display: 'block' }}>
                      {sectionSubtitle}
                    </Typography>
                  )}
                  <Typography variant="h4" fontWeight={800}>{sectionTitle}</Typography>
                </Box>
                <Button endIcon={<ArrowForwardIcon />} onClick={() => router.push(viewAllPath)} sx={{ color: 'primary.main', fontWeight: 600 }}>
                  View All
                </Button>
              </Box>
              <Grid container spacing={3}>
                {filtered.slice(0, 4).map((p: any) => (
                  <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
                    <PropertyCard property={p} compact />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        );
      })}
    </>
  );
}
