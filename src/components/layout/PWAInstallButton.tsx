'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import ApiService from '../../services/api';

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // 1. Detect if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      setShowButton(false);
      return;
    }

    // 2. Detect iOS
    const isIPhone = /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIPhone);

    // 3. Listen for native install prompt (Android/Chrome/Desktop)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS, we always show the button if not standalone, because we can't detect "beforeinstallprompt"
    if (isIPhone) {
      setShowButton(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowInstructions(true);
      logEvent('ios_install_click');
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        logEvent('pwa_install_accepted');
        setShowButton(false);
      } else {
        logEvent('pwa_install_dismissed');
      }
      setDeferredPrompt(null);
    }
  };

  const logEvent = (type: string) => {
    ApiService.analytics.log({
      event_type: 'pwa_action',
      metadata: { action: type, platform: isIOS ? 'ios' : 'other' }
    }).catch(() => {});
  };

  if (!showButton) return null;

  return (
    <>
      <Box
        className="pwa-install-button"
        sx={{
          position: 'fixed',
          bottom: { xs: 88, md: 24 },
          left: 24,
          zIndex: 2000,
        }}
      >
        <Button
          variant="contained"
          onClick={handleInstallClick}
          startIcon={<InstallMobileIcon />}
          sx={{
            borderRadius: '100px',
            bgcolor: 'primary.main',
            color: 'white',
            px: 3,
            py: 1.5,
            fontWeight: 800,
            fontSize: '0.875rem',
            textTransform: 'none',
            boxShadow: '0 8px 32px rgba(0, 162, 86, 0.4)',
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Install App
        </Button>
      </Box>

      {/* iOS Instructions Overlay */}
      {showInstructions && (
        <Paper
          elevation={24}
          sx={{
            position: 'fixed',
            bottom: 100,
            left: 24,
            width: 280,
            p: 3,
            borderRadius: 4,
            zIndex: 2001,
            bgcolor: 'white',
            border: '1px solid rgba(0,0,0,0.08)',
            animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" fontWeight={800} fontSize="1rem">
              Install on iPhone
            </Typography>
            <IconButton size="small" onClick={() => setShowInstructions(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
            1. Tap the <strong>Share</strong> button <img src="https://developer.apple.com/design/human-interface-guidelines/foundations/images/icons/share-icon.png" width="16" style={{ verticalAlign: 'middle' }} /> in the browser bar.
            <br />
            2. Scroll down and tap <strong>"Add to Home Screen"</strong>.
            <br />
            3. Tap <strong>"Add"</strong> in the top right corner.
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setShowInstructions(false)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            Got it!
          </Button>
        </Paper>
      )}

      <style jsx global>{`
        @keyframes bounceGlow {
          0% { 
            transform: translateY(0) scale(1); 
            box-shadow: 0 8px 32px rgba(0, 162, 86, 0.4);
          }
          30% { 
            transform: translateY(-12px) scale(1.08); 
            box-shadow: 0 15px 40px rgba(0, 162, 86, 0.6);
          }
          50% {
            transform: translateY(0) scale(1);
            box-shadow: 0 8px 32px rgba(0, 162, 86, 0.4);
          }
          70% {
            transform: translateY(-5px) scale(1.03);
            box-shadow: 0 10px 35px rgba(0, 162, 86, 0.5);
          }
          100% { 
            transform: translateY(0) scale(1); 
            box-shadow: 0 8px 32px rgba(0, 162, 86, 0.4);
          }
        }
        @keyframes outerGlow {
          0% { box-shadow: 0 0 0 0 rgba(0, 162, 86, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(0, 162, 86, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 162, 86, 0); }
        }
        .pwa-install-button {
          animation: bounceGlow 3s infinite ease-in-out, outerGlow 2s infinite ease-in-out;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
