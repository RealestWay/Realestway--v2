import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';

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
          '&::before': {
            content: '""',
            display: 'inline-block',
            width: 4,
            height: 24,
            bgcolor: 'primary.main',
            borderRadius: 2,
            mr: 1,
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
  { id: 'acceptance',      label: '1. Acceptance of Terms' },
  { id: 'eligibility',     label: '2. Eligibility' },
  { id: 'account',         label: '3. User Accounts' },
  { id: 'platform-use',    label: '4. Permitted Use of the Platform' },
  { id: 'listings',        label: '5. Property Listings' },
  { id: 'agents',          label: '6. Agents & Verification' },
  { id: 'user-conduct',    label: '7. User Conduct' },
  { id: 'payments',        label: '8. Fees & Payments' },
  { id: 'third-party',     label: '9. Third-Party Content & Links' },
  { id: 'ip',              label: '10. Intellectual Property' },
  { id: 'disclaimer',      label: '11. Disclaimers & Limitation of Liability' },
  { id: 'indemnification', label: '12. Indemnification' },
  { id: 'termination',     label: '13. Account Suspension & Termination' },
  { id: 'disputes',        label: '14. Dispute Resolution' },
  { id: 'governing-law',   label: '15. Governing Law' },
  { id: 'changes',         label: '16. Changes to These Terms' },
  { id: 'contact',         label: '17. Contact Us' },
];

export default function TermsOfServicePage() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Terms of Service — Realestway';
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0D3BAE 0%, #1B4FD8 60%, #2563EB 100%)',
          color: 'white',
          py: { xs: 7, md: 10 },
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -80,
            left: -40,
            width: 300,
            height: 300,
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
            <GavelOutlinedIcon sx={{ fontSize: 40, opacity: 0.9 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.6rem' } }}>
              Terms of Service
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.85, lineHeight: 1.8, maxWidth: 620 }}>
            These terms govern your use of the Realestway platform. Please read them carefully before
            accessing or using our services.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 3, flexWrap: 'wrap' }}>
            <Chip label="Effective: April 22, 2026" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} />
            <Chip label="Governed by Nigerian Law" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} />
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

            {/* Intro callout */}
            <Box sx={{ mb: 5, p: 3, bgcolor: 'warning.50', borderRadius: 2, borderLeft: '4px solid', borderColor: 'warning.main' }}>
              <Typography variant="body2" sx={{ lineHeight: 1.85 }}>
                <strong>IMPORTANT — PLEASE READ CAREFULLY.</strong> These Terms of Service ("Terms") constitute
                a legally binding agreement between you and <strong>Realestway</strong> ("we", "our", "us").
                By accessing, registering on, or using the Realestway platform (website and mobile application),
                you acknowledge that you have read, understood, and agree to be bound by these Terms and our{' '}
                <Box component="a" href="/privacy-policy" sx={{ color: 'primary.main' }}>Privacy Policy</Box>.
                If you do not agree, you must not use our Platform.
              </Typography>
            </Box>

            {/* 1. Acceptance */}
            <Section id="acceptance" title="1. Acceptance of Terms">
              <p>
                By creating an account, browsing listings, posting a property, or otherwise using any part
                of the Realestway Platform, you confirm that:
              </p>
              <ul>
                <li>You have read and agree to these Terms.</li>
                <li>You agree to our Privacy Policy, which is incorporated herein by reference.</li>
                <li>You are entering into a legally binding contract with Realestway.</li>
              </ul>
              <p>
                These Terms apply to all users of the Platform, including property seekers, landlords,
                real estate agents, and administrators.
              </p>
            </Section>

            {/* 2. Eligibility */}
            <Section id="eligibility" title="2. Eligibility">
              <p>To use Realestway, you must:</p>
              <ul>
                <li>Be at least <strong>18 years of age</strong>.</li>
                <li>Be a legal resident or citizen of Nigeria, or otherwise have the legal right to transact in Nigerian real estate.</li>
                <li>Have the legal capacity to enter into binding contracts.</li>
                <li>Not have been previously suspended or banned from the Platform.</li>
              </ul>
              <p>
                By using the Platform, you represent and warrant that you meet all of the above eligibility
                requirements. If you are using the Platform on behalf of a business entity, you represent
                that you have authority to bind that entity to these Terms.
              </p>
            </Section>

            {/* 3. Accounts */}
            <Section id="account" title="3. User Accounts">
              <p><strong>3.1 Registration:</strong> To access certain features, you must create an account
              by providing a valid name, email address, and phone number. You may also register using your
              Google account.</p>

              <p><strong>3.2 Account security:</strong> You are responsible for maintaining the
              confidentiality of your login credentials. You must notify us immediately if you suspect
              unauthorised access to your account. Realestway is not liable for any loss resulting from
              unauthorised use of your account.</p>

              <p><strong>3.3 Accurate information:</strong> You agree to provide accurate, current, and
              complete information during registration and to keep your profile information up to date.</p>

              <p><strong>3.4 One account per person:</strong> Each individual or business entity may
              maintain only one active account. Creating multiple accounts to circumvent bans or restrictions
              is strictly prohibited.</p>

              <p><strong>3.5 Phone & email verification:</strong> We require verification of your phone
              number via a one-time password (OTP) and your email address via a verification code. Unverified
              accounts may have restricted access to Platform features.</p>
            </Section>

            {/* 4. Platform Use */}
            <Section id="platform-use" title="4. Permitted Use of the Platform">
              <p>
                Realestway grants you a limited, non-exclusive, non-transferable, revocable licence to
                access and use the Platform solely for lawful personal or professional real estate purposes,
                in accordance with these Terms.
              </p>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Platform for any illegal purpose or in violation of any applicable Nigerian law or regulation.</li>
                <li>Reproduce, distribute, modify, or create derivative works of any Platform content without our express written consent.</li>
                <li>Use automated bots, scrapers, or crawlers to extract data from the Platform without prior written authorisation.</li>
                <li>Attempt to gain unauthorised access to any Platform systems, accounts, or databases.</li>
                <li>Transmit viruses, malware, or any other harmful code.</li>
                <li>Use the Platform to send unsolicited commercial communications (spam).</li>
                <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity.</li>
              </ul>
            </Section>

            {/* 5. Listings */}
            <Section id="listings" title="5. Property Listings">
              <p><strong>5.1 Listing accuracy:</strong> If you post a property listing, you represent and
              warrant that:</p>
              <ul>
                <li>The information provided (title, description, address, price, photographs) is accurate, truthful, and not misleading.</li>
                <li>You are the owner of the property, an authorised agent, or otherwise have the right to list the property.</li>
                <li>The property is actually available for rent, sale, or lease at the stated price.</li>
                <li>All photographs submitted are genuine images of the listed property.</li>
              </ul>

              <p><strong>5.2 Prohibited listings:</strong> The following are strictly forbidden on the Platform:</p>
              <ul>
                <li>Fraudulent, fictitious, or scam listings.</li>
                <li>Properties listed without the owner's consent.</li>
                <li>Listings containing discriminatory language based on gender, religion, ethnicity, disability, or other protected characteristics.</li>
                <li>Properties intended for illegal activities.</li>
                <li>Duplicate or spam listings.</li>
              </ul>

              <p><strong>5.3 Third-party sourced listings:</strong> Some listings on the Platform are
              aggregated from publicly available third-party sources to provide users with a broader
              property selection. These listings are clearly identified and Realestway does not represent
              the accuracy or availability of third-party sourced listings. Users should independently
              verify all details before taking any action.</p>

              <p><strong>5.4 Listing moderation:</strong> Realestway reserves the right to review, approve,
              reject, modify, or remove any listing at its sole discretion, including listings that violate
              these Terms or our community standards.</p>

              <p><strong>5.5 Listing expiry:</strong> Listings that have not been confirmed as still
              available may be subject to automated cleanup notices and removal after a reasonable grace
              period, as communicated to you via email.</p>
            </Section>

            {/* 6. Agents */}
            <Section id="agents" title="6. Agents & Verification">
              <p><strong>6.1 Agent registration:</strong> Real estate agents may register on the Platform
              to list properties, manage their portfolio, and connect with property seekers. By registering
              as an agent, you agree to these Terms and any additional agent-specific policies.</p>

              <p><strong>6.2 KYC verification:</strong> To obtain a "Verified Agent" status and associated
              trust badges, agents must complete our Know Your Customer (KYC) process, which may include
              submitting a National Identification Number (NIN) and other identity documents. Providing
              false or fraudulent KYC information is a criminal offence under Nigerian law and will result
              in immediate account termination and possible referral to law enforcement.</p>

              <p><strong>6.3 Agent responsibilities:</strong> Agents are solely responsible for:</p>
              <ul>
                <li>The accuracy and legality of their property listings.</li>
                <li>All interactions with property seekers facilitated through the Platform.</li>
                <li>Complying with all applicable Nigerian real estate laws and regulations.</li>
                <li>Maintaining their professional conduct in line with Realestway's standards.</li>
              </ul>

              <p><strong>6.4 Public profile:</strong> Agent profiles — including name, business name,
              listing count, and verified status — are publicly visible on the Platform. Agents consent
              to this visibility by registering as agents.</p>
            </Section>

            {/* 7. Conduct */}
            <Section id="user-conduct" title="7. User Conduct">
              <p>All users of the Platform agree to:</p>
              <ul>
                <li>Treat all other users with respect and professionalism.</li>
                <li>Not engage in harassment, intimidation, threats, or abusive behaviour toward any other user.</li>
                <li>Not post or share offensive, defamatory, obscene, or hateful content.</li>
                <li>Not engage in any form of property fraud, advance-fee fraud ("419"), or any deceptive scheme.</li>
                <li>Not collect or harvest personal data about other users without their consent.</li>
                <li>Report suspicious listings, fraudulent activity, or policy violations to Realestway.</li>
              </ul>
              <p>
                Realestway reserves the right to remove content and/or suspend accounts that violate
                these conduct standards, without prior notice.
              </p>
            </Section>

            {/* 8. Fees */}
            <Section id="payments" title="8. Fees & Payments">
              <p>
                <strong>8.1 Free listings:</strong> Basic property listing is currently provided free of
                charge to registered agents and landlords. Realestway reserves the right to introduce fees
                for certain features or listing tiers in the future, with adequate prior notice to users.
              </p>
              <p>
                <strong>8.2 Premium features:</strong> Certain enhanced features (e.g., featured listings,
                "Hot" badges, or Vantage financing integrations) may be subject to fees as communicated
                on the Platform. All fees are quoted in Nigerian Naira (NGN) and are inclusive of
                applicable taxes unless stated otherwise.
              </p>
              <p>
                <strong>8.3 No payment intermediary:</strong> Realestway is a <strong>listing and discovery
                platform only</strong>. We do not process, hold, or guarantee any financial transactions
                between property seekers and landlords/agents. All payments for rent, purchase, or fees
                are made directly between the relevant parties. Realestway accepts no liability for any
                financial disputes arising from such transactions.
              </p>
              <p>
                <strong>8.4 Refunds:</strong> Where fees are charged by Realestway for platform services,
                refund eligibility will be governed by the specific terms of the service purchased. Please
                contact us at{' '}
                <Box component="a" href="mailto:support@realestway.com" sx={{ color: 'primary.main' }}>
                  support@realestway.com
                </Box>{' '}for refund requests.
              </p>
            </Section>

            {/* 9. Third-Party */}
            <Section id="third-party" title="9. Third-Party Content & Links">
              <p>
                The Platform may contain links to third-party websites, or may display content sourced
                from third parties (including aggregated property listings from external sources). Realestway
                does not endorse and is not responsible for any third-party content, websites, products,
                or services. Your interactions with third parties are solely between you and those parties.
              </p>
              <p>
                Third-party services integrated into our Platform (such as Google Sign-In and our SMS
                messaging partner) are governed by their own terms and privacy policies. We encourage
                you to review those policies independently.
              </p>
            </Section>

            {/* 10. IP */}
            <Section id="ip" title="10. Intellectual Property">
              <p>
                <strong>10.1 Our content:</strong> All content on the Platform created by Realestway —
                including but not limited to logos, brand assets, design elements, software, text, and
                compiled listing data — is the exclusive intellectual property of Realestway and is
                protected under Nigerian and international copyright law. Unauthorised reproduction or
                use is prohibited.
              </p>
              <p>
                <strong>10.2 Your content:</strong> By uploading or submitting content to the Platform
                (including property photographs, descriptions, and profile information), you grant
                Realestway a worldwide, royalty-free, non-exclusive licence to use, display, reproduce,
                and distribute that content solely for the purpose of operating and promoting the Platform.
                You retain ownership of all content you submit.
              </p>
              <p>
                <strong>10.3 Feedback:</strong> Any suggestions, ideas, or feedback you provide regarding
                the Platform may be used by Realestway without obligation to you.
              </p>
            </Section>

            {/* 11. Disclaimer */}
            <Section id="disclaimer" title="11. Disclaimers & Limitation of Liability">
              <p>
                <strong>11.1 Platform "as is":</strong> The Realestway Platform is provided on an "as is"
                and "as available" basis. We make no warranties, express or implied, including but not
                limited to warranties of merchantability, fitness for a particular purpose, or
                non-infringement.
              </p>
              <p>
                <strong>11.2 Listing accuracy:</strong> Realestway does not guarantee the accuracy,
                completeness, or availability of any property listing. We are not a party to any
                transaction between users and accept no responsibility for the quality, legality, or
                availability of any listed property.
              </p>
              <p>
                <strong>11.3 Limitation of liability:</strong> To the maximum extent permitted by Nigerian
                law, Realestway and its directors, employees, and partners shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages arising out of or in
                connection with your use of the Platform, including but not limited to loss of data,
                loss of revenue, or fraudulent transactions between users.
              </p>
              <p>
                <strong>11.4 Total liability cap:</strong> Our total liability to you for any claim
                arising from these Terms or your use of the Platform shall not exceed the amount (if any)
                you have paid to Realestway in the 12 months preceding the claim.
              </p>
              <p>
                <strong>11.5 Third-party fraud:</strong> Realestway strongly advises users to independently
                verify all property listings and agent credentials before making any payments. Never pay
                any rent or deposit to an individual or account not verified through official channels.
                Realestway bears no liability for losses resulting from fraudulent transactions.
              </p>
            </Section>

            {/* 12. Indemnification */}
            <Section id="indemnification" title="12. Indemnification">
              <p>
                You agree to indemnify, defend, and hold harmless Realestway, its officers, directors,
                employees, agents, and partners from and against any claims, liabilities, damages, losses,
                costs, or expenses (including reasonable legal fees) arising out of or in connection with:
              </p>
              <ul>
                <li>Your use of the Platform.</li>
                <li>Your violation of these Terms.</li>
                <li>Any content you submit or post on the Platform.</li>
                <li>Your violation of any third-party right, including intellectual property or privacy rights.</li>
                <li>Any fraudulent or misleading property listing you post.</li>
              </ul>
            </Section>

            {/* 13. Termination */}
            <Section id="termination" title="13. Account Suspension & Termination">
              <p>
                <strong>13.1 By Realestway:</strong> We reserve the right to suspend or permanently
                terminate your account, with or without notice, if you:
              </p>
              <ul>
                <li>Violate any provision of these Terms.</li>
                <li>Engage in fraudulent, abusive, or illegal activity.</li>
                <li>Provide false identity or KYC information.</li>
                <li>Post scam or misleading listings.</li>
                <li>Repeatedly violate our community standards.</li>
              </ul>
              <p>
                <strong>13.2 By you:</strong> You may close your account at any time by contacting us
                at{' '}
                <Box component="a" href="mailto:support@realestway.com" sx={{ color: 'primary.main' }}>
                  support@realestway.com
                </Box>. Upon account deletion, your personal data will be handled in accordance with
                our Privacy Policy.
              </p>
              <p>
                <strong>13.3 Effect of termination:</strong> Upon termination, your right to access the
                Platform ceases immediately. Provisions of these Terms that by their nature should survive
                termination (including intellectual property, indemnification, and dispute resolution)
                shall survive.
              </p>
            </Section>

            {/* 14. Disputes */}
            <Section id="disputes" title="14. Dispute Resolution">
              <p>
                <strong>14.1 Informal resolution:</strong> Before initiating any formal proceedings,
                you agree to first contact us at{' '}
                <Box component="a" href="mailto:support@realestway.com" sx={{ color: 'primary.main' }}>
                  support@realestway.com
                </Box>{' '}to attempt to resolve the dispute informally. We will endeavour to resolve
                complaints within 30 business days.
              </p>
              <p>
                <strong>14.2 Arbitration:</strong> If informal resolution is unsuccessful, disputes
                arising out of or relating to these Terms shall be referred to arbitration under the
                rules of the{' '}
                <strong>Lagos Court of Arbitration (LCA)</strong> or the{' '}
                <strong>Chartered Institute of Arbitrators Nigeria (CIArb Nigeria)</strong>, with the
                seat of arbitration in Lagos, Nigeria. The language of arbitration shall be English.
              </p>
              <p>
                <strong>14.3 Consumer disputes:</strong> Nothing in these Terms limits your right to
                file a complaint with the <strong>Consumer Protection Council (CPC)</strong> or any other
                relevant Nigerian regulatory authority.
              </p>
            </Section>

            {/* 15. Governing Law */}
            <Section id="governing-law" title="15. Governing Law">
              <p>
                These Terms and any dispute arising out of or in connection with them shall be governed
                by and construed in accordance with the laws of the <strong>Federal Republic of Nigeria</strong>,
                without regard to its conflict of law provisions.
              </p>
              <p>
                Subject to the arbitration clause above, the courts of <strong>Lagos State, Nigeria</strong>
                shall have exclusive jurisdiction to settle any dispute or claim arising out of or in
                connection with these Terms.
              </p>
            </Section>

            {/* 16. Changes */}
            <Section id="changes" title="16. Changes to These Terms">
              <p>
                Realestway reserves the right to amend these Terms at any time. When we make material
                changes, we will:
              </p>
              <ul>
                <li>Update the "Effective Date" at the top of this page.</li>
                <li>Notify registered users by email or via a prominent notice on the Platform.</li>
              </ul>
              <p>
                Your continued use of the Platform following the effective date of any changes constitutes
                your acceptance of the revised Terms. If you do not agree to the revised Terms, you must
                cease using the Platform.
              </p>
            </Section>

            {/* 17. Contact */}
            <Section id="contact" title="17. Contact Us">
              <p>
                If you have any questions about these Terms, please contact us:
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
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Realestway Legal</Typography>
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
