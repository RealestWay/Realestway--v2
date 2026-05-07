'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Divider from '@mui/material/Divider';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import ApiService from '@/src/services/api';

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import ConnectWithoutContactOutlinedIcon from '@mui/icons-material/ConnectWithoutContactOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

/* â•â• Keyframes â•â• */
const KEYFRAMES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes slideLeft {
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideRight {
  from { opacity: 0; transform: translateX(-40px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.88); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes floatY {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
}
@keyframes countUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,162,86,0.3); }
  50%       { box-shadow: 0 0 0 14px rgba(0,162,86,0); }
}
@keyframes shimmer {
  0%   { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}
`;

/* â•â• Intersection Observer hook for reveal animations â•â• */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* â•â• Animated counter â•â• */
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useReveal(0.2);

  useEffect(() => {
    if (!visible) return;
    const duration = 1800;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, value);
      setCount(Math.floor(current));
      if (current >= value) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, value]);

  return (
    <Box ref={ref}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 900,
          color: 'primary.main',
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontFamily: '"Poppins", sans-serif',
          animation: visible ? 'countUp 0.6s ease both' : 'none',
        }}
      >
        {count.toLocaleString()}{suffix}
      </Typography>
    </Box>
  );
}

/* â•â• Section label â•â• */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Chip
      label={children}
      size="small"
      sx={{
        bgcolor: 'rgba(0,162,86,0.1)',
        color: 'primary.main',
        fontWeight: 700,
        fontSize: '0.72rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        mb: 2,
        borderRadius: '6px',
        height: 26,
        px: 0.5,
      }}
    />
  );
}

/* â•â• Feature card â•â• */
function FeatureCard({
  icon,
  title,
  desc,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3.5,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.07)',
          height: '100%',
          transition: 'all 0.25s ease',
          cursor: 'default',
          '&:hover': {
            boxShadow: '0 8px 40px rgba(0,162,86,0.12)',
            borderColor: 'rgba(0,162,86,0.25)',
            transform: 'translateY(-4px)',
          },
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2,
            bgcolor: 'rgba(0,162,86,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
            mb: 2.5,
            fontSize: 26,
          }}
        >
          {icon}
        </Box>
        <Typography variant="subtitle1" fontWeight={700} mb={1}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" lineHeight={1.75}>
          {desc}
        </Typography>
      </Paper>
    </Box>
  );
}

/* == FAQ Data == */
const FAQS = [
  {
    q: 'Is Realestway free to use?',
    a: 'Yes — completely. There are no charges, subscription fees, or hidden costs for searching properties or browsing listings on Realestway. Property seekers can browse, save, and explore listings at no cost. Agents can also create a profile and claim listings free of charge. Our platform is built to connect people with properties, not to take your money.',
  },
  {
    q: 'Are the properties on Realestway verified?',
    a: 'We organize listings into two categories: Verified Listings — managed by agents who have claimed and actively update their properties; and Unverified Listings — sourced from external platforms awaiting agent claims. We recommend contacting agents directly and verifying property details before making any commitments.',
  },
  {
    q: 'Is Realestway responsible for transactions between users and agents?',
    a: 'No. Realestway is a discovery and connection platform. We are not a party to, and are not responsible for, any transaction, agreement, payment, or dispute between property seekers and agents or landlords. Users are advised to exercise due diligence, verify all details directly with the agent, and proceed with caution in all dealings.',
  },
  {
    q: 'How do I contact a property owner or agent?',
    a: 'Each listing displays the agent\'s contact details. You can reach them directly via phone, WhatsApp, or email. Realestway does not mediate or facilitate payments — you connect directly with the agent listed on the property.',
  },
  {
    q: 'Can I search for properties without creating an account?',
    a: 'Absolutely. You can freely browse and explore all available listings without registering. Creating an account gives you additional features like saving favorites, tracking listings you\'ve viewed, and receiving personalized recommendations.',
  },
  {
    q: 'How do agents claim or manage their listings?',
    a: 'Agents can register on the platform with their phone number (preferably a WhatsApp number) and get their existing listings synced to their profile. By this action, they have claim ownership and can update property details, add photos, set availability status, and reach a wider pool of active property seekers.',
  },
  {
    q: 'Can I search for properties in different states or cities?',
    a: 'Yes. Our platform aggregates listings from across Nigeria, allowing you to search by city, neighborhood, or landmark. You can filter by location, property type, price range, and more to find exactly what you need.',
  },
  {
    q: 'What should I do before finalizing a deal with an agent?',
    a: 'Always verify the property address, agent identity, ownership documents, and agreed terms in person or via a trusted legal representative. Realestway connects you with listings — the due diligence and decision is yours. We strongly encourage physical inspections and proper legal documentation before any payment or agreement.',
  },
];

/* == Main About Page == */
export default function AboutPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);
  const [platformStats, setPlatformStats] = useState({
    active_listings: 10000,
    total_agents: 1000,
    cities_count: 36,
    property_seekers: 50000
  });

  const statsReveal = useReveal(0.1);
  const missionReveal = useReveal(0.1);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await ApiService.properties.getPublicStats();
        if (response.success && response.data) {
          setPlatformStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching platform stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fb' }}>
      <style>{KEYFRAMES}</style>
      <Navbar />

      {/* ══ PAGE HEADER — Contact-Us-style: full-bleed image, Navbar overlaid, centered text ══ */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 300, sm: 360, md: 440 },
          overflow: 'hidden',
          /* Pull up so the fixed Navbar sits right on top of the image */
          mt: { xs: '-74px', md: '-86px' },
        }}
      >
        {/* Background building image */}
        <Box
          component="img"
          src="/building2.jpg"
          alt="About Realestway"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/building1.jpg';
          }}
        />

        {/* Dark overlay — uniform dark like the Contact Us page */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.58)',
          }}
        />

        {/* Centered text content — vertically centered, horizontally centered */}
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
            /* push content below Navbar */
            pt: { xs: '120px', md: '160px' },
            px: 2,
          }}
        >
          {/* ABOUT US overline */}
          <Typography
            sx={{
              color: 'primary.light',
              fontWeight: 700,
              letterSpacing: '0.18em',
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              mb: 1.5,
              animation: 'fadeUp 0.6s ease 0.05s both',
            }}
          >
            About Us
          </Typography>

          {/* Main title */}
          <Typography
            component="h1"
            sx={{
              color: 'white',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 900,
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
              lineHeight: 1.2,
              mb: 2,
              maxWidth: 700,
              animation: 'fadeUp 0.7s ease 0.15s both',
            }}
          >Real People. Real Homes. Realestway
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: { xs: '0.88rem', md: '0.97rem' },
              maxWidth: 560,
              lineHeight: 1.75,
              animation: 'fadeUp 0.7s ease 0.28s both',
            }}
          >
           We&apos;re more than a real estate platform, we&apos;re a community helping everyday people find places they can truly call home
          </Typography>
        </Box>
      </Box>

      {/* == FIRST SECTION — "Who We Are" split: text-left / image-right == */}
      <Box sx={{ bgcolor: 'white', py: { xs: 7, md: 10 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">

            {/* LEFT — text content */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                ref={missionReveal.ref}
                sx={{
                  opacity: missionReveal.visible ? 1 : 0,
                  transform: missionReveal.visible ? 'translateX(0)' : 'translateX(-36px)',
                  transition: 'opacity 0.65s ease, transform 0.65s ease',
                }}
              >
                {/* Label */}
                <Typography
                  variant="overline"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    fontSize: '0.72rem',
                    display: 'block',
                    mb: 1.5,
                  }}
                >
                  About Us
                </Typography>

                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{
                    mb: 2.5,
                    fontSize: { xs: '1.6rem', md: '2rem' },
                    lineHeight: 1.2,
                    fontFamily: '"Poppins", sans-serif',
                  }}
                >
                  Your Trusted Partner In{' '}
                  <Box component="span" sx={{ color: 'primary.main' }}>Renting &amp; Buying</Box>{' '}Homes.
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ lineHeight: 1.85, mb: 2.5, fontSize: '0.96rem' }}
                >
                  At{' '}
                  <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>Realestway</Box>,
                  we believe finding a home should be simple, transparent, and stress-free.
                  That&apos;s why we&apos;ve built a platform where anyone can confidently rent, buy,
                  or list properties without the usual hassle.
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ lineHeight: 1.85, mb: 4, fontSize: '0.96rem' }}
                >
                  From verified listings to trusted agents, our focus is on giving you clarity at every step
                  of the journey — no hidden charges, no endless back-and-forth, just the easiest way to
                  connect with the right property.
                </Typography>

                <Link href="/search" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 4.5,
                      py: 1.5,
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' },
                      boxShadow: '0 6px 28px rgba(0,162,86,0.38)',
                      transition: 'all 0.22s ease',
                    }}
                  >
                    Learn More
                  </Button>
                </Link>
              </Box>
            </Grid>

            {/* RIGHT — building image with feature cards at bottom */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'hidden',
                  opacity: missionReveal.visible ? 1 : 0,
                  transform: missionReveal.visible ? 'translateX(0)' : 'translateX(36px)',
                  transition: 'opacity 0.65s ease 0.15s, transform 0.65s ease 0.15s',
                }}
              >
                {/* Main building photo */}
                <Box
                  component="img"
                  src="/building1.jpg"
                  alt="Modern property"
                  sx={{
                    width: '100%',
                    height: { xs: 320, sm: 400, md: 480 },
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    filter: 'brightness(0.9)',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/building2.jpg';
                  }}
                />

                {/* Dark gradient at bottom for pill legibility */}
                <Box
                  sx={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '45%',
                    background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
                  }}
                />

                {/* Feature pills row */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 22,
                    left: 20,
                    right: 20,
                    display: 'flex',
                    gap: 1.5,
                    flexWrap: 'nowrap',
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': { display: 'none' },
                  }}
                >
                  {[
                    {
                      icon: <SearchIcon sx={{ fontSize: 14 }} />,
                      title: 'Easy Property Search',
                      desc: 'Find your next home in minutes, search by location, budget, or property type.',
                    },
                    {
                      icon: <PeopleAltOutlinedIcon sx={{ fontSize: 14 }} />,
                      title: 'Wide Network of Agents',
                      desc: 'Realestway brings together buyers, renters, and property owners in one ecosystem.',
                    },
                    {
                      icon: <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />,
                      title: 'Across Nigeria',
                      desc: 'Your home is not limited by city limits. We cover listings nationwide.',
                    },
                  ].map((pill, i) => (
                    <Box
                      key={i}
                      sx={{
                        flexShrink: 0,
                        bgcolor: 'rgba(0,0,0,0.55)',
                        backdropFilter: 'blur(14px)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        borderRadius: 2.5,
                        p: 1.5,
                        minWidth: 150,
                        maxWidth: 200,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                        <Box sx={{ color: 'primary.light' }}>{pill.icon}</Box>
                        <Typography
                          sx={{
                            color: 'white',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            lineHeight: 1.2,
                          }}
                        >
                          {pill.title}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          color: 'rgba(255,255,255,0.65)',
                          fontSize: '0.65rem',
                          lineHeight: 1.5,
                        }}
                      >
                        {pill.desc}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* == STATS SECTION == */}
      <Box
        ref={statsReveal.ref}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {[
              { value: platformStats.active_listings, suffix: '+', label: 'Active Listings', icon: <HomeWorkOutlinedIcon /> },
              { value: platformStats.total_agents, suffix: '+', label: 'Verified Agents', icon: <VerifiedOutlinedIcon /> },
              { value: platformStats.cities_count, suffix: ' Cities', label: 'States & Cities', icon: <LocationOnOutlinedIcon /> },
              { value: platformStats.property_seekers, suffix: '+', label: 'Property Seekers', icon: <PeopleAltOutlinedIcon /> },
            ].map((stat, i) => (
              <Grid size={{ xs: 6, sm: 3 }} key={i}>
                <Box
                  sx={{
                    textAlign: 'center',
                    opacity: statsReveal.visible ? 1 : 0,
                    transform: statsReveal.visible ? 'translateY(0)' : 'translateY(24px)',
                    transition: `opacity 0.55s ease ${i * 100}ms, transform 0.55s ease ${i * 100}ms`,
                  }}
                >
                  <Box
                    sx={{
                      width: 50, height: 50, borderRadius: '14px',
                      bgcolor: 'rgba(0,162,86,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'primary.main', fontSize: 24, mx: 'auto', mb: 1.5,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  <Typography variant="body2" color="text.secondary" fontWeight={500} mt={0.5}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* == WHAT WE DO / OUR APPROACH == */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          {/* Section header */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <SectionLabel>Our Approach</SectionLabel>
            <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: '1.7rem', md: '2.1rem' }, mb: 2 }}>
              How Realestway Works
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 560, mx: 'auto', lineHeight: 1.8, fontSize: '0.97rem' }}>
              A platform designed from the ground up around the needs of property seekers and real estate agents alike.
            </Typography>
          </Box>

          {/* Features grid */}
          <Grid container spacing={3}>
            {[
              {
                icon: <SearchIcon sx={{ fontSize: 26 }} />,
                title: 'Aggregate & Discover',
                desc: 'We pull listings from multiple sources across Nigeria, organizing them into a single, fast, searchable platform.',
              },
              {
                icon: <VerifiedOutlinedIcon sx={{ fontSize: 26 }} />,
                title: 'Verified Listings',
                desc: 'Agents claim and manage their listings for complete accuracy. Unverified listings remain accessible while awaiting claims.',
              },
              {
                icon: <LocationOnOutlinedIcon sx={{ fontSize: 26 }} />,
                title: 'Location Intelligence',
                desc: 'Explore properties by neighborhood, landmark, or region. Find what\'s near you with smart location filtering.',
              },
              {
                icon: <TrendingUpOutlinedIcon sx={{ fontSize: 26 }} />,
                title: 'Real-Time Updates',
                desc: 'Agents update availability, pricing, and details in real time — meaning you always see the most current information.',
              },
              {
                icon: <LightbulbOutlinedIcon sx={{ fontSize: 26 }} />,
                title: 'Personalized Discovery',
                desc: 'Our platform learns from your activity to surface recommendations based on your location and search behavior.',
              },
              {
                icon: <ConnectWithoutContactOutlinedIcon sx={{ fontSize: 26 }} />,
                title: 'Direct Agent Connection',
                desc: 'No middlemen. Contact agents directly via phone or WhatsApp and clarify every detail before any commitment.',
              },
            ].map((f, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <FeatureCard icon={f.icon} title={f.title} desc={f.desc} delay={i * 80} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* == FOR SEEKERS & AGENTS == */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #003d1f 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorations */}
        <Box sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Chip
              label="Built for Everyone"
              sx={{
                bgcolor: 'rgba(0,162,86,0.2)',
                color: '#4ade80',
                fontWeight: 700,
                fontSize: '0.72rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                mb: 2.5,
                border: '1px solid rgba(0,162,86,0.35)',
              }}
            />
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ color: 'white', fontSize: { xs: '1.7rem', md: '2.1rem' }, mb: 2 }}
            >
              For Property Seekers & Agents
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', maxWidth: 540, mx: 'auto', lineHeight: 1.8 }}>
              Whether you are looking for your next home or managing a real estate portfolio — Realestway is built for you.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* For Seekers */}
            <Grid size={{ xs: 12, md: 6 }}>
              <DualCard
                title="For Property Seekers"
                subtitle="Find your ideal home without the hassle"
                accentColor="#00a256"
                items={[
                  { icon: <SearchIcon />, text: 'Browse properties without creating an account' },
                  { icon: <FavoriteOutlinedIcon />, text: 'Save listings and track your interests' },
                  { icon: <NearMeOutlinedIcon />, text: 'Discover properties near your location' },
                  { icon: <ThumbUpAltOutlinedIcon />, text: 'Get recommendations based on your activity' },
                  { icon: <LocationOnOutlinedIcon />, text: 'Search across cities, states, and neighborhoods' },
                ]}
                cta="Start Exploring"
                ctaHref="/search"
              />
            </Grid>

            {/* For Agents */}
            <Grid size={{ xs: 12, md: 6 }}>
              <DualCard
                title="For Agents"
                subtitle="Reach more property seekers, effortlessly"
                accentColor="#f59e0b"
                items={[
                  { icon: <VerifiedOutlinedIcon />, text: 'Claim and verify your existing listings' },
                  { icon: <AddCircleOutlineIcon />, text: 'Add new properties easily to your portfolio' },
                  { icon: <UpdateOutlinedIcon />, text: 'Update availability and details in real time' },
                  { icon: <PersonSearchOutlinedIcon />, text: 'Reach thousands of active property seekers' },
                  { icon: <TrendingUpOutlinedIcon />, text: 'Grow your real estate business online' },
                ]}
                cta="Register as Agent"
                ctaHref="/auth/register"
                dark
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* == OUR VISION == */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8f9fb' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <SectionLabel>Our Vision</SectionLabel>
            <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: '1.7rem', md: '2.1rem' }, mb: 3 }}>
              Where We Are Going
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.85, mb: 6, fontSize: '0.97rem' }}>
              We aim to become a <strong>data-driven property discovery platform</strong> that goes far beyond listings.
              Our roadmap is built on technology that makes real estate smarter, faster, and more transparent.
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            {[
              {
                icon: <LocationOnOutlinedIcon sx={{ fontSize: 26 }} />,
                title: 'Location Intelligence',
                desc: 'Neighborhood insights, infrastructure data, and proximity analytics to help you make informed decisions.',
                badge: 'Coming Soon',
              },
              {
                icon: <AutoAwesomeOutlinedIcon sx={{ fontSize: 26 }} />,
                title: 'Smart Recommendations',
                desc: 'AI-powered property matching based on your behavior, preferences, and budget.',
                badge: 'In the Works',
              },
              {
                icon: <SearchIcon sx={{ fontSize: 26 }} />,
                title: 'Advanced Search & Matching',
                desc: 'Precision filters, virtual tours, and property comparison tools.',
                badge: 'Roadmap',
              },
              {
                icon: <TrendingUpOutlinedIcon sx={{ fontSize: 26 }} />,
                title: 'Market Analytics',
                desc: 'Price trend data and market insights to help users make smarter real estate decisions.',
                badge: 'Roadmap',
              },
            ].map((item, i) => {
              const { ref: vRef, visible: vVisible } = useReveal(); // eslint-disable-line react-hooks/rules-of-hooks
              return (
                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                  <Box
                    ref={vRef}
                    sx={{
                      opacity: vVisible ? 1 : 0,
                      transform: vVisible ? 'translateY(0)' : 'translateY(24px)',
                      transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid rgba(0,0,0,0.07)',
                        display: 'flex',
                        gap: 2,
                        transition: 'all 0.22s ease',
                        '&:hover': { boxShadow: '0 6px 28px rgba(0,162,86,0.1)', transform: 'translateY(-3px)' },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48, height: 48, borderRadius: 2,
                          bgcolor: 'rgba(0,162,86,0.08)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'primary.main', flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                          <Typography variant="subtitle2" fontWeight={700}>{item.title}</Typography>
                          <Chip
                            label={item.badge}
                            size="small"
                            sx={{ height: 18, fontSize: '0.62rem', fontWeight: 600, bgcolor: 'rgba(0,162,86,0.1)', color: 'primary.main', px: 0.25 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                          {item.desc}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* == FAQ SECTION == */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 6, md: 10 }}>
            {/* Left label */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ position: { md: 'sticky' }, top: 120 }}>
                <SectionLabel>FAQ</SectionLabel>
                <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: '1.7rem', md: '2rem' }, mb: 2 }}>
                  Frequently Asked Questions
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.8, mb: 4 }}>
                  Everything you need to know about using Realestway â€” for property seekers and agents alike.
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1.5px solid rgba(0,162,86,0.2)',
                    bgcolor: 'rgba(0,162,86,0.04)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <InfoOutlinedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                      Still have a question?
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2} lineHeight={1.7}>
                    Can&apos;t find the answer you&apos;re looking for? Contact us and we&apos;ll get back to you as soon as possible.
                  </Typography>
                  <Link href="/contact" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: 'primary.main',
                        borderRadius: 2,
                        fontWeight: 700,
                        '&:hover': { bgcolor: 'primary.dark' },
                        boxShadow: '0 4px 16px rgba(0,162,86,0.3)',
                      }}
                    >
                      Contact Us
                    </Button>
                  </Link>
                </Paper>
              </Box>
            </Grid>

            {/* Right FAQ accordion */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {FAQS.map((faq, i) => (
                  <Accordion
                    key={i}
                    expanded={expandedFaq === `faq-${i}`}
                    onChange={(_, isOpen) => setExpandedFaq(isOpen ? `faq-${i}` : false)}
                    elevation={0}
                    disableGutters
                    sx={{
                      border: '1px solid',
                      borderColor: expandedFaq === `faq-${i}` ? 'rgba(0,162,86,0.3)' : 'rgba(0,0,0,0.08)',
                      borderRadius: '12px !important',
                      overflow: 'hidden',
                      '&::before': { display: 'none' },
                      bgcolor: expandedFaq === `faq-${i}` ? 'rgba(0,162,86,0.03)' : 'white',
                      transition: 'all 0.22s ease',
                      '&:hover': {
                        borderColor: 'rgba(0,162,86,0.2)',
                        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <Box
                          sx={{
                            width: 28, height: 28, borderRadius: '50%',
                            bgcolor: expandedFaq === `faq-${i}` ? 'primary.main' : 'rgba(0,0,0,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.22s ease',
                          }}
                        >
                          <ExpandMoreIcon sx={{ fontSize: 18, color: expandedFaq === `faq-${i}` ? 'white' : 'text.secondary' }} />
                        </Box>
                      }
                      sx={{ px: 3, py: 2.25 }}
                    >
                      <Typography fontWeight={600} fontSize="0.95rem">
                        {faq.q}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 3, pb: 2.75, pt: 0 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Typography color="text.secondary" lineHeight={1.8} fontSize="0.9rem">
                        {faq.a}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* â•â• CTA SECTION â•â• */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #00a256 0%, #007a41 100%)',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          top: -200, right: -150, bgcolor: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          bottom: -100, left: -80, bgcolor: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
        }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography
            component="div"
            sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 2 }}
          >
            Start Your Journey
          </Typography>
          <Typography
            variant="h3"
            fontWeight={900}
            sx={{ color: 'white', fontSize: { xs: '1.8rem', md: '2.4rem' }, mb: 2, lineHeight: 1.2 }}
          >
            We Are Not Just Listing Properties.
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: 'rgba(255,255,255,0.85)', fontSize: { xs: '1.2rem', md: '1.5rem' }, mb: 3 }}
          >
            We Are Building the Infrastructure for Smarter Property Discovery.
          </Typography>
          <Typography
            sx={{ color: 'rgba(255,255,255,0.75)', maxWidth: 560, mx: 'auto', lineHeight: 1.8, mb: 5, fontSize: '0.97rem' }}
          >
            Finding a property shouldn&apos;t be stressful, slow, or confusing. With the right technology,
            discovery can be faster, more transparent, and more personalized â€” and that&apos;s exactly what we&apos;re building.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/search" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 5,
                  py: 1.75,
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.97rem',
                  '&:hover': { bgcolor: '#f0fdf4', transform: 'translateY(-2px)' },
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  transition: 'all 0.22s ease',
                }}
              >
                Find a Property
              </Button>
            </Link>
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  px: 5,
                  py: 1.75,
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.97rem',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.12)',
                  },
                  transition: 'all 0.22s ease',
                }}
              >
                List Your Property
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

/* â•â• DualCard sub-component â•â• */
function DualCard({
  title,
  subtitle,
  accentColor,
  items,
  cta,
  ctaHref,
  dark = false,
}: {
  title: string;
  subtitle: string;
  accentColor: string;
  items: { icon: React.ReactNode; text: string }[];
  cta: string;
  ctaHref: string;
  dark?: boolean;
}) {
  const { ref, visible } = useReveal();
  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.55s ease, transform 0.55s ease',
        height: '100%',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.12)',
          bgcolor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.25s ease',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.1)',
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 50px rgba(0,0,0,0.2)',
          },
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Chip
            label={title}
            size="small"
            sx={{
              bgcolor: accentColor + '25',
              color: accentColor,
              fontWeight: 700,
              fontSize: '0.72rem',
              border: `1px solid ${accentColor}50`,
              letterSpacing: '0.04em',
              mb: 2,
            }}
          />
          <Typography variant="h6" fontWeight={800} sx={{ color: 'white', mb: 0.75 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            {subtitle}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.75, mb: 4 }}>
          {items.map((item, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 34, height: 34, borderRadius: '10px',
                  bgcolor: accentColor + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: accentColor, flexShrink: 0,
                  '& svg': { fontSize: 18 },
                }}
              >
                {item.icon}
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, fontWeight: 500 }}>
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>

        <Link href={ctaHref} style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            fullWidth
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: accentColor,
              color: 'white',
              fontWeight: 700,
              borderRadius: '10px',
              py: 1.4,
              '&:hover': {
                bgcolor: accentColor,
                filter: 'brightness(1.1)',
                transform: 'translateY(-1px)',
              },
              boxShadow: `0 6px 24px ${accentColor}50`,
              transition: 'all 0.22s ease',
            }}
          >
            {cta}
          </Button>
        </Link>
      </Paper>
    </Box>
  );
}

