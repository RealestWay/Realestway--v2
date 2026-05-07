'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

import PropertyCard from '../components/property/PropertyCard';
import PropertySkeleton from '../components/property/PropertySkeleton';
import BlogCard from '../components/blog/BlogCard';
import { mockBlogPosts } from '../data/mockData';
import ApiService from '@/src/services/api';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GroupsIcon from '@mui/icons-material/Groups';
import { useUserLocation } from '../hooks/useUserLocation';
import { useAuth } from '../context/AuthContext';
import HeroFilterBar from '../components/property/HeroFilterBar';
import CategoryCard from '../components/home/CategoryCard';
import { usePropertiesCache } from '../hooks/usePropertiesCache';
import MobileNav from '../components/layout/MobileNav';

/* ─── Carousel images ─── */
const CAROUSEL_IMAGES = [
  '/building1.jpg',
  '/building2.jpg',
  '/building3.jpg',
  '/building4.jpg',
  '/building5.jpg',
];

/* ─── Animation types that cycle randomly ─── */
const ANIMATIONS = ['fadeIn', 'slideLeft', 'slideRight', 'zoomIn', 'dissolve'] as const;

const QUICK_FILTER_TAGS = ['Self Contain', 'Flats', 'Duplex', '2 Bed', '3 Bed', '4 Bed', '5 Bed', 'Shop', 'Office'];

const howItWorks = [
  {
    icon: <SearchOutlinedIcon sx={{ fontSize: 28 }} />,
    title: 'Search',
    desc: 'Describe what you want — city, type, budget. Our smart search returns exactly what you need.',
  },
  {
    icon: <HomeWorkOutlinedIcon sx={{ fontSize: 28 }} />,
    title: 'Explore',
    desc: 'Browse thousands of verified listings with photos, floor plans, and detailed fee breakdowns.',
  },
  {
    icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 28 }} />,
    title: 'Connect',
    desc: 'Contact verified agents directly via call or WhatsApp — no middlemen, no hidden charges.',
  },
];

/* ── CSS keyframes injected once at runtime ── */
const KEYFRAMES = `
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
  const [prev,    setPrev]    = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [anim,    setAnim]    = useState<string>('fadeIn');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Use a ref for advance to avoid stale closures */
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
      {/* outgoing slide */}
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

      {/* incoming slide */}
      <Box
        key={`in-${animKey}`}
        sx={{
          position: 'absolute', inset: 0, zIndex: 1,
          backgroundImage: `url(${CAROUSEL_IMAGES[current]})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          animation: `${anim} 1.4s ease forwards`,
        }}
      />

      {/* dark gradient overlay */}
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
   MAIN LANDING PAGE
══════════════════════════════════════════ */

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  

  /* Scroll state — triggers hero collapse */
  const [scrolled,   setScrolled]   = useState(false);
  const [filterTop,  setFilterTop]  = useState(false);   // when filter should be sticky
  const filterRef   = useRef<HTMLDivElement>(null);
  const heroRef     = useRef<HTMLDivElement>(null);

  const [homeData, setHomeData] = useState<any>({
    sections: {
      recent: [],
      featured: [],
      hot_deals: [],
      popular: [],
      shortlet: [],
      land: [],
      rent: [],
      buy: [],
    },
    counts: {
      rent: 0,
      sale: 0,
      shortlet: 0,
      land: 0
    },
    avg_prices: {
      rent: 0,
      sale: 0,
      shortlet: 0,
      land: 0
    }
  });
  const [popularCities, setPopularCities] = useState<{name: string, count: number, emoji: string}[]>([]);
  const [visibleCitiesCount, setVisibleCitiesCount] = useState(12);
  const [globalCategory, setGlobalCategory] = useState<'rent' | 'sale'>('rent');
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);

  const filterProperties = useCallback((list: any[]) => {
    return list.filter(p => {
      // 1. Filter by Rent/Sale Category
      // Assuming 'rent' matches category 'rent' and 'sale' matches category 'sale'
      if (p.category !== globalCategory && p.property_category !== globalCategory) return false;
      
      // 2. Quick Filters
      if (quickFilters.length > 0) {
        const lowerType = (p.house_type || '').toLowerCase();
        const bedCount = p.bedrooms || 0;
        
        return quickFilters.some(f => {
          const lf = f.toLowerCase();
          if (lf.includes('bed')) return lf.startsWith(bedCount.toString());
          if (lf === 'flats') return lowerType.includes('flat') || lowerType.includes('apartment');
          if (lf === 'self contain') return lowerType.includes('self');
          return lowerType.includes(lf);
        });
      }
      return true;
    });
  }, [globalCategory, quickFilters]);

  useEffect(() => {
    try {
      const cachedData = localStorage.getItem('home_properties');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setHomeData(parsed);
        setLoading(false);

        // Also shuffle immediately if we have data
        const allSections = ['recent', 'featured', 'popular', 'recommended', 'luxury', 'affordable'];
        setShuffledSections([...allSections].sort(() => 0.5 - Math.random()));
      }
    } catch (e) {
      console.error('Failed to load home cache', e);
    }
  }, []);

  // Dynamic categories pool (shuffled sections)
  const [shuffledSections, setShuffledSections] = useState<string[]>([]);
  
  const { location } = useUserLocation();

  useEffect(() => {
    // Fetch home properties
    const fetchHomeData = async () => {
      try {
        const response: any = await ApiService.properties.getHome();
        if (response) {
          setHomeData(response);
          localStorage.setItem('home_properties', JSON.stringify(response));

          // Build shuffled sections list from fixed marketing categories
          const allSections = ['recent', 'featured', 'popular', 'recommended', 'luxury', 'affordable'];
          const shuffled = allSections.sort(() => 0.5 - Math.random());
          setShuffledSections(shuffled);
        }
      } catch (err) {
        console.error('Failed to fetch home properties, using mock data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch cities
    const fetchCities = async () => {
      try {
        const cachedCities = localStorage.getItem('available_cities');
        if (cachedCities) setPopularCities(JSON.parse(cachedCities));
        
        const response: any = await ApiService.properties.getCities();
        if (response && response.data) {
          const mapped = response.data.map((c: any, i: number) => ({
            name: c.name,
            count: c.count,
            emoji: ['🏙️', '🏛️', '⚓', '🏘️', '🌆', '🌿'][i % 6]
          }));
          setPopularCities(mapped);
          localStorage.setItem('available_cities', JSON.stringify(mapped));
        }
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      }
    };
    fetchCities();

    // Only show spinner if we have no cached data at all
    const hasCached = localStorage.getItem('home_properties');
    fetchHomeData();
  }, []);

  // Live search when filters change
  useEffect(() => {
    if (quickFilters.length === 0) {
      setSearchResults([]);
      setTotalResults(0);
      return;
    }

    const performSearch = async () => {
      setSearching(true);
      try {
        const query = new URLSearchParams();
        query.append('category', globalCategory);
        
        // Map filters
        const houseTypes: string[] = [];
        let minBeds: number | null = null;
        
        quickFilters.forEach(f => {
          if (f.includes('Bed')) {
            const val = parseInt(f);
            if (!isNaN(val)) minBeds = val;
          } else {
            houseTypes.push(f);
          }
        });

        if (houseTypes.length > 0) {
          houseTypes.forEach(type => query.append('house_type[]', type));
        }
        if (minBeds !== null) query.append('bedrooms', minBeds.toString());
        query.append('limit', '12');

        const res: any = await ApiService.properties.getAll(query.toString());
        if (res && res.data) {
          setSearchResults(res.data);
          setTotalResults(res.total || res.data.length);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setSearching(false);
      }
    };

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [quickFilters, globalCategory]);

  // Background Prefetching for Categories
  useEffect(() => {
    const categories = [
      '/search?category=rent',
      '/search?category=sale',
      '/search?category=shortlet',
      '/search?category=sale&house_type[]=Land'
    ];
    categories.forEach(href => {
      router.prefetch(href);
    });
  }, [router]);

  useEffect(() => {
    if (location) {
      const fetchNearby = async () => {
        try {
          const response: any = await ApiService.properties.getNearby({
            lat: location.lat,
            lng: location.lng,
            city: location.city,
            state: location.state,
            address: location.address,
            limit: 10
          });
          if (response && response.data) {
            setHomeData((prev: any) => ({ 
              ...prev, 
              sections: { ...prev.sections, nearby: response.data } 
            }));
          }
        } catch (err) {
          console.error('Failed to fetch nearby properties:', err);
        }
      };
      fetchNearby();
    }
  }, [location]);

  useEffect(() => {
    const NAVBAR_H = 72; // px – matches Navbar minHeight
    const TRIGGER  = 80; // px – scroll distance before collapse

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > TRIGGER);

      /* sticky filter: when hero bottom scrolls above viewport */
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setFilterTop(heroBottom < NAVBAR_H + 60);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box>
      {/* keyframes */}
      <style>{KEYFRAMES}</style>

      {/* ══ STICKY FILTER BAR (appears when filter goes out of view) ══ */}
      <Box
        sx={{
          position: 'fixed',
          top: { xs: '72px', md: '90px' },   /* below Navbar — extra gap on desktop */
          left: '50%',
          transform: filterTop
            ? 'translateX(-50%) translateY(8px)'
            : 'translateX(-50%) translateY(-130%)',
          width: '90%',
          zIndex: 1100,
          bgcolor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
          px: { xs: 2, md: 3 },
          py: 1.25,
          transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease, visibility 0s linear ' + (filterTop ? '0s' : '0.4s'),
          opacity: filterTop ? 1 : 0,
          visibility: filterTop ? 'visible' : 'hidden',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* agent badge inline */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'inline-flex' },
            alignItems: 'center',
            gap: 0.8,
            bgcolor: 'rgba(0,162,86,0.08)',
            border: '1px solid rgba(0,162,86,0.2)',
            borderRadius: '100px',
            px: 1.5,
            py: 0.55,
            flexShrink: 0,
          }}
        >
          <GroupsIcon sx={{ fontSize: 15, color: 'primary.main' }} />
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap' }}>
            1,000+ Agents
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <HeroFilterBar compact />
        </Box>
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
        {/* Background carousel */}
        <HeroCarousel />

        {/* Content layer */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 3,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            flex: 1,
            width: '100%',
            pt: { xs: 12, md: 14 },   /* clear floating navbar (74px xs / 86px md) */
          }}
        >
          {/* Agent badge — centered */}
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '30px' }}>
            <Box
              sx={{
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
              }}
            >
              <img src="/Group 5.png" alt="icon" />
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'white', letterSpacing: 0.3 }}>
                Over 1,000+ Community of Agents
              </Typography>
            </Box>
          </Box>

          {/* Hero text & CTA — collapses on scroll */}
          <Box
            sx={{
              opacity:    scrolled ? 0 : 1,
              maxHeight:  scrolled ? '0px' : '700px',
              overflow:   'hidden',
              transition: 'opacity 0.38s ease, max-height 0.5s cubic-bezier(0.4,0,0.2,1)',
              pointerEvents: scrolled ? 'none' : 'auto',
            }}
          >
            <Container maxWidth="lg" sx={{ position: 'relative' }}>

              {/* Floating side pills with blinking green dot */}
              <Box
                onClick={() => router.push('/search?category=sale')}
                sx={{
                  position: 'absolute',
                  left: { md: -8 },
                  top: { md: 140 },
                  display: { xs: 'none', md: 'inline-flex' },
                  alignItems: 'center',
                  gap: 0.7,
                  bgcolor: 'rgba(255,255,255,0.16)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '100px',
                  px: 1.5,
                  py: 0.55,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  animation: 'heroUp 0.8s ease 0.7s both',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
                  userSelect: 'none',
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    bgcolor: '#00e676',
                    boxShadow: '0 0 5px #00e676',
                    animation: 'blinkDot 1.4s ease-in-out infinite',
                    flexShrink: 0,
                  }}
                />
                Sell Property
              </Box>

              <Box
                onClick={() => router.push('/search?category=sale')}
                sx={{
                  position: 'absolute',
                  right: { md: 16 },
                  top: { md: 40 },
                  display: { xs: 'none', md: 'inline-flex' },
                  alignItems: 'center',
                  gap: 0.7,
                  bgcolor: 'rgba(255,255,255,0.16)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '100px',
                  px: 1.5,
                  py: 0.55,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  animation: 'heroUp 0.8s ease 0.9s both',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
                  userSelect: 'none',
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    bgcolor: '#00e676',
                    boxShadow: '0 0 5px #00e676',
                    animation: 'blinkDot 1.4s ease-in-out infinite 0.3s',
                    flexShrink: 0,
                  }}
                />
                Buy Property
              </Box>

              {/* Headline */}
              <Box sx={{ textAlign: 'center', mt: { xs: 1, md: 2 }, mb: 3 }}>
                <Typography
                  component="h1"
                  sx={{
                    color: 'white',
                    fontSize: { xs: '2.1rem', sm: '2.75rem', md: '3.5rem' },
                    fontWeight: 900,
                    lineHeight: 1.12,
                    mb: 0.5,
                    animation: 'heroUp 0.8s ease 0.2s both',
                    fontFamily: '"Poppins", "Arial Black", sans-serif',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Connecting People With Homes,
                </Typography>
                <Typography
                  component="h1"
                  sx={{
                    color: 'primary.main',
                    fontSize: { xs: '2.1rem', sm: '2.75rem', md: '3.5rem' },
                    fontWeight: 900,
                    lineHeight: 1.12,
                    fontStyle: 'italic',
                    mb: 3.5,
                    animation: 'heroUp 0.8s ease 0.35s both',
                    fontFamily: '"Poppins", "Arial Black", sans-serif',
                  }}
                >
                  The Right Way
                </Typography>

                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.82)',
                    maxWidth: 830,
                    mx: 'auto',
                    mb: 4.5,
                    fontSize: { xs: '0.93rem', md: '1rem' },
                    lineHeight: 1.8,
                    animation: 'heroUp 0.8s ease 0.5s both',
                    fontFamily: '"Poppins", sans-serif',
                  }}
                >
                  Whether you&apos;re searching for your next apartment or looking to list your property, Realestway gives you a safe, transparent, and easy-to-use platform to make real estate simple.
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push('/auth/register')}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 5,
                    py: 1.6,
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: 700,
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
          <Box
            ref={filterRef}
            sx={{
              mt: 'auto',
              px: { xs: 2, md: 0 },
              pb: { xs: 4, md: 6 },
            }}
          >
            <Container maxWidth="lg">
              <HeroFilterBar />
            </Container>
          </Box>
        </Box>
      </Box>

      {/* ══ CATEGORY CARDS ══ */}
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
            {[
              { 
                title: 'Rent', 
                description: 'Find apartments for yearly rent', 
                image: homeData.previews?.rent?.[0] || '/building1.jpg', 
                href: '/search?category=rent',
                previewImages: homeData.previews?.rent || [],
                count: homeData.counts?.rent ? (homeData.counts.rent > 999 ? `${(homeData.counts.rent / 1000).toFixed(1)}k` : homeData.counts.rent.toString()) : '0',
                priceOverlay: null
              },
              { 
                title: 'Buy', 
                description: 'Own your home with premium listings', 
                image: homeData.previews?.buy?.[0] || '/building2.jpg', 
                href: '/search?category=sale',
                previewImages: homeData.previews?.buy || [],
                count: homeData.counts?.sale ? (homeData.counts.sale > 999 ? `${(homeData.counts.sale / 1000).toFixed(1)}k` : homeData.counts.sale.toString()) : '0',
                priceOverlay: null
              },
              { 
                title: 'Shortlet', 
                description: 'Comfortable stays for short durations', 
                image: homeData.previews?.shortlet?.[0] || '/building3.jpg', 
                href: '/search?category=shortlet',
                previewImages: homeData.previews?.shortlet || [],
                count: homeData.counts?.shortlet ? (homeData.counts.shortlet > 999 ? `${(homeData.counts.shortlet / 1000).toFixed(1)}k` : homeData.counts.shortlet.toString()) : '0',
                priceOverlay: null
              },
              { 
                title: 'Land', 
                description: 'Invest in the future with prime land', 
                image: homeData.previews?.land?.[0] || '/building4.jpg', 
                href: '/search?category=sale&house_type[]=Land',
                previewImages: homeData.previews?.land || [],
                count: homeData.counts?.land ? (homeData.counts.land > 999 ? `${(homeData.counts.land / 1000).toFixed(1)}k` : homeData.counts.land.toString()) : '0',
                priceOverlay: null
              }
            ].map((cat, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
                <CategoryCard {...cat} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ══ CITIES SECTION ══ */}
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

          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            overflowX: 'auto', 
            pb: 4,
            '&::-webkit-scrollbar': { display: 'none' },
            mx: { xs: -2, md: 0 },
            px: { xs: 2, md: 0 }
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
                  '&:hover img': { transform: 'scale(1.1)' }
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
                  color: 'white'
                }}>
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>{city.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>{city.count} Listings</Typography>
                    <Typography variant="body2" fontWeight={700}>Avg. ₦{(Number((city as any).avg_price || 0) / 1000000).toFixed(1)}M</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ══ DYNAMIC SECTIONS ══ */}
      {loading ? (
        // Loading State: Shimmering Skeletons
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
      ) : (
        <>
          {/* ════ SEARCH RESULTS SECTION (When filters active) ════ */}
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
                    {[1, 2, 3, 4].map(i => (
                      <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                        <PropertySkeleton />
                      </Grid>
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
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: { xs: 4, md: 8 }, 
                      textAlign: 'center', 
                      bgcolor: 'rgba(0,162,86,0.03)', 
                      borderRadius: 4,
                      border: '2px dashed',
                      borderColor: 'rgba(0,162,86,0.2)'
                    }}
                  >
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      No matches found in this section
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                      We couldn't find any {quickFilters.join(' + ')} {globalCategory} listings matching exactly what you're looking for here.
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="large"
                      onClick={() => {
                        const q = new URLSearchParams();
                        q.append('category', globalCategory);
                        q.append('q', quickFilters.join(' '));
                        router.push(`/search?${q.toString()}`);
                      }}
                      sx={{ 
                        px: 4, py: 1.5, borderRadius: 3, fontWeight: 700,
                        boxShadow: '0 8px 24px rgba(0,162,86,0.25)'
                      }}
                    >
                      Search Everywhere on Realestway
                    </Button>
                  </Paper>
                )}
              </Container>
            </Box>
          )}

          {/* 0. Nearby Properties (Prioritized if available) */}
          {(() => {
            const nearbyData = homeData.sections?.nearby || [];
            const filteredNearby = filterProperties(nearbyData);
            if (filteredNearby.length < 1) return null;

            return (
              <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 8 } }}>
                <Container maxWidth="xl">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="overline" color="primary" sx={{ mb: 0.5, display: 'block' }}>
                        Local Listings
                      </Typography>
                      <Typography variant="h4" fontWeight={800}>
                        Properties Near You
                      </Typography>
                    </Box>
                    <Button endIcon={<ArrowForwardIcon />} onClick={() => router.push('/search')} sx={{ color: 'primary.main', fontWeight: 600 }}>
                      View All
                    </Button>
                  </Box>
                  <Grid container spacing={3}>
                    {filteredNearby.slice(0, 4).map((property: any) => (
                      <Grid key={property.id} size={{ xs: 12, sm: 6, md: 3 }}>
                        <PropertyCard property={property} compact />
                      </Grid>
                    ))}
                  </Grid>
                </Container>
              </Box>
            );
          })()}

          {/* 1. Hot Deals (Fixed/Prioritized as second section) */}
          {(() => {
            const hotDeals = homeData.sections?.hot_deals || [];
            const filteredDeals = filterProperties(hotDeals);
            if (filteredDeals.length < 1) return null;

            return (
              <Box sx={{ bgcolor: '#fff9e6', py: { xs: 6, md: 8 } }}>
                <Container maxWidth="xl">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="overline" sx={{ color: '#d97706', mb: 0.5, display: 'block' }}>
                        Exclusive Offers
                      </Typography>
                      <Typography variant="h4" fontWeight={800} sx={{ color: '#d97706' }}>
                        Hot Deals 🔥
                      </Typography>
                    </Box>
                    <Button endIcon={<ArrowForwardIcon />} onClick={() => router.push('/search?category=sale')} sx={{ color: '#d97706', fontWeight: 600 }}>
                      View All
                    </Button>
                  </Box>
                  <Grid container spacing={3}>
                    {filteredDeals.slice(0, 4).map((property: any) => (
                      <Grid key={property.id} size={{ xs: 12, sm: 6, md: 3 }}>
                        <PropertyCard property={property} compact />
                      </Grid>
                    ))}
                  </Grid>
                </Container>
              </Box>
            );
          })()}

          {/* 2. Shuffled Sections */}
          {shuffledSections.map((sectionId, index) => {
            let sectionData = [];
            let sectionTitle = "";
            let sectionSubtitle = "";
            let bgColor = index % 2 === 0 ? 'white' : 'background.default';
            let viewAllPath = "/search";

            // 1. Check fixed sections
            const fixedSection = homeData.sections?.[sectionId];
            if (fixedSection) {
              sectionData = fixedSection;
              switch (sectionId) {
                case 'recent':
                  sectionTitle = "Recently Added Properties";
                  sectionSubtitle = "Latest Listings";
                  break;
                case 'featured':
                  sectionTitle = "Featured Properties";
                  sectionSubtitle = "Handpicked for you";
                  break;
                case 'popular':
                  sectionTitle = "Trending Now";
                  sectionSubtitle = "Most viewed properties";
                  break;
                case 'recommended':
                  sectionData = [...(homeData.sections?.featured || []), ...(homeData.sections?.popular || [])].slice(0, 8);
                  sectionTitle = "Recommended For You";
                  sectionSubtitle = "Tailored to your preference";
                  break;
                case 'luxury':
                  sectionData = [...(homeData.sections?.recent || []), ...(homeData.sections?.featured || [])]
                    .filter(p => (p.price || p.total_package) > 10000000)
                    .slice(0, 8);
                  sectionTitle = "Luxury Homes";
                  sectionSubtitle = "Premium living spaces";
                  break;
                case 'affordable':
                  sectionData = [...(homeData.sections?.recent || []), ...(homeData.sections?.featured || [])]
                    .filter(p => (p.price || p.total_package) > 0 && (p.price || p.total_package) < 2000000)
                    .slice(0, 8);
                  sectionTitle = "Affordable Homes";
                  sectionSubtitle = "Budget friendly options";
                  break;
              }
            } else {
              return null;
            }

            const filteredData = filterProperties(sectionData);

            // Visibility Ratio Logic: 
            if (filteredData.length < 4) return null;

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
                      <Typography variant="h4" fontWeight={800}>
                        {sectionTitle}
                      </Typography>
                    </Box>
                    <Button endIcon={<ArrowForwardIcon />} onClick={() => router.push(viewAllPath)} sx={{ color: 'primary.main', fontWeight: 600 }}>
                      View All
                    </Button>
                  </Box>
                  <Grid container spacing={3}>
                    {filteredData.slice(0, 4).map((property: any) => (
                      <Grid key={property.id} size={{ xs: 12, sm: 6, md: 3 }}>
                        <PropertyCard property={property} compact />
                      </Grid>
                    ))}
                  </Grid>
                </Container>
              </Box>
            );
          })}
        </>
      )}

      {/* ══ POPULAR CITIES ══ */}
      <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 10 }, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" color="primary" sx={{ mb: 0.5, display: 'block' }}>Popular Locations</Typography>
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
                onClick={() => setVisibleCitiesCount(prev => prev + 12)}
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  px: 6,
                  py: 1.2,
                  borderRadius: '10px',
                  fontWeight: 700,
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(0,162,85,0.25)'
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                See More Cities
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* ══ BLOG & NEWS ══ */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 6, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                BLOG & NEWS
              </Typography>
              <Typography variant="h3" fontWeight={800} sx={{ maxWidth: 600, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1.2 }}>
                Your Guide to Smarter Renting, Buying & Investing
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => router.push('/blog')} 
              sx={{ bgcolor: 'primary.main', fontWeight: 600, px: 4, py: 1.5, borderRadius: 2 }}
            >
              View All Blog
            </Button>
          </Box>
          <Grid container spacing={3}>
            {mockBlogPosts.map((post) => (
              <Grid key={post.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <BlogCard post={post} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ══ HOW IT WORKS ══ */}
      <Box sx={{ background: 'linear-gradient(135deg, #F6F7FB 0%, #EBF5EE 100%)', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" color="primary" sx={{ mb: 0.5, display: 'block' }}>Simple Process</Typography>
            <Typography variant="h4" fontWeight={800}>How Realestway Works</Typography>
          </Box>
          <Grid container spacing={4}>
            {howItWorks.map((step, i) => (
              <Grid key={step.title} size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  {i < howItWorks.length - 1 && (
                    <Box sx={{
                      display: { xs: 'none', md: 'block' }, position: 'absolute',
                      top: 28, left: '60%', right: '-20%', height: 2,
                      bgcolor: 'primary.main', opacity: 0.18, zIndex: 0,
                    }} />
                  )}
                  <Avatar sx={{
                    width: 64, height: 64, bgcolor: 'primary.main', mx: 'auto', mb: 2.5,
                    boxShadow: '0 8px 24px rgba(0,162,85,0.28)', position: 'relative', zIndex: 1,
                  }}>
                    {step.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} mb={1}>{i + 1}. {step.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, maxWidth: 280, mx: 'auto' }}>
                    {step.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* ══ MOBILE NAVIGATION ══ */}
      <MobileNav />
    </Box>
  );
}
