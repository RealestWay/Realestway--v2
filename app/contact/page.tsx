'use client';

import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

/* ── Keyframes ── */
const KEYFRAMES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

/* ── Reveal hook ── */
function useReveal(threshold = 0.12) {
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

/* ── Contact info card ── */
function ContactCard({
  icon, label, value, href, delay = 0,
}: {
  icon: React.ReactNode; label: string; value: string; href?: string; delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.07)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          transition: 'all 0.22s ease',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,162,86,0.1)',
            borderColor: 'rgba(0,162,86,0.2)',
            transform: 'translateY(-3px)',
          },
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
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
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.7rem' }}>
            {label}
          </Typography>
          {href ? (
            <Typography
              component="a"
              href={href}
              sx={{ display: 'block', mt: 0.5, fontWeight: 600, color: 'text.primary', textDecoration: 'none', fontSize: '0.95rem', '&:hover': { color: 'primary.main' } }}
            >
              {value}
            </Typography>
          ) : (
            <Typography sx={{ mt: 0.5, fontWeight: 600, fontSize: '0.95rem' }}>{value}</Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

/* ── Main Contact Page ── */
export default function ContactPage() {
  const [topic,     setTopic]     = useState('');
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [message,   setMessage]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState('');

  const formReveal = useReveal(0.08);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) { setError('Please fill name, email and message.'); return; }
    setLoading(true); setError('');
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fb' }}>
      <style>{KEYFRAMES}</style>
      <Navbar />

      {/* ══ HERO BANNER ══ */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 320, sm: 380, md: 450 },
          overflow: 'hidden',
          mt: { xs: '-74px', md: '-96px' },
        }}
      >
        <Box
          component="img"
          src="/building2.jpg"
          alt="Contact Realestway"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/building1.jpg'; }}
        />
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.58)' }} />

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
            pt: { xs: '120px', md: '150px' },
            px: 2,
          }}
        >
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
            Contact Us
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
              animation: 'fadeUp 0.7s ease 0.15s both',
            }}
          >
            We&apos;d Love to Hear From You
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
            Have a question, suggestion, or want to partner with us? Reach out — our team is always ready to help.
          </Typography>
        </Box>
      </Box>

      {/* ══ CONTACT CARDS ROW ══ */}
      <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ContactCard
                icon={<PhoneOutlinedIcon />}
                label="Phone"
                value="+234 812 060 6547"
                href="tel:+2348120606547"
                delay={0}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ContactCard
                icon={<WhatsAppIcon />}
                label="WhatsApp"
                value="+234 810 234 9094"
                href="https://wa.me/2348102349094"
                delay={80}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ContactCard
                icon={<EmailOutlinedIcon />}
                label="Email"
                value="support@realestway.com"
                href="mailto:support@realestway.com"
                delay={160}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ContactCard
                icon={<LocationOnOutlinedIcon />}
                label="Office"
                value="36 Olusesi St, Eputu, Ibeju-Lekki, Lagos"
                delay={240}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ══ FORM + INFO SECTION ══ */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="flex-start">

            {/* LEFT: Info panel */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                ref={formReveal.ref}
                sx={{
                  opacity: formReveal.visible ? 1 : 0,
                  transform: formReveal.visible ? 'translateX(0)' : 'translateX(-28px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}
              >
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.72rem', display: 'block', mb: 1.5 }}>
                  Get In Touch
                </Typography>
                <Typography variant="h4" fontWeight={800} mb={2} sx={{ fontFamily: '"Poppins", sans-serif', fontSize: { xs: '1.5rem', md: '1.9rem' }, lineHeight: 1.2 }}>
                  Send Us a Message
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.85, mb: 4, fontSize: '0.95rem' }}>
                  Fill in the form and we&apos;ll get back to you within 24 hours. For urgent matters,
                  please reach us via WhatsApp or phone.
                </Typography>

                {/* Office hours */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1.5px solid rgba(0,162,86,0.2)',
                    bgcolor: 'rgba(0,162,86,0.04)',
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
                    <AccessTimeOutlinedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                      Office Hours
                    </Typography>
                  </Box>
                  {[
                    { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM' },
                    { day: 'Saturday',        hours: '10:00 AM – 3:00 PM' },
                    { day: 'Sunday',          hours: 'Closed' },
                  ].map((row) => (
                    <Box key={row.day} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                      <Typography variant="body2" color="text.secondary">{row.day}</Typography>
                      <Typography variant="body2" fontWeight={600}>{row.hours}</Typography>
                    </Box>
                  ))}
                </Paper>

                {/* WhatsApp CTA */}
                <Button
                  fullWidth
                  variant="contained"
                  href="https://wa.me/2348102349094"
                  startIcon={<WhatsAppIcon />}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    py: 1.5,
                    bgcolor: '#25D366',
                    fontWeight: 700,
                    borderRadius: '10px',
                    '&:hover': { bgcolor: '#1da851' },
                    boxShadow: '0 6px 20px rgba(37,211,102,0.35)',
                  }}
                >
                  Chat on WhatsApp
                </Button>
              </Box>
            </Grid>

            {/* RIGHT: Contact form */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4.5 },
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.08)',
                  bgcolor: 'white',
                  boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
                  opacity: formReveal.visible ? 1 : 0,
                  transform: formReveal.visible ? 'translateX(0)' : 'translateX(28px)',
                  transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
                }}
              >
                {submitted ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        bgcolor: 'rgba(0,162,86,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2.5,
                      }}
                    >
                      <SendIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h5" fontWeight={800} mb={1}>Message Sent!</Typography>
                    <Typography color="text.secondary" lineHeight={1.8} mb={3}>
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => { setSubmitted(false); setName(''); setEmail(''); setPhone(''); setMessage(''); setTopic(''); }}
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                      Send Another Message
                    </Button>
                  </Box>
                ) : (
                  <Box component="form" onSubmit={handleSubmit}>
                    <Typography variant="h6" fontWeight={700} mb={3}>
                      Contact Form
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}

                    {/* Topic */}
                    <Typography variant="caption" fontWeight={700} sx={{ mb: 0.6, display: 'block', color: 'text.primary', fontSize: '0.79rem' }}>
                      Topic
                    </Typography>
                    <Select
                      fullWidth
                      displayEmpty
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      size="small"
                      sx={{ mb: 2.5, '& .MuiOutlinedInput-notchedOutline': { borderRadius: '10px' }, bgcolor: '#fafafa' }}
                      renderValue={(v) => v || <Box component="span" sx={{ color: 'text.disabled' }}>Select a topic</Box>}
                    >
                      <MenuItem value="General Enquiry">General Enquiry</MenuItem>
                      <MenuItem value="Property Listing">Property Listing</MenuItem>
                      <MenuItem value="Agent Registration">Agent Registration</MenuItem>
                      <MenuItem value="Technical Support">Technical Support</MenuItem>
                      <MenuItem value="Partnership">Partnership</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>

                    {/* Name + Email row */}
                    <Grid container spacing={2} sx={{ mb: 2.5 }}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" fontWeight={700} sx={{ mb: 0.6, display: 'block', color: 'text.primary', fontSize: '0.79rem' }}>
                          Full Name *
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          size="small"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fafafa' } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" fontWeight={700} sx={{ mb: 0.6, display: 'block', color: 'text.primary', fontSize: '0.79rem' }}>
                          Email Address *
                        </Typography>
                        <TextField
                          fullWidth
                          type="email"
                          placeholder="john@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          size="small"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fafafa' } }}
                        />
                      </Grid>
                    </Grid>

                    {/* Phone */}
                    <Typography variant="caption" fontWeight={700} sx={{ mb: 0.6, display: 'block', color: 'text.primary', fontSize: '0.79rem' }}>
                      Phone Number (optional)
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="+234 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      size="small"
                      sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fafafa' } }}
                    />

                    {/* Message */}
                    <Typography variant="caption" fontWeight={700} sx={{ mb: 0.6, display: 'block', color: 'text.primary', fontSize: '0.79rem' }}>
                      Message *
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fafafa' } }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      endIcon={<SendIcon />}
                      sx={{
                        py: 1.5,
                        bgcolor: 'primary.main',
                        fontWeight: 700,
                        fontSize: '0.97rem',
                        borderRadius: '10px',
                        '&:hover': { bgcolor: 'primary.dark' },
                        boxShadow: '0 6px 20px rgba(0,162,85,0.38)',
                      }}
                    >
                      {loading ? 'Sending…' : 'Send Message'}
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
