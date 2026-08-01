/* ============================================
   App Component — Dulecy Lead Services
   --------------------------------------------
   Five-route public site (Home · About · Expertise · Who We Serve ·
   Contact) sharing one shell via `PublicLayout`, plus the retained
   `/thank-you` and `/admin/*` routes and a branded `*` catch-all.

   The Nilachal-era floating UI (bottom mobile nav, swipe drawer,
   WhatsApp FAB, scroll-progress bar, back-to-top) is no longer
   mounted — the Dulecy mockup has none of it. Those files are
   deleted in Prompt 11.
   ============================================ */

import React, { Suspense, lazy, useEffect, memo } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CircularProgress, Skeleton, Box } from '@mui/material';
import { motion } from 'framer-motion';

// App Styles
import './App.css';

// Context Providers
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { ModalProvider, useModal } from './context/ModalContext';

// Shell + eager (critical-path) route
import PublicLayout from './components/layout/PublicLayout/PublicLayout';
import HomePage from './pages/Home/HomePage';
import LeadFormDrawer from './components/common/LeadFormDrawer/LeadFormDrawer';
import SEOHead from './components/common/SEO/SEOHead';

// Admin
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import AdminLogin from './admin/components/AdminLogin';
import ProtectedRoute from './admin/components/ProtectedRoute';

// Pages (Lazy loaded)
const AboutPage = lazy(() => import('./pages/About/AboutPage'));
const ExpertisePage = lazy(() => import('./pages/Expertise/ExpertisePage'));
const IndustriesPage = lazy(() => import('./pages/Industries/IndustriesPage'));
const ContactPage = lazy(() => import('./pages/Contact/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFound/NotFoundPage'));
const ThankYouPage = lazy(() => import('./pages/ThankYou/ThankYou'));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));

// Fixed header height (68px) + breathing room, used when a hash lands
// mid-page so the anchored element clears the glass bar.
const HEADER_OFFSET = 90;

// ===========================================
// Error Boundary Component
// ===========================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Section Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            backgroundColor: '#F5F5F6',
            borderRadius: '8px',
            margin: '20px',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <div>
            <p style={{ color: '#666', marginBottom: '10px' }}>
              Something went wrong loading this section.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{
                backgroundColor: '#0B0B0C',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Try Again
            </button>
          </div>
        </Box>
      );
    }

    return this.props.children;
  }
}

// ===========================================
// Section Loader Component
// ===========================================
const SectionLoader = memo(({ height = 300, variant = 'default' }) => {
  const variants = {
    default: (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: height,
          width: '100%',
          background: 'linear-gradient(180deg, #F5F5F6 0%, #FFFFFF 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CircularProgress
            size={40}
            thickness={3}
            sx={{
              color: '#0B0B0C',
            }}
          />
        </motion.div>
      </Box>
    ),
    skeleton: (
      <Box sx={{ padding: '40px 20px', maxWidth: '1280px', margin: '0 auto' }}>
        <Skeleton
          variant="text"
          width="30%"
          height={40}
          sx={{ margin: '0 auto 20px', bgcolor: 'rgba(11, 11, 12, 0.1)' }}
        />
        <Skeleton
          variant="text"
          width="60%"
          height={60}
          sx={{ margin: '0 auto 30px', bgcolor: 'rgba(11, 11, 12, 0.1)' }}
        />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={250}
              height={180}
              sx={{ bgcolor: 'rgba(11, 11, 12, 0.05)' }}
            />
          ))}
        </Box>
      </Box>
    ),
    minimal: (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: height,
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#0B0B0C',
            animation: 'pulse 1s ease-in-out infinite',
          }}
        />
      </Box>
    ),
  };

  return variants[variant] || variants.default;
});

SectionLoader.displayName = 'SectionLoader';

// Page-level chunk fallback — sits inside the shell's <main>, so it only
// needs to hold vertical space while the route chunk downloads.
const PageFallback = () => <SectionLoader height={520} variant="skeleton" />;

// Wraps a lazy route element in the shared ErrorBoundary + Suspense pattern.
const lazyRoute = (element) => (
  <ErrorBoundary>
    <Suspense fallback={<PageFallback />}>{element}</Suspense>
  </ErrorBoundary>
);

// ===========================================
// Scroll Manager
// Route changes jump to the top; a hash instead scrolls to its target,
// polling until the element exists (pages/sections may be lazy).
// ===========================================
const ScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const hash = location.hash;
    if (!hash) return undefined;

    const targetId = decodeURIComponent(hash.substring(1));
    let cancelled = false;

    const scrollToTarget = () => {
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return false;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - HEADER_OFFSET;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      return true;
    };

    // Try immediately, then retry with increasing delays to wait for
    // lazy-loaded pages/sections to mount.
    if (scrollToTarget()) return undefined;

    const retryDelays = [100, 300, 600, 1000, 2000];
    const timers = retryDelays.map((delay) =>
      setTimeout(() => {
        if (!cancelled) scrollToTarget();
      }, delay)
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [location.pathname, location.hash]);

  return null;
};

// ===========================================
// Lead Form Drawer Wrapper
// ===========================================
const LeadFormDrawerWrapper = () => {
  const { isDrawerOpen, drawerConfig, closeLeadDrawer } = useModal();

  return (
    <LeadFormDrawer
      isOpen={isDrawerOpen}
      onClose={closeLeadDrawer}
      title={drawerConfig.title}
      subtitle={drawerConfig.subtitle}
      source={drawerConfig.source}
      serviceInterest={drawerConfig.service_interest}
    />
  );
};

// ===========================================
// Main App Component
// ===========================================
const App = () => {
  // Hide initial loader after mount
  useEffect(() => {
    const initialLoader = document.getElementById('initial-loader');
    if (initialLoader) {
      initialLoader.classList.add('hidden');
      setTimeout(() => {
        initialLoader.style.display = 'none';
      }, 400); // matches the CSS transition duration
    }
  }, []);

  // Scroll restoration is manual — ScrollManager owns route scrolling.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <BrowserRouter>
      <CustomThemeProvider>
        <ModalProvider>
          <div className="app" id="app-root">
            {/* SEO Head — manages meta tags and schemas per route */}
            <SEOHead />

            {/* Route-change scrolling (top, or to a #hash target) */}
            <ScrollManager />

            <Routes>
              {/* Public site — one shared Dulecy shell */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={lazyRoute(<AboutPage />)} />
                <Route
                  path="/expertise"
                  element={lazyRoute(<ExpertisePage />)}
                />
                <Route
                  path="/industries"
                  element={lazyRoute(<IndustriesPage />)}
                />
                <Route path="/contact" element={lazyRoute(<ContactPage />)} />
                <Route path="*" element={lazyRoute(<NotFoundPage />)} />
              </Route>

              {/* Thank You Page — retired in Prompt 07 */}
              <Route
                path="/thank-you"
                element={
                  <Suspense fallback={<SectionLoader height={400} variant="default" />}>
                    <ThankYouPage />
                  </Suspense>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/login"
                element={
                  <AdminAuthProvider>
                    <AdminLogin />
                  </AdminAuthProvider>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <AdminAuthProvider>
                    <ProtectedRoute>
                      <Suspense fallback={<SectionLoader height={400} variant="default" />}>
                        <AdminLayout />
                      </Suspense>
                    </ProtectedRoute>
                  </AdminAuthProvider>
                }
              />
            </Routes>

            {/* Lead Form Drawer - Available globally */}
            <LeadFormDrawerWrapper />
          </div>
        </ModalProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  );
};

export default App;
