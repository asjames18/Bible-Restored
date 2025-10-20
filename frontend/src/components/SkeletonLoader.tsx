import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'verse' | 'card' | 'text' | 'line' | 'circle';
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ variant = 'verse', count = 1, className = '' }: SkeletonLoaderProps) {
  const skeletons = Array.from({ length: count });

  const renderSkeleton = () => {
    switch (variant) {
      case 'verse':
        return (
          <div className={`space-y-3 ${className}`}>
            {skeletons.map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3"
              >
                {/* Verse number */}
                <div className="w-8 h-6 bg-theme-surface rounded animate-pulse" />
                {/* Verse text - multiple lines */}
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-theme-surface rounded animate-pulse w-full" />
                  <div className="h-4 bg-theme-surface rounded animate-pulse w-5/6" />
                  {index % 3 === 0 && <div className="h-4 bg-theme-surface rounded animate-pulse w-4/5" />}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'card':
        return (
          <div className={`space-y-4 ${className}`}>
            {skeletons.map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-theme-surface rounded-lg p-4 border border-theme-border"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-theme-bg rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-theme-bg rounded animate-pulse w-1/3" />
                    <div className="h-3 bg-theme-bg rounded animate-pulse w-1/4" />
                  </div>
                </div>
                {/* Content */}
                <div className="space-y-2">
                  <div className="h-3 bg-theme-bg rounded animate-pulse w-full" />
                  <div className="h-3 bg-theme-bg rounded animate-pulse w-5/6" />
                  <div className="h-3 bg-theme-bg rounded animate-pulse w-4/5" />
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            {skeletons.map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="h-4 bg-theme-surface rounded animate-pulse"
                style={{ width: `${Math.random() * 20 + 70}%` }}
              />
            ))}
          </div>
        );

      case 'line':
        return (
          <div className={`space-y-3 ${className}`}>
            {skeletons.map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="h-3 bg-theme-surface rounded animate-pulse w-full"
              />
            ))}
          </div>
        );

      case 'circle':
        return (
          <div className={`flex gap-3 ${className}`}>
            {skeletons.map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="w-12 h-12 bg-theme-surface rounded-full animate-pulse"
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return <>{renderSkeleton()}</>;
}

// Specialized skeleton loaders
export function VersesSkeleton({ count = 10 }: { count?: number }) {
  return <SkeletonLoader variant="verse" count={count} />;
}

export function CardsSkeleton({ count = 3 }: { count?: number }) {
  return <SkeletonLoader variant="card" count={count} />;
}

export function TextSkeleton({ count = 5 }: { count?: number }) {
  return <SkeletonLoader variant="text" count={count} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-8 bg-theme-surface rounded animate-pulse w-1/3" />
        <div className="h-4 bg-theme-surface rounded animate-pulse w-1/4" />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-theme-surface rounded-lg p-4 border border-theme-border">
            <div className="h-3 bg-theme-bg rounded animate-pulse w-2/3 mb-2" />
            <div className="h-6 bg-theme-bg rounded animate-pulse w-1/2" />
          </div>
        ))}
      </div>
      
      {/* Content */}
      <VersesSkeleton count={8} />
    </div>
  );
}

