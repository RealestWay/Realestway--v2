'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Link from '@mui/material/Link';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BecomeAgentGuideModal from '../agent/BecomeAgentGuideModal';

/* ── Typed footer link map with real hrefs ── */
type FooterSection = {
  label: string;
  href: string;
};

const footerLinks: Record<string, FooterSection[]> = {
  'Quick Links': [
    { label: 'Home',              href: '/' },
    { label: 'About Us',          href: '/about' },
    { label: 'Become An Agent',   href: '/auth/register' },
    { label: 'Explore Locations', href: '/search' },
    { label: 'Contact Us',        href: '/contact' },
  ],
  'Resources': [
    { label: 'FAQs',              href: '/about#faqs' },
    { label: 'Blog',              href: '/blogs' },
    { label: 'Careers',           href: '/contact' },
    { label: 'Privacy Policy',    href: '/privacy-policy' },
    { label: 'Terms of Service',  href: '/terms-of-service' },
  ],
  'Contact': [
    { label: 'support@realestway.com', href: 'mailto:support@realestway.com' },
    { label: '+2348120606547',         href: 'tel:+2348120606547' },
    { label: '+2348164312224',         href: 'tel:+2348164312224' },
  ],
  'Properties by City': [
    { label: 'Lagos',   href: '/search?city=Lagos' },
    { label: 'Abuja',   href: '/search?city=Abuja' },
    { label: 'Ibadan',  href: '/search?city=Ibadan' },
    { label: 'Port Harcourt', href: '/search?city=Port+Harcourt' },
    { label: 'Enugu',   href: '/search?city=Enugu' },
  ],
  'Properties by Type': [
    { label: 'Apartments',   href: '/search?type=Apartment' },
    { label: 'Duplexes',     href: '/search?type=Duplex' },
    { label: 'Self Contain', href: '/search?type=Studio' },
    { label: 'Shortlets',    href: '/search?category=shortlet' },
    { label: 'Land for Sale', href: '/search?type=Land' },
  ],
};

const socialLinks = [
  { Icon: FacebookIcon,  href: '#', label: 'Facebook' },
  { Icon: LinkedInIcon,  href: '#', label: 'LinkedIn' },
  { Icon: InstagramIcon, href: '#', label: 'Instagram' },
  { Icon: TwitterIcon,   href: '#', label: 'Twitter / X' },
];

export default function Footer() {
  const [isAgentGuideOpen, setAgentGuideOpen] = useState(false);

  return (
    <Box component="footer" sx={{ mt: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Top CTA Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 10 },
          backgroundImage: 'url(/agent.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0, 0, 0, 0.75)',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 3 }}>
            <img src="/Asset_8.png" alt="logo" style={{ height: 28, filter: 'brightness(0) invert(1)' }} />
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, letterSpacing: 0.5 }}>
              Realestway
            </Typography>
          </Box>

          <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 3, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Become a Real Estate Agent on Realestway
          </Typography>

          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 5, maxWidth: 640, mx: 'auto', lineHeight: 1.8 }}>
            List your properties, connect with active renters and buyers, and grow your real estate business on our community-driven platform.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Link
              component="button"
              onClick={() => setAgentGuideOpen(true)}
              sx={{
                color: 'primary.main',
                fontWeight: 800,
                fontSize: '1.25rem',
                textDecoration: 'none',
                bgcolor: 'white',
                px: 4, py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)', color: 'primary.dark' },
              }}
            >
              Start Listing for Free
            </Link>
          </Box>
        </Container>
      </Box>

      {/* Main Footer Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', pt: 8, pb: 4 }}>
        <Container maxWidth="xl">
          <Grid container spacing={5} justifyContent="space-between">

            {/* Brand column */}
            <Grid  size={{ xs: 12, md: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <img src="/Asset_8.png" alt="Realestway" style={{ height: 28, filter: 'brightness(0) invert(1)' }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, letterSpacing: 0.5 }}>
                    Realestway
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.7 }}>
                  36 Olusesi Street, Eputu,<br />
                  Ibeju-Lekki, Lagos, Nigeria.
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {socialLinks.map(({ Icon, href, label }) => (
                    <IconButton
                      key={label}
                      component="a"
                      href={href}
                      aria-label={label}
                      size="small"
                      sx={{
                        color: 'rgba(255,255,255,0.75)',
                        transition: 'all 0.2s',
                        '&:hover': { color: 'white', transform: 'translateY(-2px)' },
                      }}
                    >
                      <Icon fontSize="small" />
                    </IconButton>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([section, links]) => (
              <Grid size={{ xs: 6, sm: 3, md: 2 }} key={section}>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                  {section}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, alignItems: 'flex-start' }}>
                  {links.map(({ label, href }) => (
                    <Link
                      key={label}
                      href={label === 'Become An Agent' ? undefined : href}
                      onClick={label === 'Become An Agent' ? (e: any) => { e.preventDefault(); setAgentGuideOpen(true); } : undefined}
                      component={label === 'Become An Agent' ? 'button' : 'a'}
                      underline="none"
                      sx={{
                        color: 'rgba(255,255,255,0.78)',
                        fontSize: '0.875rem',
                        transition: 'color 0.2s',
                        textAlign: 'left',
                        '&:hover': { color: 'white' },
                        ...(section === 'Contact' && { fontFamily: 'monospace', fontSize: '0.82rem' }),
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                </Box>
              </Grid>
            ))}

            {/* Newsletter column */}
            <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                Subscribe to our newsletter
              </Typography>
              <Box
                component="form"
                sx={{
                  display: 'flex',
                  bgcolor: 'white',
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  p: 0.5,
                  mb: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1.5, color: 'text.secondary' }}>
                  <EmailOutlinedIcon fontSize="small" />
                </Box>
                <InputBase
                  placeholder="Enter your email"
                  sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
                />
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'primary.main',
                    borderRadius: 1,
                    boxShadow: 'none',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.7rem' }}>
                Be the first to hear of our latest updates &amp; properties
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', mt: 6, mb: 3 }} />

          {/* Bottom bar */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>
              © {new Date().getFullYear()} Realestway. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { label: 'Privacy Policy',   href: '/privacy-policy' },
                { label: 'Terms of Service', href: '/terms-of-service' },
                { label: 'Cookie Policy',    href: '/privacy-policy#cookies' },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  sx={{
                    color: 'rgba(255,255,255,0.65)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'white', textDecoration: 'underline' },
                  }}
                >
                  {label}
                </Link>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
      <BecomeAgentGuideModal open={isAgentGuideOpen} onClose={() => setAgentGuideOpen(false)} />
    </Box>
  );
}

