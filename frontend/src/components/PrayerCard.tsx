import { motion } from 'framer-motion';
import { MoreVertical, CheckCircle, Archive, Trash2, Edit, BookOpen, Tag } from 'lucide-react';
import { useState } from 'react';
import type { Prayer } from '../store/prayerStore';

interface PrayerCardProps {
  prayer: Prayer;
  onEdit: (prayer: Prayer) => void;
  onDelete: (id: string) => void;
  onMarkAnswered: (id: string) => void;
  onArchive: (id: string) => void;
  onNavigateToVerse?: (verseRef: string) => void;
}

const categoryColors: Record<Prayer['category'], { bg: string; text: string; border: string }> = {
  personal: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
  family: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700' },
  health: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-300 dark:border-red-700' },
  guidance: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700' },
  thanksgiving: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-300 dark:border-yellow-700' },
  other: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-700' },
};

const priorityColors: Record<Prayer['priority'], string> = {
  low: 'text-gray-500',
  medium: 'text-yellow-500',
  high: 'text-red-500',
};

export default function PrayerCard({
  prayer,
  onEdit,
  onDelete,
  onMarkAnswered,
  onArchive,
  onNavigateToVerse,
}: PrayerCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const colors = categoryColors[prayer.category];

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`bg-theme-surface rounded-xl p-4 md:p-5 border-2 transition-all ${
        prayer.status === 'answered'
          ? 'border-green-500/30 bg-green-50/5'
          : prayer.status === 'archived'
          ? 'border-theme-border/50 opacity-70'
          : 'border-theme-border hover:border-theme-accent/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {/* Category Badge */}
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
              {prayer.category}
            </span>

            {/* Priority Indicator */}
            <span className={`text-xs font-semibold ${priorityColors[prayer.priority]}`}>
              {prayer.priority === 'high' && '⚠️ High'}
              {prayer.priority === 'medium' && '📌 Medium'}
              {prayer.priority === 'low' && '➖ Low'}
            </span>

            {/* Status Badge */}
            {prayer.status === 'answered' && (
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30">
                ✓ Answered
              </span>
            )}
            {prayer.status === 'archived' && (
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-500/20 text-gray-700 dark:text-gray-300">
                Archived
              </span>
            )}
          </div>

          <h3 className="text-base md:text-lg font-semibold text-theme-text mb-2">{prayer.title}</h3>
        </div>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-theme-text/60 hover:text-theme-text transition-colors p-2 hover:bg-theme-bg rounded-lg"
          >
            <MoreVertical size={20} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-full mt-2 w-48 bg-theme-surface border border-theme-border rounded-lg shadow-xl z-20 overflow-hidden"
              >
                <button
                  onClick={() => {
                    onEdit(prayer);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-theme-bg transition-colors text-theme-text text-left"
                >
                  <Edit size={16} />
                  Edit
                </button>

                {prayer.status !== 'answered' && (
                  <button
                    onClick={() => {
                      onMarkAnswered(prayer.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-theme-bg transition-colors text-green-600 text-left"
                  >
                    <CheckCircle size={16} />
                    Mark Answered
                  </button>
                )}

                <button
                  onClick={() => {
                    onArchive(prayer.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-theme-bg transition-colors text-theme-text text-left"
                >
                  <Archive size={16} />
                  {prayer.status === 'archived' ? 'Unarchive' : 'Archive'}
                </button>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this prayer?')) {
                      onDelete(prayer.id);
                    }
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-theme-bg transition-colors text-red-600 text-left border-t border-theme-border"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-theme-text/80 mb-3 leading-relaxed">{prayer.description}</p>

      {/* Verse Reference */}
      {prayer.verseRef && (
        <div className="mb-3">
          {onNavigateToVerse ? (
            <button
              onClick={() => onNavigateToVerse(prayer.verseRef!)}
              className="flex items-center gap-2 text-sm text-theme-accent hover:underline"
            >
              <BookOpen size={14} />
              {prayer.verseRef}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-theme-accent">
              <BookOpen size={14} />
              {prayer.verseRef}
            </div>
          )}
          {prayer.verseText && (
            <p className="text-xs text-theme-text/60 italic mt-1 ml-5">"{prayer.verseText}"</p>
          )}
        </div>
      )}

      {/* Tags */}
      {prayer.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {prayer.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-xs px-2 py-1 bg-theme-bg text-theme-text/70 rounded-full"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Answer Note */}
      {prayer.answerNote && prayer.status === 'answered' && (
        <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-500/30 rounded-lg mb-3">
          <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">
            How God Answered:
          </p>
          <p className="text-sm text-green-700/80 dark:text-green-300/80">{prayer.answerNote}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-theme-text/60 pt-3 border-t border-theme-border">
        <span>Created {formatDate(prayer.createdAt)}</span>
        {prayer.answeredAt && (
          <span className="text-green-600 dark:text-green-400">
            Answered {formatDate(prayer.answeredAt)}
          </span>
        )}
      </div>
    </motion.div>
  );
}

