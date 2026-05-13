'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import ApiService from '@/src/services/api';
import { useUserLocation } from '../hooks/useUserLocation';
import { useAuth } from '../context/AuthContext';
import MobileNav from '../components/layout/MobileNav';

import CitiesCarousel from '../components/home/CitiesCarousel';
import DynamicPropertySections from '../components/home/DynamicPropertySections';
import PopularCitiesGrid from '../components/home/PopularCitiesGrid';
import BlogSection from '../components/home/BlogSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import HeroSection from '../components/home/HeroSection';
import CategoryCardsSection from '../components/home/CategoryCardsSection';
import { useHomeData, useCities } from '../hooks/useHomeData';
import Skeleton from '@mui/material/Skeleton';

/* ══════════════════════════════════════════
   MAIN LANDING PAGE
   — Owns all state & data-fetching.
   — Composes modular section components.
══════════════════════════════════════════ */
export default function LandingPage({ 
  initialHomeData, 
  initialCitiesData 
}: { 
  initialHomeData?: any; 
  initialCitiesData?: any[]; 
}) {
  const router = useRouter();
  const { user } = useAuth();

  /* ── Scroll / hero state ── */
  const [scrolled, setScrolled] = useState(false);
  const [isStickyFilterExpanded, setIsStickyFilterExpanded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const [filterTop, setFilterTop] = useState(0);

  /* ── Data Fetching ── */
  const { data: homeQueryData, isLoading: homeLoading } = useHomeData(initialHomeData);
  const { data: popularCities = (initialCitiesData || []) } = useCities(initialCitiesData);

  const [homeData, setHomeData] = useState<any>({
    sections: initialHomeData?.sections || {
      recent: [], featured: [], hot_deals: [],
      popular: [], shortlet: [], land: [], rent: [], buy: [],
    },
    counts: initialHomeData?.counts || { rent: 0, sale: 0, shortlet: 0, land: 0 },
    avg_prices: initialHomeData?.avg_prices || { rent: 0, sale: 0, shortlet: 0, land: 0 },
    previews: initialHomeData?.previews || { rent: [], buy: [], shortlet: [], land: [] },
  });
  
  const [visibleCitiesCount, setVisibleCitiesCount] = useState(12);
  
  // Initialize shuffled sections with a stable order first (to prevent hydration mismatch)
  const [shuffledSections, setShuffledSections] = useState<string[]>(['recent', 'featured', 'popular', 'recommended', 'luxury', 'affordable']);
  const [loading, setLoading] = useState(!initialHomeData);

  // Sync query data to local state for internal filtering/shuffling
  useEffect(() => {
    const data = homeQueryData || initialHomeData;
    if (data) {
      // Smart Fallback: If 'previews' is missing (old backend), extract them from sections
      const processedData = { ...data };
      if (!processedData.previews || Object.keys(processedData.previews).length === 0) {
        processedData.previews = {
          rent: (data.sections?.rent || []).slice(0, 4).map((p: any) => p.media?.[0]?.file_url || p.media_urls?.[0]),
          buy: (data.sections?.buy || []).slice(0, 4).map((p: any) => p.media?.[0]?.file_url || p.media_urls?.[0]),
          shortlet: (data.sections?.shortlet || []).slice(0, 4).map((p: any) => p.media?.[0]?.file_url || p.media_urls?.[0]),
          land: (data.sections?.land || []).slice(0, 4).map((p: any) => p.media?.[0]?.file_url || p.media_urls?.[0]),
        };
      }
      
      setHomeData(processedData);
      setLoading(false);
      
      // Shuffle only on the client to keep it hydration-safe
      const allSections = ['recent', 'featured', 'popular', 'recommended', 'luxury', 'affordable'];
      setShuffledSections([...allSections].sort(() => 0.5 - Math.random()));
    } else if (!homeLoading) {
      setLoading(false);
    }
  }, [homeQueryData, homeLoading, initialHomeData]);

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
