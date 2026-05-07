'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useAuth } from '@/src/context/AuthContext';

interface BecomeAgentGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BecomeAgentGuideModal({ open, onClose }: BecomeAgentGuideModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleAction = () => {
    onClose();
    if (user) {
      router.push('/profile');
    } else {
      router.push('/auth/register');
    }
  };

  const steps = [
    {
      icon: <PersonAddAlt1Icon sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '1. Create an Account',
      description: 'Sign up or log in to your existing standard account on Realestway.',
    },
    {
      icon: <LockOpenIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '2. Verify Phone & Details',
      description: 'Navigate to your profile to verify your phone number. If you have existing properties, you can claim them.',
    },
    {
      icon: <BusinessCenterIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '3. Become an Agent',
      description: 'Click the "Become an Agent" button in your profile to upgrade your account status.',
    },
    {
      icon: <DomainVerificationIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '4. Upload Documents',
      description: 'Provide your business name, registration, and ID to get fully verified.',
    },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden' }
      }}
    >
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3, position: 'relative' }}>
        <IconButton 
          onClick={onClose} 
          sx={{ position: 'absolute', top: 12, right: 12, color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={800} sx={{ fontFamily: '"Poppins", sans-serif', mb: 1 }}>
          Become a Real Estate Agent
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Join the Realestway platform, list your properties, and connect with verified clients. Follow these steps to get started.
        </Typography>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          {steps.map((step, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2.5 }}>
              <Box 
                sx={{ 
                  width: 56, 
                  height: 56, 
                  borderRadius: '14px', 
                  bgcolor: 'rgba(0,162,86,0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {step.icon}
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary" mb={0.5}>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                  {step.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleAction}
          sx={{
            py: 1.5,
            bgcolor: 'primary.main',
            fontWeight: 700,
            fontSize: '1rem',
            borderRadius: '10px',
            boxShadow: '0 6px 20px rgba(0,162,85,0.3)',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          {user ? 'Go to Profile to Start' : 'Register to Get Started'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
