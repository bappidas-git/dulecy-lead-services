/* ============================================
   App Component — Nilachal Infracon
   Main application component with providers,
   lazy loading, and performance optimizations
   ============================================ */

import React, { Suspense, lazy, useEffect, useState, useRef, memo } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CircularProgress, useMediaQuery, useTheme, Skeleton, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

// App Styles
import './App.css';

// Animation foundation (GSAP)
import { gsap, prefersReducedMotion } from './animations';

// Business config (single source of truth)
import { siteConfig, waHref } from './data/siteConfig';

// Context Providers
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { ModalProvider, useModal } from './context/ModalContext';

// Components (Eager loaded for critical path - Above the fold)
import Header from './components/common/Header/Header';
import HeroSection from './components/sections/HeroSection/HeroSection';
import Footer from './components/common/Footer/Footer';
import MobileNavigation from './components/common/MobileNavigation/MobileNavigation';
import MobileDrawer from './components/common/MobileDrawer/MobileDrawer';
import LeadFormDrawer from './components/common/LeadFormDrawer/LeadFormDrawer';
import SEOHead from './components/common/SEO/SEOHead';

// Admin
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import AdminLogin from './admin/components/AdminLogin';
import ProtectedRoute from './admin/components/ProtectedRoute';

// Pages (Lazy loaded)
const ThankYouPage = lazy(() => import('./pages/ThankYou/ThankYou'));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));

// Lazy loaded sections for performance (Below the fold)
const AboutSection = lazy(() => import('./components/sections/AboutSection/AboutSection'));
const ProductsSection = lazy(() => import('./components/sections/ProductsSection/ProductsSection'));
const ServicesSection = lazy(() => import('./components/sections/ServicesSection/ServicesSection'));
const StatsSection = lazy(() => import('./components/sections/StatsSection/StatsSection'));
const BrandsSection = lazy(() => import('./components/sections/BrandsSection/BrandsSection'));
const WhyUsSection = lazy(() => import('./components/sections/WhyUsSection/WhyUsSection'));
const FAQSection = lazy(() => import('./components/sections/FAQSection/FAQSection'));
const ContactSection = lazy(() => import('./components/sections/ContactSection/ContactSection'));

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
            backgroundColor: '#F8F9FA',
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
                backgroundColor: '#16324F',
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
          background: 'linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%)',
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
              color: '#16324F',
            }}
          />
        </motion.div>
      </Box>
    ),
    skeleton: (
      <Box sx={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Skeleton
          variant="text"
          width="30%"
          height={40}
          sx={{ margin: '0 auto 20px', bgcolor: 'rgba(22, 50, 79, 0.1)' }}
        />
        <Skeleton
          variant="text"
          width="60%"
          height={60}
          sx={{ margin: '0 auto 30px', bgcolor: 'rgba(22, 50, 79, 0.1)' }}
        />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={250}
              height={180}
              sx={{ bgcolor: 'rgba(22, 50, 79, 0.05)' }}
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
            backgroundColor: '#16324F',
            animation: 'pulse 1s ease-in-out infinite',
          }}
        />
      </Box>
    ),
  };

  return variants[variant] || variants.default;
});

SectionLoader.displayName = 'SectionLoader';

// ===========================================
// Scroll Progress Indicator
// ===========================================
const ScrollProgressIndicator = memo(() => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: '3px',
        background: 'linear-gradient(90deg, #16324F 0%, #274B6E 100%)',
        zIndex: 9999,
        transition: 'width 0.1s ease-out',
      }}
    />
  );
});

ScrollProgressIndicator.displayName = 'ScrollProgressIndicator';

// ===========================================
// Back to Top Button
// ===========================================
const BackToTopButton = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Back to top"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
});

BackToTopButton.displayName = 'BackToTopButton';

// ===========================================
// Floating WhatsApp Button (desktop only)
// Mobile already has WhatsApp in the bottom nav. Appears (GSAP) once
// the user scrolls past the hero; links to wa.me from siteConfig.
// ===========================================
const WhatsAppFab = memo(() => {
  const fabRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Reveal after scrolling roughly one hero-height down.
      setIsVisible(window.pageYOffset > window.innerHeight * 0.8);
    };
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  useEffect(() => {
    const el = fabRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: isVisible ? 1 : 0, scale: 1 });
      return;
    }
    gsap.to(el, {
      autoAlpha: isVisible ? 1 : 0,
      scale: isVisible ? 1 : 0.6,
      duration: 0.3,
      ease: 'power3.out',
    });
  }, [isVisible]);

  return (
    <a
      ref={fabRef}
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label={`Chat with ${siteConfig.brandName} on WhatsApp`}
      style={{ visibility: 'hidden', opacity: 0 }}
    >
      <Icon icon="mdi:whatsapp" aria-hidden="true" />
    </a>
  );
});

WhatsAppFab.displayName = 'WhatsAppFab';

// ===========================================
// Preload Manager - Preload sections on idle
// ===========================================
const useIdlePreload = () => {
  useEffect(() => {
    // Preload sections during idle time
    if ('requestIdleCallback' in window) {
      const sections = [
        () => import('./components/sections/AboutSection/AboutSection'),
        () => import('./components/sections/ProductsSection/ProductsSection'),
        () => import('./components/sections/ServicesSection/ServicesSection'),
        () => import('./components/sections/StatsSection/StatsSection'),
        () => import('./components/sections/BrandsSection/BrandsSection'),
        () => import('./components/sections/WhyUsSection/WhyUsSection'),
        () => import('./components/sections/FAQSection/FAQSection'),
        () => import('./components/sections/ContactSection/ContactSection'),
      ];

      let currentIndex = 0;

      const preloadNext = (deadline) => {
        while (deadline.timeRemaining() > 0 && currentIndex < sections.length) {
          sections[currentIndex]();
          currentIndex++;
        }
        if (currentIndex < sections.length) {
          window.requestIdleCallback(preloadNext, { timeout: 2000 });
        }
      };

      const idleId = window.requestIdleCallback(preloadNext, { timeout: 2000 });
      return () => window.cancelIdleCallback(idleId);
    }
  }, []);
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
// Home Page Content Component
// ===========================================
const HomePageContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { openLeadDrawer } = useModal();
  const location = useLocation();

  const handleMenuClick = () => setIsMobileDrawerOpen(true);
  const handleMobileDrawerClose = () => setIsMobileDrawerOpen(false);
  const handleMobileDrawerOpen = () => setIsMobileDrawerOpen(true);
  const handleEnquiryClick = () => openLeadDrawer('request-quote');

  // Handle hash-based scroll to section (e.g., /#overview, /#floor-plans)
  // Sections are lazy-loaded, so we poll until the target element appears in the DOM
  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;

    const targetId = hash.substring(1);
    const headerOffset = 80;
    let cancelled = false;

    const scrollToTarget = () => {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
        return true;
      }
      return false;
    };

    // Try immediately, then retry with increasing delays to wait for lazy sections
    if (!scrollToTarget()) {
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
    }
  }, [location.hash]);

  return (
    <>
      {/* Header/Navigation */}
      <Header forceCloseMenu={isMobileDrawerOpen} />

      {/* Main Content */}
      <main id="main-content" className="main-content">
        {/* Hero Section - Critical, loaded immediately */}
        <HeroSection />

        {/* Lazy loaded sections with error boundaries */}
        <ErrorBoundary>
          <Suspense fallback={<SectionLoader height={400} variant="skeleton" />}>
            <AboutSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader height={400} variant="skeleton" />}>
            <ProductsSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader height={400} variant="skeleton" />}>
            <ServicesSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader height={300} variant="skeleton" />}>
            <StatsSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader height={500} variant="skeleton" />}>
            <BrandsSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader height={400} variant="skeleton" />}>
            <WhyUsSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader height={500} variant="skeleton" />}>
            <FAQSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader height={500} variant="skeleton" />}>
            <ContactSection />
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <>
          <MobileNavigation
            onMenuClick={handleMenuClick}
            onEnquiryClick={handleEnquiryClick}
            isDrawerOpen={isMobileDrawerOpen}
          />
          <MobileDrawer
            open={isMobileDrawerOpen}
            onClose={handleMobileDrawerClose}
            onOpen={handleMobileDrawerOpen}
            onBookConsultation={handleEnquiryClick}
          />
        </>
      )}

      {/* Back to Top Button */}
      <BackToTopButton />

      {/* Floating WhatsApp button — desktop only (mobile uses the bottom nav) */}
      {!isMobile && <WhatsAppFab />}
    </>
  );
};

// ===========================================
// Main App Component
// ===========================================
const App = () => {
  // Enable idle preloading
  useIdlePreload();

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

  // Smooth scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Only scroll to top if there's no hash in the URL
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

            {/* Scroll Progress Indicator */}
            <ScrollProgressIndicator />

            {/* Skip to main content link for accessibility */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>

            {/* Routes */}
            <Routes>
              {/* Home Page */}
              <Route path="/" element={<HomePageContent />} />

              {/* Thank You Page */}
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
