/* ============================================
   App Component — Dulcey Lead Services
   --------------------------------------------
   Five-route public site (Home · About · Expertise · Who We Serve ·
   Contact) sharing one shell via `PublicLayout`, plus the `/admin/*`
   routes and a branded `*` catch-all. `/thank-you` was retired in
   Prompt 07 — the enquiry form now confirms inline.

   The only floating UI is the burger → full-screen overlay menu
   (`MobileMenu`) and the global enquiry modal (`LeadModal`).
   ============================================ */

import React, { Suspense, lazy, useEffect, useLayoutEffect, memo } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CircularProgress, Skeleton, Box } from '@mui/material';

// App Styles
import './App.css';

// Context Providers
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { ModalProvider, useModal } from './context/ModalContext';

// Shell + eager (critical-path) route
import PublicLayout from './components/layout/PublicLayout/PublicLayout';
import HomePage from './pages/Home/HomePage';
import LeadModal from './components/common/LeadModal/LeadModal';
import SEOHead from './components/common/SEO/SEOHead';

// Shared #hash → scroll helper (also used by the /expertise accordion)
import { hashToId, scrollToHash } from './utils/hashScroll';

// Pages (Lazy loaded)
const AboutPage = lazy(() => import('./pages/About/AboutPage'));
const ExpertisePage = lazy(() => import('./pages/Expertise/ExpertisePage'));
const IndustriesPage = lazy(() => import('./pages/Industries/IndustriesPage'));
const ContactPage = lazy(() => import('./pages/Contact/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFound/NotFoundPage'));

// Admin — lazy, so nothing under /admin ships in the public bundle
// (Prompt 12). The auth provider is pulled in through this same boundary
// by `AdminGate` below rather than imported at module scope.
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const AdminLoginRoute = lazy(() => import('./admin/components/AdminLoginRoute'));
const AdminProtectedShell = lazy(() =>
  import('./admin/components/AdminProtectedShell')
);

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
// Two variants are in use: `skeleton` for public route chunks and
// `default` for the admin shell.
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
        <CircularProgress
          size={40}
          thickness={3}
          sx={{
            color: '#0B0B0C',
            animation: 'fadeIn 0.3s ease',
          }}
        />
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

/**
 * Jump to the top with no animation.
 *
 * `html { scroll-behavior: smooth }` (src/styles/global.css) applies to
 * programmatic scrolls too, so a plain `scrollTo(0, 0)` animates the reset —
 * gliding the visitor down through the whole outgoing page instead of
 * placing them at the top of the new one. GSAP neutralises that with an
 * inline `scroll-behavior: auto`, but only once ScrollTrigger has built its
 * first scroller, which has not happened on the first navigation of a
 * session. `behavior: 'instant'` is the explicit opt-out; engines that
 * predate the enum reject the dictionary, so fall back to the positional
 * form there.
 */
const jumpToTop = () => {
  if (typeof window === 'undefined') return;
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  } catch (err) {
    window.scrollTo(0, 0);
  }
};

// `useLayoutEffect` is the whole point of the reset below, but React warns
// when it runs without a DOM. The app is client-only (CRA), so this guard is
// purely so the module stays importable from a Node test renderer.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// How long to keep holding the incoming route at the top (ms). Long enough
// to cover a lazy chunk mounting plus its fonts and images laying out; short
// enough that it is over before anyone reaches for the scrollbar.
const SETTLE_MS = 1000;

// Events that mean the *visitor* wants to move. A programmatic scroll — ours,
// the browser re-clamping the offset when the document shrinks, or a stale
// offset being written back — fires `scroll` but none of these, so they are
// what tells the settle pass below to stop re-asserting the top and get out
// of the way.
//
// `scroll` is deliberately NOT in this set. It is the one event every
// programmatic scroll fires too, so treating it as intent would hand control
// straight back to whatever the pass exists to guard against.
const USER_SCROLL_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];

/**
 * Hold the document at the top until the incoming route has settled.
 *
 * Two different things move the scroll off the top in the moments after a
 * navigation, and neither of them is the visitor:
 *
 * 1. **The browser re-clamping.** A route commits before its lazy chunk's
 *    images and fonts have laid out, and `<Suspense>` can commit a shorter
 *    fallback in a separate commit first — so the document height keeps
 *    changing for several frames afterwards. Every change re-clamps the
 *    offset, and on a short route the clamp lands in the footer.
 * 2. **A stale offset being written back.** The enquiry modal's scroll lock
 *    restores the offset it captured when it opened, and GSAP's
 *    ScrollTrigger re-applies the position it recorded around a `refresh()`.
 *    Both are one-shot writes of a number measured on a *different* page,
 *    and neither changes the document height, so watching the box alone
 *    cannot catch them.
 *
 * So watch both: the document box (via ResizeObserver) *and* the scroll
 * position itself. Anything that moves us off the top without the visitor
 * asking is undone. Guarding the position rather than each known culprit is
 * the point — it holds for the next one too.
 *
 * @returns {Function} cancel — stops the pass; use as effect cleanup.
 */
const pinToTopUntilSettled = () => {
  if (typeof window === 'undefined') return () => {};

  let observer = null;
  let timer = 0;
  let stopped = false;

  // Undoing our own scroll is a no-op, so the `scroll` this fires simply
  // re-enters once and finds nothing to do — it cannot loop.
  const reassert = () => {
    if (!stopped && window.scrollY !== 0) jumpToTop();
  };

  const stop = () => {
    if (stopped) return;
    stopped = true;
    if (observer) observer.disconnect();
    window.clearTimeout(timer);
    window.removeEventListener('scroll', reassert);
    USER_SCROLL_EVENTS.forEach((type) =>
      window.removeEventListener(type, stop)
    );
  };

  if (typeof ResizeObserver === 'function') {
    // `documentElement` is height:auto, so its box tracks the document — this
    // fires on exactly the height changes that trigger a re-clamp. It also
    // covers a scroll lock lifting: `position: fixed` on the body collapses
    // the document to zero height, so releasing it is a height change too.
    observer = new ResizeObserver(reassert);
    observer.observe(document.documentElement);
  }

  window.addEventListener('scroll', reassert, { passive: true });

  timer = window.setTimeout(stop, SETTLE_MS);
  USER_SCROLL_EVENTS.forEach((type) =>
    window.addEventListener(type, stop, { passive: true })
  );

  return stop;
};

const ScrollManager = () => {
  const location = useLocation();

  // Keyed on `location.key` — the identity of the history entry — rather
  // than the pathname. Every navigation mints a new key, including one to
  // the route already on screen, so the footer's / mobile menu's / header's
  // "Contact" link still resets the scroll when the visitor is already on
  // /contact. Keyed on the pathname, that click changed neither dependency,
  // so the effect never re-ran and left them parked exactly where they had
  // clicked from: inside the footer.
  //
  // A LAYOUT effect, not a passive one. Passive effects flush after the
  // browser has painted, so the incoming route always got at least one
  // painted frame at the *outgoing* scroll offset. React clamps nothing —
  // the browser does: when the new page is shorter than that offset, the
  // offset is clamped to the new maximum, and on the shortest route on the
  // site that maximum IS the footer. Arriving on /contact from anywhere
  // scrolled past ~1900px therefore painted the footer first. On a fast
  // desktop that is one subliminal frame; on a phone, where React yields for
  // hundreds of milliseconds while the route chunk mounts, it is the page
  // visibly "opening in the footer" before snapping to the top. Running it
  // in the commit phase means the clamped position is never painted at all.
  //
  // This also covers the first paint of the session (`location.key` is set on
  // mount too), which is why App no longer duplicates the reset.
  useIsomorphicLayoutEffect(() => {
    if (location.hash) return undefined;
    jumpToTop();
    return pinToTopUntilSettled();
  }, [location.key, location.hash]);

  // A hash scrolls to its target instead — polling while lazy
  // pages/sections mount, and cancelling any pending retry on unmount.
  useEffect(
    () => scrollToHash(hashToId(location.hash)),
    [location.key, location.hash]
  );

  return null;
};

// ===========================================
// Lead Modal Wrapper
// ===========================================
const LeadModalWrapper = () => {
  const { isModalOpen, modalConfig, closeLeadModal } = useModal();

  return (
    <LeadModal
      isOpen={isModalOpen}
      onClose={closeLeadModal}
      source={modalConfig.source}
      serviceInterest={modalConfig.service_interest}
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

  // Scroll restoration is manual — ScrollManager owns route scrolling, first
  // paint included. The mode itself is claimed in public/index.html and
  // re-asserted by src/animations/gsapSetup.js; setting it from here would be
  // both too late to beat the browser's restore and immediately reverted by
  // the next ScrollTrigger.refresh(). The first-paint reset that used to live
  // here is gone: ScrollManager's layout effect runs on mount as well, and
  // runs before paint rather than after it.

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
              {/* Public site — one shared Dulcey shell */}
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

              {/* Admin Routes — each behind its own Suspense boundary so the
                  admin chunk (auth context, MUI tables, Iconify) is only
                  fetched once someone actually navigates to /admin. */}
              <Route
                path="/admin/login"
                element={
                  <Suspense fallback={<SectionLoader height={400} variant="default" />}>
                    <AdminLoginRoute />
                  </Suspense>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={<SectionLoader height={400} variant="default" />}>
                    <AdminProtectedShell>
                      <AdminLayout />
                    </AdminProtectedShell>
                  </Suspense>
                }
              />
            </Routes>

            {/* Enquiry modal — available globally */}
            <LeadModalWrapper />
          </div>
        </ModalProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  );
};

export default App;
