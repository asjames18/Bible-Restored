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
            <Route path="/" element={<Home />} />
            <Route path="/:translation/:book/:chapter" element={<Reader />} />
            <Route path="/:translation/:book/:chapter/:verse" element={<Reader />} />
            <Route path="/parallel/:book/:chapter" element={<ParallelViewWrapper />} />
            <Route path="/parallel/:book/:chapter/:verse" element={<ParallelViewWrapper />} />
            <Route path="/search" element={<Search />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/plans" element={<ReadingPlans />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/prayers" element={<PrayerList />} />
            <Route path="/concordance" element={<Concordance />} />
            <Route path="/topics" element={<TopicBrowser />} />
            <Route path="/memory" element={<MemoryVerses />} />
            <Route path="/devotional" element={<Devotional />} />
            <Route path="/history" element={<History />} />
            <Route path="/book-overview/:book" element={<BookOverview />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/glossary" element={<Glossary />} />
          </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
      
      {/* Loading Progress */}
      {isLoading && loadingProgress < 100 && (
        <LoadingProgress percent={loadingProgress} />
      )}
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />
      
      {/* PWA Components */}
      <OfflineIndicator isOnline={isOnline} />
      <UpdatePrompt 
        isVisible={updateAvailable} 
        onUpdate={handleUpdate} 
        onDismiss={handleDismiss} 
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
