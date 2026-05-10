'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import PropertyCard from '../components/property/PropertyCard';
import PropertySkeleton from '../components/property/PropertySkeleton';
import MobileNav from '../components/layout/MobileNav';
import { useInfiniteProperties } from '../hooks/useInfiniteProperties';
import { SearchFilters } from '../components/search/SearchFilters';

export default function SearchResultsPage() {
    const [hasMounted, setHasMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setHasMounted(true);
    }, []);
    
    // ... rest of the states remain the same
    // Initial values from URL
    const initialQuery = searchParams?.get('q') || searchParams?.get('search') || '';
    const initialCity = searchParams?.get('city') || '';
    const initialCategoryParam = searchParams?.get('category') || 'rent';
    const initialTypes = Array.from(new Set([
        ...(searchParams?.getAll('house_type[]') || []),
        ...(searchParams?.get('house_type') ? [searchParams.get('house_type')!] : [])
    ]));
    
    // Applied Filter States
    const [appliedSearchQuery, setAppliedSearchQuery] = useState(initialQuery);
    const [appliedLocationQuery, setAppliedLocationQuery] = useState(initialCity);

    // Local Input States
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [locationQuery, setLocationQuery] = useState(initialCity);

    const [category, setCategory] = useState<'rent' | 'sale'>(
        (initialCategoryParam === 'sale' || initialTypes.includes('Land')) ? 'sale' : 'rent'
    );
    const [subCategory, setSubCategory] = useState(
        searchParams?.get('subcategory') || 
        (initialCategoryParam === 'shortlet' ? 'shortlet' : (initialTypes.includes('Land') ? 'land' : ''))
    );
    const [selectedTypes, setSelectedTypes] = useState<string[]>(initialTypes);
    const [priceRange, setPriceRange] = useState(searchParams?.get('price_range') || '');
    const [sortBy, setSortBy] = useState(searchParams?.get('sort') || 'newest');

    // Combined Search Params String for Hook
    const searchParamsString = useMemo(() => {
        const params = new URLSearchParams();
        if (appliedSearchQuery) params.set('search', appliedSearchQuery);
        if (appliedLocationQuery) params.set('city', appliedLocationQuery);
        params.set('category', subCategory === 'shortlet' ? 'shortlet' : category);
        
        // Collect all types into a set to avoid duplicates
        const allTypes = new Set(selectedTypes);
        if (subCategory === 'land') allTypes.add('Land');
        
        if (allTypes.size > 0) {
            allTypes.forEach(t => params.append('house_type[]', t));
        }
        if (priceRange) params.set('price_range', priceRange);
        params.set('sort', sortBy);
        return params.toString();
    }, [appliedSearchQuery, appliedLocationQuery, category, subCategory, selectedTypes, priceRange, sortBy]);

    const { 
        data, 
        isLoading, 
        isFetchingNextPage, 
        hasNextPage, 
        fetchNextPage,
        status 
    } = useInfiniteProperties(searchParamsString, { enabled: hasMounted });

    const properties = useMemo(() => {
        return data?.pages.flatMap(page => page.data) || [];
    }, [data]);

    const totalResults = data?.pages[0]?.total || 0;

    const handleSearchTrigger = useCallback(() => {
        setAppliedSearchQuery(searchQuery);
        setAppliedLocationQuery(locationQuery);
    }, [searchQuery, locationQuery]);

    const handleCategoryChange = useCallback((newCat: 'rent' | 'sale') => {
        setCategory(newCat);
        setSubCategory('');
        router.prefetch(`/search?category=${newCat}`);
    }, [router]);

    const resetFilters = useCallback(() => {
        setSearchQuery('');
        setLocationQuery('');
        setAppliedSearchQuery('');
        setAppliedLocationQuery('');
        setSelectedTypes([]);
        setPriceRange('');
        setSubCategory('');
    }, []);

    // Sync State -> URL
    useEffect(() => {
        const url = `/search?${searchParamsString}`;
        window.history.replaceState({ ...window.history.state, as: url, url }, '', url);
    }, [searchParamsString]);

    // Intersection Observer for Infinite Scroll
    const observerTarget = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const target = observerTarget.current;
        if (!target) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1, rootMargin: '400px' }
        );
        observer.observe(target);
        return () => { if (target) observer.unobserve(target); };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Sticky Header Logic
    const [isSticky, setIsSticky] = useState(false);
    const [filtersExpanded, setFiltersExpanded] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsSticky(currentScrollY > 400);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const subCategories = useMemo(() => {
        if (category === 'rent') return [{ id: '', label: 'Rent' }, { id: 'shortlet', label: 'Shortlet' }];
        return [{ id: '', label: 'Developed' }, { id: 'land', label: 'Land' }];
    }, [category]);

    if (!hasMounted) return null;

    return (
        <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', pb: { xs: 6, md: 2 } }}>
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

            <SearchFilters 
                isSticky={isSticky}
                filtersExpanded={filtersExpanded}
                setFiltersExpanded={setFiltersExpanded}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                locationQuery={locationQuery}
                setLocationQuery={setLocationQuery}
                handleSearchTrigger={handleSearchTrigger}
                category={category}
                handleCategoryChange={handleCategoryChange}
                subCategory={subCategory}
                setSubCategory={setSubCategory}
                subCategories={subCategories}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                resetFilters={resetFilters}
            />

            <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, md: 6, lg: 8 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="body1" fontWeight={700}>
                        {isLoading ? 'Finding properties...' : `${totalResults} listings found`}
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

                {isLoading ? (
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <Grid key={i} size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                                <PropertySkeleton />
                            </Grid>
                        ))}
                    </Grid>
                ) : properties.length === 0 ? (
                    <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '32px', bgcolor: 'white', border: '1px solid', borderColor: 'grey.100' }}>
                        <HomeOutlinedIcon sx={{ fontSize: 64, color: 'grey.200', mb: 2 }} />
                        <Typography variant="h5" fontWeight={800} gutterBottom>No listings found</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>We couldn't find any properties matching your criteria.</Typography>
                        <Button variant="contained" size="large" onClick={resetFilters} sx={{ borderRadius: '12px', px: 4 }}>Clear All Filters</Button>
                    </Paper>
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {properties.map((property, idx) => (
                                <Grid key={`${property.id}-${idx}`} size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                                    <PropertyCard property={property} compact />
                                </Grid>
                            ))}
                        </Grid>
                        
                        <Box ref={observerTarget} sx={{ height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {isFetchingNextPage && <CircularProgress size={24} />}
                        </Box>
                    </>
                )}
            </Container>

            <MobileNav />
        </Box>
    );
}
