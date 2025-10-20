import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Trash2, BookOpen, ArrowLeft, TrendingUp, Flame } from 'lucide-react';
import { useHistoryStore } from '../store/historyStore';
import { useBibleStore } from '../store/bibleStore';
import TopBar from '../components/TopBar';

export default function History() {
  const navigate = useNavigate();
  const { translationId } = useBibleStore();
  const { 
    getHistory, 
    clearHistory, 
    removeHistoryEntry,
    getReadingStreak,
    getMostReadBooks 
  } = useHistoryStore();
  
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const history = getHistory();
  const streak = getReadingStreak();
  const mostReadBooks = getMostReadBooks(5);

  const handleVerseClick = (book: string, chapter: string, verse?: string) => {
    const path = verse
      ? `/${translationId}/${book}/${chapter}/${verse}`
      : `/${translationId}/${book}/${chapter}`;
    navigate(path);
  };

  const handleClearHistory = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const groupByDate = (entries: typeof history) => {
    const groups = new Map<string, typeof history>();
    
    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const dateKey = date.toDateString();
      
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(entry);
    });

    return Array.from(groups.entries());
  };

  const groupedHistory = groupByDate(history);

  return (
    <div className="min-h-screen bg-theme-bg pb-20">
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-theme-text/60 hover:text-theme-text transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-theme-text">Reading History</h1>
            <p className="text-theme-text/60 text-sm">{history.length} readings tracked</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-red-500 hover:text-red-600 text-sm transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Stats Grid */}
        {history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Reading Streak */}
            <div className="bg-theme-surface rounded-xl p-4 border border-theme-border">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-semibold text-theme-text">Current Streak</h3>
              </div>
              <p className="text-3xl font-bold text-theme-accent">{streak.currentStreak}</p>
              <p className="text-xs text-theme-text/60 mt-1">
                Longest: {streak.longestStreak} days
              </p>
            </div>

            {/* Total Readings */}
            <div className="bg-theme-surface rounded-xl p-4 border border-theme-border">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-semibold text-theme-text">Total Readings</h3>
              </div>
              <p className="text-3xl font-bold text-theme-accent">{history.length}</p>
              <p className="text-xs text-theme-text/60 mt-1">All time</p>
            </div>

            {/* Most Read Books */}
            <div className="bg-theme-surface rounded-xl p-4 border border-theme-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="text-sm font-semibold text-theme-text">Top Books</h3>
              </div>
              <div className="space-y-1 mt-2">
                {mostReadBooks.slice(0, 3).map((item, index) => (
                  <div key={item.book} className="flex items-center justify-between text-xs">
                    <span className="text-theme-text/80 truncate">
                      {index + 1}. {item.book}
                    </span>
                    <span className="text-theme-accent font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History List */}
        {history.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-16 h-16 mx-auto text-theme-text/20 mb-4" />
            <p className="text-theme-text/60">
              No reading history yet. Start reading to build your history!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedHistory.map(([dateKey, entries]) => (
              <div key={dateKey}>
                <h3 className="text-sm font-semibold text-theme-text/80 mb-3 sticky top-0 bg-theme-bg py-2">
                  {new Date(dateKey).toDateString() === new Date().toDateString()
                    ? 'Today'
                    : new Date(dateKey).toDateString() === new Date(Date.now() - 86400000).toDateString()
                    ? 'Yesterday'
                    : new Date(dateKey).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric' 
                      })}
                </h3>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-theme-surface border border-theme-border rounded-xl p-4 hover:border-theme-accent transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => handleVerseClick(entry.book, entry.chapter, entry.verse)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="w-4 h-4 text-theme-accent" />
                            <h4 className="font-semibold text-theme-accent">
                              {entry.verseRef}
                            </h4>
                          </div>
                          <p className="text-theme-text/60 text-sm">
                            {formatTimeAgo(entry.timestamp)}
                          </p>
                        </div>
                        <motion.button
                          onClick={() => removeHistoryEntry(entry.id)}
                          className="text-theme-text/40 hover:text-red-500 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Remove from history"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowClearConfirm(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="bg-theme-surface rounded-2xl shadow-2xl border border-theme-border p-6">
              <h3 className="text-lg font-semibold text-theme-text mb-2">
                Clear All History?
              </h3>
              <p className="text-theme-text/70 text-sm mb-6">
                This will permanently delete your reading history and statistics. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 px-4 bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text rounded-lg font-medium transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleClearHistory}
                  className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  Clear History
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

