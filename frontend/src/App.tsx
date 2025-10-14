import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useBibleStore } from './store/bibleStore';
import { usePWA } from './lib/usePWA';
import { preloadTranslations } from './lib/data';
import ErrorBoundary from './components/ErrorBoundary';
import UpdatePrompt from './components/UpdatePrompt';
import OfflineIndicator from './components/OfflineIndicator';
import Reader from './routes/Reader';
import Home from './routes/Home';
import Search from './routes/Search';
import Settings from './routes/Settings';
import Glossary from './routes/Glossary';
import ParallelViewWrapper from './components/ParallelViewWrapper';

function App() {
  const { loadCurrentBible } = useBibleStore();
  const { isOnline, updateAvailable, handleUpdate, handleDismiss } = usePWA();

  useEffect(() => {
    loadCurrentBible();
    // Preload all translations for offline use
    preloadTranslations();
  }, [loadCurrentBible]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:translation/:book/:chapter" element={<Reader />} />
            <Route path="/:translation/:book/:chapter/:verse" element={<Reader />} />
            <Route path="/parallel/:book/:chapter" element={<ParallelViewWrapper />} />
            <Route path="/parallel/:book/:chapter/:verse" element={<ParallelViewWrapper />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/glossary" element={<Glossary />} />
          </Routes>
          
          {/* PWA Components */}
          <OfflineIndicator isOnline={isOnline} />
          <UpdatePrompt 
            isVisible={updateAvailable} 
            onUpdate={handleUpdate} 
            onDismiss={handleDismiss} 
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
