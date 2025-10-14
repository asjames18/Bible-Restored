import { useParams, useNavigate } from 'react-router-dom';
import { useBibleStore } from '../store/bibleStore';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Focus, X } from 'lucide-react';
import TopBar from '../components/TopBar';
import Verse from '../components/Verse';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Reader() {
  const { translation, book, chapter, verse } = useParams();
  const navigate = useNavigate();
  const [isFocusMode, setIsFocusMode] = useState(false);
  const { 
    bible, 
    isLoading, 
    error, 
    setTranslation, 
    setRef, 
    nextChapter, 
    prevChapter 
  } = useBibleStore();

  useEffect(() => {
    if (translation && book && chapter) {
      setTranslation(translation);
      setRef(book, chapter, verse);
    }
  }, [translation, book, chapter, verse, setTranslation, setRef]);

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

  // Show loading if Bible is being loaded OR if Bible isn't available yet
  if (isLoading || !bible) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Bible..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
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

  // Chapter transition variants
  const chapterVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const chapterTransition = {
    type: 'tween' as const,
    ease: 'anticipate' as const,
    duration: 0.3
  };

  return (
    <div className={`min-h-screen bg-theme-bg text-theme-text ${isFocusMode ? 'focus-mode' : ''}`}>
      {!isFocusMode && <TopBar />}
      
      {/* Focus Mode Toggle */}
      <motion.button
        onClick={() => setIsFocusMode(!isFocusMode)}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full bg-theme-surface hover:bg-theme-surface-hover shadow-lg transition-all duration-200 ${
          isFocusMode ? 'bg-theme-accent text-white' : 'bg-theme-surface text-theme-text'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isFocusMode ? 'Exit Focus Mode (F)' : 'Enter Focus Mode (F)'}
      >
        {isFocusMode ? <X size={20} /> : <Focus size={20} />}
      </motion.button>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Chapter Title with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-theme-text mb-2">
            {book} {chapter}
          </h1>
          {verse && (
            <p className="text-theme-accent font-medium">Verse {verse}</p>
          )}
        </motion.div>

        {/* Verses with Chapter Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${book}-${chapter}`}
            initial="initial"
            animate="in"
            exit="out"
            variants={chapterVariants}
            transition={chapterTransition}
            className="prose prose-lg max-w-none reading-area"
          >
            {verseNumbers.map((verseNum, index) => (
              <motion.div
                key={verseNum}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="verse-hover"
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

        {/* Navigation with Enhanced Styling */}
        <motion.div 
          className="mt-8 flex justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <motion.button
            onClick={prevChapter}
            className="bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-theme-border hover:border-theme-accent"
            whileHover={{ scale: 1.02, x: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            ← Previous Chapter
          </motion.button>
          <motion.button
            onClick={nextChapter}
            className="bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-theme-border hover:border-theme-accent"
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            Next Chapter →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}


