'use client';

import { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import CookieOutlinedIcon from '@mui/icons-material/CookieOutlined';
import ChildCareOutlinedIcon from '@mui/icons-material/ChildCareOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';

/* ── Keyframes ── */
const KEYFRAMES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;

/* ── Reveal hook ── */
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Section component ── */
function PolicySection({
  id,
  number,
  icon,
  title,
  children,
  delay = 0,
}: {
  id: string;
  number: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <Box
      id={id}
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        mb: 1,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.07)',
          transition: 'all 0.22s ease',
          '&:hover': {
            boxShadow: '0 8px 40px rgba(0,162,86,0.08)',
            borderColor: 'rgba(0,162,86,0.18)',
          },
        }}
      >
        {/* Section header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: 'rgba(0,162,86,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              Section {number}
            </Typography>
            <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2, fontSize: { xs: '1rem', md: '1.15rem' } }}>
              {title}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 2.5, borderColor: 'rgba(0,0,0,0.06)' }} />
        <Box sx={{ color: 'text.secondary', lineHeight: 1.85, fontSize: '0.94rem' }}>
          {children}
        </Box>
      </Paper>
    </Box>
  );
}

/* ── Bullet list ── */
function PolicyList({ items }: { items: string[] }) {
  return (
    <Box component="ul" sx={{ pl: 0, m: 0, listStyle: 'none' }}>
      {items.map((item, i) => (
        <Box
          key={i}
          component="li"
          sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2, mb: 1 }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              mt: '9px',
              flexShrink: 0,
            }}
          />
          <Typography sx={{ fontSize: '0.94rem', lineHeight: 1.8, color: 'text.secondary' }}>
            {item}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

/* ── Subsection header ── */
function SubHeader({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="subtitle2"
      fontWeight={700}
      sx={{ color: 'text.primary', mt: 2, mb: 1, fontSize: '0.9rem' }}
    >
      {children}
    </Typography>
  );
}

const TOC = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'information-collected', label: 'Information We Collect' },
  { id: 'how-we-use', label: 'How We Use Your Info' },
  { id: 'anonymous-tracking', label: 'Anonymous Tracking' },
  { id: 'sharing', label: 'Sharing of Information' },
  { id: 'third-party', label: 'Third-Party Services' },
  { id: 'security', label: 'Data Storage & Security' },
  { id: 'your-rights', label: 'Your Rights' },
  { id: 'cookies', label: 'Cookies & Local Storage' },
  { id: 'children', label: "Children's Privacy" },
  { id: 'changes', label: 'Changes to This Policy' },
  { id: 'contact', label: 'Contact Us' },
];

export default function PrivacyPolicyPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fb' }}>
      <style>{KEYFRAMES}</style>
      <Navbar />

      {/* ══ HERO BANNER ══ */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 300, sm: 360, md: 430 },
          overflow: 'hidden',
          mt: { xs: '-74px', md: '-86px' },
        }}
      >
        <Box
          component="img"
          src="/building2.jpg"
          alt="Privacy Policy — Realestway"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/building1.jpg'; }}
        />
        {/* Gradient overlay — slightly blue-tinted for a security/trust feel */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(5,30,60,0.82) 0%, rgba(0,0,0,0.62) 100%)',
          }}
        />

        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pt: { xs: '74px', md: '86px' },
            px: 2,
          }}
        >
          {/* Icon badge */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              bgcolor: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              mb: 2,
              animation: 'fadeUp 0.5s ease 0.05s both',
            }}
          >
            <SecurityOutlinedIcon sx={{ fontSize: 28 }} />
          </Box>

          <Typography
            sx={{
              color: 'primary.light',
              fontWeight: 700,
              letterSpacing: '0.18em',
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              mb: 1.5,
              animation: 'fadeUp 0.6s ease 0.1s both',
            }}
          >
            Legal
          </Typography>
          <Typography
            component="h1"
            sx={{
              color: 'white',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 900,
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
              lineHeight: 1.2,
              mb: 2,
              maxWidth: 640,
              animation: 'fadeUp 0.7s ease 0.18s both',
            }}
          >
            Privacy Policy
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: { xs: '0.88rem', md: '0.97rem' },
              maxWidth: 520,
              lineHeight: 1.75,
              animation: 'fadeUp 0.7s ease 0.28s both',
            }}
          >
            How we collect, use, and protect your information when you use Realestway.
          </Typography>
          <Chip
            label="Last Updated: April 2026"
            size="small"
            sx={{
              mt: 2.5,
              bgcolor: 'rgba(255,255,255,0.15)',
              color: 'white',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              fontWeight: 600,
              fontSize: '0.75rem',
              animation: 'fadeUp 0.7s ease 0.38s both',
            }}
          />
        </Box>
      </Box>

      {/* ══ MAIN CONTENT ══ */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', gap: { xs: 0, lg: 5 }, alignItems: 'flex-start' }}>

            {/* ── Sticky Table of Contents (desktop only) ── */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'block' },
                width: 240,
                flexShrink: 0,
                position: 'sticky',
                top: 100,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid rgba(0,0,0,0.08)',
                  bgcolor: 'white',
                }}
              >
                <Typography variant="caption" fontWeight={700} sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem', display: 'block', mb: 1.5 }}>
                  Contents
                </Typography>
                {TOC.map((item) => (
                  <Link
                    key={item.id}
                    href={`#${item.id}`}
                    underline="none"
                    sx={{
                      display: 'block',
                      py: 0.6,
                      px: 1,
                      fontSize: '0.82rem',
                      color: 'text.secondary',
                      borderRadius: 1.5,
                      transition: 'all 0.18s',
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'rgba(0,162,86,0.06)',
                        pl: 1.5,
                      },
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </Paper>
            </Box>

            {/* ── Policy sections ── */}
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

              {/* 1. Introduction */}
              <PolicySection id="introduction" number="1" icon={<SecurityOutlinedIcon />} title="Introduction" delay={0}>
                <Typography sx={{ mb: 1.5, lineHeight: 1.85 }}>
                  This Privacy Policy explains how we collect, use, and protect your information when you use our platform.
                </Typography>
                <Typography sx={{ lineHeight: 1.85 }}>
                  Our platform provides a <strong style={{ color: '#1a1a1a' }}>property discovery service</strong>, aggregating listings and connecting users with property agents. We do not facilitate or process property transactions directly.
                </Typography>
              </PolicySection>

              {/* 2. Information We Collect */}
              <PolicySection id="information-collected" number="2" icon={<PersonOutlinedIcon />} title="Information We Collect" delay={40}>
                <SubHeader>a. Information You Provide</SubHeader>
                <Typography sx={{ mb: 1.5 }}>When you use our platform, we may collect:</Typography>
                <PolicyList items={[
                  'Name',
                  'Phone number',
                  'Email address',
                  'WhatsApp number',
                  'Account login details (if registered)',
                  'Identity Verification Data: National Identification Number (NIN) for agents undergoing verification',
                ]} />

                <SubHeader>b. Automatically Collected Information</SubHeader>
                <Typography sx={{ mb: 1.5, mt: 0.5 }}>We may automatically collect:</Typography>
                <PolicyList items={[
                  'Device information (browser, OS, device type)',
                  'Location data (with your permission)',
                  'Usage data (searches, viewed listings, interactions)',
                  'Anonymous identifiers (e.g., anonId stored on your device)',
                ]} />

                <SubHeader>c. Third-Party Property Sources</SubHeader>
                <Typography sx={{ mb: 1.5, mt: 0.5 }}>
                  Some property listings on our platform are aggregated from third-party sources (e.g., WhatsApp-based property networks) to provide a broader selection for users. These listings are clearly identified, and we only collect:
                </Typography>
                <PolicyList items={[
                  'Listing agent name or handle',
                  'Contact phone number or WhatsApp link',
                  'Property images and descriptions',
                ]} />
              </PolicySection>

              {/* 3. How We Use */}
              <PolicySection id="how-we-use" number="3" icon={<DevicesOutlinedIcon />} title="How We Use Your Information" delay={80}>
                <Typography sx={{ mb: 1.5 }}>We use your data to:</Typography>
                <PolicyList items={[
                  'Provide and improve our services',
                  'Personalize your experience (e.g., recommended properties)',
                   'Connect you with property agents',
                  'Verify accounts and prevent fraud (including KYC/NIN verification for agents)',
                  'Communicate with you (e.g., OTP verification via SMS/WhatsApp through third-party providers like Termii)',
                ]} />
              </PolicySection>

              {/* 4. Anonymous Tracking */}
              <PolicySection id="anonymous-tracking" number="4" icon={<FingerprintOutlinedIcon />} title="Anonymous Tracking" delay={0}>
                <Typography sx={{ mb: 1.5 }}>
                  We may assign a <strong style={{ color: '#1a1a1a' }}>unique anonymous identifier</strong> to your device to:
                </Typography>
                <PolicyList items={[
                  'Track usage behavior',
                  'Improve recommendations',
                  'Enhance user experience',
                ]} />
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(0,162,86,0.05)',
                    border: '1px solid rgba(0,162,86,0.15)',
                  }}
                >
                  <Typography sx={{ fontSize: '0.88rem', lineHeight: 1.75, color: 'text.secondary' }}>
                    This does <strong style={{ color: '#1a1a1a' }}>not</strong> directly identify you unless you create an account.
                  </Typography>
                </Box>
              </PolicySection>

              {/* 5. Sharing */}
              <PolicySection id="sharing" number="5" icon={<ShareOutlinedIcon />} title="Sharing of Information" delay={0}>
                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(0,162,86,0.05)',
                    border: '1px solid rgba(0,162,86,0.15)',
                  }}
                >
                  <Typography sx={{ fontSize: '0.94rem', fontWeight: 700, color: 'primary.main' }}>
                    We do not sell your personal data.
                  </Typography>
                </Box>
                <Typography sx={{ mb: 1.5 }}>We may share information:</Typography>
                <PolicyList items={[
                  'With agents when you contact them',
                  'With service providers (e.g., SMS/OTP providers, hosting services)',
                  'When required by law',
                ]} />
              </PolicySection>

              {/* 6. Third-Party Services */}
              <PolicySection id="third-party" number="6" icon={<CloudOutlinedIcon />} title="Third-Party Services" delay={0}>
                <Typography sx={{ mb: 1.5 }}>
                  We may use third-party services such as:
                </Typography>
                <PolicyList items={[
                  'Cloud storage providers',
                  'Analytics tools',
                  'Authentication services (e.g., Google login)',
                ]} />
                <Typography sx={{ mt: 2 }}>
                  These services may process your data in accordance with their own policies.
                </Typography>
              </PolicySection>

              {/* 7. Data Storage & Security */}
              <PolicySection id="security" number="7" icon={<LockOutlinedIcon />} title="Data Storage & Security" delay={0}>
                <Typography sx={{ mb: 1.5 }}>
                  We take reasonable steps to protect your data using:
                </Typography>
                <PolicyList items={[
                  'Secure servers',
                  'Encryption where applicable',
                  'Access controls',
                ]} />
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,180,0,0.06)',
                    border: '1px solid rgba(255,180,0,0.25)',
                  }}
                >
                  <Typography sx={{ fontSize: '0.88rem', lineHeight: 1.75, color: 'text.secondary' }}>
                    ⚠️ However, no system is 100% secure. We are unable to guarantee the absolute security of your data.
                  </Typography>
                </Box>
              </PolicySection>

              {/* 8. Your Rights */}
              <PolicySection id="your-rights" number="8" icon={<VerifiedUserOutlinedIcon />} title="Your Rights" delay={0}>
                <Typography sx={{ mb: 1.5 }}>You may:</Typography>
                <PolicyList items={[
                  'Access your data',
                  'Update your profile',
                  'Request deletion of your account',
                  'Opt out of certain tracking features',
                ]} />
              </PolicySection>

              {/* 9. Cookies */}
              <PolicySection id="cookies" number="9" icon={<CookieOutlinedIcon />} title="Cookies & Local Storage" delay={0}>
                <Typography sx={{ mb: 1.5 }}>We use:</Typography>
                <PolicyList items={[
                  'Cookies (web)',
                  'Local storage / AsyncStorage (mobile)',
                ]} />
                <SubHeader>To:</SubHeader>
                <PolicyList items={[
                  'Maintain sessions',
                  'Store preferences',
                  'Enable personalization',
                ]} />
              </PolicySection>

              {/* 10. Children */}
              <PolicySection id="children" number="10" icon={<ChildCareOutlinedIcon />} title="Children's Privacy" delay={0}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(239,68,68,0.05)',
                    border: '1px solid rgba(239,68,68,0.2)',
                  }}
                >
                  <Typography sx={{ fontSize: '0.94rem', lineHeight: 1.8, color: 'text.secondary' }}>
                    Our platform is <strong style={{ color: '#1a1a1a' }}>not intended for individuals under the age of 18</strong>.
                    We do not knowingly collect personal information from children.
                  </Typography>
                </Box>
              </PolicySection>

              {/* 11. Changes */}
              <PolicySection id="changes" number="11" icon={<UpdateOutlinedIcon />} title="Changes to This Policy" delay={0}>
                <Typography sx={{ lineHeight: 1.85 }}>
                  We may update this Privacy Policy from time to time. Updates will be reflected with a revised
                  <strong style={{ color: '#1a1a1a' }}> "Last Updated"</strong> date at the top of this page.
                  We encourage you to review this policy periodically.
                </Typography>
              </PolicySection>

              {/* 12. Contact */}
              <PolicySection id="contact" number="12" icon={<EmailOutlinedIcon />} title="Contact Us" delay={0}>
                <Typography sx={{ mb: 2, lineHeight: 1.85 }}>
                  If you have questions about this Privacy Policy, please contact us at:
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 3,
                    py: 1.5,
                    bgcolor: 'rgba(0,162,86,0.06)',
                    border: '1.5px solid rgba(0,162,86,0.2)',
                    borderRadius: 2,
                  }}
                >
                  <EmailOutlinedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Link
                    href="mailto:support@realestway.com"
                    sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    support@realestway.com
                  </Link>
                </Box>
              </PolicySection>

            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
