'use client';

import React from 'react';
import { 
    Box, 
    Grid, 
    TextField, 
    InputAdornment, 
    IconButton, 
    FormControl, 
    Select, 
    MenuItem, 
    Typography, 
    Button, 
    Collapse 
} from '@mui/material';
import { 
    Search as SearchIcon, 
    LocationOn as LocationOnIcon, 
    Tune as TuneIcon 
} from '@mui/icons-material';
import { PROPERTY_TYPES, PRICE_RANGES } from '../../data/mockData';

interface SearchFiltersProps {
    isSticky: boolean;
    filtersExpanded: boolean;
    setFiltersExpanded: (val: boolean) => void;
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    locationQuery: string;
    setLocationQuery: (val: string) => void;
    handleSearchTrigger: () => void;
    category: 'rent' | 'sale';
    handleCategoryChange: (cat: 'rent' | 'sale') => void;
    subCategory: string;
    setSubCategory: (val: string) => void;
    subCategories: { id: string, label: string }[];
    selectedTypes: string[];
    setSelectedTypes: (val: string[]) => void;
    priceRange: string;
    setPriceRange: (val: string) => void;
    resetFilters: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = (props) => {
    const {
        isSticky,
        filtersExpanded,
        setFiltersExpanded,
        searchQuery,
        setSearchQuery,
        locationQuery,
        setLocationQuery,
        handleSearchTrigger,
        category,
        handleCategoryChange,
        subCategory,
        setSubCategory,
        subCategories,
        selectedTypes,
        setSelectedTypes,
        priceRange,
        setPriceRange,
        resetFilters
    } = props;

    return (
        <Box 
            sx={{ 
                position: 'sticky', 
                top: 0, 
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
            <Box sx={{ px: { xs: 2, md: 6, lg: 8 } }}>
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
                                            sx: { px: 1, py: 0.5, fontSize: '0.95rem', fontWeight: 500 }
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

                    <Grid size={12}>
                        <Collapse in={filtersExpanded} timeout="auto" unmountOnExit={false}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pb: (isSticky && !filtersExpanded) ? 0 : 1 }}>
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
                                                '&:hover': { bgcolor: subCategory === sub.id ? 'white' : 'grey.100' },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {sub.label}
                                        </Button>
                                    ))}
                                </Box>

                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 1.5, 
                                    alignItems: 'center',
                                    flexWrap: { xs: 'wrap', md: 'nowrap' }
                                }}>
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
                                            sx={{ borderRadius: '14px', bgcolor: 'grey.50' }}
                                        >
                                            {PROPERTY_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                        </Select>
                                    </FormControl>

                                    <FormControl size="small" sx={{ flex: { xs: '1 1 calc(50% - 12px)', md: '0 1 180px' }, minWidth: { md: 160 } }}>
                                        <Select
                                            value={priceRange}
                                            onChange={(e) => setPriceRange(e.target.value)}
                                            displayEmpty
                                            sx={{ borderRadius: '14px', bgcolor: 'grey.50' }}
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
                                        onClick={resetFilters}
                                        sx={{ 
                                            color: 'error.main', 
                                            fontWeight: 700, 
                                            textTransform: 'none', 
                                            px: 2,
                                            borderRadius: '10px',
                                            width: { xs: '100%', md: 'auto' },
                                            '&:hover': { bgcolor: 'error.50' } 
                                        }}
                                    >
                                        Reset All Filters
                                    </Button>
                                </Box>
                            </Box>
                        </Collapse>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};
