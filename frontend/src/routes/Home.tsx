import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useBibleStore } from '../store/bibleStore';
import { useReadingStreak } from '../hooks/useReadingStreak';
import TopBar from '../components/TopBar';
import VerseOfDay from '../components/VerseOfDay';
import { getFactOfTheDay } from '../lib/didYouKnow';
import type { DidYouKnowFact } from '../lib/didYouKnow';
import { BookOpen, Search, Settings, Book, Flame, Star, Bookmark, StickyNote } from 'lucide-react';

export default function Home() {
  const { translationId, book, chapter } = useBibleStore();
  const { streakData, getStreakMessage } = useReadingStreak();
  const [currentFact, setCurrentFact] = useState<DidYouKnowFact>(getFactOfTheDay());

  // Load fact of the day on mount
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('did-you-know');
    
    if (stored) {
      const { date, fact } = JSON.parse(stored);
      if (date === today && fact) {
        setCurrentFact(fact);
        return;
      }
    }

    // Get new fact for today
    const factOfDay = getFactOfTheDay();
    setCurrentFact(factOfDay);
    localStorage.setItem('did-you-know', JSON.stringify({
      date: today,
      fact: factOfDay
    }));
  }, []);

  return (
    <div className="min-h-screen bg-theme-bg page-content-mobile">
      <div className="hidden md:block">
        <TopBar />
      </div>
      
      <div className="max-w-6xl mx-auto container-mobile py-4 md:py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-mobile-hero font-bold text-theme-text mb-3 md:mb-4">
            The Restored Word
          </h1>
          <p className="text-mobile-body text-theme-text/80 mb-6 md:mb-8 max-w-2xl mx-auto">
            Experience Scripture with restored Hebrew names and divine titles. 
            Discover the beauty of Yahuah, Elohiym, and Yahusha in their original context.
          </p>
        </motion.div>

        {/* Main Content Grid - Single column on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
          {/* Verse of the Day */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <VerseOfDay />
          </motion.div>

          {/* Reading Streak */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-theme-surface rounded-xl p-4 md:p-6 border border-theme-border"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Flame className="w-5 h-5 md:w-6 md:h-6 text-theme-accent" />
              <h3 className="text-base md:text-lg font-semibold text-theme-text">Reading Streak</h3>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-theme-accent mb-2">
                {streakData.currentStreak}
              </div>
              <p className="text-xs md:text-sm text-theme-text/80 mb-3">
                {getStreakMessage()}
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-theme-text/60">
                <span>Longest: {streakData.longestStreak}</span>
                <span>•</span>
                <span>Total: {streakData.totalDaysRead}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center space-y-4 md:space-y-6"
        >
          <div className="space-y-3 md:space-y-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/${translationId}/${book}/${chapter}`}
                className="btn-touch inline-flex items-center justify-center space-x-3 bg-theme-accent hover:bg-theme-accent-dark text-white px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-200 text-base md:text-lg font-semibold shadow-lg w-full md:w-auto"
              >
                <BookOpen className="w-5 h-5" />
                <span className="truncate">Continue: {book} {chapter}</span>
              </Link>
            </motion.div>
            
            <div className="text-xs md:text-sm text-theme-text/60">or</div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/restored_kjv/Genesis/1`}
                className="btn-touch inline-flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-200 text-base md:text-lg font-semibold shadow-lg w-full md:w-auto"
              >
                <Book className="w-5 h-5" />
                <span>Start from Genesis 1</span>
              </Link>
            </motion.div>
          </div>
          
          {/* Quick Actions - Grid on mobile */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-2 md:gap-4 mt-6 md:mt-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/search"
                className="btn-touch inline-flex items-center justify-center space-x-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-4 md:px-6 py-3 rounded-lg transition-all duration-200 border border-theme-border w-full md:w-auto"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm md:text-base">Search</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/bookmarks"
                className="btn-touch inline-flex items-center justify-center space-x-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-4 md:px-6 py-3 rounded-lg transition-all duration-200 border border-theme-border w-full md:w-auto"
              >
                <Bookmark className="w-4 h-4" />
                <span className="text-sm md:text-base">Bookmarks</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/notes"
                className="btn-touch inline-flex items-center justify-center space-x-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-4 md:px-6 py-3 rounded-lg transition-all duration-200 border border-theme-border w-full md:w-auto"
              >
                <StickyNote className="w-4 h-4" />
                <span className="text-sm md:text-base">Notes</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/parallel/Genesis/1"
                className="btn-touch inline-flex items-center justify-center space-x-2 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-900 dark:text-green-100 px-4 md:px-6 py-3 rounded-lg transition-all duration-200 w-full md:w-auto"
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm md:text-base">Parallel</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="md:hidden">
              <Link
                to="/settings"
                className="btn-touch inline-flex items-center justify-center space-x-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-4 py-3 rounded-lg transition-all duration-200 border border-theme-border w-full"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/glossary"
                className="btn-touch inline-flex items-center justify-center space-x-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-4 md:px-6 py-3 rounded-lg transition-all duration-200 border border-theme-border w-full md:w-auto"
              >
                <Star className="w-4 h-4" />
                <span className="text-sm md:text-base">Glossary</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
              <Link
                to="/settings"
                className="inline-flex items-center space-x-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-6 py-3 rounded-lg transition-all duration-200 border border-theme-border"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Did You Know Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 md:mt-12 bg-gradient-to-r from-theme-accent/10 to-theme-accent/5 rounded-xl p-4 md:p-6 border border-theme-accent/20"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {currentFact.icon && <span className="text-xl md:text-2xl">{currentFact.icon}</span>}
              <h3 className="text-base md:text-lg font-semibold text-theme-text">
                Did You Know?
              </h3>
            </div>
            <motion.p 
              key={currentFact.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xs md:text-base text-theme-text/80"
            >
              {currentFact.fact}
            </motion.p>
            
            {/* Category Badge */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-[10px] md:text-xs px-2 py-1 bg-theme-accent/20 text-theme-accent rounded-full font-medium capitalize">
                {currentFact.category}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


