import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBibleStore } from '../store/bibleStore';
import { Sun, RefreshCw } from 'lucide-react';

interface VerseOfDayProps {
  className?: string;
}

export default function VerseOfDay({ className = '' }: VerseOfDayProps) {
  const { bible } = useBibleStore();
  const [verseOfDay, setVerseOfDay] = useState<{
    book: string;
    chapter: string;
    verse: string;
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get a random verse from the Bible
  const getRandomVerse = () => {
    if (!bible) return null;

    const books = Object.keys(bible);
    const randomBook = books[Math.floor(Math.random() * books.length)];
    const chapters = Object.keys(bible[randomBook]);
    const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
    const verses = Object.keys(bible[randomBook][randomChapter]);
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];

    return {
      book: randomBook,
      chapter: randomChapter,
      verse: randomVerse,
      text: bible[randomBook][randomChapter][randomVerse]
    };
  };

  // Load verse of the day from localStorage or generate new one
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('verse-of-day');
    
    if (stored) {
      const { date, verse } = JSON.parse(stored);
      if (date === today && verse) {
        setVerseOfDay(verse);
        return;
      }
    }

    // Generate new verse if none exists or date changed
    if (bible) {
      const newVerse = getRandomVerse();
      if (newVerse) {
        setVerseOfDay(newVerse);
        localStorage.setItem('verse-of-day', JSON.stringify({
          date: today,
          verse: newVerse
        }));
      }
    }
  }, [bible]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newVerse = getRandomVerse();
      if (newVerse) {
        setVerseOfDay(newVerse);
        localStorage.setItem('verse-of-day', JSON.stringify({
          date: new Date().toDateString(),
          verse: newVerse
        }));
      }
      setIsLoading(false);
    }, 500);
  };

  if (!verseOfDay) {
    return (
      <div className={`bg-theme-surface rounded-xl p-6 border border-theme-border ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-theme-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-xl border border-theme-border ${className}`}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-theme-accent/20 via-theme-accent/10 to-theme-accent/5 animate-pulse"></div>
      
      {/* Sunrise Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-theme-accent to-transparent animate-shimmer"></div>
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sun className="w-5 h-5 text-theme-accent" />
            <h3 className="text-lg font-semibold text-theme-text">Verse of the Day</h3>
          </div>
          <motion.button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-full bg-theme-surface/50 hover:bg-theme-surface transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Get new verse"
          >
            <RefreshCw className={`w-4 h-4 text-theme-accent ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>

        {/* Verse Content */}
        <motion.div
          key={verseOfDay.book + verseOfDay.chapter + verseOfDay.verse}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <div className="text-sm font-medium text-theme-accent">
            {verseOfDay.book} {verseOfDay.chapter}:{verseOfDay.verse}
          </div>
          <blockquote className="text-theme-text leading-relaxed italic">
            "{verseOfDay.text}"
          </blockquote>
        </motion.div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-theme-border/50">
          <p className="text-xs text-theme-text/60">
            Daily inspiration from the restored Word
          </p>
        </div>
      </div>
    </motion.div>
  );
}
