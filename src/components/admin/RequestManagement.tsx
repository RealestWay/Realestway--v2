import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    IconButton, 
    Chip, 
    Tooltip,
    TextField,
    InputAdornment,
    Pagination,
    CircularProgress
} from '@mui/material';
import { Search, Trash2, MapPin, Calendar, User, Phone, ExternalLink, MessageSquare } from 'lucide-react';
import { requestService } from '../../services/requestService';
import { PropertyRequest } from '../../types/propertyRequest';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const RequestManagement: React.FC = () => {
    const [requests, setRequests] = useState<PropertyRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await requestService.getAdminRequests(page);
            setRequests(data.data);
            setTotalPages(data.last_page);
        } catch (error) {
            toast.error('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [page]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this request?')) return;
        
        try {
            await requestService.deleteRequest(id);
            toast.success('Request deleted');
            fetchRequests();
        } catch (error) {
            toast.error('Failed to delete request');
        }
    };

    const filteredRequests = requests.filter(req => 
        req.message_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requester_phone?.includes(searchQuery) ||
        req.requester_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>House Requests</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage user house requests from both WhatsApp and the Platform.
                    </Typography>
                </Box>
                <TextField
                    size="small"
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: 300, bgcolor: 'white', borderRadius: 2 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search className="w-4 h-4 text-slate-400" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Requester</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Request Details</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Source</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Posted At</TableCell>
                            <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                    <CircularProgress size={30} />
                                </TableCell>
                            </TableRow>
                        ) : filteredRequests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                    <Typography color="text.secondary">No requests found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRequests.map((request) => (
                                <TableRow key={request.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="body2" fontWeight={700}>
                                                {request.requester_name || 'Anonymous'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Phone className="w-3 h-3" /> {request.requester_phone}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 300 }}>
                                        <Typography variant="body2" sx={{ 
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {request.message_text}
                                        </Typography>
                                        {request.budget && (
                                            <Chip 
                                                label={`Budget: ${request.budget}`} 
                                                size="small" 
                                                sx={{ mt: 1, height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: 'rgba(0,162,86,0.08)', color: 'primary.main' }} 
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <MapPin className="w-3 h-3 text-slate-400" />
                                            <Typography variant="body2">
                                                {request.city}, {request.state}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={request.source} 
                                            size="small" 
                                            color={request.source === 'whatsapp' ? 'success' : 'primary'}
                                            sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {format(new Date(request.created_at), 'MMM dd, yyyy')}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {format(new Date(request.created_at), 'HH:mm')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => handleDelete(request.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {totalPages > 1 && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={(_, v) => setPage(v)} 
                        color="primary"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                borderRadius: 2,
                                fontWeight: 700
                            }
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default RequestManagement;
