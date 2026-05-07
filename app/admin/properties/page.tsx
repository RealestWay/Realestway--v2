'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PropertyModeration from '@/src/components/admin/PropertyModeration';

export default function AdminPropertiesPage() {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} mb={0.5}>Property Management</Typography>
          <Typography color="text.secondary">Review, approve, and manage all property listings.</Typography>
        </Box>
        <Button variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700 }}>Export CSV</Button>
      </Box>

      <PropertyModeration />
    </Box>
  );
}
