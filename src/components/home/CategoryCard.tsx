'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface CategoryCardProps {
  title: string;
  description: string;
  count?: string;
  image: string;
  previewImages: string[];
  href: string;
  priceOverlay?: string;
}

const CardContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '280px',
  borderRadius: '24px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
  }
}));

const BgGrid = styled(Box)({
  position: 'absolute',
  inset: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridTemplateRows: 'repeat(2, 1fr)',
  gap: '2px',
  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
});

const PreviewLayer = styled(Box)<{ active: boolean }>(({ active }) => ({
  position: 'absolute',
  inset: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridTemplateRows: 'repeat(2, 1fr)',
  gap: '6px',
  padding: '8px',
  opacity: active ? 1 : 0,
  transform: active ? 'translateY(0)' : 'translateY(20px)',
  transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
  zIndex: 2,
  backdropFilter: 'blur(16px)',
  background: 'rgba(0, 0, 0, 0.5)',
}));

const Overlay = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
  zIndex: 1,
}));

const Shimmer = styled('div')({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
  animation: 'shimmer 1.5s infinite',
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
});

function MediaRenderer({ src, delay = 0, isHovered = false }: { src: string; delay?: number; isHovered?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const isVideo = src.match(/\.(mp4|webm|ogg|mov)$|^data:video/i);
  const mediaRef = useRef<any>(null);

  useEffect(() => {
    if (mediaRef.current) {
      if (isVideo && mediaRef.current.readyState >= 3) {
        setLoaded(true);
      } else if (!isVideo && mediaRef.current.complete) {
        setLoaded(true);
      }
    }
  }, [src, isVideo]);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.03)' }}>
      {!loaded && <Shimmer />}
      
      {isVideo ? (
        <Box
          component="video"
          ref={mediaRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setLoaded(true)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
            transitionDelay: `${delay}ms`,
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />
      ) : (
        <Box
          component="img"
          ref={mediaRef}
          src={src}
          onLoad={() => setLoaded(true)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
            transitionDelay: `${delay}ms`,
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />
      )}
    </Box>
  );
}

export default function CategoryCard({ 
  title, 
  description, 
  count, 
  image, 
  previewImages, 
  href,
  priceOverlay 
}: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleMouseEnter = () => {
    setIsHovered(true);
    router.prefetch(href);
  };

  const displayImages = previewImages.length >= 4 ? previewImages.slice(0, 4) : [image, image, image, image];

  return (
    <CardContainer 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(href)}
    >
      <BgGrid sx={{ transform: isHovered ? 'scale(1.1) rotate(1deg)' : 'scale(1)' }}>
        {displayImages.map((img, idx) => (
          <MediaRenderer key={idx} src={img} isHovered={isHovered} />
        ))}
      </BgGrid>
      
      <Overlay />
      
      {/* Interactive Grid Overlay on Hover */}
      {previewImages.length > 0 && (
        <PreviewLayer active={isHovered}>
          {previewImages.slice(0, 8).map((img, idx) => (
            <Box 
              key={idx} 
              sx={{ 
                borderRadius: '12px', 
                overflow: 'hidden', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.4s ease',
                transitionDelay: `${idx * 30}ms`,
                transform: isHovered ? 'scale(1)' : 'scale(0.85)',
                opacity: isHovered ? 1 : 0,
              }}
            >
              <MediaRenderer src={img} delay={idx * 30} />
            </Box>
          ))}
        </PreviewLayer>
      )}

      {priceOverlay && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'primary.main',
            color: 'white',
            px: 1.5,
            py: 0.8,
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.75rem',
            boxShadow: '0 8px 20px rgba(0,162,86,0.4)',
            zIndex: 10,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
            transform: isHovered ? 'scale(1.1) translateY(-2px)' : 'none',
          }}
        >
          {priceOverlay}
        </Box>
      )}

      {/* Static Content */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 24, 
          left: 24, 
          right: 24, 
          zIndex: 3,
          color: 'white',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-5px)' : 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: '-0.02em', fontSize: '1.5rem' }}>
            {title}
          </Typography>
          <ArrowForwardIcon sx={{ 
            opacity: isHovered ? 1 : 0.7, 
            transform: isHovered ? 'translateX(0)' : 'translateX(-5px)',
            transition: 'all 0.3s ease'
          }} />
        </Box>
        
        <Typography variant="body2" sx={{ opacity: 0.85, mb: 1.5, fontSize: '0.9rem', lineHeight: 1.4, maxWidth: '90%' }}>
          {description}
        </Typography>

        {count && (
          <Box sx={{ 
            display: 'inline-flex', 
            bgcolor: 'rgba(255,255,255,0.15)', 
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            px: 1.8, 
            py: 0.6, 
            borderRadius: '100px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.02em'
          }}>
            {count} Listings Available
          </Box>
        )}
      </Box>
    </CardContainer>
  );
}
