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
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ApiService from '../../services/api';
import toast from 'react-hot-toast';

export default function ContactRequestManagement() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // Update Status Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        search,
      });
      const res: any = await ApiService.admin.getContactRequests(params.toString());
      setRequests(res.data);
      setTotal(res.meta.total);
    } catch (err) {
      toast.error('Failed to load contact requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, rowsPerPage, search]);

  const handleOpenStatus = (request: any) => {
    setSelectedRequest(request);
    setAdminNote(request.admin_note || '');
    setStatusModalOpen(true);
  };

  const handleCloseStatus = () => {
    setStatusModalOpen(false);
    setSelectedRequest(null);
    setAdminNote('');
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedRequest) return;
    setUpdating(true);
    try {
      await ApiService.admin.updateContactRequest(selectedRequest.id, {
        status,
        admin_note: adminNote,
      });
      toast.success(`Request marked as ${status}`);
      fetchRequests();
      handleCloseStatus();
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'forwarded': return 'success';
      case 'dismissed': return 'error';
      default: return 'warning';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={800}>Agent Contact Requests</Typography>
        <Typography variant="body2" color="text.secondary">Review and manage requests from users to reach agents of non-consented properties.</Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <TextField
            size="small"
            placeholder="Search by requester name, property, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{ maxWidth: 400, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer sx={{ minHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Requester</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Property / Owner</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Message</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Date</TableCell>
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
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                    <Typography variant="body2" color="text.secondary">No contact requests found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>{req.requester_name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <PhoneOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">{req.requester_phone}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MailOutlineIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">{req.requester_email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 200 }}>
                          {req.property_title}
                        </Typography>
                        <Typography variant="caption" color="primary" sx={{ display: 'block' }}>
                          Owner: {req.owner_phone_masked}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.message || <span style={{ opacity: 0.5 }}>No message</span>}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={req.status} 
                        size="small" 
                        color={getStatusColor(req.status)} 
                        sx={{ textTransform: 'capitalize', fontWeight: 600, height: 24 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(req.created_at).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={() => handleOpenStatus(req)}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                      >
                        Update
                      </Button>
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
        />
      </Paper>

      {/* Update Status Modal */}
      <Dialog 
        open={statusModalOpen} 
        onClose={handleCloseStatus}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        {selectedRequest && (
          <>
            <DialogTitle sx={{ fontWeight: 800 }}>Update Request Status</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 1 }}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <PersonOutlineIcon color="action" />
                    <Typography variant="body2"><strong>From:</strong> {selectedRequest.requester_name} ({selectedRequest.requester_phone})</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <HomeOutlinedIcon color="action" />
                    <Typography variant="body2"><strong>Property:</strong> {selectedRequest.property_title}</Typography>
                  </Box>
                  {selectedRequest.message && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <MailOutlineIcon color="action" />
                      <Typography variant="body2"><strong>Message:</strong> {selectedRequest.message}</Typography>
                    </Box>
                  )}
                </Box>

                <TextField
                  fullWidth
                  label="Admin Note"
                  multiline
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="E.g. Sent contact via WhatsApp"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseStatus} disabled={updating}>Cancel</Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button 
                variant="outlined" 
                color="error" 
                disabled={updating}
                onClick={() => handleUpdateStatus('dismissed')}
                sx={{ borderRadius: 2 }}
              >
                Dismiss
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                disabled={updating}
                onClick={() => handleUpdateStatus('forwarded')}
                sx={{ borderRadius: 2 }}
              >
                Mark Forwarded
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
