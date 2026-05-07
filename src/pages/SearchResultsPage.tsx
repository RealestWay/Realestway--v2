'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';

import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TuneIcon from '@mui/icons-material/Tune';

import PropertyCard from '../components/property/PropertyCard';
import PropertySkeleton from '../components/property/PropertySkeleton';
import MobileNav from '../components/layout/MobileNav';
import { PROPERTY_TYPES, PRICE_RANGES, formatPrice } from '../data/mockData';
import { usePropertiesCache } from '../hooks/usePropertiesCache';
import { useAuth } from '../context/AuthContext';

export default function SearchResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initial values from URL
  const initialQuery = searchParams?.get('q') || '';
  const initialCity = searchParams?.get('city') || '';
  const initialCategoryParam = searchParams?.get('category') || 'rent';
  const initialTypes = searchParams?.getAll('house_type[]') || [];
  
  // Logic to determine subcategory from URL
  let initialSubCategory = searchParams?.get('subcategory') || '';
  if (!initialSubCategory) {
    if (initialCategoryParam === 'shortlet') initialSubCategory = 'shortlet';
    else if (initialTypes.includes('Land')) initialSubCategory = 'land';
  }

  // Applied Filter States (These trigger the actual fetch)
  const [appliedSearchQuery, setAppliedSearchQuery] = useState(initialQuery);
  const [appliedLocationQuery, setAppliedLocationQuery] = useState(initialCity);

  // Local Input States (For fluid typing)
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [locationQuery, setLocationQuery] = useState(initialCity);

  const [category, setCategory] = useState<'rent' | 'sale'>(
    (initialCategoryParam === 'sale' || initialTypes.includes('Land')) ? 'sale' : 'rent'
  );
  const [subCategory, setSubCategory] = useState(initialSubCategory);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialTypes);
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Logic for Subcategories
  const subCategories = useMemo(() => {
    if (category === 'rent') return [{ id: '', label: 'Rent' }, { id: 'shortlet', label: 'Shortlet' }];
    return [{ id: '', label: 'Developed' }, { id: 'land', label: 'Land' }];
  }, [category]);

  // Combined Search Params String for Hook
  const searchParamsString = useMemo(() => {
    const params = new URLSearchParams();
    if (appliedSearchQuery) params.set('search', appliedSearchQuery);
    if (appliedLocationQuery) params.set('city', appliedLocationQuery);
    params.set('category', subCategory === 'shortlet' ? 'shortlet' : category);
    if (subCategory === 'land') params.set('house_type[]', 'Land');
    if (selectedTypes.length > 0) {
      selectedTypes.forEach(t => params.append('house_type[]', t));
    }
    if (priceRange) params.set('price_range', priceRange);
    params.set('sort', sortBy);
    return params.toString();
  }, [appliedSearchQuery, appliedLocationQuery, category, subCategory, selectedTypes, priceRange, sortBy]);

  const handleSearchTrigger = () => {
    setAppliedSearchQuery(searchQuery);
    setAppliedLocationQuery(locationQuery);
  };

  const { displayedProperties, loading, hasMore, loadNextBatch } = usePropertiesCache(searchParamsString);

  // 1. Sync URL -> State (Handles back button and external links)
  useEffect(() => {
    if (!searchParams) return;
    const q = searchParams.get('q') || searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    const catParam = searchParams.get('category') || 'rent';
    const subCatParam = searchParams.get('subcategory') || '';
    const typesParam = searchParams.getAll('house_type[]');

    if (q) setSearchQuery(q);
    if (city) setLocationQuery(city);
    
    if (catParam === 'sale') setCategory('sale');
    else if (catParam === 'rent' || catParam === 'shortlet') setCategory('rent');

    if (catParam === 'shortlet') setSubCategory('shortlet');
    else if (subCatParam) setSubCategory(subCatParam);
    else if (typesParam.includes('Land')) setSubCategory('land');
    else setSubCategory('');

    if (typesParam.length > 0) setSelectedTypes(typesParam);
  }, [searchParams]);

  // 2. Sync State -> URL (Updates address bar as user filters)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const url = `/search?${searchParamsString}`;
      window.history.replaceState({ ...window.history.state, as: url, url }, '', url);
    }, 400); // Debounce URL update
    return () => clearTimeout(timeout);
  }, [searchParamsString]);

  // Proactive batching: fetch next batch before scroll reaches bottom
  const observerTarget = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadNextBatch(false);
        }
      },
      { threshold: 0.1, rootMargin: '400px' } // Fetch 400px before bottom
    );
    observer.observe(target);
    return () => { if (target) observer.unobserve(target); };
  }, [loadNextBatch, hasMore, loading]);

  // Handle Category Toggle
  const handleCategoryChange = (newCat: 'rent' | 'sale') => {
    setCategory(newCat);
    setSubCategory('');
    // Background prefetch for both subcategories
    router.prefetch(`/search?category=${newCat}`);
    router.prefetch(`/search?category=${newCat}&subcategory=${newCat === 'rent' ? 'shortlet' : 'land'}`);
  };

  // Sticky Header Logic
  const [isSticky, setIsSticky] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsSticky((prevSticky) => {
        // Use a wide hysteresis gap (400 on, 200 off) to prevent layout shift flickering
        if (!prevSticky && currentScrollY > 400) {
          return true;
        }
        if (prevSticky && currentScrollY < 200) {
          // Wrap in a microtask to avoid React warning during render phase
          setTimeout(() => setFiltersExpanded(true), 0);
          return false;
        }
        return prevSticky;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', pb: { xs: 6, md: 2 } }}>
      
      {/* ══ NON-STICKY TITLE SECTION ══ */}
      <Box sx={{ pt: { xs: 4, md: 4 }, pb: { xs: 2, md: 3 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 900, 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'text.primary',
              mb: 2
            }}
          >
            Find Homes That <Box component="span" sx={{ color: 'primary.main' }}>Truly Fit You</Box>
          </Typography>
          
        </Container>
      </Box>

      {/* ══ STICKY SEARCH SECTION ══ */}
      <Box 
        ref={stickyRef}
        sx={{ 
          position: 'sticky', 
          top: { xs: 54, sm: 62, md: 0 }, 
          zIndex: 1100, 
          bgcolor: 'white', 
          borderBottom: '1px solid', 
          borderColor: 'grey.100',
          boxShadow: isSticky ? '0 10px 30px rgba(0,0,0,0.05)' : 'none',
          pt: isSticky ? 0 : 1,
          pb: 2,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 6, lg: 8 } }}>
          {/* Rent | Buy Tabs & Filter Toggle */}
          <Box sx={{ display: 'flex', width: '100%', mb: 2, borderBottom: '1px solid', borderColor: 'grey.100', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flex: 1 }}>
              {[
                { id: 'rent', label: 'Rent' },
                { id: 'sale', label: 'Buy' }
              ].map((cat) => (
                <Box
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id as 'rent' | 'sale')}
                  sx={{
                    flex: 1,
                    textAlign: 'center',
                    pb: 1.5,
                    cursor: 'pointer',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -1,
                      left: 0,
                      right: 0,
                      height: 3,
                      bgcolor: category === cat.id ? 'primary.main' : 'transparent',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }
                  }}
                >
                  <Typography 
                    sx={{ 
                      fontWeight: 800, 
                      color: category === cat.id ? '#000000' : 'text.secondary',
                      fontSize: '1.125rem',
                      transition: 'color 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {cat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            {/* Mobile Filter Toggle Button */}
            {isSticky && (
              <Button
                size="small"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                endIcon={<TuneIcon sx={{ transform: filtersExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />}
                sx={{ 
                  ml: 2,
                  mb: 1.5,
                  fontWeight: 700,
                  color: filtersExpanded ? 'primary.main' : 'text.secondary',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  bgcolor: filtersExpanded ? 'primary.50' : 'transparent',
                  borderRadius: '100px',
                  px: 2,
                  py: 0.5
                }}
              >
                {filtersExpanded ? 'Hide Filters' : 'Filters'}
              </Button>
            )}
          </Box>

          <Grid container spacing={2} alignItems="center">
            {/* Search Input + Button Row (Hidden on sticky) */}
            {!isSticky && (
              <Grid size={12}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  bgcolor: 'white',
                  p: 0.8,
                  borderRadius: { xs: '16px', md: '100px' },
                  border: '1px solid',
                  borderColor: 'grey.200',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  alignItems: 'center',
                  mb: 2
                }}>
                  {/* Keyword Search */}
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
                    <InputAdornment position="start" sx={{ ml: 2 }}>
                      <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Search properties (e.g. 3 bedroom flat)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchTrigger()}
                      InputProps={{
                        disableUnderline: true,
                        sx: { 
                          px: 1,
                          py: 0.5,
                          fontSize: '0.95rem',
                          fontWeight: 500
                        }
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    onClick={handleSearchTrigger}
                    sx={{
                      borderRadius: '100px',
                      px: 4,
                      py: { xs: 1.2, md: 1.5 },
                      minWidth: { md: 140 },
                      fontWeight: 800,
                      textTransform: 'none',
                      bgcolor: 'primary.main',
                      boxShadow: '0 4px 14px rgba(0,162,86,0.2)',
                      '&:hover': { bgcolor: 'primary.dark' },
                      width: { xs: '100%', md: 'auto' }
                    }}
                  >
                    Search
                  </Button>
                </Box>
              </Grid>
            )}

            {/* ══ COLLAPSIBLE FILTER SECTION ══ */}
            <Grid size={12}>
              <Collapse in={filtersExpanded} timeout="auto" unmountOnExit={false}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pb: (isSticky && !filtersExpanded) ? 0 : 1 }}>
                  
                  {/* Subcategory Switcher */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    bgcolor: 'grey.50', 
                    p: 0.5, 
                    borderRadius: '16px',
                    width: 'fit-content',
                    border: '1px solid',
                    borderColor: 'grey.100'
                  }}>
                    {subCategories.map((sub) => (
                      <Button
                        key={sub.id}
                        size="small"
                        onClick={() => setSubCategory(sub.id)}
                        sx={{
                          borderRadius: '12px',
                          px: 3,
                          py: 0.8,
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          bgcolor: subCategory === sub.id ? 'white' : 'transparent',
                          color: subCategory === sub.id ? 'primary.main' : 'text.secondary',
                          boxShadow: subCategory === sub.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                          '&:hover': {
                            bgcolor: subCategory === sub.id ? 'white' : 'grey.100',
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {sub.label}
                      </Button>
                    ))}
                  </Box>

                  {/* Filter Row: Location, Types & Budget */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1.5, 
                    alignItems: 'center',
                    flexWrap: { xs: 'wrap', md: 'nowrap' }
                  }}>
                    {/* Location Input */}
                    <TextField
                      size="small"
                      placeholder="Location (city, state)..."
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchTrigger()}
                      sx={{ flex: { xs: '1 1 100%', md: '0 1 240px' }, minWidth: { md: 200 } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={handleSearchTrigger} sx={{ color: 'primary.main' }}>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: { 
                          borderRadius: '14px', 
                          bgcolor: 'grey.50',
                          '& fieldset': { borderColor: 'grey.200' },
                          '&:hover fieldset': { borderColor: 'primary.main' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' }
                        }
                      }}
                    />

                    <FormControl size="small" sx={{ flex: { xs: '1 1 calc(50% - 12px)', md: '0 1 180px' }, minWidth: { md: 160 } }}>
                      <Select
                        multiple
                        value={selectedTypes}
                        onChange={(e) => setSelectedTypes(e.target.value as string[])}
                        displayEmpty
                        renderValue={(selected) => {
                          if (selected.length === 0) return <Typography variant="body2" color="text.secondary" fontWeight={600}>Types</Typography>;
                          return <Typography variant="body2" fontWeight={700}>{selected.length} Selected</Typography>;
                        }}
                        sx={{ 
                          borderRadius: '14px', 
                          bgcolor: 'grey.50',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.200' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
                        }}
                      >
                        {PROPERTY_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ flex: { xs: '1 1 calc(50% - 12px)', md: '0 1 180px' }, minWidth: { md: 160 } }}>
                      <Select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        displayEmpty
                        sx={{ 
                          borderRadius: '14px', 
                          bgcolor: 'grey.50',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.200' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
                        }}
                        renderValue={(val) => {
                          if (!val) return <Typography variant="body2" color="text.secondary" fontWeight={600}>Budget</Typography>;
                          return <Typography variant="body2" fontWeight={700}>{val}</Typography>;
                        }}
                      >
                        <MenuItem value="">Any Budget</MenuItem>
                        {PRICE_RANGES.map((r) => <MenuItem key={r.label} value={r.label}>{r.label}</MenuItem>)}
                      </Select>
                    </FormControl>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'block' } }} />
                    
                    <Button 
                      size="small" 
                      onClick={() => { 
                        setSearchQuery(''); 
                        setLocationQuery(''); 
                        setAppliedSearchQuery('');
                        setAppliedLocationQuery('');
                        setSelectedTypes([]); 
                        setPriceRange(''); 
                        setSubCategory(''); 
                      }}
                      sx={{ 
                        color: 'error.main', 
                        fontWeight: 700, 
                        textTransform: 'none', 
                        px: 2,
                        borderRadius: '10px',
                        width: { xs: '100%', md: 'auto' },
                        border: { xs: '1px solid', md: 'none' },
                        borderColor: 'error.light',
                        '&:hover': { 
                          bgcolor: 'error.50',
                          color: 'error.dark'
                        } 
                      }}
                    >
                      Reset All Filters
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ══ MAIN CONTENT ══ */}
      <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, md: 6, lg: 8 } }}>
        
        {/* Results Info & Sort */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="body1" fontWeight={700}>
            {loading && displayedProperties.length === 0 ? 'Finding properties...' : `${displayedProperties.length} listings found`}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>Sort by:</Typography>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="small"
              variant="standard"
              disableUnderline
              sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'primary.main' }}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Property Grid */}
        {loading && displayedProperties.length === 0 ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                <PropertySkeleton />
              </Grid>
            ))}
          </Grid>
        ) : displayedProperties.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '32px', bgcolor: 'white', border: '1px solid', borderColor: 'grey.100' }}>
            <HomeOutlinedIcon sx={{ fontSize: 64, color: 'grey.200', mb: 2 }} />
            <Typography variant="h5" fontWeight={800} gutterBottom>No listings found</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>We couldn't find any properties matching your criteria.</Typography>
            <Button variant="contained" size="large" onClick={() => { setSearchQuery(''); setSelectedTypes([]); setPriceRange(''); }} sx={{ borderRadius: '12px', px: 4 }}>Clear All Filters</Button>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {displayedProperties.map((property, idx) => (
                <Grid key={`${property.id}-${idx}`} size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                  <PropertyCard property={property} compact />
                </Grid>
              ))}
            </Grid>
            
            {/* Next Batch Loading Indicator */}
            <div ref={observerTarget} style={{ height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {loading && hasMore && <CircularProgress size={24} />}
            </div>
          </>
        )}
      </Container>

      {/* ══ MOBILE NAVIGATION ══ */}
      <MobileNav />

    </Box>
  );
}
