import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BedIcon from '@mui/icons-material/Bed';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import StraightenIcon from '@mui/icons-material/Straighten';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import type { Property } from '../../types';
import { formatPrice, getFeatureValue } from '../../data/mockData';
import AgentQuickViewModal from '../agent/AgentQuickViewModal';
import ApiService from '@/src/services/api';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

interface PropertyCardProps {
  property: Property;
  onSave?: (id: string) => void;
  compact?: boolean;
}

export default function PropertyCard({ property, onSave, compact = false }: PropertyCardProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(property.is_saved || property.saved || false);
  const [liked, setLiked] = useState(property.is_liked || false);
  const [likesCount, setLikesCount] = useState(property.likes_count || 0);
  const [imgIdx, setImgIdx] = useState(0);
  const [agentModalOpen, setAgentModalOpen] = useState(false);


  const agent = property.agent_profile || property.agent;

  const bedrooms = getFeatureValue(property.features, 'bedrooms');
  const bathrooms = getFeatureValue(property.features, 'bathrooms') || property.bathrooms;
  const parking = getFeatureValue(property.features, 'parking');

  const images = (property.media_urls || property.images || []).map((url: string) => ApiService.getMediaUrl(url));
  const displayPrice = property.basic_rent || property.price || 0;
  const isVideo = useMemo(() => {
    return (url: string) => url?.toLowerCase().match(/\.(mp4|webm|ogg)$/) || url?.includes('uploads') && url?.split('.').pop()?.match(/(mp4|webm|ogg)$/i);
  }, []);

  const handleAgentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const metadata = agent?.business_metadata || {};
    const hasDetailedInfo = !!(metadata.description || metadata.address || (metadata.categories && metadata.categories.length > 1));

    if (hasDetailedInfo && (agent?.username || agent?.id)) {
      router.push(`/agent/${agent?.username || agent?.id}`);
    } else {
      setAgentModalOpen(true);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const prevSaved = saved;
    setSaved(!prevSaved);

    try {
      if (prevSaved) {
        await ApiService.properties.unsave(property.uuid || property.id);
        onSave?.(property.id);
      } else {
        await ApiService.properties.save(property.uuid || property.id);
      }
    } catch (err) {
      setSaved(prevSaved);
      console.error('Failed to save property:', err);
      // If unauthorized, redirect to login
      if ((err as any).status === 401) router.push('/auth/login');
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
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
      console.error('Failed to like property:', err);
      if ((err as any).status === 401) router.push('/auth/login');
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s ease',
      }}
    >
      <Box sx={{ position: 'relative', pb: compact ? '52%' : '64%', overflow: 'hidden', bgcolor: 'grey.100' }}>
        {isVideo(images[imgIdx]) ? (
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Box
              component="video"
              src={images[imgIdx]}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
              muted
              autoPlay
              loop
            />
            <PlayCircleOutlineIcon sx={{ position: 'absolute', fontSize: 40, color: 'white', opacity: 0.8 }} />
          </Box>
        ) : (
          <Image
            src={images.length > 0 ? images[imgIdx] : '/placeholder.jpg'}
            alt={property.title}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onLoad={(e) => {
              // Custom logic if needed
            }}
          />
        )}
        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
          <Chip
            label={property.property_category === 'rent' ? 'For Rent' : 'For Sale'}
            size="small"
            sx={{
              bgcolor: property.category === 'rent' ? 'secondary.main' : 'primary.main',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.72rem',
              height: 24,
            }}
          />

        </Box>
        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Tooltip title={liked ? 'Unlike' : 'Like'}>
            <IconButton
              onClick={handleLike}
              size="small"

              sx={{
                bgcolor: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(4px)',
                '&:hover': { bgcolor: 'white', transform: 'scale(1.1)' },
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                color: liked ? 'primary.main' : 'text.secondary'
              }}
            >
              {liked ? (
                <FavoriteIcon sx={{ fontSize: 18 }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>
          
          <Tooltip title={saved ? 'Remove from saved' : 'Save property'}>
            <IconButton
              onClick={handleSave}
              size="small"

              sx={{
                bgcolor: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(4px)',
                '&:hover': { bgcolor: 'white', transform: 'scale(1.1)' },
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                color: saved ? 'secondary.main' : 'text.secondary'
              }}
            >
              {saved ? (
                <BookmarkIcon sx={{ fontSize: 18 }} />
              ) : (
                <BookmarkBorderIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
        {images.length > 1 && (
          <Box sx={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 0.5 }}>
            {images.map((_, i) => (
              <Box
                key={i}
                onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                sx={{
                  width: i === imgIdx ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: i === imgIdx ? 'primary.main' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      <CardActionArea
        onClick={() => {
          sessionStorage.setItem('selectedProperty', JSON.stringify(property));
          router.push(`/property/${property.uuid || property.id}`);
        }}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardContent sx={{ p: compact ? 2 : 2.5, flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: compact ? '0.82rem' : '1rem',
              lineHeight: 1.3,
              mb: compact ? 0.5 : 0.75,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {property.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: compact ? 1 : 1.5 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary', flexShrink: 0 }} />
            <Typography variant="caption" color="text.secondary" noWrap>
              {property.city}, {property.state}
            </Typography>
          </Box>

          {(bedrooms !== null || property.bedrooms !== undefined || bathrooms !== null || parking !== null) && (
            <Box sx={{ display: 'flex', gap: compact ? 1.5 : 2, mb: compact ? 1.25 : 2 }}>
              {(bedrooms !== null || property.bedrooms !== undefined) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>{String(bedrooms || property.bedrooms)}</Typography>
                </Box>
              )}
              {bathrooms !== null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BathtubOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>{String(bathrooms)}</Typography>
                </Box>
              )}
              {parking !== null && Number(parking) > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <DirectionsCarOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>{String(parking)}</Typography>
                </Box>
              )}
              {property.land_size && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StraightenIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>{property.land_size}</Typography>
                </Box>
              )}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mt: 'auto' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                {property.property_category === 'shortlet' ? 'Shortlet Price' : property.property_category === 'rent' ? 'Rent Price' : 'Sales Price'}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: 'primary.main',
                  fontSize: compact ? '0.9rem' : '1.125rem',
                  fontFamily: '"Arial Black", sans-serif',
                }}
              >
                {formatPrice(displayPrice)}
                {property.property_category !== 'sale' && property.rental_duration && (
                  <Typography component="span" sx={{ fontSize: '0.65em', fontWeight: 600, color: 'text.secondary', ml: 0.5 }}>
                    / {property.rental_duration.replace('per ', '')}
                  </Typography>
                )}
              </Typography>
            </Box>

            <Tooltip title="View Agent Profile" arrow placement="top">
              <Box 
                sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer', p: 0.5, borderRadius: 1.5, '&:hover': { bgcolor: 'rgba(0,162,86,0.06)', opacity: 0.9 } }}
                onClick={handleAgentClick}
              >
                {likesCount > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 0.5 }}>
                    <FavoriteIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {likesCount}
                    </Typography>
                  </Box>
                )}
                <Avatar sx={{ width: 26, height: 26, bgcolor: 'secondary.main', fontSize: '0.75rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  {agent?.name?.charAt(0) || '?'}
                </Avatar>
                {agent?.claimed_at && (agent?.verified || agent?.verified_at) && (
                  <VerifiedIcon sx={{ fontSize: 15, color: 'primary.main' }} />
                )}
              </Box>
            </Tooltip>
          </Box>
        </CardContent>
      </CardActionArea>

      <Box sx={{ px: 2, pb: 2, display: 'flex' }}>
        <Button
          fullWidth
          component={Link}
          href={`/property/${property.uuid || property.id}`}
          variant="contained"
          size="small"
          sx={{ 
            textTransform: 'none', 
            fontWeight: 700, 
            fontSize: '0.75rem', 
            borderRadius: 2,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
            py: 0.8
          }}
        >
          View Property Details
        </Button>
      </Box>

      <AgentQuickViewModal 
        open={agentModalOpen}
        onClose={() => setAgentModalOpen(false)}
        agent={agent}
      />
    </Card>
  );
}
