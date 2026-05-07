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
import TablePagination from '@mui/material/TablePagination';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import BlockIcon from '@mui/icons-material/Block';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import ApiService from '../../services/api';
import toast from 'react-hot-toast';
import { getCache, setCache } from '../../utils/cache';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState('');

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    kyc_status: 'unverified'
  });

  const fetchUsers = async () => {
    const cacheKey = `users_${page}_${rowsPerPage}_${search}_${roleFilter}`;
    const cached = getCache(cacheKey);
    
    // 1. Optimistic UI
    if (cached) {
      setUsers(cached.users);
      setTotal(cached.total);
      if (users.length === 0) setLoading(false); // Only disable loading overlay if we successfully hydrated
    } else {
      if (users.length === 0) setLoading(true);
    }

    // 2. Background revalidation
    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        search,
        ...(roleFilter && { role: roleFilter }),
      });
      const res: any = await ApiService.admin.getUsers(params.toString());
      setUsers(res.data);
      setTotal(res.meta.total);
      setCache(cacheKey, { users: res.data, total: res.meta.total });
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, rowsPerPage, search, roleFilter]);

  const handleOpenEdit = (user: any) => {
    setEditingUserId(user.uuid || user.phone_number);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      kyc_status: user.kyc_status || 'unverified'
    });
    setEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setEditingUserId(null);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;
    
    setSubmitting(true);
    try {
      await ApiService.admin.updateUser(editingUserId, formData);
      toast.success('User updated successfully');
      handleCloseEdit();
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlockToggle = async (user: any) => {
    try {
      // Logic: block means phone_verified = false (as implemented in controller)
      const isBlocking = user.phone_verified;
      await ApiService.admin.blockUser(user.phone_number || user.uuid, isBlocking);
      toast.success(isBlocking ? 'User blocked' : 'User unblocked');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
    try {
      await ApiService.admin.deleteUser(userId);
      toast.success('User deleted');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', gap: 2, flex: 1, minWidth: 300 }}>
            <TextField
              size="small"
              placeholder="Search users by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              size="small"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{ width: 150, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              InputProps={{ startAdornment: <FilterListIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }}
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="user">Users</MenuItem>
              <MenuItem value="agent">Agents</MenuItem>
              <MenuItem value="admin">Admins</MenuItem>
            </TextField>
          </Box>
        </Box>

        <TableContainer sx={{ minHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>User Info</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Verification</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Joined Date</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ p: 3, borderRadius: '50%', bgcolor: '#f1f5f9' }}>
                        <SearchIcon sx={{ fontSize: 48, color: '#94a3b8' }} />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={700}>No users found</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search or filters to find what you're looking for.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.uuid || user.phone_number} hover sx={{ '&:last-child td': { border: 0 }}}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={user.profile_picture} sx={{ width: 40, height: 40 }}>{user.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{user.email || 'No email'}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{user.phone_number}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        size="small" 
                        sx={{ 
                          fontWeight: 700, 
                          textTransform: 'capitalize',
                          bgcolor: user.role === 'admin' || user.role === 'super_admin' ? '#fef2f2' : user.role === 'agent' ? '#f0fdf4' : '#eff6ff',
                          color: user.role === 'admin' || user.role === 'super_admin' ? '#991b1b' : user.role === 'agent' ? '#166534' : '#1e40af',
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Chip 
                          label={user.email_verified ? 'Email Verified' : 'Email Pending'} 
                          size="small" 
                          variant="outlined"
                          color={user.email_verified ? 'success' : 'warning'}
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }}
                        />
                        <Chip 
                          label={user.phone_verified ? 'Account Active' : 'Account Blocked'} 
                          size="small" 
                          variant={user.phone_verified ? 'outlined' : 'filled'}
                          color={user.phone_verified ? 'success' : 'error'}
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {new Date(user.created_at * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Edit User">
                          <IconButton size="small" color="primary" onClick={() => handleOpenEdit(user)} disabled={user.role === 'super_admin'}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={user.phone_verified ? 'Block User' : 'Unblock User'}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleBlockToggle(user)}
                            color={user.phone_verified ? 'default' : 'success'}
                            disabled={user.role === 'super_admin'}
                          >
                            {user.phone_verified ? <BlockIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDelete(user.uuid || user.phone_number)}
                            disabled={user.role === 'super_admin'}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
          sx={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
        />
      </Paper>

      {/* Edit User Modal */}
      <Dialog 
        open={editModalOpen} 
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <form onSubmit={handleSubmitEdit}>
          <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.05)', pb: 2 }}>
            Edit User Profile
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid  size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid  size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid  size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="agent">Agent</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </TextField>
              </Grid>
              <Grid  size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="KYC Status"
                  value={formData.kyc_status}
                  onChange={(e) => setFormData({ ...formData, kyc_status: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                >
                  <MenuItem value="unverified">Unverified</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <Button onClick={handleCloseEdit} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, px: 4 }}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

