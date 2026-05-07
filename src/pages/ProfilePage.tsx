'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import VerifiedIcon from '@mui/icons-material/Verified';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import GoogleIcon from '@mui/icons-material/Google';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAuth } from '@/src/context/AuthContext';
import ApiService from '@/src/services/api';

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 59;
const MAX_RESEND_ATTEMPTS = 5;

export default function ProfilePage() {
  const router = useRouter();
  const { user, login, token, logout, refreshUser } = useAuth();

  // Local user state editable fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [whatsapp, setWhatsapp] = useState(user?.phone_number || '');
  
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  
  // Status states
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState<'success' | 'error' | 'warning'>('success');
  
  const [hasPropertiesToClaim, setHasPropertiesToClaim] = useState(false);
  const [checkingAgent, setCheckingAgent] = useState(true);
  const [processingAgent, setProcessingAgent] = useState(false);

  // Load cache on mount
  useEffect(() => {
    try {
      const cachedClaim = localStorage.getItem('profile_claimable');
      if (cachedClaim !== null) {
        setHasPropertiesToClaim(JSON.parse(cachedClaim));
        setCheckingAgent(false);
      }
    } catch (e) {
      console.error('Failed to load profile cache', e);
    }
  }, []);

  // OTP Modal states
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(MAX_RESEND_ATTEMPTS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* OTP Countdown timer */
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (otpModalOpen && countdown > 0) {
      t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(t);
  }, [countdown, otpModalOpen]);

  useEffect(() => {
    if (user) {
      console.log(user);
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone_number || '');
      setWhatsapp(user.phone_number || '');
    }
  }, [user]);

  useEffect(() => {
    // Check if user has a profile to claim
    const checkProfile = async () => {
      try {
        const response: any = await ApiService.agent.checkProfile();
        const claimable = !!response.has_profile;
        setHasPropertiesToClaim(claimable);
        localStorage.setItem('profile_claimable', JSON.stringify(claimable));
      } catch (error) {
        setHasPropertiesToClaim(false);
      } finally {
        setCheckingAgent(false);
      }
    };
    if (user) {
      checkProfile();
    }
  }, [user]);

  const showSnack = (message: string, severity: 'success' | 'error' | 'warning' = 'success') => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  const handleSave = async () => {
    try {
      setProcessingAgent(true); // Using existing processing state for loading
      await ApiService.auth.updateProfile({
        name,
        email,
        phone_number: phone,
      });
      // Update local context user? The me endpoint or login function could be used, or just wait for next load.
      // But let's just show success for now.
      refreshUser();
      showSnack('Profile updated successfully!', 'success');
    } catch (err: any) {
      showSnack(err.message || 'Failed to update profile.', 'error');
    } finally {
      setProcessingAgent(false);
    }
  };

  // --- OTP Verification Logic ---
  const handleOpenOtpModal = async () => {
    if (!phone) {
      showSnack('Please provide a phone number first.', 'error');
      return;
    }
    try {
      setOtpLoading(true);
      await ApiService.auth.sendOtp({ phone_number: phone });
      setOtpModalOpen(true);
      setOtpError('');
      setOtp(Array(OTP_LENGTH).fill(''));
      setCountdown(RESEND_COUNTDOWN);
      setCanResend(false);
      setResendAttempts(MAX_RESEND_ATTEMPTS);
    } catch (err: any) {
      showSnack(err.message || 'Failed to send OTP.', 'error');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError('');
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < OTP_LENGTH) {
      setOtpError('Please enter the complete 6-digit code.');
      return;
    }
    setOtpLoading(true);
    try {
      const response: any = await ApiService.auth.verifyOtp({ phone_number: phone, otp_code: otpCode });
      if (response && response.success && response.user) {
        login(response.user, token as string);
        setOtpModalOpen(false);
        showSnack('Phone verified successfully!', 'success');
      }
    } catch (err: any) {
      setOtpError(err.message || 'Verification failed. Invalid OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || resendAttempts <= 0) return;
    
    setOtpLoading(true);
    try {
      await ApiService.auth.sendOtp({ phone_number: phone });
      setResendAttempts(prev => prev - 1);
      setCountdown(RESEND_COUNTDOWN);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(''));
      setOtpError('');
      showSnack('New code sent successfully!', 'success');
    } catch (err: any) {
      setOtpError(err.message || 'Failed to resend OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  // --- Agent Action Logic ---
  const handleAgentAction = async (action: 'claim' | 'register') => {
    if (!user?.phone_verified) {
      showSnack('Please verify your phone number first before proceeding.', 'warning');
      return;
    }
    
    setProcessingAgent(true);
    try {
      const response: any = action === 'claim' 
        ? await ApiService.agent.claimProfile({ phone_number: phone })
        : await ApiService.agent.register();
        
      if (response && response.success && response.user) {
        login(response.user, token as string);
        showSnack(response.message || 'Successfully upgraded to Agent!', 'success');
        // Redirect to dashboard shortly
        setTimeout(() => router.push('/dashboard'), 1500);
      }
    } catch (err: any) {
      showSnack(err.message || `Failed to ${action} profile.`, 'error');
    } finally {
      setProcessingAgent(false);
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ bgcolor: 'secondary.main', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: { xs: 60, md: 80 },
                  height: { xs: 60, md: 80 },
                  bgcolor: 'primary.main',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 800,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                {name.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  bgcolor: 'white',
                  border: '2px solid',
                  borderColor: 'divider',
                  width: 28,
                  height: 28,
                  '&:hover': { bgcolor: 'grey.50' },
                }}
              >
                <CameraAltIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              </IconButton>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Typography variant="h5" fontWeight={800} color="white">{name}</Typography>
                {user.role === 'agent' && (
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: '14px !important' }} />}
                    label="Agent"
                    size="small"
                    sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600, height: 24, fontSize: '0.72rem' }}
                  />
                )}
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                {phone} · Member
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* --- Phone Verification Banner --- */}
        {!user.phone_verified && (
          <Alert 
            severity="warning" 
            sx={{ mb: 4, borderRadius: 3, display: 'flex', alignItems: 'center' }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                variant="outlined" 
                onClick={handleOpenOtpModal}
                disabled={otpLoading}
                sx={{ fontWeight: 700 }}
              >
                {otpLoading ? 'Sending...' : 'Verify Phone'}
              </Button>
            }
          >
            <Typography variant="body2" fontWeight={700}>Action Required: Verify Phone Number</Typography>
            <Typography variant="caption">Please verify your phone number to unlock all features, including saving properties and upgrading to an agent.</Typography>
          </Alert>
        )}

        {/* --- KYC Verification Banner (Moved to Agent Dashboard for future version) --- */}
        {/* 
        {user.phone_verified && (user.kyc_status === 'unverified' || user.kyc_status === 'pending') && (
          <Alert 
            severity="info" 
            sx={{ mb: 4, borderRadius: 3, display: 'flex', alignItems: 'center' }}
            action={
              <Button 
                color="primary" 
                size="small" 
                variant="contained" 
                sx={{ fontWeight: 700, borderRadius: 2 }}
                onClick={() => showSnack('KYC verification coming soon!', 'warning')}
              >
                Complete KYC
              </Button>
            }
          >
            <AlertTitle sx={{ fontWeight: 700 }}>Identity Verification (KYC)</AlertTitle>
            Complete your verification to build trust and unlock premium agent features.
          </Alert>
        )}
        */}

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={3}>Personal Information</Typography>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment>,
                      endAdornment: user.phone_verified ? (
                        <InputAdornment position="end">
                          <Chip label="Verified" size="small" sx={{ bgcolor: 'rgba(0,162,85,0.1)', color: 'primary.dark', height: 20, fontSize: '0.68rem', fontWeight: 600 }} />
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="WhatsApp Number"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><WhatsAppIcon sx={{ color: '#25D366', fontSize: 18 }} /></InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
              <Button 
                variant="contained" 
                onClick={handleSave} 
                disabled={processingAgent}
                sx={{ mt: 3, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, px: 5 }}
              >
                {processingAgent ? 'Saving...' : 'Save Changes'}
              </Button>
            </Paper>

            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={0.5}>Notification Preferences</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>Choose how you'd like to be notified about property activity</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Email Notifications', desc: 'Receive updates about saved properties and enquiries via email', value: emailNotifs, onChange: setEmailNotifs, icon: <EmailIcon fontSize="small" /> },
                  { label: 'SMS Notifications', desc: 'Get SMS alerts for new matching properties and enquiries', value: smsNotifs, onChange: setSmsNotifs, icon: <PhoneIcon fontSize="small" /> },
                ].map((item, i) => (
                  <Box key={item.label}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ color: 'text.secondary' }}>{item.icon}</Box>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{item.label}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                        </Box>
                      </Box>
                      <Switch checked={item.value} onChange={(e) => item.onChange(e.target.checked)} color="primary" />
                    </Box>
                    {i < 1 && <Divider />}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            {/* --- Agent Onboarding Section --- */}
            {user.role === 'user' && !checkingAgent && (
              <Paper elevation={0} sx={{ p: 3, border: '2px solid', borderColor: 'primary.main', borderRadius: 3, mb: 3, bgcolor: 'rgba(0,162,86,0.03)' }}>
                {hasPropertiesToClaim ? (
                  <Box>
                    <DomainVerificationIcon sx={{ color: 'primary.main', fontSize: 32, mb: 1 }} />
                    <Typography variant="subtitle1" fontWeight={800} mb={1}>Claim Your Properties</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      We found properties linked to your phone number on our platform. Claim your profile to start managing them.
                    </Typography>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="primary"
                      disabled={processingAgent}
                      onClick={() => handleAgentAction('claim')}
                      sx={{ fontWeight: 700 }}
                    >
                      {processingAgent ? 'Processing...' : 'Claim Profile & Upgrade'}
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <BusinessCenterIcon sx={{ color: 'primary.main', fontSize: 32, mb: 1 }} />
                    <Typography variant="subtitle1" fontWeight={800} mb={1}>Become a Real Estate Agent</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Start listing your properties, connect with verified buyers, and grow your real estate business.
                    </Typography>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="primary"
                      disabled={processingAgent}
                      onClick={() => handleAgentAction('register')}
                      sx={{ fontWeight: 700 }}
                    >
                      {processingAgent ? 'Processing...' : 'Become an Agent'}
                    </Button>
                  </Box>
                )}
              </Paper>
            )}
            {checkingAgent && user.role === 'user' && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={24} />
              </Box>
            )}

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>Connected Accounts</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <GoogleIcon sx={{ color: '#4285F4' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>Google</Typography>
                    <Typography variant="caption" color="text.secondary">{email}</Typography>
                  </Box>
                </Box>
                <Chip label="Connected" size="small" sx={{ bgcolor: 'rgba(0,162,85,0.1)', color: 'primary.dark', height: 22, fontSize: '0.72rem', fontWeight: 600 }} />
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <WhatsAppIcon sx={{ color: '#25D366' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>WhatsApp</Typography>
                    <Typography variant="caption" color="text.secondary">{whatsapp}</Typography>
                  </Box>
                </Box>
                {user.is_verified && (
                  <Chip label="Verified" size="small" sx={{ bgcolor: 'rgba(0,162,85,0.1)', color: 'primary.dark', height: 22, fontSize: '0.72rem', fontWeight: 600 }} />
                )}
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>Security</Typography>
              <Button fullWidth variant="outlined" startIcon={<LockOutlinedIcon />} sx={{ borderColor: 'divider', color: 'text.secondary', justifyContent: 'flex-start', mb: 1.5, '&:hover': { borderColor: 'secondary.main', color: 'secondary.main' } }}>
                Change Password
              </Button>
              <Button fullWidth variant="outlined" startIcon={<PhoneIcon />} sx={{ borderColor: 'divider', color: 'text.secondary', justifyContent: 'flex-start', mb: 1.5, '&:hover': { borderColor: 'secondary.main', color: 'secondary.main' } }}>
                Change Phone Number
              </Button>
              <Button fullWidth variant="outlined" startIcon={<LogoutIcon />} onClick={() => { logout(); router.push('/'); }} sx={{ borderColor: 'error.main', color: 'error.main', justifyContent: 'flex-start', '&:hover': { borderColor: 'error.dark', color: 'error.dark', bgcolor: 'rgba(211,47,47,0.04)' } }}>
                Sign Out
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* --- OTP Verification Modal --- */}
      <Dialog open={otpModalOpen} onClose={() => !otpLoading && setOtpModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setOtpModalOpen(false)} disabled={otpLoading}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ textAlign: 'center', pt: 0 }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(0,162,86,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', mx: 'auto', mb: 2 }}>
            <PhoneIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} mb={1}>Verify Phone</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Enter the 6-digit code sent to {phone}
          </Typography>

          {otpError && <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>{otpError}</Alert>}

          <Box sx={{ display: 'flex', gap: 1, mb: 4, justifyContent: 'center' }}>
            {otp.map((digit, i) => (
              <Box
                key={i}
                component="input"
                ref={(el: HTMLInputElement | null) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleOtpKeyDown(i, e)}
                autoFocus={i === 0}
                sx={{
                  width: 44, height: 52,
                  border: digit ? '2px solid' : '1.5px solid',
                  borderColor: digit ? 'primary.main' : 'rgba(0,0,0,0.18)',
                  borderRadius: '12px',
                  fontSize: '1.25rem', fontWeight: 700, textAlign: 'center',
                  outline: 'none',
                  '&:focus': { borderColor: 'primary.main', borderWidth: '2px', boxShadow: '0 0 0 3px rgba(0,162,86,0.15)' },
                }}
              />
            ))}
          </Box>

          <Typography variant="body2" color="text.secondary" mb={4}>
            {canResend ? (
              resendAttempts > 0 ? (
                <>
                  Didn&apos;t receive it?{' '}
                  <Button 
                    variant="text" 
                    onClick={handleResendOtp} 
                    disabled={otpLoading}
                    sx={{ color: 'primary.main', fontWeight: 700, p: 0, minWidth: 0, textTransform: 'none', verticalAlign: 'baseline', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                  >
                    Resend Code
                  </Button>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.disabled' }}>
                    {resendAttempts} attempts remaining
                  </Typography>
                </>
              ) : (
                <Typography variant="caption" color="error">Maximum resend attempts reached.</Typography>
              )
            ) : (
              <>
                Resend code in{' '}
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
                  {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                </Box>
              </>
            )}
          </Typography>

          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={otpLoading || otp.join('').length < OTP_LENGTH}
            onClick={handleVerifyOtp}
            sx={{ py: 1.5, fontWeight: 700, borderRadius: '10px' }}
          >
            {otpLoading ? 'Verifying...' : 'Verify Now'}
          </Button>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackSeverity} sx={{ width: '100%', borderRadius: 2 }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
