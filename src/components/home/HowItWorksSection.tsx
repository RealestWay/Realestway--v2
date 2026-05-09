'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Avatar } from '@mui/material';
import {
  SearchOutlined as SearchIcon,
  HomeOutlined as HomeIcon,
  Groups as CommunityIcon,
} from '@mui/icons-material';

const STEPS = [
  {
    title: 'Search',
    desc: 'Describe what you want — city, type, budget. Our smart search returns exactly what you need.',
    icon: <SearchIcon sx={{ fontSize: 32 }} />,
  },
  {
    title: 'Explore',
    desc: 'Browse thousands of available listings with photos, floor plans, and detailed fee breakdowns.',
    icon: <HomeIcon sx={{ fontSize: 32 }} />,
  },
  {
    title: 'Connect',
    desc: 'Contact community agents directly via call or WhatsApp — no middlemen, no hidden charges.',
    icon: <CommunityIcon sx={{ fontSize: 32 }} />,
  },
];

export default function HowItWorksSection() {
  return (
    <Box sx={{ background: 'linear-gradient(135deg, #F6F7FB 0%, #EBF5EE 100%)', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2, mb: 1, display: 'block' }}>
            SIMPLE PROCESS
          </Typography>
          <Typography variant="h3" fontWeight={900} sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
            How Realestway Works
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {STEPS.map((step, i) => (
            <Grid key={step.title} size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <Box sx={{
                    display: { xs: 'none', md: 'block' }, position: 'absolute',
                    top: 32, left: '60%', right: '-20%', height: 2,
                    bgcolor: 'primary.main', opacity: 0.15, zIndex: 0,
                  }} />
                )}
                <Avatar sx={{
                  width: 80, height: 80, bgcolor: 'primary.main', mx: 'auto', mb: 3,
                  boxShadow: '0 12px 30px rgba(0,162,85,0.25)', position: 'relative', zIndex: 1,
                }}>
                  {step.icon}
                </Avatar>
                <Typography variant="h5" fontWeight={800} mb={2}>{i + 1}. {step.title}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, maxWidth: 300, mx: 'auto', fontSize: '1.05rem' }}>
                  {step.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
