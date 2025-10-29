import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBibleStore } from './store/bibleStore';
import { usePWA } from './lib/usePWA';
import { preloadTranslations } from './lib/data';
import ErrorBoundary from './components/ErrorBoundary';
import UpdatePrompt from './components/UpdatePrompt';
import OfflineIndicator from './components/OfflineIndicator';
import { LoadingProgress } from './components/LoadingProgress';
import BottomNav from './components/BottomNav';
import { PageSkeleton } from './components/SkeletonLoader';
import { initAnalytics, trackPageview, reportWebVitals } from './lib/analytics';
import FeedbackButton from './components/FeedbackButton';
import OnboardingModal from './components/OnboardingModal';

// Lazy load route components for better performance
const Reader = lazy(() => import('./routes/Reader'));
const Home = lazy(() => import('./routes/Home'));
const Search = lazy(() => import('./routes/Search'));
const Settings = lazy(() => import('./routes/Settings'));
const Glossary = lazy(() => import('./routes/Glossary'));
const Bookmarks = lazy(() => import('./routes/Bookmarks'));
const Notes = lazy(() => import('./routes/Notes'));
const History = lazy(() => import('./routes/History'));
const BookOverview = lazy(() => import('./routes/BookOverview'));
const ParallelViewWrapper = lazy(() => import('./components/ParallelViewWrapper'));
const ReadingPlans = lazy(() => import('./routes/ReadingPlans'));
const Progress = lazy(() => import('./routes/Progress'));
const PrayerList = lazy(() => import('./routes/PrayerList'));
const Concordance = lazy(() => import('./routes/Concordance'));
const TopicBrowser = lazy(() => import('./routes/TopicBrowser'));
const MemoryVerses = lazy(() => import('./routes/MemoryVerses'));
const Devotional = lazy(() => import('./routes/Devotional'));

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.3
};

function AppContent() {
  const location = useLocation();
  const { loadCurrentBible, isLoading, loadingProgress } = useBibleStore();
  const { isOnline, updateAvailable, handleUpdate, handleDismiss } = usePWA();

  // Load and apply saved settings on app start
  useEffect(() => {
    // Analytics pageview on route change
    trackPageview(location.pathname + location.search);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const savedSettings = localStorage.getItem('bible-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        
        // Apply theme preset
        if (settings.themePreset) {
          document.documentElement.setAttribute('data-theme', settings.themePreset);
        }
        
        // Apply theme (dark/light/system)
        if (settings.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (settings.theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          // System theme
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        
        // Apply font size
        if (settings.fontSize) {
          document.documentElement.style.fontSize = 
            settings.fontSize === 'small' ? '14px' :
            settings.fontSize === 'large' ? '18px' : '16px';
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    loadCurrentBible();
    // Preload all translations for offline use (in background)
    setTimeout(() => preloadTranslations(), 2000);
  }, [loadCurrentBible]);

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <Suspense fallback={<PageSkeleton />}>
            <Routes location={location}>
              <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
              <Route path="/:translation/:book/:chapter" element={<ErrorBoundary><Reader /></ErrorBoundary>} />
              <Route path="/:translation/:book/:chapter/:verse" element={<ErrorBoundary><Reader /></ErrorBoundary>} />
              <Route path="/parallel/:book/:chapter" element={<ErrorBoundary><ParallelViewWrapper /></ErrorBoundary>} />
              <Route path="/parallel/:book/:chapter/:verse" element={<ErrorBoundary><ParallelViewWrapper /></ErrorBoundary>} />
              <Route path="/search" element={<ErrorBoundary><Search /></ErrorBoundary>} />
              <Route path="/bookmarks" element={<ErrorBoundary><Bookmarks /></ErrorBoundary>} />
              <Route path="/notes" element={<ErrorBoundary><Notes /></ErrorBoundary>} />
              <Route path="/plans" element={<ErrorBoundary><ReadingPlans /></ErrorBoundary>} />
              <Route path="/progress" element={<ErrorBoundary><Progress /></ErrorBoundary>} />
              <Route path="/prayers" element={<ErrorBoundary><PrayerList /></ErrorBoundary>} />
              <Route path="/concordance" element={<ErrorBoundary><Concordance /></ErrorBoundary>} />
              <Route path="/topics" element={<ErrorBoundary><TopicBrowser /></ErrorBoundary>} />
              <Route path="/memory" element={<ErrorBoundary><MemoryVerses /></ErrorBoundary>} />
              <Route path="/devotional" element={<ErrorBoundary><Devotional /></ErrorBoundary>} />
              <Route path="/history" element={<ErrorBoundary><History /></ErrorBoundary>} />
              <Route path="/book-overview/:book" element={<ErrorBoundary><BookOverview /></ErrorBoundary>} />
              <Route path="/settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
              <Route path="/glossary" element={<ErrorBoundary><Glossary /></ErrorBoundary>} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
      
      {/* Spacer for fixed bottom nav on mobile to prevent content jump/overlap */}
      <div className="h-16 md:hidden" />

      {/* Loading Progress */}
      {isLoading && loadingProgress < 100 && (
        <LoadingProgress percent={loadingProgress} />
      )}
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />
      <FeedbackButton />
      
      {/* PWA Components */}
      <OfflineIndicator isOnline={isOnline} />
      <UpdatePrompt 
        isVisible={updateAvailable} 
        onUpdate={handleUpdate} 
        onDismiss={handleDismiss} 
      />
      <OnboardingModal />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppInitializer>
          <AppContent />
        </AppInitializer>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

function AppInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAnalytics();
    reportWebVitals();
  }, []);
  return children as any;
}
