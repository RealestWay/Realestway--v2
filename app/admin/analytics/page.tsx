'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import WhatsappGroupManagement from '@/src/components/admin/WhatsappGroupManagement';

export default function AdminAnalyticsPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} mb={0.5}>Analysis & Clustering</Typography>
        <Typography color="text.secondary">Deep dive into platform analytics and manage data sources.</Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="analytics tabs">
          <Tab label="Platform Analytics" sx={{ fontWeight: 600 }} />
          <Tab label="WhatsApp Data Mining" sx={{ fontWeight: 600 }} />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, bgcolor: '#f8fafc' }}>
          <Typography variant="h6" fontWeight={700} color="text.secondary" mb={2}>Advanced Analytics</Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={500}>
            Detailed demographic clustering, user engagement metrics, and revenue heatmaps will be available in the upcoming analytics module update.
          </Typography>
        </Paper>
      )}

      {tabIndex === 1 && (
        <WhatsappGroupManagement />
      )}
    </Box>
  );
}
