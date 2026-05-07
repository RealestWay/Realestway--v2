'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import BlogManager from '@/src/components/admin/BlogManager';

export default function AdminBlogsPage() {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} mb={0.5}>Blog Management</Typography>
          <Typography color="text.secondary">Create, edit, and manage articles published on the platform.</Typography>
        </Box>
        <Button variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700 }}>Add New Article</Button>
      </Box>

      <BlogManager />
    </Box>
  );
}
