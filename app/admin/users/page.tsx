'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import UserManagement from '@/src/components/admin/UserManagement';

export default function AdminUsersPage() {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} mb={0.5}>Users & Admins</Typography>
          <Typography color="text.secondary">Manage platform accounts, create admins, and handle suspensions.</Typography>
        </Box>
        <Button variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700 }}>Add User / Admin</Button>
      </Box>

      <UserManagement />
    </Box>
  );
}
