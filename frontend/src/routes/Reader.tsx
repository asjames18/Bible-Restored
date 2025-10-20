import { useParams, useNavigate } from 'react-router-dom';
import { useBibleStore } from '../store/bibleStore';
import { useHistoryStore } from '../store/historyStore';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Focus, X, Info } from 'lucide-react';
import TopBar from '../components/TopBar';
import Verse from '../components/Verse';
import LoadingSpinner from '../components/LoadingSpinner';
import ChapterSummary from '../components/ChapterSummary';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { useScrollRestoration } from '../hooks/useScrollRestoration';
import { prefetchAdjacentChapters } from '../lib/cacheManager';

export default function Reader() {
  const { translation, book, chapter, verse } = useParams();
  const navigate = useNavigate();
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { 
    bible, 
    error, 
    isLoading,
    loadCurrentBible,
    setTranslation, 
    setRef, 
    nextChapter, 
    prevChapter,
    book: storeBook,
    chapter: storeChapter,
    verse: storeVerse,
    translationId
  } = useBibleStore();
  
  const { addToHistory } = useHistoryStore();

  // Scroll restoration
  useScrollRestoration();

  // Swipe gestures for mobile navigation
  useSwipeGesture({
    onSwipeLeft: () => nextChapter(),
    onSwipeRight: () => prevChapter(),
    threshold: 75,
  });

  // Initialize Bible on mount
  useEffect(() => {
    const initializeBible = async () => {
      try {
        if (!bible) {
          console.log('Bible not loaded, loading current Bible...');
          await loadCurrentBible();
        }
        if (translation && translationId !== translation) {
          console.log(`Translation mismatch: ${translationId} vs ${translation}, loading ${translation}...`);
          await setTranslation(translation);
        }
      } catch (err) {
        console.error('Failed to initialize Bible:', err);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeBible();
  }, [bible, translation, translationId, loadCurrentBible, setTranslation]);

  // Prefetch adjacent chapters for better performance
  useEffect(() => {
    if (bible && book && chapter && translation) {
      // Get total chapters for this book
      const totalChapters = Object.keys(bible[book] || {}).length;
      const chapterNum = parseInt(chapter, 10);
      
      // Prefetch previous and next chapters in the background
      setTimeout(() => {
        prefetchAdjacentChapters(translation, book, chapterNum, totalChapters);
      }, 1000); // Delay to not interfere with current page load
    }
  }, [bible, book, chapter, translation]);

  // Update ref when navigating and track history
  useEffect(() => {
    if (translation && book && chapter && bible) {
      setRef(book, chapter, verse);
      // Track reading history
      addToHistory(book, chapter, verse);
    }
  }, [translation, book, chapter, verse, bible, setRef, addToHistory]);

  // Navigate when store chapter/book changes (from nextChapter/prevChapter)
  useEffect(() => {
    if (storeBook && storeChapter && (storeBook !== book || storeChapter !== chapter || storeVerse !== verse)) {
      const newPath = `/${translation}/${storeBook}/${storeChapter}${storeVerse ? `/${storeVerse}` : ''}`;
      navigate(newPath);
    }
  }, [storeBook, storeChapter, storeVerse, book, chapter, verse, translation, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '[') {
        prevChapter();
      } else if (e.key === ']') {
        nextChapter();
      } else if (e.key === '/') {
        navigate('/search');
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFocusMode(!isFocusMode);
      } else if (e.key === 'Escape') {
        setIsFocusMode(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [prevChapter, nextChapter, navigate, isFocusMode]);

  // Show loading screen during initialization or when Bible is loading
  if (isInitializing || isLoading || !bible) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-bg">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Loading Bible..." />
          {isLoading && (
            <p className="mt-4 text-sm text-theme-text/60">
              Please wait, this may take a moment...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-bg">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4 text-lg">Error loading Bible</p>
          <p className="text-theme-text/70 mb-6 text-sm">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => {
                setIsInitializing(true);
                loadCurrentBible().finally(() => setIsInitializing(false));
              }}
              className="block w-full bg-theme-accent hover:bg-theme-accent-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Retry Loading
            </button>
            <button 
              onClick={() => navigate('/')}
              className="block w-full bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-6 py-3 rounded-lg font-medium transition-colors border border-theme-border"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!bible[book!] || !bible[book!][chapter!]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Chapter not found</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Looking for: {book} {chapter}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Bible loaded: {bible ? 'Yes' : 'No'}
          </p>
          {bible && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Available books: {Object.keys(bible).length}
            </p>
          )}
        </div>
      </div>
    );
  }

  const verses = bible[book!][chapter!];
  const verseNumbers = Object.keys(verses).sort((a, b) => parseInt(a) - parseInt(b));

  // Chapter transition variants - faster and smoother
  const chapterVariants = {
    initial: { opacity: 0, x: 30 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -30 }
  };

  const chapterTransition = {
    type: 'tween' as const,
    ease: 'easeInOut' as const,
    duration: 0.2
  };

  return (
    <div className={`min-h-screen bg-theme-bg text-theme-text page-content-mobile ${isFocusMode ? 'focus-mode' : ''}`}>
      {!isFocusMode && <TopBar />}
      
      {/* Focus Mode Toggle - Repositioned for mobile thumb reach */}
      <motion.button
        onClick={() => setIsFocusMode(!isFocusMode)}
        className={`fixed md:top-4 md:right-4 bottom-24 right-4 md:bottom-auto z-50 btn-touch p-3 rounded-full shadow-lg transition-all duration-200 ${
          isFocusMode ? 'bg-theme-accent text-white' : 'bg-theme-surface text-theme-text'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isFocusMode ? 'Exit Focus Mode (F)' : 'Enter Focus Mode (F)'}
      >
        {isFocusMode ? <X size={20} /> : <Focus size={20} />}
      </motion.button>

      <div className="swipe-container max-w-4xl mx-auto container-mobile py-4 md:py-8">
        {/* Chapter Title with Animation */}
        <motion.div
          key={`title-${book}-${chapter}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="mb-6 md:mb-8 text-center"
        >
          <h1 className="text-mobile-title md:text-3xl font-bold text-theme-text mb-2">
            {book} {chapter}
          </h1>
          {verse && (
            <p className="text-theme-accent font-medium text-sm md:text-base">Verse {verse}</p>
          )}
          <motion.button
            onClick={() => navigate(`/book-overview/${book}`)}
            className="mt-2 text-sm text-theme-text/60 hover:text-theme-accent transition-colors flex items-center gap-1 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Info className="w-4 h-4" />
            View Book Overview
          </motion.button>
        </motion.div>

        {/* Chapter Summary */}
        <ChapterSummary book={book!} chapter={chapter!} />

        {/* Verses with Chapter Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${book}-${chapter}`}
            initial="initial"
            animate="in"
            exit="out"
            variants={chapterVariants}
            transition={chapterTransition}
            className="prose prose-sm md:prose-lg max-w-none reading-area"
          >
            {verseNumbers.map((verseNum, index) => (
              <motion.div
                key={verseNum}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4,
                  delay: Math.min(index * 0.03, 0.5), // Cap max delay at 0.5s
                  ease: [0.22, 1, 0.36, 1] // Custom easing for smooth entrance
                }}
                className="verse-hover mb-3 md:mb-4"
              >
                <Verse
                  number={verseNum}
                  text={verses[verseNum]}
                  isHighlighted={verse === verseNum}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation with Enhanced Styling - Stacked on mobile */}
        <motion.div 
          className="mt-8 flex flex-col md:flex-row gap-3 md:gap-0 md:justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            onClick={prevChapter}
            className="btn-touch bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-6 py-3 md:py-3 rounded-lg font-medium transition-all duration-200 border border-theme-border hover:border-theme-accent w-full md:w-auto"
            whileHover={{ scale: 1.02, x: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            ← Previous Chapter
          </motion.button>
          <motion.button
            onClick={nextChapter}
            className="btn-touch bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-6 py-3 md:py-3 rounded-lg font-medium transition-all duration-200 border border-theme-border hover:border-theme-accent w-full md:w-auto"
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            Next Chapter →
          </motion.button>
        </motion.div>
        
        {/* Mobile swipe hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="md:hidden mt-4 text-center text-xs text-theme-text/40"
        >
          Swipe left or right to navigate chapters
        </motion.div>
      </div>
    </div>
  );
}


