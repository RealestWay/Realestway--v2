'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import BedIcon from '@mui/icons-material/Bed';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import StraightenIcon from '@mui/icons-material/Straighten';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import PropertyCard from '../components/property/PropertyCard';

// Lazy load heavy modals
const AgentQuickViewModal = dynamic(() => import('../components/agent/AgentQuickViewModal'), {
  loading: () => <CircularProgress size={24} />,
  ssr: false
});
import { mockProperties, formatPrice, getFeatureValue } from '../data/mockData';
import ApiService from '@/src/services/api';
import toast from 'react-hot-toast';

import { Property, User } from '../types';

export default function PropertyDetailPage({ initialData }: { initialData?: Property }) {
  const params = useParams();
  const router = useRouter();
  
  // Resolve ID/Slug from params (handling both legacy /property/[id] and new /properties/[...slug])
  const propertyIdentifier = useMemo(() => {
    if (params?.id) return params.id as string;
    if (params?.slug && Array.isArray(params.slug)) {
      return params.slug[params.slug.length - 1];
    }
    return null;
  }, [params]);

  const [property, setProperty] = useState<Property | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [imgIdx, setImgIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  
  // Contact Request State
  const [contactRequestOpen, setContactRequestOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const agent = property?.agent_profile || property?.agent;
  const hasConsent = agent?.consent_given !== false;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res: any = await ApiService.auth.me();
        if (res && res.user) setCurrentUser(res.user);
      } catch (e) {}
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyIdentifier) return;
      
      const isSlug = !/^\d+$/.test(propertyIdentifier);
      
      // Only show main spinner if we have absolutely nothing in session storage
      const stored = sessionStorage.getItem('selectedProperty');
      let hasInitial = false;
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const parsedId = String(parsed.slug || parsed.uuid || parsed.id);
          if (parsedId === String(propertyIdentifier)) {
            setProperty(parsed);
            setLoading(false);
            hasInitial = true;
          }
        } catch (e) {}
      }
      
      if (!hasInitial && !initialData) setLoading(true);
      
      try {
        const response: any = isSlug 
          ? await ApiService.properties.getBySlug(propertyIdentifier)
          : await ApiService.properties.getOne(propertyIdentifier);
          
        if (response && response.success) {
          setProperty(response?.data);
          // Update cache for next time
          sessionStorage.setItem('selectedProperty', JSON.stringify(response?.data));
          
          setSaved(response?.data?.is_saved || false);
          setLiked(response?.data?.is_liked || false);
          setLikesCount(response?.data?.likes_count || 0);
        }
      } catch (err) {
        console.error('Failed to fetch property detail:', err);
        // Fallback to mock data if it's a numeric ID
        if (!isSlug) {
          const mock = mockProperties.find((p) => p.id === propertyIdentifier);
          if (mock) setProperty(mock);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyIdentifier, initialData]);

  const handleShare = async () => {
    if (!property) return;
    const shareData = {
      title: property.title,
      text: `Check out this property on Realestway: ${property.title}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.error('Error sharing', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Could not copy text', err);
      }
    }
  };

  const handleSave = async () => {
    if (!property) return;
    
    const prevSaved = saved;
    setSaved(!prevSaved);

    try {
      if (prevSaved) {
        await ApiService.properties.unsave(property.uuid || property.id);
      } else {
        await ApiService.properties.save(property.uuid || property.id);
      }
    } catch (err) {
      setSaved(prevSaved);
      console.error('Failed to save:', err);
      if ((err as any).status === 401) router.push('/auth/login');
      else toast.error('Network Error - Failed to update saved status');
    }
  };

  const handleLike = async () => {
    if (!property) return;
    
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      if (prevLiked) {
        const res: any = await ApiService.properties.unlike(property.uuid || property.id);
        if (res && res.likes_count !== undefined) setLikesCount(res.likes_count);
      } else {
        const res: any = await ApiService.properties.like(property.uuid || property.id);
        if (res && res.likes_count !== undefined) setLikesCount(res.likes_count);
      }
    } catch (err) {
      setLiked(prevLiked);
      setLikesCount(prevCount);
      console.error('Failed to like:', err);
      if ((err as any).status === 401) router.push('/auth/login');
      else console.error('Failed to like:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={50} thickness={4} />
        <Typography variant="body2" color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  if (!property) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} mb={2}>Property Not Found</Typography>
        <Button variant="contained" onClick={() => router.push('/search')}>Browse Properties</Button>
      </Container>
    );
  }

  const bedrooms = getFeatureValue(property.features, 'bedrooms') || property.bedrooms;
  const bathrooms = getFeatureValue(property.features, 'bathrooms') || property.bathrooms;
  const parking = getFeatureValue(property.features, 'parking');

  const price = property.total_package || property.basic_rent || property.price || 0;
  const images = (property.media?.map((m: any) => m.file_url) || property.media_urls || property.images || []).map((url: string) => ApiService.getMediaUrl(url));
  
  const agencyFee = typeof (property.agency_fee || property.agencyFee) === 'number' && (property.agency_fee || property.agencyFee) <= 100 
    ? (price * (property.agency_fee || property.agencyFee)) / 100 
    : (property.agency_fee || property.agencyFee || 0);
    
  const cautionFee = property.caution_fee || property.cautionFee || 0;
  
  const legalFee = typeof (property.legal_fee || property.legalFee) === 'number' && (property.legal_fee || property.legalFee) <= 100
    ? (price * (property.legal_fee || property.legalFee)) / 100
    : (property.legal_fee || property.legalFee || 0);
    
  const inspectionFee = property.inspection_fee || property.inspectionFee || 0;
  
  const otherFeesList = Array.isArray(property.other_fees || property.otherFees) 
    ? (property.other_fees || property.otherFees).map((f: { name?: string; tag?: string; amount?: number; value?: number }) => ({
        tag: f.tag || f.name || 'Fee',
        value: f.amount || f.value || 0
      }))
    : [];

  const totalFees = agencyFee + cautionFee + legalFee + inspectionFee + otherFeesList.reduce((sum: number, f: { value: number }) => sum + f.value, 0);

  const isVideo = (url: string) => url?.toLowerCase().match(/\.(mp4|webm|ogg)$/) || url?.includes('uploads') && url?.split('.').pop()?.match(/(mp4|webm|ogg)$/i);

  const handleAgentClick = () => {
    const metadata = agent?.business_metadata || {};
    const hasDetailedInfo = !!(metadata.description || metadata.address || (metadata.categories && metadata.categories.length > 1));

    if (hasDetailedInfo && (agent?.username || agent?.id)) {
      router.push(`/agent/${agent?.username || agent?.id}`);
    } else {
      setAgentModalOpen(true);
    }
  };

  const similar = mockProperties.filter((p) => p.id !== propertyIdentifier && p.city === property.city).slice(0, 3);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', py: 1.5 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Breadcrumbs>
              <Link
                component="button"
                onClick={() => router.push('/')}
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: '0.85rem' }}
              >
                <HomeIcon sx={{ fontSize: 14 }} /> Home
              </Link>
              <Link
                component="button"
                onClick={() => router.push('/search')}
                underline="hover"
                sx={{ color: 'text.secondary', fontSize: '0.85rem' }}
              >
                Properties
              </Link>
              <Typography variant="caption" color="text.primary" noWrap sx={{ maxWidth: 200 }}>
                {property.title}
              </Typography>
            </Breadcrumbs>
            <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} size="small" sx={{ color: 'text.secondary' }}>
              Back
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
              {isVideo(images[imgIdx]) ? (
                <Box
                  component="video"
                  src={images[imgIdx]}
                  controls
                  autoPlay
                  muted
                  loop
                  sx={{
                    width: '100%',
                    height: { xs: 280, md: 460 },
                    objectFit: 'cover',
                    display: 'block',
                    bgcolor: 'black'
                  }}
                />
              ) : (
                <Box sx={{ position: 'relative', width: '100%', height: { xs: 280, md: 460 }, cursor: 'zoom-in' }} onClick={() => setLightboxOpen(true)}>
                  <Image
                    src={images[imgIdx] || '/placeholder.jpg'}
                    alt={property.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 66vw"
                    style={{ objectFit: 'cover' }}
                    unoptimized={images[imgIdx]?.includes('blob:') || images[imgIdx]?.includes('data:')}
                  />
                </Box>
              )}
              <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
                <Chip
                  label={property.category === 'rent' ? 'For Rent' : 'For Sale'}
                  sx={{
                    bgcolor: property.category === 'rent' ? 'secondary.main' : 'primary.main',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                  }}
                />
                {property.source === 'platform' && (
                  <Chip
                    label="Platform Listing"
                    sx={{ bgcolor: 'rgba(0,0,0,0.6)', color: 'white', fontWeight: 600, fontSize: '0.8rem' }}
                  />
                )}
              </Box>
              {property.images?.length > 1 && (
                <>
                  <IconButton
                    onClick={() => setImgIdx(Math.max(0, imgIdx - 1))}
                    disabled={imgIdx === 0}
                    sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' }, zIndex: 1 }}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setImgIdx(Math.min(images.length - 1, imgIdx + 1))}
                    disabled={imgIdx === images.length - 1}
                    sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' }, zIndex: 1 }}
                  >
                    <NavigateNextIcon />
                  </IconButton>
                  <Box sx={{ position: 'absolute', bottom: 12, right: 12, bgcolor: 'rgba(0,0,0,0.55)', color: 'white', borderRadius: 10, px: 1.5, py: 0.5, zIndex: 1 }}>
                    <Typography variant="caption" fontWeight={600}>{imgIdx + 1} / {images.length}</Typography>
                  </Box>
                </>
              )}
            </Box>

            {images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1.5, mb: 3, overflowX: 'auto', pb: 1 }}>
                {images.map((img: string, i: number) => (
                  <Box
                    key={i}
                    onClick={() => setImgIdx(i)}
                    sx={{
                      minWidth: 100,
                      height: 68,
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '2.5px solid',
                      borderColor: i === imgIdx ? 'primary.main' : 'transparent',
                      opacity: i === imgIdx ? 1 : 0.65,
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                      position: 'relative',
                      bgcolor: 'black'
                    }}
                  >
                    {isVideo(img) ? (
                      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="caption" color="white" sx={{ fontSize: 10, fontWeight: 700 }}>VIDEO</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Image 
                          src={img} 
                          alt={`${property.title} - ${i}`}
                          fill
                          sizes="100px"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight={800} mb={0.75}>
                    {property.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {property.address || 'N/A'}, {property.city || 'N/A'}, {property.state || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, ml: 2, flexShrink: 0 }}>
                  <Tooltip title={liked ? 'Unlike' : 'Like'}>
                    <IconButton 
                      onClick={handleLike} 

                      sx={{ 
                        border: '1px solid', 
                        borderColor: liked ? 'primary.main' : 'divider',
                        color: liked ? 'primary.main' : 'inherit'
                      }}
                    >
                      {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={saved ? 'Remove from saved' : 'Save property'}>
                    <IconButton 
                      onClick={handleSave} 

                      sx={{ 
                        border: '1px solid', 
                        borderColor: saved ? 'secondary.main' : 'divider',
                        color: saved ? 'secondary.main' : 'inherit'
                      }}
                    >
                      {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton onClick={handleShare} sx={{ border: '1px solid', borderColor: 'divider' }}>
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BedIcon sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {bedrooms !== null ? String(bedrooms) : (property.bedrooms !== undefined ? String(property.bedrooms) : 'N/A')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Bedrooms</Typography>
                  </Box>
                </Box>
                {likesCount > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FavoriteIcon sx={{ color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>{likesCount}</Typography>
                      <Typography variant="caption" color="text.secondary">Likes</Typography>
                    </Box>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BathtubOutlinedIcon sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>{bathrooms !== null ? String(bathrooms) : 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary">Bathrooms</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsCarOutlinedIcon sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>{parking !== null ? String(parking) : 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary">Parking</Typography>
                  </Box>
                </Box>
                {property.land_size && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StraightenIcon sx={{ color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>{property.land_size}</Typography>
                      <Typography variant="caption" color="text.secondary">Land Size</Typography>
                    </Box>
                  </Box>
                )}
                <Chip label={property.type} variant="outlined" size="small" sx={{ alignSelf: 'center' }} />
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <Typography variant="subtitle1" fontWeight={700} mb={1.5}>Description</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                {property.description}
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>Features & Amenities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {Array.isArray(property.features) ? property.features.map((feat: any, idx: number) => {
                  const tag = typeof feat === 'string' ? feat : (feat.tag || feat.name || 'Feature');
                  const val = typeof feat === 'string' ? true : (feat.value !== undefined ? feat.value : true);
                  return (
                    <Chip
                      key={idx}
                      icon={<CheckCircleOutlineIcon sx={{ fontSize: '16px !important', color: 'primary.main !important' }} />}
                      label={val === true ? tag : `${tag}: ${val}`}
                      variant="outlined"
                      sx={{ borderColor: 'divider', fontWeight: 500, height: 34 }}
                    />
                  );
                }) : (
                  <Typography variant="body2" color="text.secondary">No features listed</Typography>
                )}
              </Box>
            </Paper>

          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{ p: { xs: 2.5, md: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 3, position: 'sticky', top: 90 }}
            >
              <Typography variant="overline" color="primary" sx={{ display: 'block', mb: 0.5 }}>
                {property.property_category === 'shortlet' ? 'Shortlet Price' : (property.property_category === 'rent' || property.category === 'rent') ? 'Annual Rent' : 'Sale Price'}
              </Typography>
              <Typography variant="h4" fontWeight={900} color="secondary.main" sx={{ fontFamily: '"Arial Black", sans-serif', mb: 0.5 }}>
                {formatPrice(price)}
                {property.property_category !== 'sale' && property.rental_duration && property.rental_duration.trim() !== '' && (
                  <Typography component="span" sx={{ fontSize: '0.5em', fontWeight: 600, color: 'text.secondary', ml: 0.5 }}>
                    / {property.rental_duration.replace('per ', '')}
                  </Typography>
                )}
              </Typography>
              {property.property_category?.toLowerCase() === 'rent' || property.category === 'rent' && (
                <Typography variant="caption" color="text.secondary">+ fees</Typography>
              )}

              <Divider sx={{ my: 2.5 }} />

              <Typography variant="subtitle2" fontWeight={700} mb={1.5}>Fee Breakdown</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Rent / Price</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatPrice(price)}
                    {property.property_category !== 'sale' && property.rental_duration && property.rental_duration.trim() !== '' && (
                      <span style={{ fontSize: '0.85em', color: 'gray', marginLeft: 4 }}>
                        / {property.rental_duration.replace('per ', '')}
                      </span>
                    )}
                  </Typography>
                </Box>
                {agencyFee > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Agency Fee</Typography>
                    <Typography variant="body2" fontWeight={600}>{formatPrice(agencyFee)}</Typography>
                  </Box>
                )}
                {cautionFee > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Caution Fee</Typography>
                    <Typography variant="body2" fontWeight={600}>{formatPrice(cautionFee)}</Typography>
                  </Box>
                )}
                {legalFee > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Legal Fee</Typography>
                    <Typography variant="body2" fontWeight={600}>{formatPrice(legalFee)}</Typography>
                  </Box>
                )}
                {inspectionFee > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Inspection Fee</Typography>
                    <Typography variant="body2" fontWeight={600}>{formatPrice(inspectionFee)}</Typography>
                  </Box>
                )}
                {otherFeesList.map((fee: any) => (
                  <Box key={fee.tag} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">{fee.tag}</Typography>
                    <Typography variant="body2" fontWeight={600}>{formatPrice(fee.value)}</Typography>
                  </Box>
                ))}
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" fontWeight={700}>Total (Move-in)</Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="secondary.main">
                    {formatPrice(price + totalFees)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <Box 
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                onClick={handleAgentClick}
              >
                <Avatar sx={{ width: 44, height: 44, bgcolor: 'secondary.main', fontWeight: 700 }}>
                  {agent?.name?.charAt(0) || '?'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Typography variant="subtitle2" fontWeight={700}>{agent?.name || 'Unknown Agent'}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Agent · {agent?.listingCount || 0} listings
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 1.5 }}>
                {hasConsent && !(agent?.phone_number || agent?.phone)?.includes('*') ? (
                  <>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<PhoneIcon />}
                      href={`tel:${agent?.phone_number || agent?.phone}`}
                      sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, py: 1.5 }}
                    >
                      {agent?.phone_number || agent?.phone || 'Call Agent'}
                    </Button>
                    {(agent?.whatsapp || agent?.phone_number || agent?.phone) && (
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<WhatsAppIcon />}
                        href={`https://wa.me/${(agent.whatsapp || agent.phone_number || agent.phone).replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hello, I'm interested in this property: ${property.title}. View details here: ${typeof window !== 'undefined' ? window.location.href : ''}`
                        )}`}
                        target="_blank"
                        sx={{ borderColor: '#25D366', color: '#25D366', '&:hover': { bgcolor: '#25D366', color: 'white', borderColor: '#25D366' }, py: 1.5 }}
                      >
                        WhatsApp
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #e2e8f0', mb: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                        <InfoOutlinedIcon sx={{ fontSize: 16 }} /> Contact Masked
                      </Typography>
                      <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: 1 }}>
                        {agent?.phone_number || agent?.phone || '080******94'}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={requestSubmitted}
                      onClick={() => {
                        if (!currentUser) {
                          toast.error('Please sign in to submit a request');
                          router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
                          return;
                        }
                        setContactRequestOpen(true);
                      }}
                      sx={{ py: 1.5, bgcolor: requestSubmitted ? 'success.main' : 'secondary.main', '&:hover': { bgcolor: requestSubmitted ? 'success.dark' : 'secondary.dark' } }}
                    >
                      {requestSubmitted ? 'Request Submitted ✓' : 'Submit Request to View'}
                    </Button>
                    <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 0.5, px: 1 }}>
                      Agent contact is concealed for privacy. Click "Submit Request" to reach them via our team.
                    </Typography>
                  </>
                )}
              </Box>

              <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mt: 1.5, fontSize: '0.78rem' }}>
                Always verify agent credentials before making any payments.
              </Alert>
            </Paper>
          </Grid>
        </Grid>

        {similar.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" fontWeight={800} mb={4}>Similar Properties in {property.city}</Typography>
            <Grid container spacing={3}>
              {similar.map((p) => (
                <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <PropertyCard property={p} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} maxWidth="lg" fullWidth>
        <DialogContent sx={{ p: 0, position: 'relative', bgcolor: 'black' }}>
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.15)', color: 'white', zIndex: 1 }}
          >
            <LocationOnIcon />
          </IconButton>
          {isVideo(images[imgIdx]) ? (
            <Box
              component="video"
              src={images[imgIdx]}
              controls
              autoPlay
              sx={{ width: '100%', maxHeight: '85vh', bgcolor: 'black' }}
            />
          ) : (
            <Box sx={{ position: 'relative', width: '100%', height: '85vh', bgcolor: 'black' }}>
              <Image
                src={images?.[imgIdx] || '/placeholder.jpg'}
                alt={property.title}
                fill
                style={{ objectFit: 'contain' }}
                unoptimized={images?.[imgIdx]?.includes('blob:') || images?.[imgIdx]?.includes('data:')}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <AgentQuickViewModal
        open={agentModalOpen}
        onClose={() => setAgentModalOpen(false)}
        agent={agent}
      />

      {/* Contact Request Dialog */}
      <Dialog 
        open={contactRequestOpen} 
        onClose={() => !submittingRequest && setContactRequestOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={800} mb={1}>Reach Agent</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Our team will review your request and get back to you shortly with the agent's contact or help you schedule a viewing.
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Optional message (e.g. When can I view this property?)"
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            disabled={submittingRequest}
            sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => setContactRequestOpen(false)}
              disabled={submittingRequest}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={async () => {
                setSubmittingRequest(true);
                try {
                  await ApiService.properties.requestAgentContact(property.uuid || property.id, { message: requestMessage });
                  toast.success('Request submitted! We\'ll get back shortly');
                  setRequestSubmitted(true);
                  setContactRequestOpen(false);
                } catch (err: any) {
                  toast.error(err.data?.message || 'Failed to submit request');
                } finally {
                  setSubmittingRequest(false);
                }
              }}
              disabled={submittingRequest}
              sx={{ borderRadius: 2 }}
            >
              {submittingRequest ? <CircularProgress size={24} color="inherit" /> : 'Send Request'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
