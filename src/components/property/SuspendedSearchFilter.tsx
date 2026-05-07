'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import { PROPERTY_TYPES, PRICE_RANGES } from '../../data/mockData';

interface SuspendedSearchFilterProps {
  location: string;
  setLocation: (val: string) => void;
  propType: string | string[];
  setPropType: (val: string | string[]) => void;
  priceRange: string;
  setPriceRange: (val: string) => void;
  category: 'rent' | 'sale';
  setCategory: (val: 'rent' | 'sale') => void;
  onSearch: () => void;
  permanent?: boolean;
}

export default function SuspendedSearchFilter({
  location,
  setLocation,
  propType,
  setPropType,
  priceRange,
  setPriceRange,
  category,
  setCategory,
  onSearch,
  permanent = false,
}: SuspendedSearchFilterProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        width: '100%',
        bgcolor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
        px: { xs: 1.5, md: 2.5 },
        py: 1,
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {/* Category Toggle */}
      <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
        {(['Rent', 'Sale'] as const).map((t) => {
          const val = t.toLowerCase() as 'rent' | 'sale';
          const isActive = category === val;
          return (
            <Button
              key={t}
              onClick={() => setCategory(val)}
              size="small"
              sx={{
                minWidth: 54,
                height: 32,
                borderRadius: '8px',
                px: 1.5,
                fontWeight: 700,
                fontSize: '0.75rem',
                bgcolor: isActive ? 'primary.main' : 'transparent',
                color: isActive ? 'white' : 'text.secondary',
                border: isActive ? 'none' : '1px solid',
                borderColor: 'divider',
                textTransform: 'none',
                '&:hover': { bgcolor: isActive ? 'primary.dark' : 'rgba(0,0,0,0.03)' },
              }}
            >
              {t}
            </Button>
          );
        })}
      </Box>

      {/* Location Input - Hidden on very small screens to save space */}
      <TextField
        size="small"
        placeholder="Location..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        sx={{ 
          flex: 1.5, 
          minWidth: 100,
          display: { xs: 'none', sm: 'block' },
          '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.8rem', bgcolor: '#f8fafc' }
        }}
      />

      {/* Property Type Select */}
      <FormControl size="small" sx={{ flex: 1, minWidth: 120 }}>
        <Select
          multiple
          value={Array.isArray(propType) ? propType : propType ? [propType] : []}
          onChange={(e) => setPropType(e.target.value as string[])}
          displayEmpty
          renderValue={(selected) => {
            if (selected.length === 0) return <em style={{ fontStyle: 'normal', color: '#94a3b8' }}>Type (Select Multiple)</em>;
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
                      fontSize: '0.62rem',
                      fontWeight: 700
                    }}
                  >
                    {value}
                  </Box>
                ))}
              </Box>
            );
          }}
          sx={{ borderRadius: '100px', fontSize: '0.8rem', bgcolor: '#f8fafc', height: 36 }}
        >
          {PROPERTY_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Select>
      </FormControl>

      {/* Price Range Select - Hidden on mobile if too crowded */}
      <FormControl size="small" sx={{ flex: 1, minWidth: 110, display: { xs: 'none', md: 'block' } }}>
        <Select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          displayEmpty
          sx={{ borderRadius: '10px', fontSize: '0.8rem', bgcolor: '#f8fafc', height: 36 }}
        >
          <MenuItem value=""><em style={{ fontStyle: 'normal', color: '#94a3b8' }}>Budget</em></MenuItem>
          {PRICE_RANGES.map((r) => <MenuItem key={r.label} value={r.label}>{r.label}</MenuItem>)}
        </Select>
      </FormControl>

      {/* Search Button */}
      <Button
        variant="contained"
        size="small"
        onClick={onSearch}
        sx={{
          minWidth: 40,
          width: { xs: 40, md: 'auto' },
          height: 36,
          borderRadius: '10px',
          bgcolor: 'primary.main',
          fontWeight: 700,
          px: { xs: 0, md: 2.5 },
          flexShrink: 0,
          '&:hover': { bgcolor: 'primary.dark' },
          boxShadow: '0 4px 14px rgba(0,162,86,0.3)',
        }}
      >
        <SearchIcon sx={{ fontSize: 20 }} />
        <Typography sx={{ display: { xs: 'none', md: 'block' }, ml: 1, fontSize: '0.85rem' }}>Search</Typography>
      </Button>
    </Paper>
  );
}
