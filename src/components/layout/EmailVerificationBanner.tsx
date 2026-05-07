import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import ApiService from '../../services/api';

export default function EmailVerificationBanner() {
  const { user, refreshUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otp, setOtp] = useState('');

  if (!user || user.email_verified || dismissed) return null;

  const handleSendVerification = async () => {
    setLoading(true);
    try {
      const res: any = await ApiService.auth.sendEmailVerification({ email: user.email! });
      if (res.success) {
        toast.success(res.message || 'Verification code sent to your email.');
        setOpen(true);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error('Please enter the OTP code.');
    setVerifying(true);
    try {
      const res: any = await ApiService.auth.verifyEmail({ email: user.email!, code: otp });
      if (res.success) {
        toast.success('Email successfully verified!');
        await refreshUser();
        setOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify email.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <>
      {/* ── Ultra-slim fixed verification strip ── */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar + 10,
          height: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          // Premium neutral frosted glass — less noisy than amber
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <MarkEmailUnreadOutlinedIcon sx={{ fontSize: 14, color: 'primary.main', opacity: 0.8, flexShrink: 0 }} />

        <Typography
          sx={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'text.primary',
            opacity: 0.9,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: { xs: 200, sm: 'none' },
          }}
        >
          Verify your email to unlock all features
        </Typography>

        <Button
          size="small"
          onClick={handleSendVerification}
          disabled={loading}
          sx={{
            height: 22,
            px: 1.5,
            fontSize: '0.68rem',
            fontWeight: 700,
            borderRadius: '100px',
            textTransform: 'none',
            bgcolor: 'rgba(0, 162, 86, 0.1)',
            color: 'primary.main',
            border: '1px solid rgba(0, 162, 86, 0.2)',
            lineHeight: 1,
            '&:hover': { bgcolor: 'rgba(0, 162, 86, 0.2)' },
            flexShrink: 0,
          }}
        >
          {loading ? <CircularProgress size={11} color="inherit" /> : 'Verify Now'}
        </Button>

        <IconButton
          size="small"
          onClick={() => setDismissed(true)}
          sx={{
            position: 'absolute',
            right: 8,
            width: 20,
            height: 20,
            color: 'text.secondary',
            opacity: 0.5,
            '&:hover': { opacity: 0.9, bgcolor: 'rgba(0,0,0,0.05)' },
          }}
        >
          <CloseIcon sx={{ fontSize: 12 }} />
        </IconButton>
      </Box>

      {/* OTP verification dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 0.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>Verify Your Email</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            We've sent a 6-digit code to <strong>{user.email}</strong>. Enter it below to confirm your email address.
          </Typography>
          <TextField
            fullWidth
            label="Verification Code"
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            inputProps={{ maxLength: 6, style: { letterSpacing: '0.3em', fontWeight: 700, fontSize: '1.1rem' } }}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Button onClick={() => setOpen(false)} color="inherit" sx={{ fontWeight: 600, borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleVerifyOtp}
            variant="contained"
            disabled={verifying || otp.length < 4}
            sx={{ bgcolor: 'primary.main', fontWeight: 700, borderRadius: 2, px: 3 }}
          >
            {verifying ? <CircularProgress size={20} color="inherit" /> : 'Verify Email'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
