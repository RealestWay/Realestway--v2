'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ApiService from '../../services/api';
import toast from 'react-hot-toast';

interface AdminManagementProps {
  currentUser: {
    role: string;
    name?: string;
  } | null;
}

export default function AdminManagement({ currentUser }: AdminManagementProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
  });

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    
    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await ApiService.admin.createAdmin(formData);
      toast.success('Admin account created successfully');
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
      });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <PersonAddAlt1Icon color="primary" />
              <Typography variant="h6" fontWeight={800}>Create New Administrator</Typography>
            </Box>

            {!isSuperAdmin ? (
              <Alert severity="warning" sx={{ borderRadius: 3, mb: 2 }}>
                Only the Super Administrator has permission to create new admin accounts.
              </Alert>
            ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Fill in the details below to grant administrative access to a new user. 
                  Administrators can manage users, properties, and blog content.
                </Typography>
                
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone_number"
                  placeholder="+234..."
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />

                <Divider sx={{ my: 1 }} />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="password_confirmation"
                      type="password"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    mt: 2, 
                    borderRadius: 3, 
                    py: 1.5, 
                    textTransform: 'none', 
                    fontWeight: 700,
                    boxShadow: '0 8px 16px rgba(27, 79, 216, 0.2)',
                    '&:hover': { boxShadow: '0 12px 20px rgba(27, 79, 216, 0.3)' }
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Admin Account'}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#f1f5f9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <ShieldOutlinedIcon sx={{ color: '#475569' }} />
              <Typography variant="h6" fontWeight={800} color="#475569">Access Control Rules</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>Super Admin Privileges</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  • Can create and manage regular Admin accounts.<br />
                  • Has full access to all system settings and logs.<br />
                  • Cannot be deleted or blocked by regular admins.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>Regular Admin Privileges</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  • Can manage User and Agent profiles.<br />
                  • Can verify or remove Property listings.<br />
                  • Can create and edit Blog posts.<br />
                  • <strong>Cannot</strong> create other Admin accounts.<br />
                  • <strong>Cannot</strong> modify Super Admin details.
                </Typography>
              </Box>

              <Box sx={{ mt: 4, p: 2, bgcolor: 'white', borderRadius: 3, border: '1px dashed #cbd5e1' }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, color: 'primary.main' }}>
                  SECURITY NOTE
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Administrative actions are logged and associated with your account profile for audit purposes. Ensure all admin credentials are kept secure.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
