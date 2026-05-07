'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  CircularProgress, 
  Paper, 
  Stack, 
  Alert,
  Fade,
  useTheme,
  IconButton
} from '@mui/material';
import { 
  CheckCircleOutline, 
  ErrorOutline, 
  ArrowBack,
  HomeWorkOutlined,
  CalendarToday
} from '@mui/icons-material';
import ApiService from '@/src/services/api';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';

export default function ConfirmAvailabilityPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const theme = useTheme();
  
  const uuid = params.id as string;
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await ApiService.properties.getOne(uuid);
        setProperty(response.data);
      } catch (err: any) {
        console.error('Failed to fetch property:', err);
        setErrorMsg('We could not find the property you are looking for.');
      } finally {
        setLoading(false);
      }
    };

    if (uuid) fetchProperty();
  }, [uuid]);

  const handleConfirm = async (stillAvailable: boolean) => {
    setSubmitting(true);
    try {
      await ApiService.properties.confirmAvailability(uuid, stillAvailable, token || undefined);
      setStatus('success');
    } catch (err: any) {
      console.error('Confirmation failed:', err);
      if (err.status === 401) {
        // Redirect to login if unauthenticated and no valid token was used
        const currentUrl = window.location.pathname + window.location.search;
        router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
      } else {
        setErrorMsg(err.message || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.50' }}>
      <Navbar />
      
      <Container maxWidth="sm" sx={{ py: 8, flex: 1 }}>
        <Fade in timeout={800}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            {status === 'success' ? (
              <Stack spacing={3} alignItems="center" textAlign="center">
                <CheckCircleOutline sx={{ fontSize: 80, color: 'success.main' }} />
                <Typography variant="h4" fontWeight={700}>Thank You!</Typography>
                <Typography color="text.secondary">
                  Your response has been recorded. We appreciate you keeping the Realestway platform accurate.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={() => router.push('/dashboard')}
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  Go to Dashboard
                </Button>
              </Stack>
            ) : (
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h4" fontWeight={800} gutterBottom>
                    Listing Verification
                  </Typography>
                  <Typography color="text.secondary">
                    Help us keep Realestway fresh. Is this property still available for {property?.property_category === 'sale' ? 'sale' : 'rent'}?
                  </Typography>
                </Box>

                {property && (
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'primary.50', 
                      borderRadius: 3, 
                      display: 'flex', 
                      gap: 2,
                      alignItems: 'center',
                      border: '1px solid',
                      borderColor: 'primary.100'
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        bgcolor: 'white', 
                        borderRadius: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'primary.main',
                        flexShrink: 0
                      }}
                    >
                      <HomeWorkOutlined />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={700} noWrap>{property.title}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>{property.address}</Typography>
                    </Box>
                  </Box>
                )}

                {errorMsg && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>{errorMsg}</Alert>
                )}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={submitting}
                    onClick={() => handleConfirm(true)}
                    sx={{ 
                      borderRadius: 3, 
                      py: 1.5,
                      fontWeight: 700,
                      boxShadow: theme.shadows[4]
                    }}
                  >
                    {submitting ? <CircularProgress size={24} color="inherit" /> : 'Yes, Still Available'}
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    color="error"
                    disabled={submitting}
                    onClick={() => handleConfirm(false)}
                    sx={{ 
                      borderRadius: 3, 
                      py: 1.5,
                      fontWeight: 700
                    }}
                  >
                    No, Remove It
                  </Button>
                </Stack>

                <Typography variant="caption" color="text.secondary" textAlign="center">
                  By clicking "Yes", your listing's expiration timer will be reset.
                </Typography>
              </Stack>
            )}
          </Paper>
        </Fade>
      </Container>

      <Footer />
    </Box>
  );
}
