import { useParams, useNavigate } from 'react-router-dom';
import { useBibleStore } from '../store/bibleStore';
import { useHistoryStore } from '../store/historyStore';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Focus, X, Info } from 'lucide-react';
import TopBar from '../components/TopBar';
import Verse from '../components/Verse';
import LoadingSpinner from '../components/LoadingSpinner';
import ChapterSummary from '../components/ChapterSummary';
// import { useScrollRestoration } from '../hooks/useScrollRestoration';
import { useReadingStreak } from '../hooks/useReadingStreak';
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
    translationId
  } = useBibleStore();
  
  const { addToHistory } = useHistoryStore();
  const { updateStreak } = useReadingStreak();

  // Scroll restoration (temporarily disabled - might be conflicting)
  // useScrollRestoration();

  // Helper functions for navigation without store updates (prevents flash)
  const goToNextChapter = useCallback(() => {
    console.log('goToNextChapter called', { bible: !!bible, book, chapter });
    if (!bible || !book) {
      console.log('Missing bible or book');
      return;
    }
    const chapters = Object.keys(bible[book]).sort((a, b) => parseInt(a) - parseInt(b));
    const currentIndex = chapters.indexOf(chapter!);
    console.log('Chapters:', chapters, 'Current index:', currentIndex);
    if (currentIndex < chapters.length - 1) {
      const nextChap = chapters[currentIndex + 1];
      console.log('Navigating to next chapter:', nextChap);
      // Scroll to top before navigating
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(`/${translation}/${book}/${nextChap}`);
    } else {
      console.log('Already at last chapter');
    }
  }, [bible, book, chapter, translation, navigate]);

  const goToPrevChapter = useCallback(() => {
    console.log('goToPrevChapter called', { bible: !!bible, book, chapter });
    if (!bible || !book) {
      console.log('Missing bible or book');
      return;
    }
    const chapters = Object.keys(bible[book]).sort((a, b) => parseInt(a) - parseInt(b));
    const currentIndex = chapters.indexOf(chapter!);
    console.log('Chapters:', chapters, 'Current index:', currentIndex);
    if (currentIndex > 0) {
      const prevChap = chapters[currentIndex - 1];
      console.log('Navigating to prev chapter:', prevChap);
      // Scroll to top before navigating
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(`/${translation}/${book}/${prevChap}`);
    } else {
      console.log('Already at first chapter');
    }
  }, [bible, book, chapter, translation, navigate]);

  // Swipe gestures for mobile navigation (disabled - was blocking scroll)
  // useSwipeGesture({
  //   onSwipeLeft: () => goToNextChapter(),
  //   onSwipeRight: () => goToPrevChapter(),
  //   threshold: 75,
  //   preventDefault: false,
  // });

  // Initialize Bible on mount (run only once)
  useEffect(() => {
    let isMounted = true;
    
    const initializeBible = async () => {
      try {
        if (!bible) {
          console.log('Bible not loaded, loading current Bible...');
          await loadCurrentBible();
        }
        if (isMounted && translation && translationId !== translation) {
          console.log(`Translation mismatch: ${translationId} vs ${translation}, loading ${translation}...`);
          await setTranslation(translation);
        }
      } catch (err) {
        console.error('Failed to initialize Bible:', err);
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };
    
    if (isInitializing) {
      initializeBible();
    }
    
    return () => {
      isMounted = false;
    };
  }, [isInitializing, bible, translation, translationId, loadCurrentBible, setTranslation]);

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
    if (!translation || !book || !chapter || !bible) return;
    
    // Use requestAnimationFrame to avoid state updates during render
    requestAnimationFrame(() => {
      setRef(book, chapter, verse);
      addToHistory(book, chapter, verse);
      updateStreak();
    });
  }, [translation, book, chapter, verse, bible, setRef, addToHistory, updateStreak]);

  // Scroll to top when chapter changes
  useEffect(() => {
    if (book && chapter) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [book, chapter]);

  // Navigate when store chapter/book changes (from nextChapter/prevChapter)
  // Disabled - causes remount flashing. URL params already handle navigation.
  // useEffect(() => {
  //   if (!storeBook || !storeChapter) return;
  //   
  //   const isDifferent = storeBook !== book || storeChapter !== chapter || storeVerse !== verse;
  //   
  //   if (isDifferent) {
  //     const newPath = `/${translation}/${storeBook}/${storeChapter}${storeVerse ? `/${storeVerse}` : ''}`;
  //     navigate(newPath, { replace: true });
  //   }
  // }, [storeBook, storeChapter, storeVerse]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '[') {
        goToPrevChapter();
      } else if (e.key === ']') {
        goToNextChapter();
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
  }, [goToPrevChapter, goToNextChapter, navigate, isFocusMode]);

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

        {/* Verses */}
        <div className="prose prose-sm md:prose-lg max-w-none reading-area">
            {verseNumbers.map((verseNum) => (
              <div
                key={`${book}-${chapter}-${verseNum}`}
                className="verse-hover mb-3 md:mb-4"
              >
                <Verse
                  number={verseNum}
                  text={verses[verseNum]}
                  isHighlighted={verse === verseNum}
                />
              </div>
            ))}
        </div>

        {/* Navigation with Enhanced Styling - Stacked on mobile */}
        <motion.div 
          className="mt-8 flex flex-col md:flex-row gap-3 md:gap-0 md:justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={() => {
              console.log('Previous button clicked!');
              goToPrevChapter();
            }}
            className="btn-touch bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-6 py-3 md:py-3 rounded-lg font-medium transition-all duration-200 border border-theme-border hover:border-theme-accent w-full md:w-auto hover:scale-105 active:scale-95"
          >
            ← Previous Chapter
          </button>
          <button
            onClick={() => {
              console.log('Next button clicked!');
              goToNextChapter();
            }}
            className="btn-touch bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-6 py-3 md:py-3 rounded-lg font-medium transition-all duration-200 border border-theme-border hover:border-theme-accent w-full md:w-auto hover:scale-105 active:scale-95"
          >
            Next Chapter →
          </button>
        </motion.div>
        
        {/* Test Navigation Button */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <button
            onClick={() => {
              console.log('Test button clicked! Current:', { book, chapter, translation });
              console.log('Bible loaded:', !!bible);
              if (bible && book) {
                console.log('Available chapters for', book, ':', Object.keys(bible[book] || {}));
              }
              // Test scroll
              console.log('Testing scroll to top...');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Test Navigation & Scroll
          </button>
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


