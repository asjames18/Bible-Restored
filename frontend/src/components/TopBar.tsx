import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBibleStore } from '../store/bibleStore';
import NavPanel from './NavPanel';
import TranslationPicker from './TranslationPicker';
import { 
  Home, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  RotateCcw, 
  Settings,
  Menu
} from 'lucide-react';

export default function TopBar() {
  const navigate = useNavigate();
  const { book, chapter, nextChapter, prevChapter } = useBibleStore();
  const [showNav, setShowNav] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Keyboard shortcuts are handled in Reader component

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-theme-surface border-b border-theme-border sticky top-0 z-40 shadow-sm"
      >
        {/* Desktop View */}
        <div className="hidden md:block max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-theme-border"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Go to Home"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </motion.button>
              
              <motion.button
                onClick={() => setShowNav(true)}
                className="flex items-center space-x-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-3 py-2 rounded-lg text-sm transition-all duration-200 border border-theme-border"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Navigate to different books and chapters"
              >
                <Menu className="w-4 h-4" />
                <span>Navigate</span>
              </motion.button>
              
              <div className="flex items-center space-x-1">
                <motion.button
                  onClick={prevChapter}
                  className="p-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text rounded-lg transition-all duration-200 border border-theme-border"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Previous Chapter"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={nextChapter}
                  className="p-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text rounded-lg transition-all duration-200 border border-theme-border"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Next Chapter"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.h1 
                className="text-lg font-semibold text-theme-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {book} {chapter}
              </motion.h1>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => navigate('/search')}
                  className="flex items-center space-x-2 bg-theme-accent hover:bg-theme-accent-dark text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Search Scripture"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setShowTranslation(true)}
                  className="flex items-center space-x-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-3 py-2 rounded-lg text-sm transition-all duration-200 border border-theme-border"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Change Translation"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Translation</span>
                </motion.button>
                
                <motion.button
                  onClick={() => navigate('/settings')}
                  className="flex items-center space-x-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text px-3 py-2 rounded-lg text-sm transition-all duration-200 border border-theme-border"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View - Compact */}
        <div className="md:hidden px-3 py-2">
          <div className="flex items-center justify-between">
            {/* Left: Navigation Controls */}
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setShowNav(true)}
                className="btn-touch p-2 bg-theme-surface hover:bg-theme-surface-hover text-theme-text rounded-lg border border-theme-border"
                whileTap={{ scale: 0.95 }}
                title="Navigate"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
              
              <div className="flex items-center space-x-1">
                <motion.button
                  onClick={prevChapter}
                  className="btn-touch p-2 text-theme-text rounded-lg hover:bg-theme-surface-hover"
                  whileTap={{ scale: 0.9 }}
                  title="Previous Chapter"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={nextChapter}
                  className="btn-touch p-2 text-theme-text rounded-lg hover:bg-theme-surface-hover"
                  whileTap={{ scale: 0.9 }}
                  title="Next Chapter"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Center: Current Book/Chapter */}
            <motion.h1 
              className="text-base font-semibold text-theme-text truncate max-w-[40%]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {book} {chapter}
            </motion.h1>

            {/* Right: Quick Actions */}
            <div className="flex items-center space-x-1">
              <motion.button
                onClick={() => setShowTranslation(true)}
                className="btn-touch p-2 text-theme-text rounded-lg hover:bg-theme-surface-hover"
                whileTap={{ scale: 0.95 }}
                title="Translation"
              >
                <RotateCcw className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <NavPanel isOpen={showNav} onClose={() => setShowNav(false)} />
      <TranslationPicker isOpen={showTranslation} onClose={() => setShowTranslation(false)} />
    </>
  );
}
