import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import theme from './theme';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import SearchResultsPage from './pages/SearchResultsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AgentDashboard from './pages/dashboard/AgentDashboard';
import AddListingPage from './pages/dashboard/AddListingPage';
import SavedPropertiesPage from './pages/SavedPropertiesPage';
import ProfilePage from './pages/ProfilePage';
import AgentProfilePage from './pages/AgentProfilePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import RequestsPage from './pages/RequestsPage';
import PWAInstallButton from './components/layout/PWAInstallButton';

const AUTH_ROUTES = ['/auth/login', '/auth/register'];
const DASHBOARD_ROUTES = ['/dashboard', '/dashboard/add-listing', '/admin'];

function Layout() {
  const location = useLocation();
  const isAuth = AUTH_ROUTES.some((r) => location.pathname.startsWith(r));
  const isDashboard = DASHBOARD_ROUTES.some((r) => location.pathname === r);

  if (isAuth) {
    return (
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
      </Routes>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isDashboard && <Navbar />}
      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/dashboard" element={<AgentDashboard />} />
          <Route path="/dashboard/add-listing" element={<AddListingPage />} />
          <Route path="/saved" element={<SavedPropertiesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/agent/:id" element={<AgentProfilePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/requests" element={<RequestsPage />} />
        </Routes>
      </Box>
      {!isDashboard && <Footer />}
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <PWAInstallButton />
        <Layout />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
