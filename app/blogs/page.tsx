'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';

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

/* ── Blog post data ── */
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorAvatar: string;
  image: string;
}

const ALL_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'Why Virtual Tours Are Changing the Way We Buy Homes',
    excerpt: 'Discover how immersive tech is reshaping property viewings and helping buyers make confident decisions from anywhere in the world.',
    category: 'Technology',
    date: 'May 11, 2025',
    readTime: '11 min Read',
    author: 'Adewale Okafor',
    authorAvatar: '',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
  },
  {
    id: 'b2',
    title: 'Top 5 Things to Look for When Touring a Home',
    excerpt: 'From layout flow to lighting, learn what truly matters during home viewings: virtual or in-person. This is the full guide.',
    category: 'Buying Guide',
    date: 'May 11, 2025',
    readTime: '11 min Read',
    author: 'Chidinma Eze',
    authorAvatar: '',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  },
  {
    id: 'b3',
    title: "First-Time Buyer? Here's Your Step-by-Step Real Estate Guide",
    excerpt: 'Navigate the buying process with ease using our essential checklist for new homeowners. We have the best guide for you.',
    category: 'Buying Guide',
    date: 'May 11, 2025',
    readTime: '11 min Read',
    author: 'Fatima Abdullahi',
    authorAvatar: '',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  },
  {
    id: 'b4',
    title: 'Staging Secrets: How to Make Your Property Irresistible',
    excerpt: 'Get expert tips to present your home in the best light and attract serious buyers faster.',
    category: 'Homeowner Tips',
    date: 'May 11, 2025',
    readTime: '11 min Read',
    author: 'Emeka Properties',
    authorAvatar: '',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  },
  {
    id: 'b5',
    title: 'Market Trends 2025: What Buyers and Sellers Need to Know',
    excerpt: 'Stay ahead of the curve with insights into pricing, inventory, and the latest buyer behavior this year.',
    category: 'Market Insights',
    date: 'May 11, 2025',
    readTime: '11 min Read',
    author: 'Chidinma Eze',
    authorAvatar: '',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
  },
  {
    id: 'b6',
    title: 'Neighborhood Spotlight: Ajah Axis',
    excerpt: "Explore what makes this community stand out: schools, parks, dining, and more. Ajah is in-demand at the moment in time.",
    category: 'Neighborhoods',
    date: 'May 11, 2025',
    readTime: '11 min Read',
    author: 'Adewale Okafor',
    authorAvatar: '',
    image: 'https://images.unsplash.com/photo-1549925245-8a7a48c2e570?w=800&q=80',
  },
  {
    id: 'b7',
    title: '5 Things To Check Before Renting An Apartment In Nigeria',
    excerpt: 'Avoid costly mistakes by knowing what to inspect before signing a lease. From water supply to security.',
    category: 'Renting Tips',
    date: 'May 11, 2025',
    readTime: '9 min Read',
    author: 'Fatima Abdullahi',
    authorAvatar: '',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  },
  {
    id: 'b8',
    title: 'How Realestway Is Making Property Search Stress-Free',
    excerpt: 'Say goodbye to fake listings and endless back-and-forth. Learn how Realestway connects you with verified agents.',
    category: 'Real Estate Insights',
    date: 'May 11, 2025',
    readTime: '8 min Read',
    author: 'Adewale Okafor',
    authorAvatar: '',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  },
  {
    id: 'b9',
    title: 'Top Cities In Nigeria To Buy Property In 2025',
    excerpt: "Thinking of investing in real estate? Discover the fastest-growing cities and why they're the hottest markets.",
    category: 'Market Insights',
    date: 'May 11, 2025',
    readTime: '10 min Read',
    author: 'Chidinma Eze',
    authorAvatar: '',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
  },
];

const CATEGORIES = ['All', 'Technology', 'Buying Guide', 'Market Insights', 'Homeowner Tips', 'Renting Tips', 'Neighborhoods', 'Real Estate Insights'];
const POSTS_PER_PAGE = 6;

/* ── Blog card component ── */
function BlogArticleCard({ post, index }: { post: BlogPost; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms`,
      }}
    >
      <Link href={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.08)',
            bgcolor: 'white',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
            '&:hover': {
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              transform: 'translateY(-4px)',
            },
          }}
        >
          {/* Image */}
          <Box sx={{ position: 'relative', pb: '58%', overflow: 'hidden', bgcolor: 'grey.100' }}>
            <Box
              component="img"
              src={post.image}
              alt={post.title}
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'; }}
            />
          </Box>

          {/* Content */}
          <Box sx={{ p: 2.5 }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{
                mb: 1,
                fontSize: '0.97rem',
                lineHeight: 1.4,
                color: 'text.primary',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {post.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                lineHeight: 1.65,
                fontSize: '0.83rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {post.excerpt}
            </Typography>

            {/* Author row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 26, height: 26, bgcolor: 'primary.main', fontSize: '0.72rem', fontWeight: 700 }}>
                {post.author.charAt(0)}
              </Avatar>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {post.date}
              </Typography>
              <Box
                sx={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  bgcolor: 'text.disabled',
                  flexShrink: 0,
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                <AccessTimeIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary">{post.readTime}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Link>
    </Box>
  );
}

/* ── Main Blogs Page ── */
export default function BlogsPage() {
  const router = useRouter();
  const [search,      setSearch]      = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [page,        setPage]        = useState(1);

  const filtered = ALL_POSTS.filter((p) => {
    const matchCat  = activeCategory === 'All' || p.category === activeCategory;
    const matchSrch = search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrch;
  });

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const displayed  = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const handleSearch = () => { setPage(1); };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fb' }}>
      <style>{KEYFRAMES}</style>
      <Navbar />

      {/* ══ HERO BANNER ══ */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 420, sm: 480, md: 560 },
          overflow: 'hidden',
          mt: { xs: '-74px', md: '-86px' },
        }}
      >
        {/* Background */}
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1400&q=80"
          alt="Blog hero"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/building2.jpg'; }}
        />

        {/* Dark overlay */}
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.62)' }} />

        {/* Back button row */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            pt: { xs: '130px', md: '190px' },
            px: { xs: 2, md: 5 },
            zIndex: 3,
          }}
        >
          <Box
            onClick={() => router.back()}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': { color: 'white' },
              transition: 'color 0.2s',
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} /> Back
          </Box>
        </Box>

        {/* Centered text */}
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
            pt: { xs: '150px', md: '190px' },
            px: 2,
          }}
        >
          <Typography
            component="h1"
            sx={{
              color: 'white',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 900,
              fontSize: { xs: '1.8rem', sm: '2.3rem', md: '3rem' },
              lineHeight: 1.15,
              mb: 1.75,
              maxWidth: 680,
              animation: 'fadeUp 0.7s ease 0.1s both',
            }}
          >
            Insights, Tips & Trends in Real Estate
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: { xs: '0rem', md: '0.97rem' },
              width: { xs: '0', md: '520px' },
              height: { xs: '0', md: '100px' },
              lineHeight: { xs: '0', md: '1.75' },
              mb: { xs: '0', md: '3.5' },
              animation: 'fadeUp 0.7s ease 0.22s both',
            }}
          >
            Explore our blog for smart home hunting tips, market trends, and how VR is transforming real estate
          </Typography>

          {/* Search bar */}
          <Box
            sx={{
              display: { xs: 'block', md: 'flex' },
              gap: 1,
              width: { xs: '100%', md: '660px' },
              height: { xs: '100px', md: '50px' },
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeUp 0.7s ease 0.32s both',
            }}
          >
             <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                width: { xs: '100%', md: '55%' },
                bgcolor: 'rgba(255,255,255,0.95)',
                borderRadius: '10px',
                px: 2,
                gap: 1,
              }}
            >
              <SearchIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
              <InputBase
                placeholder="Search for blog articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                sx={{ flex: 1, fontSize: '0.9rem', py: 1.25 }}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '45%' }, height: { xs: '100px', md: '100px' }, display:'flex', justifyContent:'space-around', alignItems:'center' }}>
           
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                bgcolor: 'primary.main',
                px: 3,
                fontWeight: 700,
                borderRadius: '10px',
                '&:hover': { bgcolor: 'primary.dark' },
                boxShadow: '0 4px 16px rgba(0,162,86,0.4)',
                whiteSpace: 'nowrap',
              }}
            >
              Search Now
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              sx={{
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                fontWeight: 600,
                borderRadius: '10px',
                px: 2,
                whiteSpace: 'nowrap',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Filter by
            </Button></Box>
          </Box>
        </Box>
      </Box>

      {/* ══ CATEGORY CHIPS ══ */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid rgba(0,0,0,0.07)', py: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                sx={{
                  flexShrink: 0,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  height: 34,
                  cursor: 'pointer',
                  bgcolor: activeCategory === cat ? 'primary.main' : 'transparent',
                  color: activeCategory === cat ? 'white' : 'text.primary',
                  border: activeCategory === cat ? 'none' : '1px solid rgba(0,0,0,0.12)',
                  '&:hover': {
                    bgcolor: activeCategory === cat ? 'primary.dark' : 'rgba(0,162,86,0.08)',
                  },
                  transition: 'all 0.18s ease',
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ══ ARTICLES SECTION ══ */}
      <Box sx={{ py: { xs: 6, md: 9 }, flex: 1 }}>
        <Container maxWidth="xl">
          {/* Section heading */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ fontSize: { xs: '1.6rem', md: '2.1rem' }, mb: 1.5, color: 'primary.main' }}
            >
              Blogs/Articles
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 580, mx: 'auto', lineHeight: 1.8, fontSize: '0.97rem' }}>
              Stay informed with the latest real estate insights, market trends, expert advice, and property tips
              to help you make confident decisions. Whether you&apos;re buying, selling, or investing.
            </Typography>
          </Box>

          {displayed.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary">No articles found matching your search.</Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={() => { setSearch(''); setActiveCategory('All'); }}
              >
                Clear Filters
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {displayed.map((post, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                  <BlogArticleCard post={post} index={i} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, val) => { setPage(val); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                color="primary"
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': { fontWeight: 600 },
                }}
              />
            </Box>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
