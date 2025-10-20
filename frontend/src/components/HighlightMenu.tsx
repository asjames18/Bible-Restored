import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { type HighlightColor } from '../store/studyStore';

interface HighlightMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectColor: (color: HighlightColor) => void;
  currentColor?: HighlightColor;
  onRemove?: () => void;
}

const highlightColors: { color: HighlightColor; label: string; bg: string; hover: string }[] = [
  { color: 'yellow', label: 'Yellow', bg: 'bg-yellow-200', hover: 'hover:bg-yellow-300' },
  { color: 'green', label: 'Green', bg: 'bg-green-200', hover: 'hover:bg-green-300' },
  { color: 'blue', label: 'Blue', bg: 'bg-blue-200', hover: 'hover:bg-blue-300' },
  { color: 'pink', label: 'Pink', bg: 'bg-pink-200', hover: 'hover:bg-pink-300' },
  { color: 'orange', label: 'Orange', bg: 'bg-orange-200', hover: 'hover:bg-orange-300' },
];

export default function HighlightMenu({
  isOpen,
  onClose,
  onSelectColor,
  currentColor,
  onRemove,
}: HighlightMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm"
          >
            <div className="bg-theme-surface rounded-2xl shadow-2xl border border-theme-border overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-theme-border">
                <h3 className="text-lg font-semibold text-theme-text">
                  {currentColor ? 'Change Highlight' : 'Add Highlight'}
                </h3>
                <button
                  onClick={onClose}
                  className="text-theme-text/60 hover:text-theme-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Color Options */}
              <div className="p-4">
                <p className="text-sm text-theme-text/70 mb-3">Select a color:</p>
                <div className="grid grid-cols-5 gap-2">
                  {highlightColors.map(({ color, label, bg, hover }) => (
                    <motion.button
                      key={color}
                      onClick={() => {
                        onSelectColor(color);
                        onClose();
                      }}
                      className={`relative aspect-square rounded-lg ${bg} ${hover} transition-all border-2 ${
                        currentColor === color
                          ? 'border-theme-accent scale-105'
                          : 'border-transparent'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={label}
                    >
                      {currentColor === color && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-theme-accent rounded-full" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Remove Option (if already highlighted) */}
              {currentColor && onRemove && (
                <div className="p-4 border-t border-theme-border">
                  <motion.button
                    onClick={() => {
                      onRemove();
                      onClose();
                    }}
                    className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    Remove Highlight
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

