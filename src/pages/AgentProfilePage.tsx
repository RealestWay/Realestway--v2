'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import VerifiedIcon from '@mui/icons-material/Verified';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import ApiService from '@/src/services/api';
import PropertyCard from '@/src/components/property/PropertyCard';
import { Agent, Property } from '@/src/types';

export default function AgentProfilePage() {
  const params = useParams();
  const identifier = params?.id as string; // Could be username or ID
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProps, setLoadingProps] = useState(false);
  const [meta, setMeta] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!identifier) return;
      try {
        setLoading(true);
        const res: any = await ApiService.agent.getProfile(identifier);

        if (res.success) {
          setProfile(res.data);
          setProperties(res.data.properties || []);
          // Note: If bundled properties aren't paginated, meta will be null
          setMeta(res.meta || null); 
          console.log('Loaded Agent Profile Details:', res.data);
        } else {
          setError(res.message || 'Profile not found');
        }
      } catch (err) {
        console.error('Failed to fetch agent data', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [identifier]);

  const handleLoadMore = async () => {
    if (!meta || meta.current_page >= meta.last_page) return;
    
    try {
      setLoadingProps(true);
      const nextPage = meta.current_page + 1;
      const res: any = await ApiService.agent.getPublicProperties(identifier, `page=${nextPage}&limit=12`);
      if (res.success) {
        setProperties(prev => [...prev, ...res.data]);
        setMeta(res.meta);
      }
    } catch (err) {
      console.error('Failed to load more properties', err);
    } finally {
      setLoadingProps(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${profile.business_name || profile.name} on Realestway`,
      text: `Check out ${profile.business_name || profile.name}'s property listings.`,
      url: window.location.href,
    };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => {});
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 15, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={700} color="text.secondary">Loading Profile...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="error" fontWeight={800} gutterBottom>{error || 'Profile Not Found'}</Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>The agency you are looking for might have moved or been renamed.</Typography>
        <Button variant="contained" size="large" onClick={() => router.push('/')} sx={{ borderRadius: 2 }}>Return Home</Button>
      </Container>
    );
  }

  const metadata = profile.business_metadata || {};
  const businessName = profile.business_name || profile.name;
  const categories = metadata.categories || [];
  const listings: Property[] = profile.properties || [];
  const isVerified = !!(profile.claimed_at && profile.user?.kyc_status === 'verified');
  const isPhoneVerified = !!profile.user?.phone_verified;

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pb: 10 }}>
      {/* Premium Hero Banner */}
      <Box sx={{ 
        height: { xs: 200, md: 300 }, 
        bgcolor: 'secondary.main', 
        position: 'relative', 
        overflow: 'hidden',
        backgroundImage: profile.banner ? `url(${ApiService.getMediaUrl(profile.banner)})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {!profile.banner && <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />}
        <Container maxWidth="lg" sx={{ height: '100%', position: 'relative' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ position: 'absolute', top: 24, left: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' }, borderRadius: 2 }}
          >
            Back
          </Button>
          <Button
            startIcon={<ShareIcon />}
            onClick={handleShare}
            sx={{ position: 'absolute', top: 24, right: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' }, borderRadius: 2 }}
          >
            Share
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: -10, md: -12 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Left Column: Profile Card & Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Avatar
                src={ApiService.getMediaUrl(profile.avatar || profile.user?.profile_picture)}
                sx={{
                  width: { xs: 120, md: 160 },
                  height: { xs: 120, md: 160 },
                  mx: 'auto',
                  border: '8px solid white',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                  bgcolor: 'primary.main',
                  fontSize: '4rem',
                  fontWeight: 900
                }}
              >
                {profile.name?.charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ mt: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
                    {businessName}
                  </Typography>
                  {isVerified && (
                    <VerifiedIcon color="primary" sx={{ fontSize: 28 }} />
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary' }}>
                  <StarIcon sx={{ fontSize: 18, color: '#FFB400' }} />
                  <Typography variant="body2" fontWeight={700}>4.8</Typography>
                  <Typography variant="body2" color="text.secondary">(24 Reviews)</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4, flexWrap: 'wrap' }}>
                {categories.map((cat: any, i: number) => (
                  <Chip
                    key={cat.id || i}
                    label={cat.localized_display_name || cat}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 700, borderRadius: 1.5, px: 1 }}
                  />
                ))}
              </Box>

              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight={900}>{properties.length}</Typography>
                    <Typography variant="caption" color="text.secondary">Listings</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight={900}>1.2k</Typography>
                    <Typography variant="caption" color="text.secondary">Views</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {profile.consent_given !== false && !profile.phone_number?.includes('*') ? (
                  <>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<WhatsAppIcon />}
                      href={`https://wa.me/${profile.phone_number.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${businessName}, I saw your profile on Realestway and I'm interested in your properties.`)}`}
                      target="_blank"
                      sx={{ py: 1.8, fontWeight: 800, borderRadius: 3, bgcolor: '#25D366', '&:hover': { bgcolor: '#128C7E' }, fontSize: '1rem' }}
                    >
                      Message on WhatsApp
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<PhoneIcon />}
                      href={`tel:${profile.phone_number}`}
                      sx={{ py: 1.8, fontWeight: 800, borderRadius: 3, border: '2px solid', '&:hover': { border: '2px solid' }, fontSize: '1rem' }}
                    >
                      Call Now
                    </Button>
                  </>
                ) : (
                  <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 3, border: '1px dashed', borderColor: 'divider', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Contact Information Masked
                    </Typography>
                    <Typography variant="h6" fontWeight={800} mb={2}>
                      {profile.phone_number || '080******94'}
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => toast.error('Please visit a property page to submit a contact request for this agent.')}
                      sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
                    >
                      Request Contact
                    </Button>
                  </Box>
                )}
                
                {isPhoneVerified && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1, color: 'success.main' }}>
                    <CheckCircleIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" fontWeight={700}>Phone Number Verified</Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={800} mb={3}>Quick Info</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <LocationOnIcon sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Address</Typography>
                    <Typography variant="body2" fontWeight={600}>{metadata.address || 'Location not specified'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <PhoneIcon sx={{ color: 'primary.main' }} />
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary" display="block">Phone</Typography>
                      {isPhoneVerified && <Chip label="Verified" size="small" color="success" sx={{ height: 16, fontSize: '0.65rem', fontWeight: 800, borderRadius: 1 }} />}
                    </Box>
                    <Typography variant="body2" fontWeight={600}>{profile.phone_number}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <EmailIcon sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Email</Typography>
                    <Typography variant="body2" fontWeight={600}>{profile.email || 'No public email'}</Typography>
                  </Box>
                </Box>
                {metadata.website?.[0] && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <LanguageIcon sx={{ color: 'primary.main' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Website</Typography>
                      <Typography 
                        variant="body2" 
                        component="a" 
                        href={metadata.website[0]?.url || metadata.website[0]} 
                        target="_blank" 
                        color="primary.main" 
                        sx={{ textDecoration: 'none', fontWeight: 700 }}
                      >
                        {(metadata.website[0]?.url || metadata.website[0]).replace(/^https?:\/\//, '')}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Right Column: Listings & Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ mb: 6 }}>
              <Box sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                p: 2, 
                px: 3, 
                borderRadius: '16px 16px 0 0',
                display: 'inline-block'
              }}>
                <Typography variant="subtitle1" fontWeight={800}>About the Agency</Typography>
              </Box>
              <Paper elevation={0} sx={{ 
                p: 4, 
                borderRadius: '0 16px 16px 16px', 
                border: '1px solid', 
                borderColor: 'divider', 
                bgcolor: 'white',
                mt: -0.5,
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, fontSize: '1rem' }}>
                  {showFullDescription 
                    ? (metadata.description || `${businessName} is a professional real estate agency providing top-tier property services. Our focus is on transparency, reliability, and helping our clients find their perfect home or investment property.`)
                    : (metadata.description || `${businessName} is a professional real estate agency providing top-tier property services...`).slice(0, 350).concat((metadata.description?.length || 0) > 350 ? '...' : '')
                  }
                </Typography>
                {((metadata.description?.length || 0) > 350) && (
                  <Button 
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    sx={{ mt: 2, fontWeight: 700, textTransform: 'none', p: 0 }}
                  >
                    {showFullDescription ? 'Read Less' : 'Read More'}
                  </Button>
                )}
              </Paper>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box>
                  <Typography variant="h5" fontWeight={900}>Property Portfolio</Typography>
                  <Typography variant="body2" color="text.secondary">Exclusively managed by {businessName}</Typography>
                </Box>
                <Chip label={`${meta?.total || 0} Active Listings`} color="secondary" sx={{ fontWeight: 800, borderRadius: 2 }} />
              </Box>

              {properties.length > 0 ? (
                <>
                  <Grid container spacing={3}>
                    {properties.map((item) => (
                      <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
                        <PropertyCard property={item} />
                      </Grid>
                    ))}
                  </Grid>
                  
                  {meta && meta.current_page < meta.last_page && (
                    <Box sx={{ mt: 6, textAlign: 'center' }}>
                      <Button 
                        variant="outlined" 
                        size="large" 
                        onClick={handleLoadMore}
                        disabled={loadingProps}
                        sx={{ px: 6, borderRadius: 3, fontWeight: 700, borderColor: 'divider', color: 'text.primary', minWidth: 200 }}
                      >
                        {loadingProps ? <CircularProgress size={24} /> : 'View More Listings'}
                      </Button>
                    </Box>
                  )}
                </>
              ) : (
                <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4, border: '2px dashed', borderColor: 'divider', bgcolor: 'transparent' }}>
                  <Typography variant="h6" color="text.secondary" mb={1}>No properties listed yet</Typography>
                  <Typography variant="body2" color="text.secondary">Check back later or contact the agency for offline deals.</Typography>
                </Paper>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
