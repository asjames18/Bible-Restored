import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { useBibleStore } from '../store/bibleStore';

interface ComparisonWidgetProps {
  verseRef: string; // e.g., "John 3:16"
  onClose: () => void;
}

interface TranslationVerse {
  translation: string;
  translationName: string;
  text: string;
}

const AVAILABLE_TRANSLATIONS = [
  { id: 'restored_kjv', name: 'Restored KJV' },
  { id: 'kjv', name: 'King James Version' },
  { id: 'niv', name: 'New International Version' },
  { id: 'esv', name: 'English Standard Version' },
  { id: 'nlt', name: 'New Living Translation' },
];

export default function ComparisonWidget({ verseRef, onClose }: ComparisonWidgetProps) {
  const [verses, setVerses] = useState<TranslationVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>([
    'restored_kjv',
    'kjv',
    'niv',
  ]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadVerses();
  }, [verseRef, selectedTranslations]);

  const loadVerses = async () => {
    setIsLoading(true);
    const loadedVerses: TranslationVerse[] = [];

    // Parse verse reference
    const [bookChapter, verseNum] = verseRef.split(':');
    const parts = bookChapter.split(' ');
    const chapter = parts.pop() || '1';
    const book = parts.join(' ');

    for (const translationId of selectedTranslations) {
      try {
        const response = await fetch(`/translations/${translationId}.json`);
        if (!response.ok) {
          console.error(`Failed to load ${translationId}`);
          continue;
        }

        const data = await response.json();
        const verseText = data[book]?.[chapter]?.[verseNum];

        if (verseText) {
          const translationName =
            AVAILABLE_TRANSLATIONS.find((t) => t.id === translationId)?.name || translationId;
          loadedVerses.push({
            translation: translationId,
            translationName,
            text: verseText,
          });
        }
      } catch (error) {
        console.error(`Error loading ${translationId}:`, error);
      }
    }

    setVerses(loadedVerses);
    setIsLoading(false);
  };

  const handleToggleTranslation = (translationId: string) => {
    setSelectedTranslations((prev) => {
      if (prev.includes(translationId)) {
        // Don't allow removing if it's the only one selected
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== translationId);
      } else {
        return [...prev, translationId];
      }
    });
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleCopyAll = async () => {
    const allText = verses
      .map((v) => `${v.translationName} (${verseRef})\n"${v.text}"`)
      .join('\n\n');
    
    try {
      await navigator.clipboard.writeText(allText);
      setCopiedIndex(-1);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-theme-surface rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-theme-border">
            <div>
              <h3 className="text-xl font-semibold text-theme-text">Compare Translations</h3>
              <p className="text-sm text-theme-text/60 mt-1">{verseRef}</p>
            </div>
            <button onClick={onClose} className="text-theme-text/60 hover:text-theme-text">
              <X size={24} />
            </button>
          </div>

          {/* Translation Selector */}
          <div className="px-6 py-4 border-b border-theme-border">
            <p className="text-sm text-theme-text/60 mb-3">Select translations to compare:</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TRANSLATIONS.map((trans) => (
                <button
                  key={trans.id}
                  onClick={() => handleToggleTranslation(trans.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedTranslations.includes(trans.id)
                      ? 'bg-theme-accent text-white'
                      : 'bg-theme-bg text-theme-text border border-theme-border hover:bg-theme-surface'
                  }`}
                >
                  {trans.name}
                </button>
              ))}
            </div>
          </div>

          {/* Verses List */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-12 text-theme-text/60">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-theme-accent border-t-transparent mx-auto mb-4" />
                Loading translations...
              </div>
            ) : verses.length === 0 ? (
              <div className="text-center py-12 text-theme-text/60">
                <p>No translations found for this verse.</p>
                <p className="text-sm mt-2">Try selecting different translations above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {verses.map((verse, index) => (
                  <motion.div
                    key={verse.translation}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-theme-bg rounded-lg p-4 border border-theme-border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-theme-accent">{verse.translationName}</h4>
                        <p className="text-xs text-theme-text/50 mt-0.5">{verse.translation}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(verse.text, index)}
                        className="p-2 hover:bg-theme-surface rounded-lg transition-colors"
                        title="Copy verse"
                      >
                        {copiedIndex === index ? (
                          <Check size={18} className="text-green-500" />
                        ) : (
                          <Copy size={18} className="text-theme-text/60" />
                        )}
                      </button>
                    </div>
                    <p className="text-theme-text leading-relaxed">"{verse.text}"</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {verses.length > 0 && (
            <div className="px-6 py-4 border-t border-theme-border flex items-center justify-between">
              <p className="text-sm text-theme-text/60">
                {verses.length} translation{verses.length !== 1 ? 's' : ''} loaded
              </p>
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-2 px-4 py-2 bg-theme-accent hover:bg-theme-accent-dark text-white rounded-lg transition-colors"
              >
                {copiedIndex === -1 ? (
                  <>
                    <Check size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy All
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

