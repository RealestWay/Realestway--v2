'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../context/AuthContext';
import EmailVerificationBanner from './EmailVerificationBanner';
import { useQueryClient } from '@tanstack/react-query';
import ApiService from '@/src/services/api';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Our Properties', path: '/search' },
  { label: 'House Requests', path: '/requests' },
  { label: 'Blog', path: '/blogs' },
  { label: 'Contact Us', path: '/contact' },
];

const BANNER_H = 34; // px — must match EmailVerificationBanner height


export default function Navbar({ position = 'fixed' }: { position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative' }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const isLoggedIn = !!user;
  const showBanner = !!user && !user.email_verified;

  /* Detect scroll to toggle navbar appearance */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Pages where the navbar starts transparent (full-bleed hero image beneath) */
  const TRANSPARENT_PAGES = ['/', '/about', '/contact', '/blogs'];
  const isTransparentPage = TRANSPARENT_PAGES.includes(pathname ?? '');

  /* On transparent pages: glass when not scrolled, solid white when scrolled */
  const navBg = isTransparentPage && !scrolled
    ? 'rgba(0,0,0,0.01)'
    : 'rgba(255,255,255,0.97)';

  const navBorder = isTransparentPage && !scrolled
    ? '1px solid rgba(255,255,255,0.15)'
    : '1px solid rgba(0,0,0,0.07)';

  const navShadow = isTransparentPage && !scrolled
    ? 'none'
    : '0 2px 16px rgba(0,0,0,0.08)';

  const linkColor = isTransparentPage && !scrolled ? 'white' : 'text.primary';
  const activeLinkColor = isTransparentPage && !scrolled ? 'primary.light' : 'primary.main';

  const isActive = (path: string) => pathname === path.split('?')[0];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const queryClient = useQueryClient();

  const handlePrefetch = (path: string) => {
    if (path === '/search') {
      queryClient.prefetchQuery({
        queryKey: ['infinite_properties', 'category=rent'],
        queryFn: async () => {
          const res: any = await ApiService.properties.getAll('category=rent&limit=12');
          return res;
        }
      });
    } else if (path === '/requests') {
      queryClient.prefetchQuery({
        queryKey: ['property_requests'],
        queryFn: async () => {
          const res: any = await ApiService.requests.getAll();
          return res;
        }
      });
    }
  };

  return (
    <>
      <EmailVerificationBanner />
      <AppBar
        position={position}
        elevation={0}
        sx={{
          bgcolor: navBg,
          backdropFilter: isTransparentPage && !scrolled ? 'blur(14px)' : 'blur(0px)',
          border: isTransparentPage && !scrolled
            ? '1px solid rgba(255,255,255,0.18)'
            : '1px solid rgba(0,0,0,0.07)',
          boxShadow: isTransparentPage && !scrolled
            ? '0 4px 32px rgba(0,0,0,0.18)'
            : '0 2px 16px rgba(0,0,0,0.08)',
          top: (showBanner && !scrolled)
            ? { xs: BANNER_H + 10, md: BANNER_H + 14 }
            : { xs: 10, md: 14 },
          left: '50%',
          transform: 'translateX(-50%)',
          width: '94%',
          maxWidth: '1440px',
          borderRadius: scrolled ? '16px' : '18px',
          color: linkColor,
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          zIndex: 1100,
          ...((position === 'static' || position === 'absolute' || position === 'relative') && {
            top: { xs: 10, md: 14 },
            transform: 'translateX(-50%)',
            left: '50%',
            width: '94%',
            borderRadius: '18px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
            bgcolor: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.07)',
          })
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: { xs: 64, md: 72 } }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0, textDecoration: 'none' }}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: 28, md: 34 },
                width: { xs: 120, md: 150 }, // Estimated width for the logo
                filter: isTransparentPage && !scrolled ? 'brightness(0) invert(1)' : 'none',
                transition: 'filter 0.35s ease',
              }}
            >
              <Image
                src="/Realestway_horizontal.png"
                alt="Realestway"
                fill
                priority
                style={{ objectFit: 'contain' }}
              />
            </Box>
          </Link>

          {/* Desktop nav links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.25, ml: 5 }}>
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.path} 
                href={link.path} 
                style={{ textDecoration: 'none' }}
                onMouseEnter={() => handlePrefetch(link.path)}
              >
                <Button
                  sx={{
                    color: isActive(link.path) ? activeLinkColor : linkColor,
                    fontWeight: isActive(link.path) ? 600 : 400,
                    fontSize: '0.875rem',
                    px: 1.75,
                    py: 0.75,
                    borderRadius: '6px',
                    minWidth: 'auto',
                    '&:hover': {
                      bgcolor: isTransparentPage && !scrolled
                        ? 'rgba(255,255,255,0.12)'
                        : 'rgba(0,162,86,0.06)',
                      color: isTransparentPage && !scrolled ? 'white' : 'primary.main',
                    },
                    transition: 'all 0.15s ease',
                  }}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop auth / user actions */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            {isLoggedIn ? (
              <>
                <Link href="/saved">
                  <IconButton sx={{ color: isTransparentPage && !scrolled ? 'white' : 'text.secondary' }}>
                    <Badge badgeContent={0} color="primary">
                      <FavoriteIcon />
                    </Badge>
                  </IconButton>
                </Link>
                {(user?.role === 'agent' || user?.role === 'admin' || user?.role === 'super_admin') && (
                  <Link href={user.role === 'agent' ? '/dashboard/add-listing' : '/admin/properties'}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                      {user.role === 'agent' ? 'Add Listing' : 'Manage List'}
                    </Button>
                  </Link>
                )}
                <Avatar
                  onClick={handleMenuOpen}
                  sx={{ width: 36, height: 36, cursor: 'pointer', bgcolor: 'primary.main', fontSize: '0.875rem', fontWeight: 700 }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{ sx: { mt: 1, minWidth: 200, borderRadius: 2 } }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={700}>{user?.name}</Typography>
                    {(user?.role === 'agent' || user?.role === 'admin') && (
                      <Chip label={user?.role === 'admin' ? 'Admin' : 'Agent'} size="small" color="primary" sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }} />
                    )}
                  </Box>
                  <Divider />
                  {user?.role === 'user' && <MenuItem onClick={() => { router.push('/profile'); handleMenuClose(); }}>
                    <PersonOutlineIcon sx={{ mr: 1.5, fontSize: 18 }} /> Profile
                  </MenuItem>}
                  {user?.role === 'agent' && (
                    <MenuItem onClick={() => { router.push('/dashboard'); handleMenuClose(); }}>
                      <DashboardOutlinedIcon sx={{ mr: 1.5, fontSize: 18 }} /> Agent Dashboard
                    </MenuItem>
                  )}
                  {(user?.role === 'admin' || user?.role === 'super_admin') && (
                    <MenuItem onClick={() => { router.push('/admin'); handleMenuClose(); }}>
                      <DashboardOutlinedIcon sx={{ mr: 1.5, fontSize: 18 }} /> Admin Panel
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => { router.push('/saved'); handleMenuClose(); }}>
                    <FavoriteIcon sx={{ mr: 1.5, fontSize: 18, color: 'error.main' }} /> Saved Properties
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => { logout(); handleMenuClose(); }} sx={{ color: 'error.main' }}>
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 18 }} /> Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="text"
                    sx={{
                      color: isTransparentPage && !scrolled ? 'white' : 'text.primary',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: isTransparentPage && !scrolled ? 'rgba(255,255,255,0.1)' : 'grey.100',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 3,
                      borderRadius: '8px',
                      '&:hover': { bgcolor: 'primary.dark' },
                      boxShadow: '0 3px 14px rgba(0,162,86,0.35)',
                    }}
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </Box>

          {/* Mobile menu button */}
          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' }, ml: 1, color: isTransparentPage && !scrolled ? 'white' : 'text.primary' }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Offset for fixed navbar + optional banner */}
      <Box sx={{
        height: (showBanner && !scrolled)
          ? { xs: 74 + BANNER_H, md: 86 + BANNER_H }
          : { xs: 74, md: 86 },
        display: isTransparentPage ? 'none' : 'block',
        transition: 'height 0.25s ease',
      }} />

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: '80vw', maxWidth: 320, zIndex:999} }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ position: 'relative', height: 28, width: 120 }}>
            <Image 
              src="/Realestway_horizontal.png" 
              alt="Realestway" 
              fill 
              style={{ objectFit: 'contain' }}
            />
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ px: 1 }}>
          {NAV_LINKS.map((link) => (
            <ListItem key={link.path} disablePadding>
              <Link href={link.path} style={{ width: '100%', textDecoration: 'none' }}>
                <ListItemButton
                  onClick={() => setDrawerOpen(false)}
                  sx={{ borderRadius: 2, mb: 0.5, color: isActive(link.path) ? 'primary.main' : 'inherit' }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{ fontWeight: isActive(link.path) ? 700 : 400 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider />
        {isLoggedIn ? (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>{user?.name?.charAt(0)}</Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              </Box>
            </Box>
            {user?.role === 'user' && (<Button fullWidth variant="outlined" onClick={() => { router.push('/profile'); setDrawerOpen(false); }}>Profile</Button>
            )}
            {user?.role === 'agent' && (
              <Button fullWidth variant="outlined" onClick={() => { router.push('/dashboard'); setDrawerOpen(false); }}>Agent Dashboard</Button>
            )}
            {(user?.role === 'admin' || user?.role === 'super_admin') && (
              <Button fullWidth variant="outlined" onClick={() => { router.push('/admin'); setDrawerOpen(false); }}>Admin Panel</Button>
            )}
            <Button fullWidth variant="contained" color="error" onClick={() => { logout(); setDrawerOpen(false); }}>Sign Out</Button>
          </Box>
        ) : (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Link href="/auth/login" style={{ textDecoration: 'none' }}>
              <Button fullWidth variant="outlined">Sign In</Button>
            </Link>
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <Button fullWidth variant="contained" sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}>
                Register
              </Button>
            </Link>
          </Box>
        )}
      </Drawer>
    </>
  );
}
