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
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import MoneyOffOutlinedIcon from '@mui/icons-material/MoneyOffOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CopyrightOutlinedIcon from '@mui/icons-material/CopyrightOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

/* ── Keyframes ── */
const KEYFRAMES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
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

/* ── Warning box ── */
function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'rgba(245,158,11,0.06)',
        border: '1px solid rgba(245,158,11,0.28)',
        display: 'flex',
        gap: 1.5,
        alignItems: 'flex-start',
        mb: 2,
      }}
    >
      <WarningAmberOutlinedIcon sx={{ color: '#f59e0b', fontSize: 20, mt: '2px', flexShrink: 0 }} />
      <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'text.secondary' }}>
        {children}
      </Typography>
    </Box>
  );
}

/* ── Info box ── */
function InfoBox({ children, variant = 'green' }: { children: React.ReactNode; variant?: 'green' | 'red' }) {
  const colors = variant === 'red'
    ? { bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.2)' }
    : { bg: 'rgba(0,162,86,0.05)', border: 'rgba(0,162,86,0.18)' };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: colors.bg,
        border: `1px solid ${colors.border}`,
        mb: 1.5,
      }}
    >
      <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'text.secondary' }}>
        {children}
      </Typography>
    </Box>
  );
}

const TOC = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'nature-of-service', label: 'Nature of Service' },
  { id: 'user-responsibilities', label: 'User Responsibilities' },
  { id: 'agent-responsibilities', label: 'Agent Responsibilities' },
  { id: 'listings-disclaimer', label: 'Listings Disclaimer' },
  { id: 'no-transaction-liability', label: 'No Transaction Liability' },
  { id: 'account-verification', label: 'Account & Verification' },
  { id: 'content-ownership', label: 'Content Ownership' },
  { id: 'usage-restrictions', label: 'Usage Restrictions' },
  { id: 'suspension', label: 'Suspension & Termination' },
  { id: 'third-party-links', label: 'Third-Party Links' },
  { id: 'liability', label: 'Limitation of Liability' },
  { id: 'changes', label: 'Changes to Terms' },
  { id: 'governing-law', label: 'Governing Law' },
  { id: 'contact', label: 'Contact' },
];

export default function TermsOfServicePage() {
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
          src="/building1.jpg"
          alt="Terms of Service — Realestway"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/building2.jpg'; }}
        />
        {/* Deep green-tinted overlay, distinct from privacy policy */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,40,20,0.85) 0%, rgba(0,0,0,0.65) 100%)',
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
            <GavelOutlinedIcon sx={{ fontSize: 28 }} />
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
            Terms of Service
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: { xs: '0.88rem', md: '0.97rem' },
              maxWidth: 560,
              lineHeight: 1.75,
              animation: 'fadeUp 0.7s ease 0.28s both',
            }}
          >
            By using Realestway, you agree to these terms. Please read them carefully.
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
              <PolicySection id="introduction" number="1" icon={<GavelOutlinedIcon />} title="Introduction" delay={0}>
                <Typography sx={{ mb: 1.5, lineHeight: 1.85 }}>
                  Welcome to our platform. By accessing or using our services, you agree to these Terms of Service.
                </Typography>
                <Typography sx={{ lineHeight: 1.85 }}>
                  Our platform is a <strong style={{ color: '#1a1a1a' }}>property discovery and listing aggregation service</strong> that
                  connects users with property agents. We do not own, sell, or manage properties directly.
                </Typography>
              </PolicySection>

              {/* 2. Nature of Service */}
              <PolicySection id="nature-of-service" number="2" icon={<MiscellaneousServicesOutlinedIcon />} title="Nature of Service" delay={40}>
                <PolicyList items={[
                  'We aggregate property listings from multiple third-party sources (e.g., WhatsApp-based property networks)',
                  'We provide tools for agents to upload and manage their own listings',
                  'We provide a discovery interface to connect users with property agents',
                ]} />
                <WarningBox>
                  <strong>Important:</strong> All property transactions occur <strong>outside the platform</strong>. We are not a party to any transaction.
                </WarningBox>
              </PolicySection>

              {/* 3. User Responsibilities */}
              <PolicySection id="user-responsibilities" number="3" icon={<PersonOutlinedIcon />} title="User Responsibilities" delay={0}>
                <Typography sx={{ mb: 1.5 }}>You agree to:</Typography>
                <PolicyList items={[
                  'Provide accurate information',
                  'Use the platform lawfully',
                  'Not misuse or exploit the platform',
                ]} />
              </PolicySection>

              {/* 4. Agent Responsibilities */}
              <PolicySection id="agent-responsibilities" number="4" icon={<BusinessCenterOutlinedIcon />} title="Agent Responsibilities" delay={0}>
                <Typography sx={{ mb: 1.5 }}>Agents using the platform must:</Typography>
                <PolicyList items={[
                  'Provide accurate and truthful listings',
                  'Ensure listings are up to date',
                  'Only post properties they are authorized to represent',
                ]} />
              </PolicySection>

              {/* 5. Listings Disclaimer */}
              <PolicySection id="listings-disclaimer" number="5" icon={<WarningAmberOutlinedIcon />} title="Listings Disclaimer" delay={0}>
                <Typography sx={{ mb: 1.5 }}>We do not guarantee:</Typography>
                <PolicyList items={[
                  'Accuracy of property details',
                  'Availability of listings',
                  'Legitimacy of agents',
                ]} />
                <InfoBox>
                  Users are responsible for verifying all information before engaging in any transaction.
                </InfoBox>
              </PolicySection>

              {/* 6. No Transaction Liability */}
              <PolicySection id="no-transaction-liability" number="6" icon={<MoneyOffOutlinedIcon />} title="No Transaction Liability" delay={0}>
                <InfoBox variant="red">
                  <strong style={{ color: '#1a1a1a' }}>We are not responsible for:</strong>
                </InfoBox>
                <PolicyList items={[
                  'Property transactions',
                  'Payments between users and agents',
                  'Disputes arising from deals',
                  'Fraud or misrepresentation by third parties',
                ]} />
                <WarningBox>
                   Users engage with agents <strong>at their own risk</strong>. Always verify agent credentials, property ownership, and listing details independently before any payment or agreement. Realestway never collects payments on behalf of agents.
                </WarningBox>
              </PolicySection>

              {/* 7. Account & Verification */}
              <PolicySection id="account-verification" number="7" icon={<AccountCircleOutlinedIcon />} title="Account & Verification" delay={0}>
                <PolicyList items={[
                   'Users may register using a phone number or Google account',
                  'Agents are required to undergo KYC verification (including National Identification Number - NIN) to obtain "Verified" status',
                  'Verification status is intended to build trust but does not constitute a guarantee of service quality or legitimacy',
                  'You are responsible for maintaining account security and for all actions performed under your account',
                ]} />
              </PolicySection>

              {/* 8. Content Ownership */}
              <PolicySection id="content-ownership" number="8" icon={<CopyrightOutlinedIcon />} title="Content Ownership" delay={0}>
                <PolicyList items={[
                  'Users and agents retain ownership of content they upload',
                  'By uploading content, you grant us the right to display and distribute it on the platform',
                ]} />
              </PolicySection>

              {/* 9. Usage Restrictions */}
              <PolicySection id="usage-restrictions" number="9" icon={<BlockOutlinedIcon />} title="Platform Usage Restrictions" delay={0}>
                <Typography sx={{ mb: 1.5 }}>You may not:</Typography>
                <PolicyList items={[
                  'Scrape or copy data without permission',
                  'Use the platform for illegal activities',
                  'Attempt to disrupt or hack the system',
                ]} />
              </PolicySection>

              {/* 10. Suspension */}
              <PolicySection id="suspension" number="10" icon={<ErrorOutlineOutlinedIcon />} title="Suspension & Termination" delay={0}>
                <Typography sx={{ mb: 1.5 }}>We may suspend or terminate accounts if:</Typography>
                <PolicyList items={[
                  'Terms are violated',
                  'Fraudulent activity is detected',
                  'Abuse of the platform occurs',
                ]} />
              </PolicySection>

              {/* 11. Third-Party Links */}
              <PolicySection id="third-party-links" number="11" icon={<OpenInNewOutlinedIcon />} title="Third-Party Links" delay={0}>
                <Typography sx={{ lineHeight: 1.85 }}>
                  The platform may contain links to third-party services. We are not responsible for their content or practices.
                  We encourage you to review the privacy policies of any third-party services you visit.
                </Typography>
              </PolicySection>

              {/* 12. Limitation of Liability */}
              <PolicySection id="liability" number="12" icon={<ShieldOutlinedIcon />} title="Limitation of Liability" delay={0}>
                <Typography sx={{ mb: 1.5 }}>
                  To the fullest extent permitted by law, we are not liable for:
                </Typography>
                <PolicyList items={[
                  'Losses from property transactions',
                  'Inaccurate listings',
                  'Service interruptions',
                  'Any indirect or consequential damages',
                ]} />
              </PolicySection>

              {/* 13. Changes to Terms */}
              <PolicySection id="changes" number="13" icon={<UpdateOutlinedIcon />} title="Changes to Terms" delay={0}>
                <Typography sx={{ lineHeight: 1.85 }}>
                  We may update these Terms at any time. Continued use of the platform means you accept the updated terms.
                  We will reflect changes with a revised <strong style={{ color: '#1a1a1a' }}>"Last Updated"</strong> date at the top of this page.
                </Typography>
              </PolicySection>

              {/* 14. Governing Law */}
              <PolicySection id="governing-law" number="14" icon={<PublicOutlinedIcon />} title="Governing Law" delay={0}>
                <Typography sx={{ lineHeight: 1.85 }}>
                  These Terms shall be governed by the laws of your operating jurisdiction.
                </Typography>
              </PolicySection>

              {/* 15. Contact */}
              <PolicySection id="contact" number="15" icon={<EmailOutlinedIcon />} title="Contact" delay={0}>
                <Typography sx={{ mb: 2, lineHeight: 1.85 }}>
                  For questions regarding these Terms:
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
