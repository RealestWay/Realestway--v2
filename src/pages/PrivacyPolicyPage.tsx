import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

/* ─── Section helper ─── */
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <Box id={id} sx={{ mb: 5 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          '&::before': {
            content: '""',
            display: 'inline-block',
            width: 4,
            height: 24,
            bgcolor: 'primary.main',
            borderRadius: 2,
            mr: 0.5,
          },
        }}
      >
        {title}
      </Typography>
      <Box sx={{ color: 'text.secondary', lineHeight: 1.9, '& p': { mb: 1.5 }, '& ul': { pl: 3, mb: 1.5 }, '& li': { mb: 0.75 } }}>
        {children}
      </Box>
      <Divider sx={{ mt: 4 }} />
    </Box>
  );
}

const TOC = [
  { id: 'overview',        label: '1. Overview' },
  { id: 'data-collected',  label: '2. Information We Collect' },
  { id: 'how-we-use',      label: '3. How We Use Your Information' },
  { id: 'sharing',         label: '4. Sharing Your Information' },
  { id: 'third-parties',   label: '5. Third-Party Services' },
  { id: 'kyc',             label: '6. Identity Verification (KYC)' },
  { id: 'cookies',         label: '7. Cookies & Tracking' },
  { id: 'retention',       label: '8. Data Retention' },
  { id: 'security',        label: '9. Data Security' },
  { id: 'rights',          label: '10. Your Rights' },
  { id: 'children',        label: '11. Children\'s Privacy' },
  { id: 'changes',         label: '12. Changes to This Policy' },
  { id: 'contact',         label: '13. Contact Us' },
];

export default function PrivacyPolicyPage() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Privacy Policy — Realestway';
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1B4FD8 0%, #0D3BAE 100%)',
          color: 'white',
          py: { xs: 7, md: 10 },
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -60,
            right: -60,
            width: 260,
            height: 260,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.05)',
          },
        }}
      >
        <Container maxWidth="md">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ color: 'rgba(255,255,255,0.75)', mb: 3, textTransform: 'none', '&:hover': { color: 'white' } }}
          >
            Go Back
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <ShieldOutlinedIcon sx={{ fontSize: 40, opacity: 0.9 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.6rem' } }}>
              Privacy Policy
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.85, lineHeight: 1.8, maxWidth: 620 }}>
            We are committed to protecting your personal data. This policy explains what we collect,
            how we use it, and the rights you have over your information.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 3, flexWrap: 'wrap' }}>
            <Chip label="Effective: April 22, 2026" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} />
            <Chip label="Nigeria Data Protection Act 2023" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} />
            <Chip label="GDPR-aligned" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>

          {/* Table of Contents — sticky sidebar */}
          <Box
            component="nav"
            sx={{
              display: { xs: 'none', lg: 'block' },
              width: 240,
              flexShrink: 0,
              position: 'sticky',
              top: 88,
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary', fontSize: '0.72rem' }}>
              Contents
            </Typography>
            {TOC.map(({ id, label }) => (
              <Box
                key={id}
                component="a"
                href={`#${id}`}
                sx={{
                  display: 'block',
                  py: 0.6,
                  px: 1,
                  mb: 0.25,
                  fontSize: '0.82rem',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  borderRadius: 1,
                  transition: 'all 0.15s',
                  '&:hover': { color: 'primary.main', bgcolor: 'primary.50' },
                }}
              >
                {label}
              </Box>
            ))}
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>

            {/* Intro */}
            <Box sx={{ mb: 5, p: 3, bgcolor: 'primary.50', borderRadius: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
              <Typography variant="body2" sx={{ lineHeight: 1.85 }}>
                This Privacy Policy applies to all products and services offered by <strong>Realestway</strong>
                &nbsp;("we", "our", "us"), including our website at{' '}
                <Box component="a" href="https://realestway.com" target="_blank" rel="noreferrer" sx={{ color: 'primary.main' }}>
                  realestway.com
                </Box>
                &nbsp;and our mobile application (collectively, the "Platform"). By accessing or using our Platform,
                you agree to the collection and use of your information as described herein. If you do not agree,
                please discontinue use of our services.
              </Typography>
            </Box>

            {/* 1. Overview */}
            <Section id="overview" title="1. Overview">
              <p>
                Realestway is a Nigerian prop-tech marketplace that connects property seekers, landlords, and
                real estate agents for the purpose of renting, buying, leasing, and listing residential and
                commercial properties. We are incorporated and operate under the laws of the Federal Republic
                of Nigeria.
              </p>
              <p>
                As a data controller, we are committed to compliance with the <strong>Nigeria Data Protection
                Act 2023 (NDPA)</strong>, the <strong>Nigeria Data Protection Regulation (NDPR)</strong>, and
                applicable international best practices, including principles aligned with the GDPR.
              </p>
              <p>
                Our registered address is: <strong>36 Olusesi Street, Eputu, Ibeju-Lekki, Lagos, Nigeria.</strong>
              </p>
            </Section>

            {/* 2. Data Collected */}
            <Section id="data-collected" title="2. Information We Collect">
              <p><strong>2.1 Information you provide directly:</strong></p>
              <ul>
                <li><strong>Account registration:</strong> Full name, email address, phone number, and password.</li>
                <li><strong>Profile information:</strong> Profile photograph, business name (agents), and bio.</li>
                <li><strong>Identity verification (KYC):</strong> National Identification Number (NIN) for agents undergoing verification.</li>
                <li><strong>Property listings:</strong> Property title, description, address, city, state, geo-coordinates (latitude/longitude), pricing, photographs, and associated fees.</li>
                <li><strong>Communication:</strong> Messages, support requests, or enquiries you send us.</li>
                <li><strong>Newsletter subscriptions:</strong> Email address when you subscribe to updates.</li>
              </ul>

              <p><strong>2.2 Information collected automatically:</strong></p>
              <ul>
                <li><strong>Usage data:</strong> Pages visited, properties viewed, searches performed, properties saved or liked, and contact events.</li>
                <li><strong>Search history:</strong> Queries and filters applied during property searches.</li>
                <li><strong>Activity logs:</strong> Timestamps and interaction records associated with your account.</li>
                <li><strong>Device identifiers:</strong> Anonymous session IDs used to personalise your experience before you create an account.</li>
                <li><strong>Location data:</strong> City/state-level location inferred from your search context, or precise coordinates only when you opt-in to "nearby" property features.</li>
              </ul>

              <p><strong>2.3 Information from third parties:</strong></p>
              <ul>
                <li><strong>Google Sign-In:</strong> If you choose to sign in with Google, we receive your Google account ID, name, email address, and profile picture from Google LLC.</li>
                <li><strong>Third-party property sources:</strong> Some property listings on our Platform are aggregated from publicly accessible third-party sources to provide a broader selection. Such listings are clearly distinguishable and do not carry personal data beyond the listing agent's contact details.</li>
              </ul>
            </Section>

            {/* 3. How We Use */}
            <Section id="how-we-use" title="3. How We Use Your Information">
              <p>We use the information we collect for the following purposes:</p>
              <ul>
                <li><strong>Account management:</strong> Creating, authenticating, and managing your account.</li>
                <li><strong>Service delivery:</strong> Enabling property search, listing management, saving favourites, and connecting users with agents.</li>
                <li><strong>Personalisation:</strong> Providing property recommendations, trending listings, and tailored search results based on your activity.</li>
                <li><strong>Verification:</strong> Verifying your phone number and email address via one-time passwords (OTPs), and verifying agent identities through KYC processes.</li>
                <li><strong>Communications:</strong> Sending transactional messages (OTPs, listing confirmations), platform updates, and — where you have opted in — our newsletter.</li>
                <li><strong>Safety & fraud prevention:</strong> Detecting, investigating, and preventing fraudulent listings, scams, or abuse of the Platform.</li>
                <li><strong>Legal compliance:</strong> Meeting obligations under Nigerian law, including the NDPA 2023 and any applicable regulatory requirements.</li>
                <li><strong>Analytics & improvement:</strong> Understanding how users interact with the Platform to improve our features, UI, and listing quality.</li>
              </ul>
            </Section>

            {/* 4. Sharing */}
            <Section id="sharing" title="4. Sharing Your Information">
              <p>We do not sell your personal data. We share your information only in the following circumstances:</p>
              <ul>
                <li>
                  <strong>With other users (agents/seekers):</strong> When you contact an agent about a listing,
                  your contact intent is communicated. Agent profiles — including name, business name, and
                  verified status — are publicly visible.
                </li>
                <li>
                  <strong>With service providers:</strong> We engage trusted third-party providers to deliver
                  parts of our service (e.g., OTP delivery, cloud storage, email delivery). These providers
                  process data solely on our instructions and under confidentiality obligations.
                </li>
                <li>
                  <strong>For legal compliance:</strong> We may disclose your information to law enforcement,
                  government agencies, or courts where required by law or to protect our legal rights.
                </li>
                <li>
                  <strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of
                  assets, your data may be transferred. You will be notified of any such change.
                </li>
              </ul>
            </Section>

            {/* 5. Third-Party Services */}
            <Section id="third-parties" title="5. Third-Party Services">
              <p>
                Our Platform integrates with the following third-party services. Each operates under its own
                privacy policy, which we encourage you to review:
              </p>
              <ul>
                <li>
                  <strong>Google LLC (Google Sign-In / OAuth 2.0):</strong> Used to allow you to create or
                  log in to your Realestway account using your Google credentials. Data shared is governed
                  by the{' '}
                  <Box component="a" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" sx={{ color: 'primary.main' }}>
                    Google Privacy Policy
                  </Box>.
                </li>
                <li>
                  <strong>SMS / OTP Messaging Provider:</strong> We use a licensed third-party messaging
                  service to deliver one-time passwords (OTPs) to your phone number for authentication and
                  verification. Your phone number is transmitted to this provider solely for the purpose of
                  delivering the OTP message and is not retained by the provider beyond the delivery window.
                </li>
                <li>
                  <strong>Cloud Storage:</strong> Property images and media are stored on secure cloud
                  infrastructure. Files are accessed only through authenticated, time-limited URLs.
                </li>
                <li>
                  <strong>Email Delivery Service:</strong> Used to send email verification codes and
                  transactional notifications. Your email address is shared with this provider solely for
                  message delivery.
                </li>
              </ul>
              <p>
                Where third-party content or links appear on our Platform, we are not responsible for the
                privacy practices of those external sites or services.
              </p>
            </Section>

            {/* 6. KYC */}
            <Section id="kyc" title="6. Identity Verification (KYC)">
              <p>
                To build a trusted marketplace, agents who wish to obtain a "Verified" badge on Realestway
                are required to complete a Know Your Customer (KYC) process, which may include:
              </p>
              <ul>
                <li>Submission of your <strong>National Identification Number (NIN)</strong>.</li>
                <li>Verification of your phone number and email address.</li>
                <li>Business information, where applicable.</li>
              </ul>
              <p>
                KYC data is processed in accordance with the NDPA 2023 and is used exclusively for identity
                verification and fraud prevention. We do not share NIN or KYC documents with any party
                other than our verification service providers, and only as necessary to complete verification.
              </p>
              <p>
                Unverified agents may still use the Platform but will not display a verification badge.
                KYC data submitted is retained securely for the duration of your account and for a reasonable
                period thereafter as required by applicable law.
              </p>
            </Section>

            {/* 7. Cookies */}
            <Section id="cookies" title="7. Cookies & Tracking Technologies">
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our Platform.
              </p>
              <p><strong>Types of cookies we use:</strong></p>
              <ul>
                <li>
                  <strong>Essential cookies:</strong> Necessary for authentication, session management, and
                  core Platform functionality. These cannot be disabled.
                </li>
                <li>
                  <strong>Analytics cookies:</strong> Help us understand how users navigate the Platform
                  (e.g., pages viewed, search terms used). This data is aggregated and anonymised where possible.
                </li>
                <li>
                  <strong>Preference cookies:</strong> Remember your settings and preferences (e.g., search
                  filters, saved location).
                </li>
              </ul>
              <p>
                You can manage or disable non-essential cookies through your browser settings. Note that
                disabling certain cookies may affect the functionality of the Platform.
              </p>
              <p>
                We may also use anonymous device identifiers (sent via the <code>X-Anon-Id</code> header)
                to personalise property recommendations for unauthenticated users. This identifier is not
                linked to any personal data unless you subsequently create an account.
              </p>
            </Section>

            {/* 8. Retention */}
            <Section id="retention" title="8. Data Retention">
              <p>
                We retain your personal data for as long as your account is active, or as needed to provide
                our services. Specific retention periods include:
              </p>
              <ul>
                <li><strong>Account data:</strong> Retained for the lifetime of your account plus a minimum of 12 months after account deletion to support dispute resolution.</li>
                <li><strong>Property listings:</strong> Active listings are retained indefinitely. Inactive or deleted listings are soft-deleted and permanently removed after a configurable cleanup period.</li>
                <li><strong>Search & activity history:</strong> Retained for up to 12 months to power personalised recommendations.</li>
                <li><strong>OTP records:</strong> Purged after the OTP expiry window (15 minutes) and at most within 24 hours of creation.</li>
                <li><strong>Newsletter subscriptions:</strong> Retained until you unsubscribe.</li>
              </ul>
              <p>
                After the applicable retention period, data is securely deleted or anonymised.
              </p>
            </Section>

            {/* 9. Security */}
            <Section id="security" title="9. Data Security">
              <p>
                We implement appropriate technical and organisational measures to protect your personal data
                against unauthorised access, disclosure, alteration, or destruction, including:
              </p>
              <ul>
                <li>Encrypted transmission of all data via HTTPS/TLS.</li>
                <li>Hashed storage of passwords using industry-standard bcrypt.</li>
                <li>API authentication using short-lived, revocable tokens (Laravel Sanctum).</li>
                <li>Role-based access controls limiting internal data access to authorised personnel only.</li>
                <li>Rate limiting on sensitive endpoints (registration, OTP, login) to prevent brute-force attacks.</li>
              </ul>
              <p>
                No method of transmission or storage is 100% secure. If you suspect your account has been
                compromised, please contact us immediately at{' '}
                <Box component="a" href="mailto:support@realestway.com" sx={{ color: 'primary.main' }}>
                  support@realestway.com
                </Box>.
              </p>
            </Section>

            {/* 10. Rights */}
            <Section id="rights" title="10. Your Rights">
              <p>
                Under the Nigeria Data Protection Act 2023 and applicable law, you have the following rights
                with respect to your personal data:
              </p>
              <ul>
                <li><strong>Right of access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Right to rectification:</strong> Correct inaccurate or incomplete personal data.</li>
                <li><strong>Right to erasure:</strong> Request deletion of your personal data, subject to legal retention obligations.</li>
                <li><strong>Right to data portability:</strong> Receive your data in a structured, machine-readable format.</li>
                <li><strong>Right to object:</strong> Object to processing of your data for direct marketing or profiling purposes.</li>
                <li><strong>Right to withdraw consent:</strong> Where processing is based on consent (e.g., newsletter), you may withdraw at any time without affecting prior processing.</li>
                <li><strong>Right to lodge a complaint:</strong> File a complaint with the <strong>Nigeria Data Protection Commission (NDPC)</strong> at{' '}
                  <Box component="a" href="https://ndpc.gov.ng" target="_blank" rel="noreferrer" sx={{ color: 'primary.main' }}>ndpc.gov.ng</Box>.
                </li>
              </ul>
              <p>
                To exercise any of these rights, contact our Data Protection Officer at{' '}
                <Box component="a" href="mailto:support@realestway.com" sx={{ color: 'primary.main' }}>
                  support@realestway.com
                </Box>. We will respond within 30 days.
              </p>
            </Section>

            {/* 11. Children */}
            <Section id="children" title="11. Children's Privacy">
              <p>
                Realestway is intended for users aged <strong>18 years and above</strong>. We do not
                knowingly collect personal data from individuals under 18. If we become aware that a minor
                has provided us with personal data without parental consent, we will take prompt steps to
                delete such information. If you believe a minor has registered on our Platform, please
                contact us at{' '}
                <Box component="a" href="mailto:support@realestway.com" sx={{ color: 'primary.main' }}>
                  support@realestway.com
                </Box>.
              </p>
            </Section>

            {/* 12. Changes */}
            <Section id="changes" title="12. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices,
                technology, legal requirements, or for other operational reasons. When we make material
                changes, we will:
              </p>
              <ul>
                <li>Update the "Effective Date" at the top of this page.</li>
                <li>Send a notification to your registered email address (for material changes).</li>
                <li>Display a prominent notice on the Platform.</li>
              </ul>
              <p>
                Your continued use of the Platform after the effective date of any revised Privacy Policy
                constitutes your acceptance of the updated terms.
              </p>
            </Section>

            {/* 13. Contact */}
            <Section id="contact" title="13. Contact Us">
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our
                data practices, please contact us:
              </p>
              <Box
                sx={{
                  mt: 2,
                  p: 3,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Realestway — Data Protection</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>📍 36 Olusesi Street, Eputu, Ibeju-Lekki, Lagos, Nigeria</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  📧{' '}
                  <Box component="a" href="mailto:support@realestway.com" sx={{ color: 'primary.main' }}>
                    support@realestway.com
                  </Box>
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>📞 +234 812 060 6547 / +234 816 431 2224</Typography>
                <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary', fontSize: '0.8rem' }}>
                  Response time: within 30 business days.
                </Typography>
              </Box>
            </Section>

          </Box>
        </Box>
      </Container>
    </Box>
  );
}
