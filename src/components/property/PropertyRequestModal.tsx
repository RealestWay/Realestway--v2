import React, { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    IconButton, 
    Typography, 
    TextField, 
    Button, 
    Box, 
    Grid, 
    MenuItem,
    CircularProgress 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import InputAdornment from '@mui/material/InputAdornment';
import { requestService } from '../../services/requestService';
import toast from 'react-hot-toast';

interface PropertyRequestModalProps {
    open: boolean;
    onClose: () => void;
    initialData?: {
        city?: string;
        state?: string;
        house_type?: string;
    };
}

const PropertyRequestModal: React.FC<PropertyRequestModalProps> = ({ open, onClose, initialData }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        requester_name: '',
        requester_phone: '',
        message_text: '',
        budget: '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        house_type: initialData?.house_type || '',
        location: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await requestService.submitRequest(formData);
            toast.success('Your request has been submitted and shared with our agent community!');
            onClose();
            setFormData({
                requester_name: '',
                requester_phone: '',
                message_text: '',
                budget: '',
                city: '',
                state: '',
                house_type: '',
                location: '',
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: { borderRadius: 4, p: 1 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={800}>Submit House Request</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon sx={{ fontSize: 20 }} />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Can't find what you're looking for? Submit a request and we'll broadcast it to thousands of agents in our community.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid  size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Your Name"
                                name="requester_name"
                                value={formData.requester_name}
                                onChange={handleChange}
                                required
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid  size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="requester_phone"
                                value={formData.requester_phone}
                                onChange={handleChange}
                                required
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid  size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="What are you looking for?"
                                name="message_text"
                                value={formData.message_text}
                                onChange={handleChange}
                                required
                                multiline
                                rows={3}
                                placeholder="E.g. I need a 3 bedroom flat in Lekki Phase 1, budget is 5M"
                            />
                        </Grid>
                        <Grid  size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid  size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                size="small"
                            />
                        </Grid>
                        <Grid  size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="House Type"
                                name="house_type"
                                value={formData.house_type}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <HomeWorkIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid  size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Budget"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AttachMoneyIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ 
                            mt: 4, 
                            mb: 2, 
                            py: 1.5, 
                            borderRadius: 2, 
                            fontWeight: 700,
                            bgcolor: 'primary.main',
                            boxShadow: '0 4px 12px rgba(0,162,86,0.2)'
                        }}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    >
                        {loading ? 'Submitting...' : 'Submit & Broadcast Request'}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default PropertyRequestModal;

