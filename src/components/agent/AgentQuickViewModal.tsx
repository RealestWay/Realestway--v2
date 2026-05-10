'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import { Agent } from '@/src/types';

interface AgentQuickViewModalProps {
  open: boolean;
  onClose: () => void;
  agent: Agent | any;
}

export default function AgentQuickViewModal({ open, onClose, agent }: AgentQuickViewModalProps) {
  if (!agent) return null;

  const businessName = agent.business_name || agent.name;
  const metadata = agent.business_metadata || {};
  const description = metadata.description || agent.description;
  const categories = metadata.categories || [];
  const address = metadata.address;
  const website = Array.isArray(metadata.website) && metadata.website.length > 0 
    ? metadata.website[0] 
    : (typeof metadata.website === 'string' ? metadata.website : null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, overflow: 'hidden' }
      }}
    >
      <Box sx={{ position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
        >
          <CloseIcon />
        </IconButton>

        {/* Header/Cover aspect */}
        <Box sx={{ height: 100, bgcolor: 'secondary.main', position: 'relative' }} />
        
        <Box sx={{ px: 3, pb: 4, mt: -5, position: 'relative', textAlign: 'center' }}>
          <Avatar
            src={agent.avatar}
            sx={{
              width: 100,
              height: 100,
              mx: 'auto',
              border: '4px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
              fontWeight: 800
            }}
          >
            {agent.name?.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ mt: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h6" fontWeight={800}>
                {businessName || 'N/A'}
              </Typography>
              {agent.claimed_at && (agent.verified_at || agent.verified) && (
                <VerifiedIcon color="primary" sx={{ fontSize: 20 }} />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {agent.name !== businessName ? agent.name : 'Verified Real Estate Agency'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            {categories.map((cat: any, i: number) => (
              <Chip
                key={cat.id || i}
                label={cat.localized_display_name || cat}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', fontWeight: 600 }}
              />
            ))}
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ textAlign: 'left', mb: 3 }}>
            {address && (
              <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 20, mt: 0.3 }} />
                <Typography variant="body2" color="text.secondary">
                  {address || 'N/A'}
                </Typography>
              </Box>
            )}

            {typeof website === 'string' && website && (
              <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                <LanguageIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2" component="a" href={website} target="_blank" color="primary.main" sx={{ textDecoration: 'none', fontWeight: 600 }}>
                  {website.replace(/^https?:\/\//, '')}
                </Typography>
              </Box>
            )}

            {description && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  About Agency
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {description || 'N/A'}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {agent.consent_given !== false && !(agent.phone_number || agent.phone)?.includes('*') ? (
              <>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PhoneIcon />}
                  href={`tel:${agent.phone_number || agent.phone}`}
                  sx={{ py: 1.2, fontWeight: 700, borderRadius: 2 }}
                >
                  Call
                </Button>
                {(agent.whatsapp || agent.phone_number || agent.phone) && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<WhatsAppIcon />}
                    href={`https://wa.me/${(agent.whatsapp || agent.phone_number || agent.phone).replace(/\D/g, '')}`}
                    target="_blank"
                    sx={{ borderColor: '#25D366', color: '#25D366', py: 1.2, fontWeight: 700, borderRadius: 2, '&:hover': { bgcolor: 'rgba(37,211,102,0.05)', borderColor: '#25D366' } }}
                  >
                    WhatsApp
                  </Button>
                )}
              </>
            ) : (
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1', mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Phone Number Masked</Typography>
                  <Typography variant="subtitle1" fontWeight={800}>
                    {(() => {
                      const rawPhone = agent.phone_number || agent.phone;
                      if (!rawPhone) return '080******94';
                      if (rawPhone.includes('*')) return rawPhone;
                      const clean = rawPhone.replace(/\s+/g, '');
                      if (clean.length <= 5) return '***';
                      return clean.substring(0, 3) + '******' + clean.substring(clean.length - 2);
                    })()}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    onClose();
                    // If on a property page, the user can see the contact request button.
                    // Otherwise, we guide them.
                    toast.info('Visit an agent property to request contact information.');
                  }}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                  Contact Restricted
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
