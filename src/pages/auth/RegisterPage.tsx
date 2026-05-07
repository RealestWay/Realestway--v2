'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import MuiLink from '@mui/material/Link';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useGoogleLogin } from '@react-oauth/google';
import ApiService from '@/src/services/api';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams ? searchParams.get('redirect') || '/profile' : '/profile';
  const { login } = useAuth();
  const [name,         setName]         = useState('');
  const [email,        setEmail]        = useState('');
  const [phone,        setPhone]        = useState('');
  const [dialCode,     setDialCode]     = useState('+234');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed,       setAgreed]       = useState(false);
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) { setError('Please fill in all required fields.'); return; }
    if (!agreed) { setError('You must agree to the privacy policy.'); return; }
    setLoading(true); setError('');
    
    try {
      const payload = {
        name,
        email,
        phone_number: dialCode + phone,
        password,
        password_confirmation: password, // For backend validation
      };
      
      const response: any = await ApiService.auth.register(payload);
      if (response && response.success) {
        // Route to verify email
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const response: any = await ApiService.auth.googleAuth(tokenResponse.access_token);
        if (response && response.success) {
          login(response.user, response.token);
          if (!response.user.phone_verified) {
            router.push('/auth/verify');
          } else if (response.user.role === 'admin' || response.user.role === 'super_admin') {
            router.push('/admin');
          } else if (response.user.role === 'agent') {
            router.push('/dashboard');
          } else {
            router.push(redirectUrl);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Google registration failed.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google Registration Failed'),
  });

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
        {/* Back to home */}
        <Box sx={{ position: 'absolute', top: 28, left: 28, zIndex: 2 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box
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
          </Link>
        </Box>

        {/* Logo — bottom left */}
        <Box
          onClick={() => router.push('/')}
          sx={{
            position: 'absolute',
            bottom: 36,
            left: 36,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            cursor: 'pointer',
          }}
        >
          <Box
            component="img"
            src="/Asset_8.png"
            alt="Realestway"
            sx={{ height: 26, filter: 'brightness(0) invert(1)' }}
          />
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.05rem' }}>
            Realestway
          </Typography>
        </Box>
      </Box>

      {/* ── RIGHT: Form panel ── */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: { xs: '100%', md: 480 },
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 3, sm: 5.5 },
          py: 6,
          bgcolor: 'white',
          overflowY: 'auto',
          minHeight: '100vh',
        }}
      >
        {/* Mobile back + logo */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary', fontSize: '0.82rem', fontWeight: 600 }}>
              <ArrowBackIcon sx={{ fontSize: 16 }} /> Back
            </Box>
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="img" src="/Asset_8.png" alt="logo" sx={{ height: 22 }} />
            <Typography fontWeight={700} fontSize="1rem">Realestway</Typography>
          </Box>
        </Box>

        {/* Heading */}
        <Typography variant="h4" fontWeight={800} mb={0.75} sx={{ fontFamily: '"Poppins", sans-serif', fontSize: { xs: '1.6rem', sm: '1.9rem' } }}>
          Create Your Account
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3.5} lineHeight={1.7}>
          Unlock exclusive listings & discover more property
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}

        {/* Full Name */}
        <Typography variant="caption" fontWeight={700} sx={{ mb: 0.6, display: 'block', color: 'text.primary', fontSize: '0.79rem' }}>
          Full Name *
        </Typography>
        <TextField
          fullWidth
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
          sx={{
            mb: 2.5,
            '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fafafa' },
          }}
        />

        {/* Email */}
        <Typography variant="caption" fontWeight={700} sx={{ mb: 0.6, display: 'block', color: 'text.primary', fontSize: '0.79rem' }}>
          Email Address *
        </Typography>
        <TextField
          fullWidth
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="small"
          sx={{
            mb: 2.5,
            '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fafafa' },
          }}
        />

        {/* Phone Number with dial code */}
        <Typography variant="caption" fontWeight={700} sx={{ mb: 0.6, display: 'block', color: 'text.primary', fontSize: '0.79rem' }}>
          Phone Number * <Typography component="span" variant="caption" color="text.secondary">(preferably WhatsApp)</Typography>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
          <Select
            value={dialCode}
            onChange={(e) => setDialCode(e.target.value)}
            size="small"
            sx={{
              width: 118,
              fontSize: '0.875rem',
              '& .MuiOutlinedInput-notchedOutline': { borderRadius: '10px' },
              bgcolor: '#fafafa',
            }}
          >
            <MenuItem value="+234">🇳🇬 +234</MenuItem>
            <MenuItem value="+1">🇺🇸 +1</MenuItem>
            <MenuItem value="+44">🇬🇧 +44</MenuItem>
            <MenuItem value="+27">🇿🇦 +27</MenuItem>
            <MenuItem value="+233">🇬🇭 +233</MenuItem>
          </Select>
          <TextField
            fullWidth
            placeholder="8012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fafafa' } }}
          />
        </Box>

        {/* Password */}
        <Typography variant="caption" fontWeight={700} sx={{ mb: 0.6, display: 'block', color: 'text.primary', fontSize: '0.79rem' }}>
          Password *
        </Typography>
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          placeholder="Min. 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="small"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fafafa' },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                  {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Privacy */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1.5, display: 'block', fontSize: '0.7rem', lineHeight: 1.65 }}
        >
          Realestway may keep me informed with personalised emails. See our{' '}
          <MuiLink href="#" sx={{ color: 'primary.main' }}>Privacy Policy</MuiLink> for more details.
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              sx={{ '&.Mui-checked': { color: 'primary.main' } }}
            />
          }
          label={
            <Typography variant="caption">
              I agree to Realestway&apos;s privacy policy.
            </Typography>
          }
          sx={{ mb: 2.5, alignItems: 'flex-start', '& .MuiFormControlLabel-label': { pt: '2px' } }}
        />

        {/* Sign Up */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            py: 1.5,
            bgcolor: 'primary.main',
            fontWeight: 700,
            fontSize: '0.97rem',
            borderRadius: '10px',
            '&:hover': { bgcolor: 'primary.dark' },
            boxShadow: '0 6px 20px rgba(0,162,85,0.38)',
            mb: 2,
          }}
        >
          {loading ? 'Please wait...' : 'Create Account'}
        </Button>

        <Divider sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>or</Typography>
        </Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={() => handleGoogleRegister()}
          disabled={loading}
          sx={{
            py: 1.35,
            borderColor: 'rgba(0,0,0,0.15)',
            color: 'text.primary',
            fontWeight: 600,
            borderRadius: '100px',
            bgcolor: 'white',
            '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(0,162,85,0.04)' },
          }}
        >
          {loading ? 'Processing...' : 'Continue with Google'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 3.5 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <MuiLink
              component="button"
              type="button"
              onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`)}
              underline="hover"
              sx={{ color: 'primary.main', fontWeight: 700 }}
            >
              Sign In
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
