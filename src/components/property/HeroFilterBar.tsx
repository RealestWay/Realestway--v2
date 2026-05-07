'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import { PROPERTY_TYPES, PRICE_RANGES } from '../../data/mockData';

interface HeroFilterBarProps {
  compact?: boolean;
  initialValues?: {
    location?: string;
    type?: string | string[];
    priceRange?: string;
    category?: 'rent' | 'sale';
  };
  onSearch?: (values: { location: string; type: string | string[]; priceRange: string; category: 'rent' | 'sale' }) => void;
}

export default function HeroFilterBar({ compact = false, initialValues = {}, onSearch }: HeroFilterBarProps) {
  const router = useRouter();
  const [tab, setTab] = useState<'Rent' | 'Buy'>(initialValues.category === 'sale' ? 'Buy' : 'Rent');
  const [location, setLocation] = useState(initialValues.location || '');
  const [propType, setPropType] = useState<string | string[]>(initialValues.type || '');
  const [priceRange, setPriceRange] = useState(initialValues.priceRange || '');

  const handleSearch = () => {
    const category = tab === 'Buy' ? 'sale' : 'rent';
    if (onSearch) {
      onSearch({ location, type: propType, priceRange, category });
    } else {
      const p = new URLSearchParams();
      p.set('category', category);
      if (location) p.set('city', location);
      
      if (propType) {
        if (Array.isArray(propType)) {
          propType.forEach(t => p.append('house_type[]', t));
        } else {
          p.set('house_type', propType);
        }
      }
      
      if (priceRange) p.set('priceRange', priceRange);
      router.push(`/search?${p.toString()}`);
    }
  };

  /* ── COMPACT variant (sticky bar after scroll) ── */
  if (compact) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          width: '100%',
        }}
      >
        {/* Rent / Buy tabs */}
        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          {(['Rent', 'Buy'] as const).map((t) => (
            <Button
              key={t}
              onClick={() => setTab(t)}
              size="small"
              sx={{
                minWidth: 64,
                borderRadius: '7px',
                px: 2,
                py: 0.6,
                fontWeight: 600,
                fontSize: '0.82rem',
                bgcolor: tab === t ? 'primary.main' : 'transparent',
                color:   tab === t ? 'white'         : 'text.secondary',
                border:  tab === t ? 'none'          : '1.5px solid',
                borderColor: 'divider',
                '&:hover': { bgcolor: tab === t ? 'primary.dark' : 'grey.100' },
              }}
            >
              {t}
            </Button>
          ))}
        </Box>

        {/* Location */}
        <TextField
          size="small"
          placeholder="Insert location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          sx={{ flex: 1, minWidth: 120 }}
          InputProps={{
            sx: { borderRadius: '8px', fontSize: '0.82rem' },
          }}
        />

        {/* Property type */}
        <FormControl size="small" sx={{ flex: 1, minWidth: 140 }}>
          <Select
            multiple
            value={Array.isArray(propType) ? propType : propType ? [propType] : []}
            onChange={(e) => setPropType(e.target.value as string[])}
            displayEmpty
            renderValue={(selected) => {
              if (selected.length === 0) return <em style={{ fontStyle: 'normal', color: '#9e9e9e' }}>Type (Select Multiple)</em>;
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Box 
                      key={value} 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        borderRadius: '4px', 
                        px: 0.8, 
                        py: 0.2, 
                        fontSize: '0.65rem',
                        fontWeight: 600
                      }}
                    >
                      {value}
                    </Box>
                  ))}
                </Box>
              );
            }}
            sx={{ borderRadius: '8px', fontSize: '0.82rem' }}
          >
            {PROPERTY_TYPES.map((t) => <MenuItem key={t} value={t} sx={{ fontSize: '0.85rem' }}>{t}</MenuItem>)}
          </Select>
        </FormControl>

        {/* Price range */}
        <FormControl size="small" sx={{ flex: 1.2, minWidth: 130 }}>
          <Select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            displayEmpty
            sx={{ borderRadius: '8px', fontSize: '0.82rem' }}
          >
            <MenuItem value=""><em style={{ fontStyle: 'normal', color: '#9e9e9e' }}>Price Range (₦)</em></MenuItem>
            {PRICE_RANGES.map((r) => <MenuItem key={r.label} value={r.label}>{r.label}</MenuItem>)}
          </Select>
        </FormControl>

        {/* Search */}
        <Button
          variant="contained"
          size="small"
          onClick={handleSearch}
          startIcon={<SearchIcon sx={{ fontSize: '16px !important' }} />}
          sx={{
            borderRadius: '8px',
            bgcolor: 'primary.main',
            fontWeight: 700,
            px: 2.5,
            py: 0.9,
            flexShrink: 0,
            '&:hover': { bgcolor: 'primary.dark' },
            boxShadow: '0 3px 14px rgba(0,162,86,0.32)',
          }}
        >
          Search
        </Button>
      </Box>
    );
  }

  /* ── FULL variant (inside hero) ── */
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: { xs: 3, md: '16px' },
        bgcolor: '#ffffff',
        boxShadow: '0 8px 48px rgba(0,0,0,0.22)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: 920,
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          pt: 2,
          pb: 0,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          {(['Rent', 'Buy'] as const).map((t) => (
            <Button
              key={t}
              onClick={() => setTab(t)}
              disableElevation
              sx={{
                minWidth: 72,
                borderRadius: '8px',
                px: 2.5,
                py: 0.75,
                fontWeight: 700,
                fontSize: '0.9rem',
                bgcolor:     tab === t ? 'primary.main' : 'transparent',
                color:       tab === t ? 'white'         : 'text.secondary',
                border:      tab === t ? 'none'          : '1.5px solid',
                borderColor: tab !== t ? '#e0e0e0'       : 'none',
                '&:hover': { bgcolor: tab === t ? 'primary.dark' : 'grey.100' },
                transition: 'all 0.18s ease',
              }}
            >
              {t}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
          <img src="/reviewer.png" alt="reviewers" style={{ height: 40, borderRadius: 4 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ color: '#f59e0b', fontSize: 14, lineHeight: 1 }}>★</Box>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'text.primary' }}>4.5</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>(20 Review)</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mx: 2, mt: 1.5 }} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          gap: { xs: 2, md: 0 },
          px: 2,
          py: 2,
        }}
      >
        <Box sx={{ flex: 1.4, pr: { md: 2 } }}>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary', mb: 0.5, letterSpacing: '.03em' }}>
            Location
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Insert location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            InputProps={{
              sx: { borderRadius: '8px', fontSize: '0.875rem', '& fieldset': { borderColor: '#e0e0e0' } },
            }}
          />
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'block' }, width: '1px', bgcolor: '#e8e8e8', alignSelf: 'stretch', my: 0.5 }} />

        <Box sx={{ flex: 1.2, px: { md: 2 } }}>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary', mb: 0.5, letterSpacing: '.03em' }}>
            Property Type (Select Multiple)
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              multiple
              value={Array.isArray(propType) ? propType : propType ? [propType] : []}
              onChange={(e) => setPropType(e.target.value as string[])}
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) return <em style={{ fontStyle: 'normal', color: '#9e9e9e' }}>Any Type</em>;
                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Box 
                        key={value} 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          borderRadius: '4px', 
                          px: 1, 
                          py: 0.3, 
                          fontSize: '0.72rem',
                          fontWeight: 600
                        }}
                      >
                        {value}
                      </Box>
                    ))}
                  </Box>
                );
              }}
              sx={{ borderRadius: '8px', fontSize: '0.875rem', '& fieldset': { borderColor: '#e0e0e0' } }}
            >
              {PROPERTY_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'block' }, width: '1px', bgcolor: '#e8e8e8', alignSelf: 'stretch', my: 0.5 }} />

        <Box sx={{ flex: 1.4, px: { md: 2 } }}>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary', mb: 0.5, letterSpacing: '.03em' }}>
            Price Range (₦)
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              displayEmpty
              sx={{ borderRadius: '8px', fontSize: '0.875rem', '& fieldset': { borderColor: '#e0e0e0' } }}
            >
              <MenuItem value=""><em style={{ fontStyle: 'normal', color: '#9e9e9e' }}>Any Price</em></MenuItem>
              {PRICE_RANGES.map((r) => <MenuItem key={r.label} value={r.label}>{r.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ pl: { md: 1.5 }, display: 'flex', alignItems: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            sx={{
              borderRadius: '10px',
              bgcolor: 'primary.main',
              fontWeight: 700,
              fontSize: '0.95rem',
              px: 3.5,
              py: 1.15,
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.02)' },
              boxShadow: '0 4px 18px rgba(0,162,86,0.38)',
              transition: 'all 0.2s ease',
            }}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
