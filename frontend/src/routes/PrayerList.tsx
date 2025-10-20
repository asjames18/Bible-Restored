import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Search, Filter, Heart, CheckCircle, Archive as ArchiveIcon } from 'lucide-react';
import TopBar from '../components/TopBar';
import PrayerCard from '../components/PrayerCard';
import { usePrayerStore, type Prayer } from '../store/prayerStore';
import { useBibleStore } from '../store/bibleStore';

export default function PrayerList() {
  const navigate = useNavigate();
  const {
    prayers,
    addPrayer,
    updatePrayer,
    deletePrayer,
    markAsAnswered,
    archivePrayer,
    unarchivePrayer,
    getPrayerStats,
    searchPrayers,
    getPrayersByStatus,
  } = usePrayerStore();
  const { setRef, translationId } = useBibleStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Prayer['status']>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | Prayer['category']>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<Prayer | null>(null);

  const stats = getPrayerStats();

  // Filter prayers
  const filteredPrayers = (() => {
    let result = prayers;

    // Search filter
    if (searchTerm) {
      result = searchPrayers(searchTerm);
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter((p) => p.status === filterStatus);
    }

    // Category filter
    if (filterCategory !== 'all') {
      result = result.filter((p) => p.category === filterCategory);
    }

    // Sort by priority and date
    return result.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.updatedAt - a.updatedAt;
    });
  })();

  const handleNavigateToVerse = (verseRef: string) => {
    // Parse verse reference (e.g., "John 3:16")
    const match = verseRef.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (match) {
      const [, book, chapter, verse] = match;
      setRef(book, chapter, verse);
      navigate(`/${translationId}/${book}/${chapter}/${verse}`);
    }
  };

  const handleEdit = (prayer: Prayer) => {
    setEditingPrayer(prayer);
    setShowAddModal(true);
  };

  const handleArchiveToggle = (id: string) => {
    const prayer = prayers.find((p) => p.id === id);
    if (prayer) {
      if (prayer.status === 'archived') {
        unarchivePrayer(id);
      } else {
        archivePrayer(id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg pb-20">
      <TopBar />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-theme-text/60 hover:text-theme-text transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-theme-text">Prayer List</h1>
            <p className="text-theme-text/60 text-sm">Track your prayer requests and answered prayers</p>
          </div>
          <button
            onClick={() => {
              setEditingPrayer(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-theme-accent text-white rounded-lg font-semibold hover:bg-theme-accent/90 transition-colors"
          >
            <Plus size={20} />
            <span className="hidden md:inline">Add Prayer</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-theme-surface rounded-xl p-4 border border-theme-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-theme-text">{stats.active}</p>
                <p className="text-xs text-theme-text/60">Active</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-theme-surface rounded-xl p-4 border border-theme-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-theme-text">{stats.answered}</p>
                <p className="text-xs text-theme-text/60">Answered</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-theme-surface rounded-xl p-4 border border-theme-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-500/10 rounded-lg flex items-center justify-center">
                <ArchiveIcon className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-theme-text">{stats.archived}</p>
                <p className="text-xs text-theme-text/60">Archived</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-theme-surface rounded-xl p-4 border border-theme-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-theme-accent/10 rounded-lg flex items-center justify-center">
                <span className="text-lg">🙏</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-theme-text">{stats.total}</p>
                <p className="text-xs text-theme-text/60">Total</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text/60" size={20} />
            <input
              type="text"
              placeholder="Search prayers..."
              className="w-full pl-10 pr-4 py-2 rounded-md bg-theme-surface border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text/60" size={20} />
            <select
              className="w-full md:w-40 pl-10 pr-4 py-2 rounded-md bg-theme-surface border border-theme-border text-theme-text appearance-none focus:outline-none focus:ring-2 focus:ring-theme-accent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="answered">Answered</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              className="w-full md:w-40 px-4 py-2 rounded-md bg-theme-surface border border-theme-border text-theme-text appearance-none focus:outline-none focus:ring-2 focus:ring-theme-accent"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
            >
              <option value="all">All Categories</option>
              <option value="personal">Personal</option>
              <option value="family">Family</option>
              <option value="health">Health</option>
              <option value="guidance">Guidance</option>
              <option value="thanksgiving">Thanksgiving</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Prayer List */}
        {filteredPrayers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-theme-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-theme-accent" />
            </div>
            <h3 className="text-xl font-semibold text-theme-text mb-2">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'No prayers found'
                : 'No prayers yet'}
            </h3>
            <p className="text-theme-text/60 mb-6">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your filters'
                : 'Start tracking your prayer requests and see how God answers'}
            </p>
            {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-theme-accent text-white rounded-lg font-semibold hover:bg-theme-accent/90 transition-colors"
              >
                Add Your First Prayer
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredPrayers.map((prayer) => (
                <PrayerCard
                  key={prayer.id}
                  prayer={prayer}
                  onEdit={handleEdit}
                  onDelete={deletePrayer}
                  onMarkAnswered={markAsAnswered}
                  onArchive={handleArchiveToggle}
                  onNavigateToVerse={handleNavigateToVerse}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* TODO: Add Prayer Modal - will be added in a follow-up */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-theme-surface rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-theme-text mb-4">
              {editingPrayer ? 'Edit Prayer' : 'Add New Prayer'}
            </h3>
            <p className="text-theme-text/60 mb-4">
              Prayer form modal will be implemented in the next update.
            </p>
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingPrayer(null);
              }}
              className="w-full px-4 py-2 bg-theme-accent text-white rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

