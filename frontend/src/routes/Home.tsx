import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBibleStore } from '../store/bibleStore';
import { useReadingStreak } from '../hooks/useReadingStreak';
import TopBar from '../components/TopBar';
import VerseOfDay from '../components/VerseOfDay';
import { BookOpen, Search, Settings, Book, Flame, Star } from 'lucide-react';

export default function Home() {
  const { translationId, book, chapter } = useBibleStore();
  const { streakData, getStreakMessage } = useReadingStreak();

  return (
    <div className="min-h-screen bg-theme-bg">
      <TopBar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-theme-text mb-4">
            The Restored Word
          </h1>
          <p className="text-xl text-theme-text/80 mb-8 max-w-2xl mx-auto">
            Experience Scripture with restored Hebrew names and divine titles. 
            Discover the beauty of Yahuah, Elohiym, and Yahusha in their original context.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
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
            className="bg-theme-surface rounded-xl p-6 border border-theme-border"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Flame className="w-6 h-6 text-theme-accent" />
              <h3 className="text-lg font-semibold text-theme-text">Reading Streak</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-theme-accent mb-2">
                {streakData.currentStreak}
              </div>
              <p className="text-sm text-theme-text/80 mb-3">
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
          className="text-center space-y-6"
        >
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/${translationId}/${book}/${chapter}`}
                className="inline-flex items-center space-x-3 bg-theme-accent hover:bg-theme-accent-dark text-white px-8 py-4 rounded-xl transition-all duration-200 text-lg font-semibold shadow-lg"
              >
                <BookOpen className="w-5 h-5" />
                <span>Continue Reading: {book} {chapter}</span>
              </Link>
            </motion.div>
            
            <div className="text-sm text-theme-text/60 mb-4">or</div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/restored_kjv/Genesis/1`}
                className="inline-flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl transition-all duration-200 text-lg font-semibold shadow-lg"
              >
                <Book className="w-5 h-5" />
                <span>Start from Genesis 1</span>
              </Link>
            </motion.div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/search"
                className="inline-flex items-center space-x-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-6 py-3 rounded-lg transition-all duration-200 border border-theme-border"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/parallel/Genesis/1"
                className="inline-flex items-center space-x-2 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-900 dark:text-green-100 px-6 py-3 rounded-lg transition-all duration-200"
              >
                <BookOpen className="w-4 h-4" />
                <span>Parallel View</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/settings"
                className="inline-flex items-center space-x-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-6 py-3 rounded-lg transition-all duration-200 border border-theme-border"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/glossary"
                className="inline-flex items-center space-x-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-6 py-3 rounded-lg transition-all duration-200 border border-theme-border"
              >
                <Star className="w-4 h-4" />
                <span>Glossary</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Did You Know Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-theme-accent/10 to-theme-accent/5 rounded-xl p-6 border border-theme-accent/20"
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-theme-text mb-2">
              Did You Know?
            </h3>
            <p className="text-theme-text/80">
              The name "Yahuah" (יהוה) appears over 6,800 times in the Hebrew Scriptures, 
              making it the most frequently used name for the Most High. Each occurrence 
              represents a direct connection to the divine covenant.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


