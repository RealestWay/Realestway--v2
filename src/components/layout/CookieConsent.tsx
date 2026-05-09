'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: { xs: 80, md: 24 },
        right: { xs: 16, md: 24 },
        maxWidth: 320,
        p: 2,
        borderRadius: 3,
        zIndex: 2500,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
        We use cookies to improve your experience and analyze traffic. By continuing to browse, you agree to our use of cookies.
      </Typography>
      <Button 
        variant="contained" 
        size="small" 
        onClick={handleAccept}
        sx={{ 
          alignSelf: 'flex-end', 
          borderRadius: 1.5, 
          textTransform: 'none', 
          fontWeight: 700,
          px: 3
        }}
      >
        Accept
      </Button>
    </Paper>
  );
}
