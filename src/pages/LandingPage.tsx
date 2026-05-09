'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import ApiService from '@/src/services/api';
import { useUserLocation } from '../hooks/useUserLocation';
import { useAuth } from '../context/AuthContext';
import MobileNav from '../components/layout/MobileNav';

/* ── Section components ── */
import HeroSection from '../components/home/HeroSection';
import CategoryCardsSection from '../components/home/CategoryCardsSection';
import CitiesCarousel from '../components/home/CitiesCarousel';
import DynamicPropertySections from '../components/home/DynamicPropertySections';
import PopularCitiesGrid from '../components/home/PopularCitiesGrid';
import BlogSection from '../components/home/BlogSection';
import HowItWorksSection from '../components/home/HowItWorksSection';

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

  /* ── Home data state ── */
  const [homeData, setHomeData] = useState<any>({
    sections: {
      recent: [], featured: [], hot_deals: [],
      popular: [], shortlet: [], land: [], rent: [], buy: [],
    },
    counts: { rent: 0, sale: 0, shortlet: 0, land: 0 },
    avg_prices: { rent: 0, sale: 0, shortlet: 0, land: 0 },
  });
  const [popularCities, setPopularCities] = useState<{ name: string; count: number; emoji: string }[]>([]);
  const [visibleCitiesCount, setVisibleCitiesCount] = useState(12);
  const [shuffledSections, setShuffledSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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

  /* ── Load cached home data immediately ── */
  useEffect(() => {
    try {
      const cachedData = localStorage.getItem('home_properties');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setHomeData(parsed);
        setLoading(false);
        const allSections = ['recent', 'featured', 'popular', 'recommended', 'luxury', 'affordable'];
        setShuffledSections([...allSections].sort(() => 0.5 - Math.random()));
      }
    } catch (e) {
      console.error('Failed to load home cache', e);
    }
  }, []);

  /* ── Fetch home data + cities ── */
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response: any = await ApiService.properties.getHome();
        if (response) {
          setHomeData(response);
          localStorage.setItem('home_properties', JSON.stringify(response));
          const allSections = ['recent', 'featured', 'popular', 'recommended', 'luxury', 'affordable'];
          setShuffledSections([...allSections].sort(() => 0.5 - Math.random()));
        }
      } catch (err) {
        console.error('Failed to fetch home properties:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCities = async () => {
      try {
        const cachedCities = localStorage.getItem('available_cities');
        if (cachedCities) setPopularCities(JSON.parse(cachedCities));
        const response: any = await ApiService.properties.getCities();
        if (response && response.data) {
          const mapped = response.data.map((c: any, i: number) => ({
            name: c.name,
            count: c.count,
            emoji: ['🏙️', '🏛️', '⚓', '🏘️', '🌆', '🌿'][i % 6],
          }));
          setPopularCities(mapped);
          localStorage.setItem('available_cities', JSON.stringify(mapped));
        }
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      }
    };

    fetchHomeData();
    fetchCities();
  }, []);

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
