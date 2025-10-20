import { motion } from 'framer-motion';
import { Clock, Calendar, TrendingUp, Check, Play } from 'lucide-react';

interface PlanCardProps {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  estimatedTime?: string;
  difficulty?: string;
  popularity?: number;
  isActive?: boolean;
  progress?: number;
  onStart: (planId: string) => void;
  onContinue?: (planId: string) => void;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  chronological: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700' },
  canonical: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
  topical: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700' },
  devotional: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700' },
  custom: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-700' },
};

const difficultyLabels: Record<string, { label: string; color: string }> = {
  easy: { label: 'Beginner', color: 'text-green-600 dark:text-green-400' },
  medium: { label: 'Intermediate', color: 'text-yellow-600 dark:text-yellow-400' },
  hard: { label: 'Advanced', color: 'text-red-600 dark:text-red-400' },
};

export default function PlanCard({
  id,
  name,
  description,
  duration,
  category,
  estimatedTime,
  difficulty,
  popularity,
  isActive,
  progress = 0,
  onStart,
  onContinue,
}: PlanCardProps) {
  const colors = categoryColors[category] || categoryColors.custom;
  const difficultyInfo = difficulty ? difficultyLabels[difficulty] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-theme-surface rounded-xl p-6 border-2 transition-all ${
        isActive
          ? 'border-theme-accent shadow-lg'
          : 'border-theme-border hover:border-theme-accent/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
            {isActive && (
              <span className="text-xs px-3 py-1 rounded-full font-medium bg-theme-accent/10 text-theme-accent border border-theme-accent/20">
                Active
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-theme-text mb-1">{name}</h3>
          <p className="text-sm text-theme-text/70 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Progress Bar (if active) */}
      {isActive && progress > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-theme-text/60 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-theme-bg rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-theme-accent"
            />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-theme-text/60" />
          <div>
            <p className="text-xs text-theme-text/60">Duration</p>
            <p className="text-sm font-semibold text-theme-text">{duration} days</p>
          </div>
        </div>

        {estimatedTime && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-theme-text/60" />
            <div>
              <p className="text-xs text-theme-text/60">Daily Time</p>
              <p className="text-sm font-semibold text-theme-text">{estimatedTime}</p>
            </div>
          </div>
        )}

        {difficultyInfo && (
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-theme-text/60" />
            <div>
              <p className="text-xs text-theme-text/60">Level</p>
              <p className={`text-sm font-semibold ${difficultyInfo.color}`}>
                {difficultyInfo.label}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Popularity indicator */}
      {popularity && (
        <div className="mb-4">
          <p className="text-xs text-theme-text/60 mb-1">Popular Choice</p>
          <div className="h-1.5 bg-theme-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-theme-accent to-theme-accent/60"
              style={{ width: `${popularity}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Button */}
      <motion.button
        onClick={() => (isActive && onContinue ? onContinue(id) : onStart(id))}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
          isActive
            ? 'bg-theme-accent hover:bg-theme-accent/90 text-white'
            : 'bg-theme-accent/10 hover:bg-theme-accent/20 text-theme-accent'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isActive ? (
          <>
            <Check className="w-5 h-5" />
            Continue Plan
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Start Plan
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

