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
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CircularProgress from '@mui/material/CircularProgress';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ApiService from '../../services/api';
import toast from 'react-hot-toast';
import { getCache, setCache } from '../../utils/cache';
import { Grid } from '@mui/material';

export default function WhatsappGroupManagement() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // Edit State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    city: '',
    state: '',
    is_active: true,
    description: '',
  });

  const fetchGroups = async () => {
    const cacheKey = `whatsapp_groups_${page}_${rowsPerPage}_${search}`;
    const cached = getCache(cacheKey);

    if (cached) {
      setGroups(cached.groups);
      setTotal(cached.total);
      if (groups.length === 0) setLoading(false);
    } else {
      if (groups.length === 0) setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        search,
      });
      const res: any = await ApiService.admin.getWhatsappGroups(params.toString());
      if (res.success) {
        setGroups(res.data.data);
        setTotal(res.data.total);
        setCache(cacheKey, { groups: res.data.data, total: res.data.total });
      }
    } catch (err) {
      toast.error('Failed to load WhatsApp groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGroups();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, rowsPerPage, search]);

  const handleEditClick = (group: any) => {
    setSelectedGroup(group);
    setEditForm({
      city: group.city || '',
      state: group.state || '',
      is_active: group.is_active,
      description: group.description || '',
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await ApiService.admin.updateWhatsappGroup(selectedGroup.id, editForm);
      toast.success('Group updated successfully');
      setEditDialogOpen(false);
      fetchGroups();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update group');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this group tracking?')) return;
    try {
      await ApiService.admin.deleteWhatsappGroup(id);
      toast.success('Group deleted');
      fetchGroups();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete group');
    }
  };

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid  size={{ xs: 12, sm: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(37,211,102,0.1)', color: '#25D366' }}>
              <WhatsAppIcon />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800}>{total}</Typography>
              <Typography variant="body2" color="text.secondary">Total Groups Tracked</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid  size={{ xs: 12, sm: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(14,165,233,0.1)', color: '#0ea5e9' }}>
              <EditOutlinedIcon />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800}>
                {groups.filter(g => g.is_active).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Active in Current Page</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid  size={{ xs: 12, sm: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
              <WhatsAppIcon />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800}>
                {groups.filter(g => g.consent_status).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Consented in Current Page</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', gap: 2, flex: 1, minWidth: 300 }}>
            <TextField
              size="small"
              placeholder="Search groups by name or ID..."
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
          </Box>
        </Box>

        <TableContainer sx={{ minHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Group Detail</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Default Geography</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>System Status</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Bot Consent</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Added On</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ p: 3, borderRadius: '50%', bgcolor: '#dcfce7' }}>
                        <WhatsAppIcon sx={{ fontSize: 48, color: '#25D366' }} />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={700}>No WhatsApp Groups Found</Typography>
                      <Typography variant="body2" color="text.secondary">
                        The bot has not been added to any WhatsApp groups yet, or none match your search.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                groups.map((group) => (
                  <TableRow key={group.id} hover sx={{ '&:last-child td': { border: 0 }, transition: 'background-color 0.2s' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: '#25D366', color: 'white', fontWeight: 800, width: 36, height: 36 }}>
                          {(group.group_name || 'U').charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700} sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {group.group_name || 'Unnamed Group'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                            {group.group_id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{group.city || 'Any City'}</Typography>
                        <Typography variant="caption" color="text.secondary">{group.state || 'Any State'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={group.is_active ? 'Active' : 'Paused'} 
                        size="small" 
                        color={group.is_active ? 'success' : 'default'}
                        variant={group.is_active ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 700, height: 22, fontSize: '0.65rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={group.consent_status ? 'Consented' : 'Pending'} 
                        size="small" 
                        variant={group.consent_status ? 'filled' : 'outlined'}
                        color={group.consent_status ? 'success' : 'warning'}
                        sx={{ fontWeight: 700, height: 22, fontSize: '0.65rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {group.created_at ? new Date(group.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Edit Metadata">
                          <IconButton size="small" color="primary" onClick={() => handleEditClick(group)} sx={{ bgcolor: 'rgba(27,79,216,0.05)', '&:hover': { bgcolor: 'rgba(27,79,216,0.1)' }}}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove Record">
                          <IconButton size="small" color="error" onClick={() => handleDelete(group.id)} sx={{ bgcolor: 'rgba(220,38,38,0.05)', '&:hover': { bgcolor: 'rgba(220,38,38,0.1)' }}}>
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle fontWeight={800}>Edit WhatsApp Group Metadata</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Updating the City or State will automatically apply these locations to all properties from this group that are currently missing location data.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Default City"
                fullWidth
                value={editForm.city}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
              />
              <TextField
                label="Default State"
                fullWidth
                value={editForm.state}
                onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
              />
            </Box>
            <TextField
              label="Group Description"
              fullWidth
              multiline
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <FormControlLabel
              control={
                <Switch 
                  checked={editForm.is_active} 
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })} 
                />
              }
              label="Scraping Active"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

