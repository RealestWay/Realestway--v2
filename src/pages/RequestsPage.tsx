'use client';

import React, { useState } from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Grid, 
    Button, 
    Paper, 
    TextField, 
    InputAdornment, 
    Chip, 
    Skeleton,
    Pagination,
    Stack,
    IconButton
} from '@mui/material';
import { 
    Search as SearchIcon, 
    MapPin as MapPinIcon, 
    Clock as ClockIcon, 
    Phone as PhoneIcon, 
    User as UserIcon, 
    Home as HomeIcon, 
    Tag as TagIcon 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { usePropertyRequests } from '../hooks/usePropertyRequests';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Divider } from '@mui/material';

const RequestsPage: React.FC = () => {
    const [hasMounted, setHasMounted] = React.useState(false);
    const [page, setPage] = useState(1);
    const [draftFilters, setDraftFilters] = useState({ category: 'all', house_type: '', city: '', state: '' });
    const [appliedFilters, setAppliedFilters] = useState({ category: 'all', house_type: '', city: '', state: '' });

    React.useEffect(() => {
        setHasMounted(true);
    }, []);

    const { data, isLoading, isError } = usePropertyRequests({
        ...appliedFilters,
        page
    });

    const requests = data?.data || [];
    const totalPages = data?.last_page || 1;

    const handleSearch = () => {
        setAppliedFilters(draftFilters);
        setPage(1);
    };

    const handleCategoryChange = (cat: string) => {
        setDraftFilters(prev => ({ ...prev, category: cat }));
        setAppliedFilters(prev => ({ ...prev, category: cat }));
        setPage(1);
    };

    if (!hasMounted) {
        return (
            <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar position="absolute" />
                <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 16 }, pb: 10, flex: 1 }}>
                     <Box sx={{ py: 10, textAlign: 'center' }}>
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '24px' }} />
                     </Box>
                </Container>
                <Footer />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar position="absolute" />
            
            <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 16 }, pb: 10, flex: 1 }}>
                {/* Header Section */}
                <Box sx={{ mb: 8, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', md: 'flex-start' }, gap: 4, textAlign: { xs: 'center', md: 'left' } }}>
                    <Box>
                        <Typography 
                            variant="h2" 
                            fontWeight={900} 
                            sx={{ 
                                fontSize: { xs: '2.5rem', md: '3.5rem' }, 
                                color: 'text.primary', 
                                mb: 2,
                                letterSpacing: '-0.02em'
                            }}
                        >
                            House <Box component="span" sx={{ color: 'primary.main' }}>Requests</Box>
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', maxWidth: 600 }}>
                            Browse what people are looking for. If you have a matching property, 
                            reach out and close the deal.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => toast.info('Submit Request feature is coming soon!')}
                        sx={{ 
                            bgcolor: 'secondary.main', 
                            color: 'white', 
                            px: 4, 
                            py: 1.5, 
                            borderRadius: '12px',
                            fontWeight: 700,
                            textTransform: 'none',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                            '&:hover': { bgcolor: 'secondary.dark' }
                        }}
                    >
                        Submit Request
                    </Button>
                </Box>

                {/* Filters Paper */}
                <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid', borderColor: 'divider', mb: 6, bgcolor: 'white' }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 4, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                        {['all', 'rent', 'sale'].map((cat) => (
                            <Chip
                                key={cat}
                                label={cat === 'all' ? 'All Requests' : cat === 'rent' ? 'For Rent' : 'For Sale'}
                                onClick={() => handleCategoryChange(cat)}
                                sx={{
                                    px: 2,
                                    py: 2.5,
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    bgcolor: appliedFilters.category === cat ? 'primary.main' : 'grey.100',
                                    color: appliedFilters.category === cat ? 'white' : 'text.secondary',
                                    '&:hover': { bgcolor: appliedFilters.category === cat ? 'primary.dark' : 'grey.200' },
                                    transition: 'all 0.2s'
                                }}
                            />
                        ))}
                    </Stack>

                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth
                                placeholder="House Type (e.g. Duplex)"
                                value={draftFilters.house_type}
                                onChange={(e) => setDraftFilters(prev => ({ ...prev, house_type: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <HomeIcon size={18} color="#94A3B8" />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: '14px', bgcolor: '#F8FAFC' }
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth
                                placeholder="City"
                                value={draftFilters.city}
                                onChange={(e) => setDraftFilters(prev => ({ ...prev, city: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon size={18} color="#94A3B8" />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: '14px', bgcolor: '#F8FAFC' }
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth
                                placeholder="State"
                                value={draftFilters.state}
                                onChange={(e) => setDraftFilters(prev => ({ ...prev, state: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MapPinIcon size={18} color="#94A3B8" />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: '14px', bgcolor: '#F8FAFC' }
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleSearch}
                                startIcon={<SearchIcon size={18} />}
                                sx={{ 
                                    py: 1.8, 
                                    borderRadius: '14px', 
                                    fontWeight: 800, 
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    bgcolor: 'primary.main',
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }}
                            >
                                Search Requests
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Content Area */}
                {isLoading ? (
                    <Grid container spacing={4}>
                        {[1, 2, 3, 4].map((i) => (
                            <Grid size={{ xs: 12, md: 6 }} key={i}>
                                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: '24px' }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : isError ? (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography variant="h6" color="error">Failed to load requests. Please try again later.</Typography>
                        <Button onClick={() => handleSearch()} sx={{ mt: 2 }}>Retry</Button>
                    </Box>
                ) : requests.length > 0 ? (
                    <>
                        <Grid container spacing={4}>
                            {requests.map((request: any) => (
                                <Grid size={{ xs: 12, md: 6 }} key={request.uuid}>
                                    <Paper 
                                        elevation={0} 
                                        sx={{ 
                                            p: 4, 
                                            borderRadius: '24px', 
                                            border: '1px solid', 
                                            borderColor: 'divider',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                borderColor: 'primary.light',
                                                boxShadow: '0 12px 24px rgba(0,0,0,0.04)',
                                                transform: 'translateY(-4px)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                            <Chip 
                                                icon={<TagIcon size={12} />}
                                                label={request.house_type || 'General Request'} 
                                                size="small"
                                                sx={{ 
                                                    bgcolor: 'primary.50', 
                                                    color: 'primary.main', 
                                                    fontWeight: 700, 
                                                    fontSize: '0.7rem',
                                                    px: 1
                                                }} 
                                            />
                                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.disabled' }}>
                                                <ClockIcon size={12} />
                                                <Typography variant="caption" fontWeight={600}>
                                                    {formatDistanceToNow(new Date(request.updated_at), { addSuffix: true })}
                                                </Typography>
                                            </Stack>
                                        </Box>

                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                fontSize: '1.1rem', 
                                                fontWeight: 500, 
                                                color: 'text.primary', 
                                                mb: 4, 
                                                lineHeight: 1.6,
                                                flex: 1,
                                                fontStyle: 'italic'
                                            }}
                                        >
                                            "{request.message_text}"
                                        </Typography>

                                        <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

                                        <Grid container spacing={2}>
                                            <Grid size={6}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <MapPinIcon size={16} color="#94A3B8" />
                                                    <Typography variant="body2" color="text.secondary" noWrap fontWeight={500}>
                                                        {request.city || 'Anywhere'}, {request.state || 'NG'}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid size={6}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <UserIcon size={16} color="#94A3B8" />
                                                    <Typography variant="body2" color="text.secondary" noWrap fontWeight={500}>
                                                        {request.requester_name || 'Anonymous'}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid size={6}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <TagIcon size={16} color="#94A3B8" />
                                                    <Typography variant="body2" color="text.secondary" noWrap fontWeight={500}>
                                                        {request.budget || 'Negotiable'}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid size={6}>
                                                <Button 
                                                    component="a"
                                                    href={`tel:${request.requester_phone}`}
                                                    startIcon={<PhoneIcon size={16} />}
                                                    sx={{ 
                                                        color: 'primary.main', 
                                                        fontWeight: 700, 
                                                        textTransform: 'none',
                                                        p: 0,
                                                        minWidth: 0,
                                                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                                    }}
                                                >
                                                    Contact Now
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                                <Pagination 
                                    count={totalPages} 
                                    page={page} 
                                    onChange={(_, v) => setPage(v)} 
                                    color="primary"
                                    size="large"
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            borderRadius: '12px',
                                            fontWeight: 700
                                        }
                                    }}
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 12, bgcolor: 'white', borderRadius: '32px', border: '2px dashed', borderColor: 'divider' }}>
                        <HomeIcon size={64} color="#CBD5E1" style={{ marginBottom: '16px' }} />
                        <Typography variant="h5" fontWeight={700} gutterBottom>No requests found</Typography>
                        <Typography variant="body1" color="text.secondary">Try adjusting your filters or check back later.</Typography>
                        <Button variant="text" onClick={() => setDraftFilters({ category: 'all', house_type: '', city: '', state: '' })} sx={{ mt: 2, fontWeight: 700 }}>Reset Filters</Button>
                    </Box>
                )}
            </Container>

            <Footer />
        </Box>
    );
};

export default RequestsPage;
