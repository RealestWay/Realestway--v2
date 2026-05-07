'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ApiService from '@/src/services/api';
import StatsOverview from '@/src/components/admin/StatsOverview';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res: any = await ApiService.admin.getStats();
        if (res.success || res.data) {
          // Sometimes it returns { success: true, data: {...} } or just the data depending on the wrapper
          setStats(res.data || res); 
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} mb={0.5}>Dashboard Overview</Typography>
        <Typography color="text.secondary">Welcome back, Admin. Here is what is happening today.</Typography>
      </Box>

      {stats ? (
        <StatsOverview stats={stats} />
      ) : (
        <Typography color="text.secondary">Failed to load dashboard statistics.</Typography>
      )}
    </Box>
  );
}
