'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AdminManagement from '@/src/components/admin/AdminManagement';
import NewsletterManagement from '@/src/components/admin/NewsletterManagement';

export default function AdminSettingsPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} mb={0.5}>Platform Settings</Typography>
        <Typography color="text.secondary">Manage platform configuration, administrators, and newsletters.</Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="settings tabs">
          <Tab label="Administrator Access" sx={{ fontWeight: 600 }} />
          <Tab label="Newsletter Subscribers" sx={{ fontWeight: 600 }} />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <AdminManagement />
      )}

      {tabIndex === 1 && (
        <NewsletterManagement />
      )}
    </Box>
  );
}
