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
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import ApiService from '../../services/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getCache, setCache } from '../../utils/cache';
import { Divider } from '@mui/material';
import { getPropertyUrl } from '../../utils/urls';

export default function PropertyModeration() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);

  const fetchProperties = async () => {
    const cacheKey = `properties_${page}_${rowsPerPage}_${search}_${statusFilter}_${sourceFilter}`;
    const cached = getCache(cacheKey);

    if (cached) {
      setProperties(cached.properties);
      setTotal(cached.total);
      if (properties.length === 0) setLoading(false);
    } else {
      if (properties.length === 0) setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        search,
        ...(statusFilter && { status: statusFilter }),
        ...(sourceFilter && { source: sourceFilter }),
      });
      const res: any = await ApiService.admin.getProperties(params.toString());
      setProperties(res.data);
      setTotal(res.meta.total);
      setCache(cacheKey, { properties: res.data, total: res.meta.total });
    } catch (err) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, rowsPerPage, search, statusFilter, sourceFilter]);

  const handleVerify = async (id: string | number) => {
    try {
      await ApiService.admin.verifyProperty(id);
      toast.success('Property verified successfully');
      fetchProperties();
    } catch (err: any) {
      toast.error(err.message || 'Verification failed');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Delete this property permanently?')) return;
    try {
      await ApiService.admin.deleteProperty(id);
      toast.success('Property deleted');
      fetchProperties();
    } catch (err: any) {
      toast.error(err.message || 'Deletion failed');
    }
  };

  const isVideo = (url: string) => url?.toLowerCase().match(/\.(mp4|webm|ogg)$/) || (url?.includes('uploads') && url?.split('.').pop()?.match(/(mp4|webm|ogg)$/i));

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', gap: 2, flex: 1, minWidth: 300 }}>
            <TextField
              size="small"
              placeholder="Search properties by title or address..."
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

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label="All" 
              onClick={() => { setStatusFilter(''); setSourceFilter(''); }}
              color={!statusFilter && !sourceFilter ? "primary" : "default"}
              variant={!statusFilter && !sourceFilter ? "filled" : "outlined"}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Chip 
              label="Active" 
              onClick={() => { setStatusFilter('active'); setSourceFilter(''); }}
              color={statusFilter === 'active' ? "success" : "default"}
              variant={statusFilter === 'active' ? "filled" : "outlined"}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Chip 
              label="Inactive" 
              onClick={() => { setStatusFilter('inactive'); setSourceFilter(''); }}
              color={statusFilter === 'inactive' ? "error" : "default"}
              variant={statusFilter === 'inactive' ? "filled" : "outlined"}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />
            <Chip 
              label="WhatsApp" 
              onClick={() => { setSourceFilter('whatsapp'); setStatusFilter(''); }}
              color={sourceFilter === 'whatsapp' ? "primary" : "default"}
              variant={sourceFilter === 'whatsapp' ? "filled" : "outlined"}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Chip 
              label="Platform" 
              onClick={() => { setSourceFilter('platform'); setStatusFilter(''); }}
              color={sourceFilter === 'platform' ? "primary" : "default"}
              variant={sourceFilter === 'platform' ? "filled" : "outlined"}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Box>

        <TableContainer sx={{ minHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Property</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Agent</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Source</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Verification</TableCell>
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
              ) : properties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ p: 3, borderRadius: '50%', bgcolor: '#f0fdf4' }}>
                        <HomeWorkOutlinedIcon sx={{ fontSize: 48, color: '#059669' }} />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={700}>No properties found</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search or filter to find properties.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                properties.map((property) => (
                  <TableRow key={property.id} hover sx={{ '&:last-child td': { border: 0 }, transition: 'background-color 0.2s' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {(() => {
                          const firstMediaUrl = property.media?.[0]?.file_url || property.media_urls?.[0] || property.images?.[0];
                          const mediaUrl = ApiService.getMediaUrl(firstMediaUrl || '/Asset_8.png');
                          const isVid = firstMediaUrl ? isVideo(firstMediaUrl) : false;

                          return (
                            <Box 
                              sx={{ position: 'relative', width: 60, height: 48, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                              onClick={() => {
                                setPreviewMedia(firstMediaUrl);
                                setPreviewOpen(true);
                              }}
                            >
                              {isVid ? (
                                <Box
                                  component="video"
                                  src={mediaUrl}
                                  sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2, bgcolor: 'black', border: '1px solid #e2e8f0' }}
                                />
                              ) : (
                                <Box
                                  component="img"
                                  src={mediaUrl}
                                  sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2, bgcolor: '#f1f5f9', border: '1px solid #e2e8f0' }}
                                />
                              )}
                              {isVid && (
                                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                                  <PlayCircleOutlineIcon sx={{ color: 'white', fontSize: 24 }} />
                                </Box>
                              )}
                            </Box>
                          );
                        })()}
                        <Box>
                          <Typography variant="body2" fontWeight={700} sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {property.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>₦{property.basic_rent?.toLocaleString()}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{property.agent?.name || 'Unknown'}</Typography>
                      <Typography variant="caption" color="text.secondary">{property.agent?.phone_number}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={property.status} 
                        size="small" 
                        sx={{ 
                          fontWeight: 700, 
                          textTransform: 'capitalize',
                          bgcolor: property.status === 'active' ? '#f0fdf4' : '#fef2f2',
                          color: property.status === 'active' ? '#166534' : '#991b1b',
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={property.source || 'platform'} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          fontWeight: 700, 
                          textTransform: 'capitalize',
                          fontSize: '0.65rem',
                          height: 20
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={property.is_verified ? 'Verified' : 'Pending'} 
                        size="small" 
                        variant={property.is_verified ? 'filled' : 'outlined'}
                        color={property.is_verified ? 'success' : 'warning'}
                        sx={{ fontWeight: 700, height: 24 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="View Property">
                          <IconButton size="small" color="primary" onClick={() => window.open(getPropertyUrl(property), '_blank')} sx={{ bgcolor: 'rgba(27,79,216,0.05)', '&:hover': { bgcolor: 'rgba(27,79,216,0.1)' }}}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {!property.is_verified && (
                          <Tooltip title="Verify Property">
                            <IconButton size="small" color="success" onClick={() => handleVerify(property.id)} sx={{ bgcolor: 'rgba(34,197,94,0.05)', '&:hover': { bgcolor: 'rgba(34,197,94,0.1)' }}}>
                              <VerifiedUserIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete Permanently">
                          <IconButton size="small" color="error" onClick={() => handleDelete(property.id)} sx={{ bgcolor: 'rgba(220,38,38,0.05)', '&:hover': { bgcolor: 'rgba(220,38,38,0.1)' }}}>
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

      {/* Media Preview Modal */}
      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, overflow: 'hidden', bgcolor: 'black' }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', zHeaders: 10, '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
          >
            <CloseIcon />
          </IconButton>
          
          {previewMedia && isVideo(previewMedia) ? (
            <Box
              component="video"
              src={ApiService.getMediaUrl(previewMedia)}
              controls
              autoPlay
              sx={{ width: '100%', maxHeight: '80vh' }}
            />
          ) : (
            <Box
              component="img"
              src={ApiService.getMediaUrl(previewMedia || '/Asset_8.png')}
              sx={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
