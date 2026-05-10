'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import GroupsIcon from '@mui/icons-material/Groups';
import TuneIcon from '@mui/icons-material/Tune';
import HeroFilterBar from '../property/HeroFilterBar';

/* ─── Carousel images ─── */
const CAROUSEL_IMAGES = [
  '/building1.jpg',
  '/building2.jpg',
  '/building3.jpg',
  '/building4.jpg',
  '/building5.jpg',
];

const ANIMATIONS = ['fadeIn', 'slideLeft', 'slideRight', 'zoomIn', 'dissolve'] as const;

/* ── CSS keyframes injected once at runtime ── */
export const KEYFRAMES = `
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes slideLeft {
  from { opacity: 0; transform: translateX(5%); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideRight {
  from { opacity: 0; transform: translateX(-5%); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(1.07); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes dissolve {
  from { opacity: 0; filter: blur(8px); }
  to   { opacity: 1; filter: blur(0px); }
}
@keyframes imgFadeOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}
@keyframes heroUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes badgePop {
  0%   { opacity: 0; transform: scale(0.88) translateY(-6px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes blinkDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.25; transform: scale(0.7); }
}
`;

function getRandomAnim() {
  return ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
}

/* ══════════════════════════════════════════
   HERO CAROUSEL BACKGROUND
══════════════════════════════════════════ */
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [anim, setAnim] = useState<string>('fadeIn');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    const nextAnim = getRandomAnim();
    setCurrent((c) => {
      const next = (c + 1) % CAROUSEL_IMAGES.length;
      setPrev(c);
      setAnim(nextAnim);
      setAnimKey((k) => k + 1);
      setTimeout(() => setPrev(null), 1400);
      return next;
    });
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(advance, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [advance]);

  return (
    <>
      {prev !== null && (
        <Box
          key={`out-${prev}`}
          sx={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: `url(${CAROUSEL_IMAGES[prev]})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            animation: 'imgFadeOut 1.4s ease forwards',
          }}
        />
      )}
      <Box
        key={`in-${animKey}`}
        sx={{
          position: 'absolute', inset: 0, zIndex: 1,
          backgroundImage: `url(${CAROUSEL_IMAGES[current]})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          animation: `${anim} 1.4s ease forwards`,
        }}
      />
      <Box
        sx={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(170deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.75) 100%)',
        }}
      />
    </>
  );
}

/* ══════════════════════════════════════════
   HERO SECTION PROPS
══════════════════════════════════════════ */
interface HeroSectionProps {
  scrolled: boolean;
  filterTop: boolean;
  isStickyFilterExpanded: boolean;
  setIsStickyFilterExpanded: (v: boolean) => void;
  heroRef: React.RefObject<HTMLDivElement | null>;
  filterRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeroSection({
  scrolled,
  filterTop,
  isStickyFilterExpanded,
  setIsStickyFilterExpanded,
  heroRef,
  filterRef,
}: HeroSectionProps) {
  const router = useRouter();

  return (
    <>
      {/* Keyframes injected once */}
      <style>{KEYFRAMES}</style>

      {/* ══ STICKY FILTER BAR ══ */}
      <Box
        sx={{
          position: 'fixed',
          top: { xs: '72px', md: '90px' },
          left: '50%',
          transform: filterTop
            ? 'translateX(-50%) translateY(8px)'
            : 'translateX(-50%) translateY(-130%)',
          width: { xs: isStickyFilterExpanded ? '90%' : '54px', md: '90%' },
          height: { xs: isStickyFilterExpanded ? 'auto' : '54px', md: 'auto' },
          zIndex: 1100,
          bgcolor: 'white',
          borderRadius: { xs: isStickyFilterExpanded ? '12px' : '27px', md: '12px' },
          boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
          px: { xs: isStickyFilterExpanded ? 2 : 0, md: 3 },
          py: { xs: isStickyFilterExpanded ? 1.25 : 0, md: 1.25 },
          transition: 'all 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease, visibility 0s linear ' + (filterTop ? '0s' : '0.4s'),
          opacity: filterTop ? 1 : 0,
          visibility: filterTop ? 'visible' : 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isStickyFilterExpanded ? 2 : 0,
          overflow: 'hidden',
        }}
      >
        <Box sx={{
          display: { xs: isStickyFilterExpanded ? 'flex' : 'none', md: 'flex' },
          alignItems: 'center',
          gap: 2,
          flex: 1,
        }}>
          {/* Agent badge inline */}
          <Box sx={{
            display: { xs: 'none', lg: 'inline-flex' },
            alignItems: 'center',
            gap: 0.8,
            bgcolor: 'rgba(0,162,86,0.08)',
            border: '1px solid rgba(0,162,86,0.2)',
            borderRadius: '100px',
            px: 1.5,
            py: 0.55,
            flexShrink: 0,
          }}>
            <GroupsIcon sx={{ fontSize: 15, color: 'primary.main' }} />
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap' }}>
              1,000+ Agents
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <HeroFilterBar compact onToggle={() => setIsStickyFilterExpanded(false)} />
          </Box>
        </Box>

        {/* Mobile toggle (only when collapsed) */}
        {!isStickyFilterExpanded && (
          <IconButton
            onClick={() => setIsStickyFilterExpanded(true)}
            sx={{ display: { xs: 'flex', md: 'none' }, color: 'primary.main', transition: '0.3s' }}
          >
            <TuneIcon />
          </IconButton>
        )}
      </Box>

      {/* ══ HERO SECTION ══ */}
      <Box
        ref={heroRef}
        id="hero"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: '94vh', md: '98vh' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <HeroCarousel />

        {/* Content layer */}
        <Box sx={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          flex: 1,
          width: '100%',
          pt: { xs: 12, md: 14 },
        }}>
          {/* Agent badge — centered */}
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '30px' }}>
            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.28)',
              borderRadius: '100px',
              px: 2,
              py: 0.85,
              animation: 'badgePop 0.7s ease 0.1s both',
            }}>
              <img src="/Group 5.png" alt="icon" />
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'white', letterSpacing: 0.3 }}>
                Over 1,000+ Community of Agents
              </Typography>
            </Box>
          </Box>

          {/* Hero text & CTA — collapses on scroll */}
          <Box sx={{
            opacity: scrolled ? 0 : 1,
            maxHeight: scrolled ? '0px' : '700px',
            overflow: 'hidden',
            transition: 'opacity 0.38s ease, max-height 0.5s cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: scrolled ? 'none' : 'auto',
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative' }}>

              {/* Floating side pills */}
              <Box
                onClick={() => router.push('/search?category=sale')}
                sx={{
                  position: 'absolute', left: { md: -8 }, top: { md: 140 },
                  display: { xs: 'none', md: 'inline-flex' },
                  alignItems: 'center', gap: 0.7,
                  bgcolor: 'rgba(255,255,255,0.16)', color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)',
                  borderRadius: '100px', px: 1.5, py: 0.55, fontWeight: 500,
                  fontSize: '0.75rem', cursor: 'pointer', animation: 'heroUp 0.8s ease 0.7s both',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' }, userSelect: 'none',
                }}
              >
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#00e676', boxShadow: '0 0 5px #00e676', animation: 'blinkDot 1.4s ease-in-out infinite', flexShrink: 0 }} />
                Sell Property
              </Box>

              <Box
                onClick={() => router.push('/search?category=sale')}
                sx={{
                  position: 'absolute', right: { md: 16 }, top: { md: 40 },
                  display: { xs: 'none', md: 'inline-flex' },
                  alignItems: 'center', gap: 0.7,
                  bgcolor: 'rgba(255,255,255,0.16)', color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)',
                  borderRadius: '100px', px: 1.5, py: 0.55, fontWeight: 500,
                  fontSize: '0.75rem', cursor: 'pointer', animation: 'heroUp 0.8s ease 0.9s both',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' }, userSelect: 'none',
                }}
              >
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#00e676', boxShadow: '0 0 5px #00e676', animation: 'blinkDot 1.4s ease-in-out infinite 0.3s', flexShrink: 0 }} />
                Buy Property
              </Box>

              {/* Headline */}
              <Box sx={{ textAlign: 'center', mt: { xs: 1, md: 2 }, mb: 3 }}>
                <Typography component="h1" sx={{
                  color: 'white',
                  fontSize: { xs: '2.1rem', sm: '2.75rem', md: '3.5rem' },
                  fontWeight: 900, lineHeight: 1.12, mb: 0.5,
                  animation: 'heroUp 0.8s ease 0.2s both',
                  fontFamily: '"Poppins", "Arial Black", sans-serif',
                  letterSpacing: '-0.01em',
                }}>
                  Connecting People With Homes,
                </Typography>
                <Typography component="h1" sx={{
                  color: 'primary.main',
                  fontSize: { xs: '2.1rem', sm: '2.75rem', md: '3.5rem' },
                  fontWeight: 900, lineHeight: 1.12, fontStyle: 'italic', mb: 3.5,
                  animation: 'heroUp 0.8s ease 0.35s both',
                  fontFamily: '"Poppins", "Arial Black", sans-serif',
                }}>
                  The Right Way
                </Typography>
                <Typography sx={{
                  color: 'rgba(255,255,255,0.82)', maxWidth: 830, mx: 'auto', mb: 4.5,
                  fontSize: { xs: '0.93rem', md: '1rem' }, lineHeight: 1.8,
                  animation: 'heroUp 0.8s ease 0.5s both',
                  fontFamily: '"Poppins", sans-serif',
                }}>
                  Whether you&apos;re searching for your next apartment or looking to list your property, Realestway gives you a safe, transparent, and easy-to-use platform to make real estate simple.
                </Typography>
                <Button
                  variant="contained" size="large"
                  onClick={() => router.push('/auth/register')}
                  sx={{
                    bgcolor: 'primary.main', color: 'white', px: 5, py: 1.6,
                    borderRadius: '10px', fontSize: '1rem', fontWeight: 700,
                    '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.03)' },
                    boxShadow: '0 4px 28px rgba(0,162,86,0.48)',
                    transition: 'all 0.2s ease',
                    animation: 'heroUp 0.8s ease 0.65s both',
                  }}
                >
                  List Your Property
                </Button>
              </Box>
            </Container>
          </Box>

          {/* Filter bar — anchored to bottom of hero */}
          <Box ref={filterRef} sx={{ mt: 'auto', px: { xs: 2, md: 0 }, pb: { xs: 4, md: 6 } }}>
            <Container maxWidth="lg">
              <HeroFilterBar />
            </Container>
          </Box>
        </Box>
      </Box>
    </>
  );
}
