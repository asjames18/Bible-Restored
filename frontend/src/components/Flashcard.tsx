import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check, X, Star, Eye, EyeOff } from 'lucide-react';
import type { MemoryVerse } from '../store/memoryStore';

interface FlashcardProps {
  verse: MemoryVerse;
  onReview: (quality: number) => void;
  onSkip?: () => void;
  showStats?: boolean;
}

export default function Flashcard({ verse, onReview, onSkip, showStats = true }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReview = (quality: number) => {
    onReview(quality);
    setIsFlipped(false);
    setShowHint(false);
  };

  // Extract first few words as hint
  const getHint = () => {
    const words = verse.verseText.split(' ');
    return words.slice(0, Math.min(3, words.length)).join(' ') + '...';
  };

  const getDifficultyLabel = (quality: number) => {
    switch (quality) {
      case 0:
      case 1:
      case 2:
        return 'Again';
      case 3:
        return 'Hard';
      case 4:
        return 'Good';
      case 5:
        return 'Easy';
      default:
        return '';
    }
  };

  const getDifficultyColor = (quality: number) => {
    if (quality <= 2) return 'bg-red-500 hover:bg-red-600';
    if (quality === 3) return 'bg-orange-500 hover:bg-orange-600';
    if (quality === 4) return 'bg-green-500 hover:bg-green-600';
    return 'bg-blue-500 hover:bg-blue-600';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stats Bar */}
      {showStats && (
        <div className="flex items-center justify-between text-sm text-theme-text/70 mb-4 px-2">
          <div className="flex items-center gap-4">
            <span>Reviews: {verse.reviewCount}</span>
            <span>Interval: {verse.interval}d</span>
            {verse.mastered && (
              <span className="flex items-center gap-1 text-theme-accent">
                <Star size={14} className="fill-current" />
                Mastered
              </span>
            )}
          </div>
          {verse.category && (
            <span className="bg-theme-primary/10 text-theme-primary px-2 py-1 rounded-full text-xs">
              {verse.category}
            </span>
          )}
        </div>
      )}

      {/* Flashcard */}
      <div className="perspective-1000">
        <motion.div
          className="relative h-96 cursor-pointer"
          onClick={handleFlip}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side - Reference */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-theme-accent to-theme-accent-dark rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">{verse.verseRef}</h2>
              <p className="text-white/80 text-lg mb-6">Try to recall the verse</p>
              
              {/* Hint Button */}
              {!showHint ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHint(true);
                  }}
                  className="flex items-center gap-2 mx-auto px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                >
                  <Eye size={18} />
                  Show Hint
                </button>
              ) : (
                <div className="bg-white/20 rounded-lg p-4 max-w-md">
                  <div className="flex items-center gap-2 justify-center text-white/80 text-sm mb-2">
                    <EyeOff size={16} />
                    Hint
                  </div>
                  <p className="text-white text-lg italic">"{getHint()}"</p>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-8 text-white/60 text-sm">
              Click to reveal
            </div>
          </div>

          {/* Back Side - Verse Text */}
          <div
            className="absolute inset-0 bg-theme-surface rounded-2xl shadow-2xl flex flex-col p-8 border-2 border-theme-border"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <h3 className="text-2xl font-bold text-theme-accent mb-4">{verse.verseRef}</h3>
              <p className="text-lg text-theme-text leading-relaxed mb-4">
                "{verse.verseText}"
              </p>
              <p className="text-sm text-theme-text/60">— {verse.translation}</p>
            </div>
            
            <div className="text-theme-text/60 text-sm text-center">
              Click to flip back
            </div>
          </div>
        </motion.div>
      </div>

      {/* Review Buttons - Only show when flipped */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <p className="text-center text-theme-text/70 text-sm mb-4">
              How well did you remember this verse?
            </p>
            
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[2, 3, 4, 5].map((quality) => (
                <motion.button
                  key={quality}
                  onClick={() => handleReview(quality)}
                  className={`px-4 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${getDifficultyColor(
                    quality
                  )}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-xs mb-1">{getDifficultyLabel(quality)}</div>
                  <div className="text-lg">
                    {quality === 2 && <X size={20} className="mx-auto" />}
                    {quality === 3 && '😐'}
                    {quality === 4 && <Check size={20} className="mx-auto" />}
                    {quality === 5 && '😊'}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setShowHint(false);
                }}
                className="flex-1 px-4 py-2 bg-theme-surface border border-theme-border text-theme-text rounded-lg hover:bg-theme-surface-hover transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                Flip Back
              </button>
              
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="px-4 py-2 bg-theme-surface border border-theme-border text-theme-text/60 rounded-lg hover:bg-theme-surface-hover transition-colors"
                >
                  Skip
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tags */}
      {verse.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {verse.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-theme-primary/10 text-theme-primary rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

