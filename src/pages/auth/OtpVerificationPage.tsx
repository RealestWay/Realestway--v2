'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import MuiLink from '@mui/material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import Link from 'next/link';

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 59;
const MAX_RESEND_ATTEMPTS = 5;

export default function OtpVerificationPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const phone        = searchParams ? searchParams.get('phone') ?? '' : '';

  const [otp,       setOtp]       = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(MAX_RESEND_ATTEMPTS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* Countdown timer */
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const maskedPhone = phone
    ? phone.slice(0, phone.length - 4).replace(/./g, '*') + phone.slice(-4)
    : '***';

  /* Handle input */
  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next  = [...otp];
    next[index] = digit;
    setOtp(next);
    setError('');
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* Paste support */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next   = [...otp];
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setOtp(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleResend = useCallback(async () => {
    if (!canResend || resendAttempts <= 0) return;
    
    setLoading(true);
    try {
      // In a real app, call ApiService.auth.sendOtp({ phone_number: phone })
      setResendAttempts(prev => prev - 1);
      setCountdown(RESEND_COUNTDOWN);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  }, [canResend, resendAttempts]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length < OTP_LENGTH) { setError('Please enter the complete 6-digit code.'); return; }
    setLoading(true); setError('');
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.push('/');
  };

  const formatCountdown = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>

      {/* ── LEFT: Building photo panel ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          position: 'relative',
          backgroundImage: 'url(/building3.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.12) 60%)',
          },
        }}
      >
        {/* Back button */}
        <Box sx={{ position: 'absolute', top: 28, left: 28, zIndex: 2 }}>
          <Box
            onClick={() => router.back()}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.22)',
              borderRadius: '100px',
              px: 2,
              py: 0.75,
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.24)' },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 15 }} />
            Back
          </Box>
        </Box>

        {/* Logo bottom left */}
        <Box
          onClick={() => router.push('/')}
          sx={{ position: 'absolute', bottom: 36, left: 36, zIndex: 2, display: 'flex', alignItems: 'center', gap: 1.25, cursor: 'pointer' }}
        >
          <Box component="img" src="/Asset_8.png" alt="Realestway" sx={{ height: 26, filter: 'brightness(0) invert(1)' }} />
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.05rem' }}>Realestway</Typography>
        </Box>
      </Box>

      {/* ── RIGHT: Verification panel ── */}
      <Box
        component="form"
        onSubmit={handleVerify}
        sx={{
          width: { xs: '100%', md: 480 },
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 3, sm: 5.5 },
          py: 6,
          bgcolor: 'white',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        {/* Mobile back */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', width: '100%', mb: 4 }}>
          <Box
            onClick={() => router.back()}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} /> Back
          </Box>
        </Box>

        {/* Phone icon badge */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '18px',
            bgcolor: 'rgba(0,162,86,0.1)',
            border: '2px solid rgba(0,162,86,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
            mb: 3,
          }}
        >
          <SmartphoneIcon sx={{ fontSize: 36 }} />
        </Box>

        {/* Title */}
        <Typography variant="h5" fontWeight={800} mb={1} sx={{ fontFamily: '"Poppins", sans-serif' }}>
          SMS Verification
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={0.5} lineHeight={1.7}>
          Please enter the 6-digit code we sent to
        </Typography>
        <Typography variant="body2" fontWeight={700} color="primary.main" mb={3.5}>
          {maskedPhone || phone || 'your phone number'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, width: '100%' }}>{error}</Alert>}

        {/* OTP Input boxes */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 1.5 },
            mb: 3,
            justifyContent: 'center',
          }}
          onPaste={handlePaste}
        >
          {otp.map((digit, i) => (
            <Box
              key={i}
              component="input"
              ref={(el: HTMLInputElement | null) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(i, e)}
              autoFocus={i === 0}
              sx={{
                width: { xs: 44, sm: 52 },
                height: { xs: 52, sm: 60 },
                border: digit ? '2px solid' : '1.5px solid',
                borderColor: digit ? 'primary.main' : 'rgba(0,0,0,0.18)',
                borderRadius: '12px',
                fontSize: '1.5rem',
                fontWeight: 700,
                textAlign: 'center',
                color: 'text.primary',
                bgcolor: digit ? 'rgba(0,162,86,0.05)' : '#fafafa',
                outline: 'none',
                transition: 'all 0.15s ease',
                cursor: 'text',
                '&:focus': {
                  borderColor: 'primary.main',
                  borderWidth: '2px',
                  bgcolor: 'rgba(0,162,86,0.06)',
                  boxShadow: '0 0 0 3px rgba(0,162,86,0.15)',
                },
              }}
            />
          ))}
        </Box>

        <Typography variant="body2" color="text.secondary" mb={3.5}>
          {canResend ? (
            resendAttempts > 0 ? (
              <>
                Didn&apos;t receive it?{' '}
                <MuiLink
                  onClick={handleResend}
                  underline="hover"
                  sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer' }}
                >
                  Resend Code
                </MuiLink>
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
                {formatCountdown(countdown)}
              </Box>
            </>
          )}
        </Typography>

        {/* Verify button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading || otp.join('').length < OTP_LENGTH}
          sx={{
            py: 1.5,
            bgcolor: 'primary.main',
            fontWeight: 700,
            fontSize: '0.97rem',
            borderRadius: '10px',
            '&:hover': { bgcolor: 'primary.dark' },
            boxShadow: '0 6px 20px rgba(0,162,85,0.38)',
            mb: 2,
            maxWidth: 360,
            width: '100%',
          }}
        >
          {loading ? 'Verifying…' : 'Verify'}
        </Button>

        <Typography variant="caption" color="text.secondary" lineHeight={1.7}>
          Wrong number?{' '}
          <MuiLink
            onClick={() => router.push('/auth/register')}
            underline="hover"
            sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}
          >
            Go back and change it
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
