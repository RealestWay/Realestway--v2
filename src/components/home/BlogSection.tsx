'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import BlogCard from '../blog/BlogCard';
import { mockBlogPosts } from '../../data/mockData';

export default function BlogSection() {
  const router = useRouter();

  return (
    <Box sx={{ bgcolor: '#F8FAFC', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 6, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 1.5, mb: 1, display: 'block' }}>
              BLOG & NEWS
            </Typography>
            <Typography variant="h3" fontWeight={900} sx={{ maxWidth: 600, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              Your Guide to Smarter Renting, Buying & Investing
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => router.push('/blog')} 
            sx={{ 
              bgcolor: 'primary.main', 
              fontWeight: 700, 
              px: 4, 
              py: 1.6, 
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(0,162,85,0.2)',
              '&:hover': { bgcolor: 'primary.dark', boxShadow: '0 6px 20px rgba(0,162,85,0.3)' }
            }}
          >
            View All Articles
          </Button>
        </Box>
        <Grid container spacing={4}>
          {mockBlogPosts.map((post) => (
            <Grid key={post.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <BlogCard post={post} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
