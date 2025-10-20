import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Target, Flame, Trophy, Filter, Search, Trash2 } from 'lucide-react';
import TopBar from '../components/TopBar';
import Flashcard from '../components/Flashcard';
import { useMemoryStore, MemoryVerse } from '../store/memoryStore';
import { useBibleStore } from '../store/bibleStore';

type ViewMode = 'practice' | 'library' | 'add';
type FilterMode = 'all' | 'due' | 'mastered' | 'learning';

export default function MemoryVerses() {
  const navigate = useNavigate();
  const {
    verses,
    addVerse,
    removeVerse,
    reviewVerse,
    getVersesToReview,
    getStats,
    dailyGoal,
  } = useMemoryStore();
  
  const { bible, translationId } = useBibleStore();
  
  const [viewMode, setViewMode] = useState<ViewMode>('practice');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionComplete, setSessionComplete] = useState(false);
  
  // Add new verse form
  const [newVerseRef, setNewVerseRef] = useState('');
  const [newVerseText, setNewVerseText] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newTags, setNewTags] = useState('');
  
  const stats = getStats();
  const versesToReview = getVersesToReview();
  const currentVerse = versesToReview[currentIndex];

  useEffect(() => {
    // Check if daily goal is met
    if (stats.reviewedToday >= dailyGoal && versesToReview.length === 0) {
      setSessionComplete(true);
    }
  }, [stats.reviewedToday, dailyGoal, versesToReview.length]);

  const handleReview = (quality: number) => {
    if (!currentVerse) return;
    
    reviewVerse(currentVerse.id, quality);
    
    // Move to next verse or show completion
    if (currentIndex < versesToReview.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSessionComplete(true);
    }
  };

  const handleAddVerse = () => {
    if (!newVerseRef.trim() || !newVerseText.trim()) return;
    
    const tags = newTags.split(',').map((t) => t.trim()).filter(Boolean);
    addVerse(newVerseRef, newVerseText, translationId, newCategory, tags);
    
    // Reset form
    setNewVerseRef('');
    setNewVerseText('');
    setNewCategory('');
    setNewTags('');
    setViewMode('library');
  };

  const getFilteredVerses = (): MemoryVerse[] => {
    let filtered = verses;
    
    // Apply filter
    switch (filterMode) {
      case 'due':
        filtered = versesToReview;
        break;
      case 'mastered':
        filtered = verses.filter((v) => v.mastered);
        break;
      case 'learning':
        filtered = verses.filter((v) => !v.mastered);
        break;
      default:
        filtered = verses;
    }
    
    // Apply search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.verseRef.toLowerCase().includes(lower) ||
          v.verseText.toLowerCase().includes(lower) ||
          v.tags.some((t) => t.toLowerCase().includes(lower)) ||
          (v.category && v.category.toLowerCase().includes(lower))
      );
    }
    
    return filtered;
  };

  const filteredVerses = getFilteredVerses();

  const handleDeleteVerse = (id: string, ref: string) => {
    if (confirm(`Are you sure you want to remove ${ref} from your memory verses?`)) {
      removeVerse(id);
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg pb-20">
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-theme-text/60 hover:text-theme-text">
              <X size={24} />
            </button>
            <h1 className="text-2xl font-bold text-theme-text">Memory Verses</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('library')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'library'
                  ? 'bg-theme-accent text-white'
                  : 'bg-theme-surface text-theme-text border border-theme-border'
              }`}
            >
              Library
            </button>
            <button
              onClick={() => setViewMode('practice')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'practice'
                  ? 'bg-theme-accent text-white'
                  : 'bg-theme-surface text-theme-text border border-theme-border'
              }`}
            >
              Practice
            </button>
            <button
              onClick={() => setViewMode('add')}
              className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              title="Add Verse"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-theme-surface rounded-lg p-4 border border-theme-border">
            <div className="flex items-center gap-2 text-theme-text/60 text-sm mb-1">
              <Target size={16} />
              Total
            </div>
            <div className="text-2xl font-bold text-theme-text">{stats.total}</div>
          </div>
          
          <div className="bg-theme-surface rounded-lg p-4 border border-theme-border">
            <div className="flex items-center gap-2 text-orange-600 text-sm mb-1">
              <Flame size={16} />
              Due Today
            </div>
            <div className="text-2xl font-bold text-theme-text">{stats.dueToday}</div>
          </div>
          
          <div className="bg-theme-surface rounded-lg p-4 border border-theme-border">
            <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
              <Trophy size={16} />
              Mastered
            </div>
            <div className="text-2xl font-bold text-theme-text">{stats.mastered}</div>
          </div>
          
          <div className="bg-theme-surface rounded-lg p-4 border border-theme-border">
            <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
              <Flame size={16} />
              Streak
            </div>
            <div className="text-2xl font-bold text-theme-text">{stats.streak}d</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-theme-text/60 mb-2">
            <span>Daily Goal: {stats.reviewedToday} / {dailyGoal}</span>
            <span>{Math.round((stats.reviewedToday / dailyGoal) * 100)}%</span>
          </div>
          <div className="h-3 bg-theme-surface rounded-full overflow-hidden border border-theme-border">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((stats.reviewedToday / dailyGoal) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-theme-accent to-green-500"
            />
          </div>
        </div>

        {/* Practice Mode */}
        {viewMode === 'practice' && (
          <div>
            {sessionComplete || versesToReview.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl p-8 text-center border-2 border-green-500/30"
              >
                <Trophy size={64} className="mx-auto text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-theme-text mb-2">Great Job!</h2>
                <p className="text-theme-text/70 mb-6">
                  {versesToReview.length === 0
                    ? "No verses due for review today. Check back tomorrow!"
                    : "You've completed today's review session!"}
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setViewMode('library')}
                    className="px-6 py-3 bg-theme-accent hover:bg-theme-accent-dark text-white rounded-lg transition-colors"
                  >
                    View Library
                  </button>
                  <button
                    onClick={() => setViewMode('add')}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Add More Verses
                  </button>
                </div>
              </motion.div>
            ) : (
              <div>
                <div className="text-center text-theme-text/60 text-sm mb-4">
                  Verse {currentIndex + 1} of {versesToReview.length}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentVerse?.id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentVerse && (
                      <Flashcard
                        verse={currentVerse}
                        onReview={handleReview}
                        onSkip={() => {
                          if (currentIndex < versesToReview.length - 1) {
                            setCurrentIndex(currentIndex + 1);
                          }
                        }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* Library Mode */}
        {viewMode === 'library' && (
          <div>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text/60" size={20} />
                <input
                  type="text"
                  placeholder="Search verses..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-theme-surface border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text/60" size={20} />
                <select
                  className="w-full sm:w-40 pl-10 pr-4 py-2 rounded-lg bg-theme-surface border border-theme-border text-theme-text appearance-none focus:outline-none focus:ring-2 focus:ring-theme-accent"
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value as FilterMode)}
                >
                  <option value="all">All Verses</option>
                  <option value="due">Due Today</option>
                  <option value="learning">Learning</option>
                  <option value="mastered">Mastered</option>
                </select>
              </div>
            </div>

            {/* Verses List */}
            {filteredVerses.length === 0 ? (
              <div className="text-center py-12 text-theme-text/60">
                <p className="mb-4">No verses found.</p>
                <button
                  onClick={() => setViewMode('add')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Your First Verse
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVerses.map((verse) => (
                  <motion.div
                    key={verse.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-theme-surface rounded-lg p-4 border border-theme-border hover:border-theme-accent transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-theme-accent">{verse.verseRef}</h3>
                          {verse.mastered && (
                            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-600 rounded-full flex items-center gap-1">
                              <Trophy size={12} />
                              Mastered
                            </span>
                          )}
                          {verse.category && (
                            <span className="text-xs px-2 py-0.5 bg-theme-primary/10 text-theme-primary rounded-full">
                              {verse.category}
                            </span>
                          )}
                        </div>
                        <p className="text-theme-text/80 text-sm line-clamp-2 mb-2">
                          "{verse.verseText}"
                        </p>
                        <div className="flex items-center gap-4 text-xs text-theme-text/50">
                          <span>Reviews: {verse.reviewCount}</span>
                          <span>Next: {new Date(verse.nextReview).toLocaleDateString()}</span>
                          <span>Interval: {verse.interval}d</span>
                        </div>
                        {verse.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {verse.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 bg-theme-primary/5 text-theme-primary rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteVerse(verse.id, verse.verseRef)}
                        className="ml-4 text-red-500 hover:text-red-600 transition-colors"
                        title="Delete verse"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Verse Mode */}
        {viewMode === 'add' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-theme-surface rounded-lg p-6 border border-theme-border"
          >
            <h2 className="text-xl font-semibold text-theme-text mb-4">Add New Verse</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-theme-text mb-2">
                  Verse Reference <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., John 3:16"
                  className="w-full px-4 py-2 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                  value={newVerseRef}
                  onChange={(e) => setNewVerseRef(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-theme-text mb-2">
                  Verse Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter the verse text..."
                  className="w-full px-4 py-2 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent resize-none"
                  rows={4}
                  value={newVerseText}
                  onChange={(e) => setNewVerseText(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-theme-text mb-2">
                  Category (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Prayer, Faith, Love"
                  className="w-full px-4 py-2 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-theme-text mb-2">
                  Tags (optional, comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., encouragement, promises, wisdom"
                  className="w-full px-4 py-2 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddVerse}
                  disabled={!newVerseRef.trim() || !newVerseText.trim()}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
                >
                  Add Verse
                </button>
                <button
                  onClick={() => setViewMode('library')}
                  className="px-6 py-3 bg-theme-bg border border-theme-border text-theme-text rounded-lg hover:bg-theme-surface transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

