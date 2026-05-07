'use client';

import { useRouter, usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    router.push(newValue);
  };

  return (
    <Box sx={{ 
      display: { xs: 'block', md: 'none' }, 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1200 
    }}>
      <Paper elevation={16} sx={{ borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
        <BottomNavigation
          showLabels
          value={pathname}
          onChange={handleChange}
          sx={{ height: 72, pb: 1 }}
        >
          <BottomNavigationAction
            label="Home"
            value="/"
            icon={<HomeOutlinedIcon />}
          />
          <BottomNavigationAction
            label="Search"
            value="/search"
            icon={<SearchOutlinedIcon />}
          />
          <BottomNavigationAction
            label="Saved"
            value="/saved"
            icon={<FavoriteBorderOutlinedIcon />}
          />
          <BottomNavigationAction
            label="Requests"
            value="/requests"
            icon={<MapsUgcOutlinedIcon />}
          />
          <BottomNavigationAction
            label="Profile"
            value="/profile"
            icon={<PersonOutlineIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
