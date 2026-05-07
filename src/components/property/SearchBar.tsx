import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TuneIcon from '@mui/icons-material/Tune';
import HistoryIcon from '@mui/icons-material/History';
import { NIGERIAN_CITIES, NIGERIAN_STATES, PROPERTY_TYPES, PRICE_RANGES } from '../../data/mockData';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  initialValues?: {
    query?: string;
    city?: string;
    category?: string;
    type?: string;
    priceRange?: string;
  };
  searchHistory?: string[];
  onSearch?: (params: Record<string, string>) => void;
}

export default function SearchBar({
  variant = 'hero',
  initialValues = {},
  searchHistory = ['Lekki Apartments', '2 Bedroom Abuja', 'Houses under 3M'],
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValues.query ?? '');
  const [city, setCity] = useState(initialValues.city ?? '');
  const [category, setCategory] = useState(initialValues.category ?? '');
  const [propType, setPropType] = useState(initialValues.type ?? '');
  const [priceRange, setPriceRange] = useState(initialValues.priceRange ?? '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (city) params.city = city;
    if (category) params.category = category;
    if (propType) params.type = propType;
    if (priceRange) params.priceRange = priceRange;

    if (onSearch) {
      onSearch(params);
    } else {
      const qs = new URLSearchParams(params).toString();
      router.push(`/search?${qs}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleHistoryClick = (term: string) => {
    setQuery(term);
    const params: Record<string, string> = { q: term };
    if (onSearch) {
      onSearch(params);
    } else {
      router.push(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  if (variant === 'compact') {
    return (
      <Box>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            border: '1.5px solid',
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden',
            '&:focus-within': { borderColor: 'primary.main', boxShadow: '0 0 0 3px rgba(0,162,85,0.12)' },
            transition: 'all 0.2s ease',
          }}
        >
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="City, neighborhood, or property type..."
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: {
                '& fieldset': { border: 'none' },
                bgcolor: 'transparent',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              m: 0.75,
              px: 3,
              borderRadius: 2,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
              flexShrink: 0,
            }}
          >
            Search
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.3)',
          bgcolor: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', px: 2 }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1.5, flexShrink: 0 }} />
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by city, area, or property type..."
              variant="outlined"
              fullWidth
              InputProps={{
                sx: {
                  '& fieldset': { border: 'none' },
                  fontSize: '1rem',
                  fontWeight: 500,
                  py: 0.5,
                },
              }}
            />
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: { xs: 1, md: 0 }, gap: 1 }}>
            <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 20, flexShrink: 0 }} />
            <FormControl variant="standard" sx={{ minWidth: 140 }}>
              <Select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                displayEmpty
                disableUnderline
                sx={{ fontWeight: 500, fontSize: '0.9rem' }}
              >
                <MenuItem value=""><em style={{ fontStyle: 'normal', color: '#9e9e9e' }}>Any City</em></MenuItem>
                {NIGERIAN_CITIES.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: { xs: 1, md: 0 }, gap: 1 }}>
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                displayEmpty
                disableUnderline
                sx={{ fontWeight: 500, fontSize: '0.9rem' }}
              >
                <MenuItem value=""><em style={{ fontStyle: 'normal', color: '#9e9e9e' }}>Buy or Rent</em></MenuItem>
                <MenuItem value="sale">For Sale</MenuItem>
                <MenuItem value="rent">For Rent</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ p: 1.5 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{
                px: 4,
                py: 1.75,
                borderRadius: 3,
                bgcolor: 'primary.main',
                fontSize: '1rem',
                fontWeight: 700,
                '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.02)' },
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(0,162,85,0.35)',
              }}
            >
              Search
            </Button>
          </Box>
        </Box>

        {showFilters && (
          <>
            <Divider />
            <Box sx={{ px: 3, py: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Property Type</InputLabel>
                <Select
                  value={propType}
                  onChange={(e) => setPropType(e.target.value)}
                  label="Property Type"
                >
                  <MenuItem value="">Any Type</MenuItem>
                  {PROPERTY_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Price Range</InputLabel>
                <Select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  label="Price Range"
                >
                  <MenuItem value="">Any Price</MenuItem>
                  {PRICE_RANGES.map((r) => (
                    <MenuItem key={r.label} value={r.label}>{r.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>State</InputLabel>
                <Select value="" label="State">
                  <MenuItem value="">Any State</MenuItem>
                  {NIGERIAN_STATES.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </>
        )}

        <Box
          sx={{
            px: 3,
            pb: 2,
            pt: showFilters ? 0 : 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {searchHistory.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <HistoryIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              {searchHistory.map((term) => (
                <Chip
                  key={term}
                  label={term}
                  size="small"
                  onClick={() => handleHistoryClick(term)}
                  sx={{
                    height: 26,
                    fontSize: '0.78rem',
                    bgcolor: 'grey.100',
                    '&:hover': { bgcolor: 'primary.main', color: 'white' },
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Box>
          )}
          <Button
            size="small"
            startIcon={<TuneIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ color: 'text.secondary', ml: 'auto' }}
          >
            {showFilters ? 'Hide' : 'More'} Filters
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
