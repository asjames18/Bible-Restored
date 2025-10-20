import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, BookOpen, Heart, Share2, Bookmark } from 'lucide-react';
import TopBar from '../components/TopBar';
import devotionalsData from '../data/devotionals.json';
import { useBibleStore } from '../store/bibleStore';

interface Devotional {
  id: string;
  title: string;
  theme: string;
  passage: {
    ref: string;
    text: string;
  };
  reflection: string;
  prayer: string;
  action: string;
}

export default function Devotional() {
  const navigate = useNavigate();
  const { setRef, translationId } = useBibleStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [readDevotionals, setReadDevotionals] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const devotionals: Devotional[] = devotionalsData.devotionals;
  const currentDevotional = devotionals[currentIndex];

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('devotional-progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setReadDevotionals(new Set(data.read || []));
        setFavorites(new Set(data.favorites || []));
      } catch (error) {
        console.error('Failed to load devotional progress:', error);
      }
    }

    // Get today's devotional index
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const todayIndex = dayOfYear % devotionals.length;
    setCurrentIndex(todayIndex);
  }, [devotionals.length]);

  // Save data to localStorage
  useEffect(() => {
    const data = {
      read: Array.from(readDevotionals),
      favorites: Array.from(favorites),
    };
    localStorage.setItem('devotional-progress', JSON.stringify(data));
  }, [readDevotionals, favorites]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % devotionals.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + devotionals.length) % devotionals.length);
  };

  const handleMarkAsRead = () => {
    setReadDevotionals((prev) => {
      const updated = new Set(prev);
      updated.add(currentDevotional.id);
      return updated;
    });
  };

  const handleToggleFavorite = () => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (updated.has(currentDevotional.id)) {
        updated.delete(currentDevotional.id);
      } else {
        updated.add(currentDevotional.id);
      }
      return updated;
    });
  };

  const handleReadPassage = () => {
    const [bookChapter, verseRange] = currentDevotional.passage.ref.split(':');
    const parts = bookChapter.split(' ');
    const verse = verseRange ? verseRange.split('-')[0] : '1';
    const chapter = parts.pop() || '1';
    const book = parts.join(' ');
    
    setRef(book, chapter, verse);
    navigate(`/${translationId}/${book}/${chapter}/${verse}`);
  };

  const handleShare = async () => {
    const shareText = `${currentDevotional.title}\n\n${currentDevotional.passage.ref}\n"${currentDevotional.passage.text}"\n\n${currentDevotional.reflection}`;
    
    if ('share' in navigator && navigator.share) {
      try {
        await navigator.share({
          title: currentDevotional.title,
          text: shareText,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else if (navigator.clipboard) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Devotional copied to clipboard!');
      } catch (error) {
        console.error('Copy failed:', error);
      }
    }
  };

  const isRead = readDevotionals.has(currentDevotional.id);
  const isFavorite = favorites.has(currentDevotional.id);
  const progressPercent = (readDevotionals.size / devotionals.length) * 100;

  return (
    <div className="min-h-screen bg-theme-bg pb-20">
      <TopBar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-theme-text/60 hover:text-theme-text">
              <X size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-theme-text">Daily Devotional</h1>
              <p className="text-sm text-theme-text/60">
                {readDevotionals.size} of {devotionals.length} read
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-theme-surface text-theme-text/60 border border-theme-border hover:text-red-500'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-theme-text/60 mb-2">
            <span>Reading Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 bg-theme-surface rounded-full overflow-hidden border border-theme-border">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-theme-accent to-green-500"
            />
          </div>
        </div>

        {/* Devotional Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDevotional.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Theme Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-theme-accent/10 text-theme-accent rounded-full text-sm font-medium">
                {currentDevotional.theme}
              </span>
              {isRead && (
                <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium flex items-center gap-1">
                  ✓ Read
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-theme-text mb-6">{currentDevotional.title}</h2>

            {/* Scripture Passage */}
            <div className="bg-gradient-to-br from-theme-accent/10 to-theme-accent/5 rounded-xl p-6 mb-6 border-2 border-theme-accent/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-theme-accent">
                  {currentDevotional.passage.ref}
                </h3>
                <button
                  onClick={handleReadPassage}
                  className="flex items-center gap-2 px-3 py-1.5 bg-theme-accent hover:bg-theme-accent-dark text-white rounded-lg text-sm transition-colors"
                >
                  <BookOpen size={16} />
                  Read
                </button>
              </div>
              <p className="text-theme-text leading-relaxed text-lg italic">
                "{currentDevotional.passage.text}"
              </p>
            </div>

            {/* Reflection */}
            <div className="bg-theme-surface rounded-xl p-6 mb-6 border border-theme-border">
              <h3 className="text-xl font-semibold text-theme-text mb-3">Reflection</h3>
              <p className="text-theme-text/80 leading-relaxed whitespace-pre-line">
                {currentDevotional.reflection}
              </p>
            </div>

            {/* Prayer */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold text-theme-text mb-3 flex items-center gap-2">
                <Heart size={20} className="text-blue-600" />
                Prayer
              </h3>
              <p className="text-theme-text/80 leading-relaxed italic whitespace-pre-line">
                {currentDevotional.prayer}
              </p>
            </div>

            {/* Action Step */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6 border border-green-200 dark:border-green-800">
              <h3 className="text-xl font-semibold text-theme-text mb-3">Action Step</h3>
              <p className="text-theme-text/80 leading-relaxed whitespace-pre-line">
                {currentDevotional.action}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              {!isRead && (
                <motion.button
                  onClick={handleMarkAsRead}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Bookmark size={20} />
                  Mark as Read
                </motion.button>
              )}
              <motion.button
                onClick={handleShare}
                className="px-6 py-3 bg-theme-surface border border-theme-border text-theme-text rounded-lg font-semibold transition-colors hover:bg-theme-surface-hover flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 size={20} />
                Share
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-theme-border">
          <button
            onClick={handlePrevious}
            className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-theme-border text-theme-text rounded-lg hover:bg-theme-surface-hover transition-colors"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <span className="text-theme-text/60 text-sm">
            {currentIndex + 1} / {devotionals.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-theme-border text-theme-text rounded-lg hover:bg-theme-surface-hover transition-colors"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

