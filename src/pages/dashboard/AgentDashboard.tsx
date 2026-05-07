'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../data/mockData';
import toast from 'react-hot-toast';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import LogoutIcon from '@mui/icons-material/Logout';
import { Stack, TextField } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ApiService from '@/src/services/api';

type TabValue = 'stats' | 'properties' | 'settings';
type PropertyTab = 'all' | 'active' | 'unavailable' | 'draft';

export default function AgentDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout, refreshUser } = useAuth();
  
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'agent') {
        router.push('/');
      } else if (!user.phone_verified) {
        router.push('/auth/verify');
      }
    }
  }, [user, authLoading, router]);

  const [tab, setTab] = useState<TabValue>('stats');
  const [propTab, setPropTab] = useState<PropertyTab>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPropId, setMenuPropId] = useState<string | number | null>(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updatingPropId, setUpdatingPropId] = useState<string | number | null>(null);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<'profile' | 'banner' | null>(null);


  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, id: string | number) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setMenuPropId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);
  
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    name: '',
    business_name: '',
    profile_picture: '',
    banner: '',
    username: '',
    phone_number: '',
    email: '',
    nin: ''
  });

  // Load cache on mount
  useEffect(() => {
    try {
      const cachedProps = localStorage.getItem('agent_properties');
      const cachedStats = localStorage.getItem('agent_stats');
      if (cachedProps) setProperties(JSON.parse(cachedProps));
      if (cachedStats) setStats(JSON.parse(cachedStats));
      if (cachedProps || cachedStats) setLoading(false);
    } catch (e) {
      console.error('Failed to load dashboard cache', e);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setSettings({
        name: user.name || '',
        business_name: user.agent_profile?.business_name || '',
        profile_picture: user.profile_picture || '',
        banner: user.agent_profile?.banner || '',
        username: user.agent_profile?.username || '',
        phone_number: user.phone_number || '',
        email: user.email || '',
        nin: (user as any).nin || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === 'agent') {
      // Only show main spinner if we have no data at all
      const hasData = properties.length > 0 || stats !== null;
      fetchData(!hasData);
    }
  }, [user]);

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [statsRes, propsRes]: any = await Promise.all([
        ApiService.agent.getStats(),
        ApiService.agent.getProperties('limit=10')
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
        localStorage.setItem('agent_stats', JSON.stringify(statsRes.data));
      }
      if (propsRes) {
        const propertyList = propsRes?.data || [];
        const propertyMeta = propsRes?.meta;
        setProperties(propertyList);
        setMeta(propertyMeta);
        localStorage.setItem('agent_properties', JSON.stringify(propertyList));
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      toast.error('Failed to load dashboard data');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // NOTE: fetchData is intentionally called only once above (line ~143). The duplicate useEffect was removed.

  if (authLoading || !user || user.role !== 'agent') {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleLoadMore = async () => {
    if (!meta || meta.current_page >= meta.last_page) return;
    
    try {
      setLoadingMore(true);
      const nextPage = meta.current_page + 1;
      const res: any = await ApiService.agent.getProperties(`page=${nextPage}&limit=10`);
      if (res.success) {
        const newList = res?.data || [];
        const newMeta = res?.meta;
        setProperties(prev => [...prev, ...newList]);
        setMeta(newMeta);
      }
    } catch (err) {
      toast.error('Failed to load more listings');
    } finally {
      setLoadingMore(false);
    }
  };


  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const res: any = await ApiService.agent.updateProfile(settings);
      if (res.success) {
        toast.success('Profile updated successfully');
        // Refresh local user data in the background
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile_picture' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(type === 'profile_picture' ? 'profile' : 'banner');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res: any = await ApiService.media.upload(formData);
      const url = res.url || res.data?.url;
      if (url) {
        await ApiService.agent.updateProfile({ [type]: url });
        setSettings(prev => ({ ...prev, [type]: url }));
        refreshUser();
        toast.success(`${type === 'profile_picture' ? 'Profile picture' : 'Banner'} updated successfully!`);
      }
    } catch (err) {
      toast.error('Failed to upload image');
      console.error(err);
    } finally {
      setUploading(null);
    }
  };

  const copyProfileLink = () => {
    const link = `https://realestway.com/agent/${settings.username}`;
    navigator.clipboard.writeText(link);
    toast.success('Profile link copied to clipboard!');
  };


  const handleUpdateLocation = () => {
    if (!menuPropId) return;
    setUpdatingPropId(menuPropId);
    handleMenuClose();
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setLocationDialogOpen(true);
  };

  const confirmCaptureLocation = () => {
    if (!updatingPropId) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res: any = await ApiService.properties.update(updatingPropId, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          
          if (res.success) {
            toast.success('Property location updated successfully!');
            setLocationDialogOpen(false);
            setUpdatingPropId(null);
          } else {
            toast.error(res.message || 'Failed to update location');
          }
        } catch (error) {
          toast.error('Failed to update location');
        }
      },
      (error) => {
        toast.error('Failed to get location. Please ensure permissions are granted.');
        setLocationDialogOpen(false);
        setUpdatingPropId(null);
      }
    );
  };

  const handleDeleteProperty = () => {
    if (!menuPropId) return;
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const confirmDeleteProperty = async () => {
    if (!menuPropId) return;
    setDeleteLoading(true);
    try {
      const res: any = await ApiService.properties.delete(menuPropId);
      if (res.success) {
        toast.success('Property deleted successfully');
        setProperties(prev => prev.filter(p => String(p.uuid || p.id) !== String(menuPropId)));
        setDeleteConfirmOpen(false);
        fetchData(false); // Silent refresh stats
      } else {
        toast.error(res.message || 'Failed to delete property');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete property');
    } finally {
      setDeleteLoading(false);
      setMenuPropId(null);
    }
  };


  const handleToggleAvailability = async () => {
    if (!menuPropId) return;
    const property = properties.find(p => (p.uuid || p.id) === menuPropId);
    if (!property) return;

    const newStatus = property.status === 'active' || property.status === 'available' ? 'unavailable' : 'active';
    
    try {
      const res: any = await ApiService.properties.update(menuPropId, { status: newStatus });
      if (res.success) {
        toast.success(`Property marked as ${newStatus}`);
        setProperties(prev => prev.map(p => (p.uuid || p.id) === menuPropId ? { ...p, status: newStatus } : p));
        handleMenuClose();
        fetchData(false);
      }
    } catch (err) {
      toast.error(`Failed to mark property as ${newStatus}`);
    }
  };

  const handleConfirmAvailability = async (id: string | number, stillAvailable: boolean) => {
    try {
      setUpdatingPropId(id);
      const res: any = await ApiService.properties.confirmAvailability(id, stillAvailable);
      if (res.success) {
        toast.success(stillAvailable ? 'Listing verified!' : 'Listing removed');
        if (stillAvailable) {
          setProperties(prev => prev.map(p => (p.uuid || p.id) === id ? { 
            ...p, 
            cleanup_deadline_at: null,
            cleanup_warning_sent_at: null 
          } : p));
        } else {
          setProperties(prev => prev.filter(p => (p.uuid || p.id) !== id));
        }
        fetchData(false);
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingPropId(null);
    }
  };

  const selectedProperty = properties.find(p => (p.uuid || p.id) === menuPropId);

  const handleViewProperty = (prop: any) => {
    // Pass property data through sessionStorage for immediate display on detail page
    try {
      sessionStorage.setItem('selectedProperty', JSON.stringify(prop));
    } catch (e) {
      console.error('Failed to cache property', e);
    }
    router.push(`/property/${prop.uuid || prop.id}`);
    handleMenuClose();
  };

  const statCards = [
    { label: 'Total Listings', value: stats?.total_properties || '0', icon: <HomeWorkOutlinedIcon />, color: '#100073', change: 'Total count' },
    { label: 'Active Listings', value: stats?.active_properties || '0', icon: <VerifiedIcon />, color: '#00A255', change: 'Live on site' },
    { label: 'Total Views', value: stats?.total_views?.toLocaleString() || '0', icon: <VisibilityOutlinedIcon />, color: '#0288d1', change: 'Cumulative views' },
    { label: 'Click Counts', value: stats?.total_contact_clicks || '0', icon: <TrendingUpIcon />, color: '#ed6c02', change: 'Direct interactions' },
  ];



  const profileCompletion = stats?.profile_completion || 72;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ bgcolor: 'secondary.main', pt: 5, pb: 8 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={user?.profile_picture}
                sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.25rem', fontWeight: 800, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h5" fontWeight={800} color="white">
                    {user?.name}
                  </Typography>
                  {user?.kyc_status === 'verified' && (
                    <Chip
                      icon={<VerifiedIcon sx={{ fontSize: '14px !important' }} />}
                      label="Verified"
                      size="small"
                      sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600, height: 24, fontSize: '0.72rem' }}
                    />
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.25 }}>
                  {user?.email} · Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' }) : 'recently'}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/dashboard/add-listing')}
              sx={{
                bgcolor: 'primary.main',
                px: 3,
                py: 1.5,
                fontWeight: 700,
                '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.02)' },
                boxShadow: '0 4px 16px rgba(0,162,85,0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              Add New Listing
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -4 }}>


        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
              <Box sx={{ px: 3, pt: 3, pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight={700}>Dashboard</Typography>

                <Button size="small" onClick={() => router.push('/dashboard/add-listing')} startIcon={<AddIcon />} sx={{ color: 'primary.main' }}>
                  Add New
                </Button>
              </Box>
              <Box sx={{ px: 3 }}>
                <Tabs
                  value={tab}
                  onChange={(_, val) => setTab(val)}
                  sx={{
                    '& .MuiTab-root': { minHeight: 48, fontSize: '0.85rem', px: 3, fontWeight: 700 },
                    '& .MuiTabs-indicator': { bgcolor: 'primary.main', height: 3 },
                    '& .Mui-selected': { color: 'primary.main !important' },
                  }}
                >
                  <Tab value="stats" label="Overview" />
                  <Tab value="properties" label={`My Properties (${properties.length})`} />
                  <Tab value="settings" label="Profile & Settings" />
                </Tabs>
              </Box>
              <Divider />

              {tab === 'stats' && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={700} mb={3}>Performance Overview</Typography>
                  <Grid container spacing={2.5}>
                    {statCards.map((stat) => (
                      <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: { xs: 2, md: 3 },
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'rgba(0,0,0,0.01)'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: `${stat.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: stat.color,
                              }}
                            >
                              {stat.icon}
                            </Box>
                          </Box>
                          <Typography variant="h4" fontWeight={900} sx={{ fontFamily: '"Arial Black", sans-serif', color: stat.color }}>
                            {stat.value}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
                            {stat.label}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">{stat.change}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>

                  <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.main', borderRadius: 3, color: 'white' }}>
                    <Typography variant="h6" fontWeight={800} mb={1}>Listing Performance</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Your listings are getting active traction. Keep your properties updated to maintain visibility.
                    </Typography>
                  </Box>
                </Box>
              )}

              {tab === 'properties' && (
                <>
                  <Box sx={{ px: 3, pt: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Tabs 
                      value={propTab} 
                      onChange={(_, v) => setPropTab(v)}
                      sx={{ minHeight: 40, '& .MuiTab-root': { minHeight: 40, fontSize: '0.75rem', fontWeight: 600 } }}
                    >
                      <Tab value="all" label="All" />
                      <Tab value="active" label="Active" />
                      <Tab value="unavailable" label="Unavailable" />
                      <Tab value="draft" label="Drafts" />
                    </Tabs>
                  </Box>

                  {properties.some(p => p.cleanup_deadline_at) && (
                    <Box sx={{ p: 2, bgcolor: 'error.50', borderBottom: '1px solid', borderColor: 'error.100' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <WarningAmberIcon color="error" />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={700} color="error.dark">
                            Action Required: Expiring Listings
                          </Typography>
                          <Typography variant="caption" color="error.main">
                            Some of your listings are over a month old and will be removed soon. Please verify if they are still available.
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}

                  {loading ? (
                    <Box sx={{ p: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                      <CircularProgress size={40} thickness={4} />
                      <Typography variant="body2" color="text.secondary">Fetching your listings...</Typography>
                    </Box>
                  ) : (properties.filter(p => propTab === 'all' || (propTab === 'active' && (p.status === 'active' || p.status === 'available')) || (propTab === 'unavailable' && p.status === 'unavailable') || (propTab === 'draft' && p.status === 'draft')).length === 0) ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                      <SavedSearchIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="subtitle1" fontWeight={600} mb={1}>No listings found</Typography>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Property</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }} align="center">Status</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }} align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {properties
                            .filter(p => propTab === 'all' || (propTab === 'active' && (p.status === 'active' || p.status === 'available')) || (propTab === 'unavailable' && p.status === 'unavailable') || (propTab === 'draft' && p.status === 'draft'))
                            .map((property) => (
                            <TableRow 
                              key={property.uuid || property.id} 
                              hover 
                              onClick={() => handleViewProperty(property)}
                              sx={{ cursor: 'pointer' }}
                            >

                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  {(() => {
                                    const imgSrc = ApiService.getMediaUrl(property.media_urls?.[0] || property.images?.[0]);
                                    return imgSrc ? (
                                      <Box
                                        component="img"
                                        src={imgSrc}
                                        alt=""
                                        sx={{ width: 52, height: 38, objectFit: 'cover', borderRadius: 1.5, flexShrink: 0 }}
                                        onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                                      />
                                    ) : (
                                      <Box
                                        sx={{
                                          width: 52, height: 38, borderRadius: 1.5, flexShrink: 0,
                                          bgcolor: 'grey.100', display: 'flex', alignItems: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <HomeWorkOutlinedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                                      </Box>
                                    );
                                  })()}
                                  <Box>
                                    <Typography variant="body2" fontWeight={600} sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                      {property.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">{property.city}, {property.state}</Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight={700} color="primary.main">
                                  {formatPrice(property.basic_rent || property.price || 0)}
                                </Typography>
                                {property.cleanup_deadline_at && (
                                  <Typography variant="caption" color="error.main" fontWeight={700} sx={{ display: 'block', mt: 0.5 }}>
                                    Expiring {new Date(property.cleanup_deadline_at).toLocaleDateString()}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {property.cleanup_deadline_at ? (
                                  <Stack direction="row" spacing={1} justifyContent="center" onClick={(e) => e.stopPropagation()}>
                                    <Button 
                                      size="small" 
                                      variant="contained" 
                                      color="success"
                                      onClick={() => handleConfirmAvailability(property.uuid || property.id, true)}
                                      disabled={updatingPropId === (property.uuid || property.id)}
                                      sx={{ minWidth: 0, px: 1, height: 24, fontSize: '0.65rem', fontWeight: 700 }}
                                    >
                                      Still Available
                                    </Button>
                                    <Button 
                                      size="small" 
                                      variant="outlined" 
                                      color="error"
                                      onClick={() => handleConfirmAvailability(property.uuid || property.id, false)}
                                      disabled={updatingPropId === (property.uuid || property.id)}
                                      sx={{ minWidth: 0, px: 1, height: 24, fontSize: '0.65rem', fontWeight: 700 }}
                                    >
                                      No
                                    </Button>
                                  </Stack>
                                ) : (
                                  <Chip
                                    label={property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                                    size="small"
                                    sx={{
                                      bgcolor: property.status === 'active' || property.status === 'available' ? 'rgba(0,162,85,0.1)' : 'rgba(0,0,0,0.06)',
                                      color: property.status === 'active' || property.status === 'available' ? 'primary.dark' : 'text.secondary',
                                      fontWeight: 600,
                                      height: 24,
                                      fontSize: '0.72rem',
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell align="right">
                                <IconButton size="small" onClick={(e) => handleMenuOpen(e, property.uuid || property.id)}>
                                  <MoreVertIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  {meta && meta.current_page < meta.last_page && tab === 'properties' && (
                    <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                      <Button 
                        onClick={handleLoadMore} 
                        disabled={loadingMore}
                        variant="text" 
                        sx={{ fontWeight: 700, color: 'primary.main', minWidth: 150 }}
                      >
                        {loadingMore ? <CircularProgress size={20} /> : 'View More Listings'}
                      </Button>
                    </Box>
                  )}
                </>
              )}


              {tab === 'settings' && (
                <Box sx={{ p: 0 }}>
                  <Box sx={{ position: 'relative', mb: 10 }}>
                    {/* Banner */}
                    <Box 
                      sx={{ 
                        height: 200, 
                        width: '100%', 
                        bgcolor: 'grey.200',
                        backgroundImage: settings.banner ? `url(${settings.banner})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        cursor: 'pointer',
                        '&:hover .banner-overlay': { opacity: 1 }
                      }}
                      onClick={() => bannerInputRef.current?.click()}
                    >
                      <Box 
                        className="banner-overlay"
                        sx={{ 
                          position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.3)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: 0, transition: 'opacity 0.2s'
                        }}
                      >
                        <PhotoCameraIcon sx={{ color: 'white', fontSize: 40 }} />
                      </Box>
                      <input 
                        type="file" ref={bannerInputRef} hidden accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'banner')}
                      />
                      {uploading === 'banner' && (
                        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.5)' }}>
                          <CircularProgress />
                        </Box>
                      )}
                    </Box>

                    {/* Profile Pic */}
                    <Box 
                      sx={{ 
                        position: 'absolute', bottom: -50, left: 40,
                        width: 120, height: 120, borderRadius: '50%',
                        border: '5px solid white', overflow: 'hidden', bgcolor: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        '&:hover .profile-overlay': { opacity: 1 }
                      }}
                      onClick={() => profileInputRef.current?.click()}
                    >
                      <Avatar 
                        src={settings.profile_picture} 
                        sx={{ width: '100%', height: '100%' }} 
                      />
                      <Box 
                        className="profile-overlay"
                        sx={{ 
                          position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.3)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: 0, transition: 'opacity 0.2s'
                        }}
                      >
                        <PhotoCameraIcon sx={{ color: 'white', fontSize: 24 }} />
                      </Box>
                      <input 
                        type="file" ref={profileInputRef} hidden accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'profile_picture')}
                      />
                      {uploading === 'profile' && (
                        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.5)' }}>
                          <CircularProgress size={30} />
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                      <Grid size={{ xs: 12, md: 8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                          <Typography variant="h6" fontWeight={800}>Personal Details</Typography>
                          <Button 
                            variant="outlined" size="small" startIcon={<ShareIcon />}
                            onClick={copyProfileLink}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                          >
                            Share Profile Link
                          </Button>
                        </Box>
                        
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField 
                              label="Full Name" 
                              fullWidth 
                              value={settings.name}
                              onChange={(e) => setSettings({...settings, name: e.target.value})}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField 
                              label="Business / Agency Name" 
                              fullWidth 
                              value={settings.business_name}
                              onChange={(e) => setSettings({...settings, business_name: e.target.value})}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField 
                              label="Email Address" 
                              fullWidth 
                              value={settings.email}
                              onChange={(e) => setSettings({...settings, email: e.target.value})}
                              helperText="Changing this will require re-verification."
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField 
                              label="Phone Number" 
                              fullWidth 
                              value={settings.phone_number}
                              onChange={(e) => setSettings({...settings, phone_number: e.target.value})}
                              helperText="Changing this will require re-verification."
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField 
                              label="National Identity Number (NIN)" 
                              fullWidth 
                              value={settings.nin}
                              onChange={(e) => setSettings({...settings, nin: e.target.value})}
                              helperText="11-digit NIN for KYC verification."
                              inputProps={{ maxLength: 11 }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(0,162,85,0.05)', borderRadius: 2, border: '1px dashed', borderColor: 'primary.light', mb: 1 }}>
                              <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ display: 'block', mb: 0.5 }}>Public Profile Link</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ flex: 1, fontFamily: 'monospace', color: 'text.secondary' }}>
                                  https://realestway.com/agent/{settings.username}
                                </Typography>
                                <IconButton size="small" onClick={copyProfileLink} color="primary">
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                        <Button 
                          variant="contained" 
                          sx={{ mt: 4, px: 6, py: 1.5, fontWeight: 700, borderRadius: 2 }}
                          onClick={handleSaveSettings}
                          disabled={saving}
                        >
                          {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Profile Changes'}
                        </Button>
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" fontWeight={700} mb={2}>Profile Strength</Typography>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3, bgcolor: 'rgba(0,0,0,0.01)' }}>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                              <Typography variant="body2" color="text.secondary">Overall completion</Typography>
                              <Typography variant="body2" fontWeight={700} color="primary.main">{profileCompletion}%</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={profileCompletion}
                              sx={{ height: 8, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {[
                              { label: 'Phone Verified', done: !!user?.phone_verified },
                              { label: 'KYC Verified', done: user?.kyc_status === 'verified' },
                              { label: 'Profile Photo', done: !!settings.profile_picture },
                              { label: 'WhatsApp Number', done: !!user?.phone_number },
                              { label: 'Email Verified', done: !!user?.email_verified },
                            ].map((item) => (
                              <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color={item.done ? 'text.primary' : 'text.secondary'} fontWeight={item.done ? 500 : 400}>
                                  {item.label}
                                </Typography>
                                <Chip
                                  label={item.done ? 'Done' : 'Pending'}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.68rem',
                                    fontWeight: 600,
                                    bgcolor: item.done ? 'rgba(0,162,85,0.1)' : 'rgba(0,0,0,0.05)',
                                    color: item.done ? 'primary.dark' : 'text.secondary',
                                  }}
                                />
                              </Box>
                            ))}
                          </Box>
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => router.push('/profile')}
                            sx={{ mt: 2.5, borderColor: 'divider', color: 'text.secondary', '&:hover': { borderColor: 'secondary.main', color: 'secondary.main' } }}
                          >
                            Complete Profile
                          </Button>
                        </Paper>

                        <Alert severity={user?.kyc_status === 'verified' ? "success" : "warning"} sx={{ borderRadius: 3, mb: 3 }}>
                          <Typography variant="body2" fontWeight={700} mb={0.5}>
                            {user?.kyc_status === 'verified' ? 'Account Verified' : 'Verify KYC'}
                          </Typography>
                          <Typography variant="caption">
                            {user?.kyc_status === 'verified' 
                              ? 'Your account is linked and fully verified.' 
                              : 'Please complete KYC to unlock full features.'}
                          </Typography>
                        </Alert>
                        
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          startIcon={<LogoutIcon />}
                          onClick={() => { logout(); router.push('/'); }}
                          sx={{ borderRadius: 2, fontWeight: 700, mt: 'auto' }}
                        >
                          Sign Out
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { minWidth: 160, borderRadius: 2 } }}
      >
        <MenuItem onClick={() => selectedProperty && handleViewProperty(selectedProperty)}>
          <VisibilityOutlinedIcon sx={{ mr: 1.5, fontSize: 18 }} /> View Listing
        </MenuItem>
        <MenuItem onClick={handleUpdateLocation}>
          <MyLocationIcon sx={{ mr: 1.5, fontSize: 18 }} /> Update Location
        </MenuItem>
        <MenuItem onClick={() => { 
          if (selectedProperty) {
            sessionStorage.setItem('editProperty', JSON.stringify(selectedProperty));
          }
          router.push(`/dashboard/add-listing?edit=${menuPropId}`); 
          handleMenuClose(); 
        }}>
          <EditOutlinedIcon sx={{ mr: 1.5, fontSize: 18 }} /> Edit
        </MenuItem>
        {selectedProperty?.status !== 'draft' && (
          <MenuItem onClick={handleToggleAvailability}>
            {selectedProperty?.status === 'unavailable' ? (
              <><ToggleOnIcon sx={{ mr: 1.5, fontSize: 18 }} /> Mark Available</>
            ) : (
              <><ToggleOffIcon sx={{ mr: 1.5, fontSize: 18 }} /> Mark Unavailable</>
            )}
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleDeleteProperty} sx={{ color: 'error.main' }}>
          <DeleteOutlineIcon sx={{ mr: 1.5, fontSize: 18 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog 
        open={locationDialogOpen} 
        onClose={() => { setLocationDialogOpen(false); setUpdatingPropId(null); setMenuPropId(null); }} 
        sx={{ '& .MuiDialog-paper': { borderRadius: 3, p: 1 } }}
      >

        <DialogTitle sx={{ fontWeight: 800 }}>Update Property Location?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will record your current GPS coordinates (Latitude & Longitude) and apply them to this property. 
            Only use this if you are currently physically present at the property.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => { setLocationDialogOpen(false); setUpdatingPropId(null); }} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={confirmCaptureLocation} variant="contained" sx={{ borderRadius: 2, fontWeight: 700 }}>Confirm & Capture</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={deleteConfirmOpen} 
        onClose={() => { setDeleteConfirmOpen(false); setMenuPropId(null); }}
        sx={{ '& .MuiDialog-paper': { borderRadius: 3, p: 1, maxWidth: 400 } }}
      >

        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5, color: 'error.main' }}>
          <WarningAmberIcon /> Delete Property?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Are you sure you want to delete <strong>{selectedProperty?.title}</strong>?
          </Typography>
          <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
            This action is permanent and cannot be reversed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }} disabled={deleteLoading}>Cancel</Button>
          <Button 
            onClick={confirmDeleteProperty} 
            variant="contained" 
            color="error" 
            sx={{ 
              borderRadius: 2, 
              fontWeight: 700,
              opacity: deleteLoading ? 0.7 : 1,
              transition: 'opacity 0.2s ease-in-out'
            }}
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
          </Button>

        </DialogActions>
      </Dialog>
    </Box>
  );
}
