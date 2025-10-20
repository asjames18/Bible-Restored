import { motion, AnimatePresence } from 'framer-motion';
import { Lock, TrendingUp } from 'lucide-react';
import type { Achievement } from '../store/readingPlanStore';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export default function AchievementBadge({
  achievement,
  size = 'md',
  showProgress = true,
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: {
      container: 'p-3',
      icon: 'text-2xl',
      title: 'text-sm',
      description: 'text-xs',
      progress: 'text-xs',
    },
    md: {
      container: 'p-4',
      icon: 'text-3xl',
      title: 'text-base',
      description: 'text-sm',
      progress: 'text-sm',
    },
    lg: {
      container: 'p-6',
      icon: 'text-5xl',
      title: 'text-lg',
      description: 'text-base',
      progress: 'text-base',
    },
  };

  const classes = sizeClasses[size];
  const progressPercentage = Math.min(
    100,
    Math.round((achievement.progress / achievement.requirement) * 100)
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative bg-theme-surface rounded-xl border-2 ${
        achievement.unlocked
          ? 'border-theme-accent shadow-lg'
          : 'border-theme-border'
      } ${classes.container} transition-all`}
    >
      {/* Unlocked Badge */}
      {achievement.unlocked && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-theme-accent rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-white text-sm">✓</span>
        </motion.div>
      )}

      {/* Locked Overlay */}
      {!achievement.unlocked && (
        <div className="absolute inset-0 bg-theme-bg/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <Lock className="w-8 h-8 text-theme-text/40" />
        </div>
      )}

      {/* Icon */}
      <div className="text-center mb-3">
        <span className={`${classes.icon} ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
          {achievement.icon}
        </span>
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className={`font-bold text-theme-text ${classes.title} mb-1`}>
          {achievement.name}
        </h3>
        <p className={`text-theme-text/70 ${classes.description} leading-relaxed`}>
          {achievement.description}
        </p>
      </div>

      {/* Progress (if not unlocked and showProgress is true) */}
      {!achievement.unlocked && showProgress && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-theme-text/60 ${classes.progress}`}>
              Progress
            </span>
            <span className={`text-theme-accent font-semibold ${classes.progress}`}>
              {achievement.progress}/{achievement.requirement}
            </span>
          </div>
          <div className="h-2 bg-theme-bg rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-theme-accent"
            />
          </div>
        </div>
      )}

      {/* Unlocked Date */}
      {achievement.unlocked && achievement.unlockedAt && (
        <div className="mt-3 pt-3 border-t border-theme-border">
          <p className="text-xs text-theme-text/60 text-center">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </motion.div>
  );
}

// Achievement Showcase Component (for displaying multiple achievements in a row)
export function AchievementShowcase({
  achievements,
  title = 'Achievements',
  limit,
}: {
  achievements: Achievement[];
  title?: string;
  limit?: number;
}) {
  const displayAchievements = limit
    ? achievements.slice(0, limit)
    : achievements;

  return (
    <div className="bg-theme-surface rounded-xl p-6 border border-theme-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-theme-accent" />
          <h3 className="text-lg font-semibold text-theme-text">{title}</h3>
        </div>
        <span className="text-sm text-theme-text/60">
          {achievements.filter((a) => a.unlocked).length}/{achievements.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayAchievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            size="sm"
            showProgress={false}
          />
        ))}
      </div>

      {limit && achievements.length > limit && (
        <div className="mt-4 text-center">
          <span className="text-sm text-theme-text/60">
            +{achievements.length - limit} more achievements
          </span>
        </div>
      )}
    </div>
  );
}

