'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import ApiService from '@/src/services/api';
import { useUserLocation } from '../hooks/useUserLocation';
import { useAuth } from '../context/AuthContext';
import MobileNav from '../components/layout/MobileNav';

import dynamic from 'next/dynamic';
import Skeleton from '@mui/material/Skeleton';
import HeroSection from '../components/home/HeroSection';
import CategoryCardsSection from '../components/home/CategoryCardsSection';
import { useHomeData, useCities } from '../hooks/useHomeData';

/* ── Dynamic sections (below the fold) ── */
const CitiesCarousel = dynamic(() => import('../components/home/CitiesCarousel'), {
  loading: () => <Skeleton variant="rectangular" height={200} sx={{ my: 4, borderRadius: 2 }} />
});
const DynamicPropertySections = dynamic(() => import('../components/home/DynamicPropertySections'), {
  loading: () => <Skeleton variant="rectangular" height={600} sx={{ my: 4, borderRadius: 2 }} />
});
const PopularCitiesGrid = dynamic(() => import('../components/home/PopularCitiesGrid'), {
  loading: () => <Skeleton variant="rectangular" height={400} sx={{ my: 4, borderRadius: 2 }} />
});
const BlogSection = dynamic(() => import('../components/home/BlogSection'), {
  loading: () => <Skeleton variant="rectangular" height={300} sx={{ my: 4, borderRadius: 2 }} />
});
const HowItWorksSection = dynamic(() => import('../components/home/HowItWorksSection'), {
  loading: () => <Skeleton variant="rectangular" height={300} sx={{ my: 4, borderRadius: 2 }} />
});

/* ══════════════════════════════════════════
   MAIN LANDING PAGE
   — Owns all state & data-fetching.
   — Composes modular section components.
══════════════════════════════════════════ */
export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  /* ── Scroll / hero state ── */
  const [scrolled, setScrolled] = useState(false);
  const [filterTop, setFilterTop] = useState(false);
  const [isStickyFilterExpanded, setIsStickyFilterExpanded] = useState(true);
  const filterRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  /* ── Home data via TanStack Query ── */
  const { data: homeQueryData, isLoading: homeLoading } = useHomeData();
  const { data: popularCities = [] } = useCities();

  const [homeData, setHomeData] = useState<any>({
    sections: {
      recent: [], featured: [], hot_deals: [],
      popular: [], shortlet: [], land: [], rent: [], buy: [],
    },
    counts: { rent: 0, sale: 0, shortlet: 0, land: 0 },
    avg_prices: { rent: 0, sale: 0, shortlet: 0, land: 0 },
  });
  const [visibleCitiesCount, setVisibleCitiesCount] = useState(12);
  const [shuffledSections, setShuffledSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync query data to local state for internal filtering/shuffling
  useEffect(() => {
    if (homeQueryData) {
      setHomeData(homeQueryData);
      setLoading(false);
      if (shuffledSections.length === 0) {
        const allSections = ['recent', 'featured', 'popular', 'recommended', 'luxury', 'affordable'];
        setShuffledSections([...allSections].sort(() => 0.5 - Math.random()));
      }
    } else if (!homeLoading) {
      setLoading(false);
    }
  }, [homeQueryData, homeLoading, shuffledSections.length]);

  /* ── Filter / search state ── */
  const [globalCategory, setGlobalCategory] = useState<'rent' | 'sale'>('rent');
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);

  /* ── Location ── */
  const { location } = useUserLocation();

  /* ── Property filter callback (shared with DynamicPropertySections) ── */
  const filterProperties = useCallback((list: any[]) => {
    return list.filter((p) => {
      if (p.category !== globalCategory && p.property_category !== globalCategory) return false;
      if (quickFilters.length > 0) {
        const lowerType = (p.house_type || '').toLowerCase();
        const bedCount = p.bedrooms || 0;
        return quickFilters.some((f) => {
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

  /* ── Data fetching is now handled by hooks ── */

  /* ── Fetch nearby when location resolves ── */
  useEffect(() => {
    if (!location) return;
    const fetchNearby = async () => {
      try {
        const response: any = await ApiService.properties.getNearby({
          lat: location.lat, lng: location.lng,
          city: location.city, state: location.state,
          address: location.address, limit: 10,
        });
        if (response && response.data) {
          setHomeData((prev: any) => ({
            ...prev,
            sections: { ...prev.sections, nearby: response.data },
          }));
        }
      } catch (err) {
        console.error('Failed to fetch nearby properties:', err);
      }
    };
    fetchNearby();
  }, [location]);

  /* ── Live search when quick-filters change ── */
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
        const houseTypes: string[] = [];
        let minBeds: number | null = null;
        quickFilters.forEach((f) => {
          if (f.includes('Bed')) {
            const val = parseInt(f);
            if (!isNaN(val)) minBeds = val;
          } else {
            houseTypes.push(f);
          }
        });
        if (houseTypes.length > 0) houseTypes.forEach((t) => query.append('house_type[]', t));
        if (minBeds !== null) query.append('bedrooms', String(minBeds));
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

  /* ── Prefetch category pages ── */
  useEffect(() => {
    ['/search?category=rent', '/search?category=sale', '/search?category=shortlet', '/search?category=sale&house_type[]=Land']
      .forEach((href) => router.prefetch(href));
  }, [router]);

  /* ── Scroll detection (hero collapse + sticky filter) ── */
  useEffect(() => {
    const NAVBAR_H = 72;
    const TRIGGER = 80;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > TRIGGER);
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        const isFilterTop = heroBottom < NAVBAR_H + 60;
        setFilterTop(isFilterTop);
        if (!isFilterTop) setIsStickyFilterExpanded(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box>
      {/* ══ HERO (carousel + sticky filter + content) ══ */}
      <HeroSection
        scrolled={scrolled}
        filterTop={filterTop}
        isStickyFilterExpanded={isStickyFilterExpanded}
        setIsStickyFilterExpanded={setIsStickyFilterExpanded}
        heroRef={heroRef}
        filterRef={filterRef}
      />

      {/* ══ CATEGORY CARDS: RENT | BUY | SHORTLET | LAND ══ */}
      <CategoryCardsSection homeData={homeData} loading={loading} />

      {/* ══ CITIES HORIZONTAL CAROUSEL ══ */}
      <CitiesCarousel popularCities={popularCities} />

      {/* ══ DYNAMIC PROPERTY SECTIONS ══ */}
      <DynamicPropertySections
        loading={loading}
        homeData={homeData}
        shuffledSections={shuffledSections}
        quickFilters={quickFilters}
        globalCategory={globalCategory}
        filterProperties={filterProperties}
        searching={searching}
        totalResults={totalResults}
        searchResults={searchResults}
      />

      {/* ══ POPULAR CITIES GRID ══ */}
      <PopularCitiesGrid
        popularCities={popularCities}
        visibleCitiesCount={visibleCitiesCount}
        setVisibleCitiesCount={setVisibleCitiesCount}
      />

      {/* ══ BLOG & NEWS ══ */}
      <BlogSection />

      {/* ══ HOW IT WORKS ══ */}
      <HowItWorksSection />

      {/* ══ MOBILE NAVIGATION ══ */}
      <MobileNav />
    </Box>
  );
}
