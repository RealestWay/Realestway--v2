'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import CircularProgress from '@mui/material/CircularProgress';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import ApiService from '../../services/api';
import toast from 'react-hot-toast';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { MessageSquare } from 'lucide-react';
import { getCache, setCache } from '../../utils/cache';

/* ─── Components ─── */
import StatsOverview from '../../components/admin/StatsOverview';
import UserManagement from '../../components/admin/UserManagement';
import AdminManagement from '../../components/admin/AdminManagement';
import PropertyModeration from '../../components/admin/PropertyModeration';
import BlogManager from '../../components/admin/BlogManager';
import NewsletterManagement from '../../components/admin/NewsletterManagement';
import WhatsappGroupManagement from '../../components/admin/WhatsappGroupManagement';
import AgentProfiles from '../../components/admin/AgentProfiles';
import ContactRequestManagement from '../../components/admin/ContactRequestManagement';
import RequestManagement from '../../components/admin/RequestManagement';

const SIDEBAR_WIDTH = 280;

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Check auth
    const checkAuth = async () => {
      try {
        const res: any = await ApiService.auth.me();
        if (res.user && (res.user.role === 'admin' || res.user.role === 'super_admin')) {
          if (!res.user.phone_verified) {
            router.push('/auth/verify');
            return;
          }
          setUser(res.user);
          fetchStats();
        } else {
          toast.error('Unauthorized access');
          router.push('/');
        }
      } catch (err) {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router]);

  const fetchStats = async () => {
    // 1. Optimistic UI from cache
    const cachedStats = getCache('admin_stats');
    const cachedHealth = getCache('admin_health');
    if (cachedStats) setStats(cachedStats);
    if (cachedHealth) setHealth(cachedHealth);

    // 2. Background revalidation
    try {
      const [statsRes, healthRes]: any = await Promise.all([
        ApiService.admin.getStats(),
        ApiService.admin.getHealth()
      ]);
      if (statsRes.success) {
        setStats(statsRes.data);
        setCache('admin_stats', statsRes.data);
      }
      if (healthRes.success) {
        setHealth(healthRes.data);
        setCache('admin_health', healthRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#f8fafc' }}>
        <CircularProgress color="primary" thickness={4} />
      </Box>
    );
  }

  const menuItems = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: <DashboardOutlinedIcon />, color: '#1B4FD8' },
    { id: 'users', label: 'User Management', icon: <PeopleOutlinedIcon />, color: '#7C3AED' },
    { id: 'agents', label: 'Agent Profiles', icon: <BadgeOutlinedIcon />, color: '#0ea5e9' },
    { id: 'properties', label: 'Properties', icon: <HomeWorkOutlinedIcon />, color: '#059669' },
    { id: 'contact-requests', label: 'Contact Requests', icon: <EmailOutlinedIcon />, color: '#f59e0b' },
    { id: 'house-requests', label: 'House Requests', icon: <MessageSquare className="w-5 h-5" />, color: '#8B5CF6' },
    { id: 'whatsapp', label: 'WhatsApp Groups', icon: <WhatsAppIcon />, color: '#25D366' },
    { id: 'blogs', label: 'Blogs & News', icon: <ArticleOutlinedIcon />, color: '#EA580C' },
    { id: 'newsletter', label: 'Newsletter', icon: <EmailOutlinedIcon />, color: '#2563EB' },
    { id: 'admins', label: 'Platform Admins', icon: <AdminPanelSettingsOutlinedIcon />, color: '#DC2626' },
  ], []);

  const tabParam = searchParams.get('tab');
  
  const initialTab = useMemo(() => {
    if (!tabParam) return 0;
    const index = menuItems.findIndex(item => item.id === tabParam);
    return index !== -1 ? index : 0;
  }, [tabParam, menuItems]);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [mountedTabs, setMountedTabs] = useState<Set<number>>(new Set([initialTab]));

  useEffect(() => {
    setActiveTab(initialTab);
    setMountedTabs(prev => new Set(prev).add(initialTab));
  }, [initialTab]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setMountedTabs(prev => new Set(prev).add(index));
    const tabId = menuItems[index].id;
    window.history.pushState(null, '', `?tab=${tabId}`);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          bgcolor: 'white',
          borderRight: '1px solid rgba(0,0,0,0.06)',
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          zIndex: 1200,
        }}
      >
        <Box sx={{ p: 4, display: 'flex', alignItems: 'center' }}>
          <img 
            src="/Realestway_horizontal.png" 
            alt="Realestway" 
            style={{ height: 38, objectFit: 'contain', cursor: 'pointer' }} 
            onClick={() => router.push('/')}
          />
        </Box>

        <List sx={{ px: 2, mt: 2 }}>
          {menuItems.map((item, index) => (
            <ListItem
              key={item.label}
              component="button"
              onClick={() => handleTabChange(index)}
              sx={{
                mb: 1,
                borderRadius: 2.5,
                bgcolor: activeTab === index ? `${item.color}10` : 'transparent',
                color: activeTab === index ? item.color : 'text.secondary',
                border: 'none',
                width: '100%',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: activeTab === index ? `${item.color}15` : 'rgba(0,0,0,0.03)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <Box sx={{ mr: 2, display: 'flex', color: activeTab === index ? item.color : 'text.secondary' }}>
                {item.icon}
              </Box>
              <Typography variant="body2" fontWeight={activeTab === index ? 700 : 500}>
                {item.label}
              </Typography>
              {activeTab === index && (
                <Box sx={{ ml: 'auto', width: 4, height: 16, borderRadius: 2, bgcolor: item.color }} />
              )}
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', p: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: 'primary.main',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 600 }}>SYSTEM STATUS</Typography>
              <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>
                {health ? 'All Systems Operational' : 'Checking...'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: health ? '#4ade80' : '#facc15', boxShadow: `0 0 8px ${health ? '#4ade80' : '#facc15'}` }} />
                <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {health ? `${health.environment} Environment` : 'Connecting...'}
                </Typography>
              </Box>
            </Box>
            <TrendingUpIcon sx={{ position: 'absolute', right: -10, bottom: -10, fontSize: 80, opacity: 0.1 }} />
          </Paper>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { lg: `${SIDEBAR_WIDTH}px` },
          minHeight: '100vh',
          p: { xs: 2, md: 4, lg: 6 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 5,
            position: 'sticky',
            top: 0,
            zIndex: 100,
            py: 1,
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            transition: 'all 0.3s',
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800} letterSpacing={-1}>
              {menuItems[activeTab].label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back, {user?.name.split(' ')[0]}. Here's what's happening today.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Paper
              elevation={0}
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                px: 2,
                py: 1,
                borderRadius: '100px',
                border: '1px solid rgba(0,0,0,0.06)',
                bgcolor: 'white',
                width: 280,
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
              <InputBase placeholder="Search everything..." sx={{ fontSize: '0.875rem', flex: 1 }} />
            </Paper>

            <Tooltip title="Notifications">
              <IconButton sx={{ bgcolor: 'white', border: '1px solid rgba(0,0,0,0.06)' }}>
                <Badge color="error" variant="dot">
                  <NotificationsNoneOutlinedIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" fontWeight={700}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {user?.role === 'super_admin' ? 'Super Administrator' : 'Platform Admin'}
                </Typography>
              </Box>
              <Avatar
                src={user?.profile_picture}
                sx={{
                  width: 44,
                  height: 44,
                  border: '2px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                {user?.name.charAt(0)}
              </Avatar>
            </Box>
          </Box>
        </Box>

        {/* Content Area */}
        <Box sx={{ animation: 'fadeIn 0.5s ease-out', position: 'relative' }}>
          {mountedTabs.has(0) && (
            <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
              {useMemo(() => <StatsOverview stats={stats} />, [stats])}
            </Box>
          )}
          {mountedTabs.has(1) && (
            <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
              {useMemo(() => <UserManagement />, [])}
            </Box>
          )}
          {mountedTabs.has(2) && (
            <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
              {useMemo(() => <AgentProfiles />, [])}
            </Box>
          )}
          {mountedTabs.has(3) && (
            <Box sx={{ display: activeTab === 3 ? 'block' : 'none' }}>
              {useMemo(() => <PropertyModeration />, [])}
            </Box>
          )}
          {mountedTabs.has(4) && (
            <Box sx={{ display: activeTab === 4 ? 'block' : 'none' }}>
              {useMemo(() => <ContactRequestManagement />, [])}
            </Box>
          )}
          {mountedTabs.has(5) && (
            <Box sx={{ display: activeTab === 5 ? 'block' : 'none' }}>
              {useMemo(() => <RequestManagement />, [])}
            </Box>
          )}
          {mountedTabs.has(6) && (
            <Box sx={{ display: activeTab === 6 ? 'block' : 'none' }}>
              {useMemo(() => <WhatsappGroupManagement />, [])}
            </Box>
          )}
          {mountedTabs.has(7) && (
            <Box sx={{ display: activeTab === 7 ? 'block' : 'none' }}>
              {useMemo(() => <BlogManager />, [])}
            </Box>
          )}
          {mountedTabs.has(8) && (
            <Box sx={{ display: activeTab === 8 ? 'block' : 'none' }}>
              {useMemo(() => <NewsletterManagement />, [])}
            </Box>
          )}
          {mountedTabs.has(9) && (
            <Box sx={{ display: activeTab === 9 ? 'block' : 'none' }}>
              {useMemo(() => <AdminManagement currentUser={user} />, [user])}
            </Box>
          )}
        </Box>
      </Box>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Box>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#f8fafc' }}>
        <CircularProgress color="primary" thickness={4} />
      </Box>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
