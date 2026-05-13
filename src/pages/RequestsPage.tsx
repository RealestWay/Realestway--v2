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
    }, { enabled: hasMounted });

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
            
            <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: 10, flex: 1 }}>
                {/* Header Section */}
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Chip 
                        label="Community Requests" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mb: 2, fontWeight: 700, px: 2, borderRadius: '100px', borderColor: 'primary.light', color: 'primary.main' }} 
                    />
                    <Typography 
                        variant="h2" 
                        fontWeight={900} 
                        sx={{ 
                            fontSize: { xs: '2.5rem', md: '4rem' }, 
                            color: 'text.primary', 
                            mb: 2,
                            letterSpacing: '-0.04em',
                            lineHeight: 1.1
                        }}
                    >
                        Real Estate <Box component="span" sx={{ color: 'primary.main' }}>Matchmaker</Box>
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.2rem', maxWidth: 700, mx: 'auto', mb: 5 }}>
                        Discover what prospective tenants and buyers are searching for. 
                        Bridge the gap between demand and your available listings.
                    </Typography>
                    
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 6 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => toast.info('Submit Request feature is coming soon!')}
                            sx={{ 
                                bgcolor: 'secondary.main', 
                                color: 'white', 
                                px: 5, 
                                py: 2, 
                                borderRadius: '16px',
                                fontWeight: 800,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                '&:hover': { bgcolor: 'secondary.dark', transform: 'translateY(-2px)' },
                                transition: 'all 0.2s'
                            }}
                        >
                            Post a Request
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{ 
                                px: 4, 
                                py: 2, 
                                borderRadius: '16px',
                                fontWeight: 800,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                border: '2px solid',
                                borderColor: 'grey.200',
                                color: 'text.primary',
                                '&:hover': { border: '2px solid', borderColor: 'primary.main', bgcolor: 'transparent' }
                            }}
                        >
                            How it Works
                        </Button>
                    </Stack>

                    <Divider sx={{ maxWidth: 200, mx: 'auto', borderBottomWidth: 3, borderRadius: 2, borderColor: 'primary.light', opacity: 0.3 }} />
                </Box>

                {/* Filters Paper */}
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: { xs: 3, md: 5 }, 
                        borderRadius: '32px', 
                        border: '1px solid', 
                        borderColor: 'divider', 
                        mb: 8, 
                        bgcolor: 'white',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.04)'
                    }}
                >
                    <Stack direction="row" spacing={1.5} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
                        {['all', 'rent', 'sale'].map((cat) => (
                            <Chip
                                key={cat}
                                label={cat === 'all' ? 'All Requests' : cat === 'rent' ? 'For Rent' : 'For Sale'}
                                onClick={() => handleCategoryChange(cat)}
                                sx={{
                                    px: 2,
                                    py: 2.8,
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                    bgcolor: appliedFilters.category === cat ? 'primary.main' : 'rgba(0,162,86,0.05)',
                                    color: appliedFilters.category === cat ? 'white' : 'primary.main',
                                    border: '1px solid',
                                    borderColor: appliedFilters.category === cat ? 'primary.main' : 'transparent',
                                    '&:hover': { bgcolor: appliedFilters.category === cat ? 'primary.dark' : 'rgba(0,162,86,0.1)' },
                                    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                                    borderRadius: '12px'
                                }}
                            />
                        ))}
                    </Stack>

                    <Grid container spacing={3} alignItems="center">
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Box>
                                <Typography variant="caption" fontWeight={700} sx={{ ml: 1, mb: 1, display: 'block', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    House Type
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="e.g. Duplex"
                                    value={draftFilters.house_type}
                                    onChange={(e) => setDraftFilters(prev => ({ ...prev, house_type: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <HomeIcon size={20} color="#00A256" />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: '16px', bgcolor: '#F8FAFC', border: '1px solid transparent', '&:hover': { borderColor: 'primary.light' } }
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Box>
                                <Typography variant="caption" fontWeight={700} sx={{ ml: 1, mb: 1, display: 'block', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    City
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Enter city"
                                    value={draftFilters.city}
                                    onChange={(e) => setDraftFilters(prev => ({ ...prev, city: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon size={20} color="#00A256" />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: '16px', bgcolor: '#F8FAFC', border: '1px solid transparent', '&:hover': { borderColor: 'primary.light' } }
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Box>
                                <Typography variant="caption" fontWeight={700} sx={{ ml: 1, mb: 1, display: 'block', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    State
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Enter state"
                                    value={draftFilters.state}
                                    onChange={(e) => setDraftFilters(prev => ({ ...prev, state: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MapPinIcon size={20} color="#00A256" />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: '16px', bgcolor: '#F8FAFC', border: '1px solid transparent', '&:hover': { borderColor: 'primary.light' } }
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Box sx={{ pt: 3.5 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSearch}
                                    startIcon={<SearchIcon size={20} />}
                                    sx={{ 
                                        py: 2.2, 
                                        borderRadius: '16px', 
                                        fontWeight: 800, 
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        bgcolor: 'primary.main',
                                        '&:hover': { bgcolor: 'primary.dark', boxShadow: '0 8px 20px rgba(0,162,86,0.3)' },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Filter Results
                                </Button>
                            </Box>
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
                                            p: { xs: 3, md: 4 }, 
                                            borderRadius: '32px', 
                                            border: '1px solid', 
                                            borderColor: 'divider',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            bgcolor: 'white',
                                            '&:hover': {
                                                borderColor: 'primary.light',
                                                boxShadow: '0 20px 40px rgba(0,162,86,0.06)',
                                                transform: 'translateY(-6px)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ bgcolor: 'primary.50', color: 'primary.main', width: 40, height: 40 }}>
                                                    <UserIcon size={20} />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={800} color="text.primary">
                                                        {request.requester_name || 'Verified Seeker'}
                                                    </Typography>
                                                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.disabled' }}>
                                                        <ClockIcon size={12} />
                                                        <Typography variant="caption" fontWeight={600}>
                                                            {formatDistanceToNow(new Date(request.updated_at), { addSuffix: true })}
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            </Box>
                                            <Chip 
                                                label={request.house_type || 'General'} 
                                                size="small"
                                                sx={{ 
                                                    bgcolor: 'grey.50', 
                                                    color: 'text.secondary', 
                                                    fontWeight: 700, 
                                                    fontSize: '0.7rem',
                                                    px: 1,
                                                    borderRadius: '8px'
                                                }} 
                                            />
                                        </Box>

                                        <Box sx={{ flex: 1, mb: 4 }}>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    fontSize: '1.15rem', 
                                                    fontWeight: 600, 
                                                    color: 'text.primary', 
                                                    lineHeight: 1.6,
                                                    fontFamily: '"Outfit", sans-serif',
                                                }}
                                            >
                                                {request.message_text}
                                            </Typography>
                                        </Box>

                                        <Box 
                                            sx={{ 
                                                p: 2.5, 
                                                bgcolor: '#F8FAFC', 
                                                borderRadius: '24px',
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: 2
                                            }}
                                        >
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Box sx={{ p: 1, bgcolor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                                    <MapPinIcon size={16} color="#00A256" />
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: '0.6rem' }}>Location</Typography>
                                                    <Typography variant="body2" color="text.primary" noWrap fontWeight={700}>
                                                        {request.city || 'Anywhere'}, {request.state || 'NG'}
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Box sx={{ p: 1, bgcolor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                                    <TagIcon size={16} color="#00A256" />
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: '0.6rem' }}>Budget</Typography>
                                                    <Typography variant="body2" color="primary.main" noWrap fontWeight={800}>
                                                        {request.budget || 'Negotiable'}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>

                                        <Button 
                                            fullWidth
                                            component="a"
                                            href={`tel:${request.requester_phone}`}
                                            variant="contained"
                                            startIcon={<PhoneIcon size={18} />}
                                            sx={{ 
                                                mt: 3,
                                                bgcolor: 'primary.main', 
                                                color: 'white',
                                                fontWeight: 800, 
                                                textTransform: 'none',
                                                py: 1.8,
                                                borderRadius: '16px',
                                                '&:hover': { bgcolor: 'primary.dark', boxShadow: '0 8px 20px rgba(0,162,86,0.2)' }
                                            }}
                                        >
                                            Contact Seeker
                                        </Button>
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
