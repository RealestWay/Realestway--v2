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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Grid } from '@mui/material';
import ApiService from '../../services/api';
import toast from 'react-hot-toast';
import { getCache, setCache } from '../../utils/cache';
import { User } from '../../types';

export default function AgentProfiles() {
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // View Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<User | null>(null);

  const fetchAgents = async () => {
    const cacheKey = `agents_${page}_${rowsPerPage}_${search}`;
    const cached = getCache(cacheKey);

    if (cached) {
      setAgents(cached.agents);
      setTotal(cached.total);
      if (agents.length === 0) setLoading(false);
    } else {
      if (agents.length === 0) setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        search,
        role: 'agent', // Strictly filter for agents
      });
      const res: any = await ApiService.admin.getUsers(params.toString());
      setAgents(res.data);
      setTotal(res.meta.total);
      setCache(cacheKey, { agents: res.data, total: res.meta.total });
    } catch (err) {
      toast.error('Failed to load agent profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAgents();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, rowsPerPage, search]);

  const handleOpenDetails = (agent: any) => {
    setSelectedAgent(agent);
    setDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
    setSelectedAgent(null);
  };

  const handleBlockToggle = async (agent: any) => {
    try {
      const isBlocking = agent.phone_verified;
      await ApiService.admin.blockUser(agent.phone_number || agent.uuid, isBlocking);
      toast.success(isBlocking ? 'Agent blocked' : 'Agent unblocked');
      fetchAgents();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight={800}>Agent Profiles</Typography>
          <Typography variant="body2" color="text.secondary">Manage registered real estate agents and verify their documents.</Typography>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', gap: 2, flex: 1, minWidth: 300 }}>
            <TextField
              size="small"
              placeholder="Search agents by name, agency, or phone..."
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
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Agent Info</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Agency Details</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Verification Status</TableCell>
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
              ) : agents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ p: 3, borderRadius: '50%', bgcolor: '#f0f9ff' }}>
                        <BadgeOutlinedIcon sx={{ fontSize: 48, color: '#0ea5e9' }} />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={700}>No agents found</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search criteria.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                agents.map((agent) => (
                  <TableRow key={agent.uuid || agent.phone_number} hover sx={{ '&:last-child td': { border: 0 }, transition: 'background-color 0.2s' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={agent.profile_picture} sx={{ width: 40, height: 40, border: '1px solid #e2e8f0' }}>{agent.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{agent.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{agent.email || 'No email'}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{agent.phone_number}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {agent.agent_profile?.agency_name || 'Independent Agent'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {agent.agent_profile?.agency_address || 'No address provided'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Chip 
                          label={agent.kyc_status === 'verified' ? 'KYC Verified' : 'KYC Pending'} 
                          size="small" 
                          variant={agent.kyc_status === 'verified' ? 'filled' : 'outlined'}
                          color={agent.kyc_status === 'verified' ? 'success' : 'warning'}
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }}
                        />
                        <Chip 
                          label={agent.agent_profile?.is_whatsapp_consented ? 'WhatsApp Consent: Yes' : 'WhatsApp Consent: No'} 
                          size="small" 
                          variant="outlined"
                          color={agent.agent_profile?.is_whatsapp_consented ? 'success' : 'default'}
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {new Date(agent.created_at * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleOpenDetails(agent)}
                          sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem', px: 2 }}
                        >
                          View Details
                        </Button>
                        <Tooltip title={agent.phone_verified ? 'Block Agent' : 'Unblock Agent'}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleBlockToggle(agent)}
                            color={agent.phone_verified ? 'error' : 'success'}
                            sx={{ bgcolor: agent.phone_verified ? 'rgba(220,38,38,0.05)' : 'rgba(34,197,94,0.05)' }}
                          >
                            {agent.phone_verified ? <BlockIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
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

      {/* View Details Modal */}
      <Dialog 
        open={detailsModalOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        {selectedAgent && (
          <>
            <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.05)', pb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={selectedAgent.profile_picture} sx={{ width: 48, height: 48 }}>{selectedAgent.name.charAt(0)}</Avatar>
              <Box>
                <Typography variant="h6" fontWeight={800} lineHeight={1.2}>{selectedAgent.name}</Typography>
                <Typography variant="body2" color="text.secondary">Agent Profile Details</Typography>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ mt: 3 }}>
              <Grid container spacing={4}>
                <Grid  size={{ xs: 12, md: 6 }}>
                  <Typography variant="overline" color="primary" fontWeight={700}>Basic Information</Typography>
                  <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Phone Number</Typography>
                      <Typography variant="body2" fontWeight={600}>{selectedAgent.phone_number}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Email Address</Typography>
                      <Typography variant="body2" fontWeight={600}>{selectedAgent.email || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Account Status</Typography>
                      <Chip label={selectedAgent.phone_verified ? 'Active' : 'Blocked'} size="small" color={selectedAgent.phone_verified ? 'success' : 'error'} />
                    </Box>
                  </Box>
                </Grid>

                <Grid  size={{ xs: 12, md: 6 }}>
                  <Typography variant="overline" color="primary" fontWeight={700}>Agency & Verification</Typography>
                  <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Agency Name</Typography>
                      <Typography variant="body2" fontWeight={600}>{selectedAgent.agent_profile?.agency_name || 'Independent'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Agency Address</Typography>
                      <Typography variant="body2" fontWeight={600}>{selectedAgent.agent_profile?.agency_address || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">KYC Status</Typography>
                      <Chip label={selectedAgent.kyc_status} size="small" color="primary" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Identity Document Type</Typography>
                      <Typography variant="body2" fontWeight={600}>{selectedAgent.agent_profile?.id_type || 'None provided'}</Typography>
                    </Box>
                    {selectedAgent.agent_profile?.id_document_url && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Document Attachment</Typography>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          component="a" 
                          href={ApiService.getMediaUrl(selectedAgent.agent_profile.id_document_url)} 
                          target="_blank"
                          sx={{ mt: 0.5, borderRadius: 2, textTransform: 'none' }}
                        >
                          View Document
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <Button onClick={handleCloseDetails} variant="contained" sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, px: 4 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

