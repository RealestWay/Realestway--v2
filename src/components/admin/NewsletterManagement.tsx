'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CircularProgress from '@mui/material/CircularProgress';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Avatar from '@mui/material/Avatar';
import ApiService from '../../services/api';
import toast from 'react-hot-toast';
import { getCache, setCache, clearCache } from '../../utils/cache';

export default function NewsletterManagement() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    const cacheKey = 'admin_subscribers';
    const cached = getCache(cacheKey);

    if (cached) {
      setSubscribers(cached);
      if (subscribers.length === 0) setLoading(false);
    } else {
      if (subscribers.length === 0) setLoading(true);
    }

    try {
      const res: any = await ApiService.admin.getSubscribers();
      const data = res.data || res;
      setSubscribers(data);
      setCache(cacheKey, data);
    } catch (err) {
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Remove this subscriber?')) return;
    try {
      await ApiService.request(`/admin/subscribers/${id}`, { method: 'DELETE' });
      toast.success('Subscriber removed');
      clearCache('admin_subscribers');
      fetchSubscribers();
    } catch (err: any) {
      toast.error(err.message || 'Removal failed');
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={800} mb={3}>Newsletter Subscribers</Typography>

      <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Subscribed Date</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 10 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 10 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ p: 3, borderRadius: '50%', bgcolor: '#eff6ff' }}>
                        <EmailOutlinedIcon sx={{ fontSize: 48, color: '#2563EB' }} />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={700}>No Subscribers Yet</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Your newsletter list is currently empty.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((sub) => (
                  <TableRow key={sub.id} hover sx={{ '&:last-child td': { border: 0 }, transition: 'background-color 0.2s' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(37,99,235,0.1)', color: '#2563EB' }}>
                          {sub.email.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" fontWeight={700}>{sub.email}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {new Date(sub.created_at * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Remove Subscriber">
                        <IconButton size="small" color="error" onClick={() => handleDelete(sub.id)} sx={{ bgcolor: 'rgba(220,38,38,0.05)', '&:hover': { bgcolor: 'rgba(220,38,38,0.1)' }}}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
