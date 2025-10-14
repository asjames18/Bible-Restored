import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBibleStore } from './store/bibleStore';
import { usePWA } from './lib/usePWA';
import { preloadTranslations } from './lib/data';
import ErrorBoundary from './components/ErrorBoundary';
import UpdatePrompt from './components/UpdatePrompt';
import OfflineIndicator from './components/OfflineIndicator';
import { LoadingProgress } from './components/LoadingProgress';
import Reader from './routes/Reader';
import Home from './routes/Home';
import Search from './routes/Search';
import Settings from './routes/Settings';
import Glossary from './routes/Glossary';
import ParallelViewWrapper from './components/ParallelViewWrapper';

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
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/:translation/:book/:chapter" element={<Reader />} />
            <Route path="/:translation/:book/:chapter/:verse" element={<Reader />} />
            <Route path="/parallel/:book/:chapter" element={<ParallelViewWrapper />} />
            <Route path="/parallel/:book/:chapter/:verse" element={<ParallelViewWrapper />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/glossary" element={<Glossary />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      
      {/* Loading Progress */}
      {isLoading && loadingProgress < 100 && (
        <LoadingProgress percent={loadingProgress} />
      )}
      
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
