import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBibleStore } from '../store/bibleStore';
import crossRefData from '../data/crossReferences.json';

interface CrossReference {
  ref: string;
  text: string;
  relationship: string;
}

interface CrossRefPanelProps {
  verseRef: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CrossRefPanel({ verseRef, isOpen, onClose }: CrossRefPanelProps) {
  const navigate = useNavigate();
  const { translationId, setRef } = useBibleStore();

  // Get cross-references for this verse
  const references = (crossRefData.crossReferences as Record<string, CrossReference[]>)[verseRef] || [];
  const relationshipTypes = crossRefData.relationshipTypes as Record<string, { label: string; icon: string; color: string }>;

  const handleNavigate = (ref: string) => {
    // Parse reference (e.g., "John 3:16")
    const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (match) {
      const [, book, chapter, verse] = match;
      setRef(book, chapter, verse);
      navigate(`/${translationId}/${book}/${chapter}/${verse}`);
      onClose();
    }
  };

  const getRelationshipColor = (relationship: string) => {
    const type = relationshipTypes[relationship];
    if (!type) return 'bg-gray-500';

    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500',
      gray: 'bg-gray-500',
      teal: 'bg-teal-500',
    };

    return colorMap[type.color] || 'bg-gray-500';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-theme-surface rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-theme-surface border-b border-theme-border p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-theme-accent/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-theme-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-theme-text">Cross References</h3>
                <p className="text-sm text-theme-text/60">{verseRef}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-theme-text/60 hover:text-theme-text transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(80vh-5rem)]">
            {references.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-theme-text/20 mx-auto mb-4" />
                <p className="text-theme-text/60">No cross-references available for this verse yet.</p>
                <p className="text-sm text-theme-text/40 mt-2">
                  Check back soon as we continue adding more connections!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {references.map((crossRef, index) => {
                  const relType = relationshipTypes[crossRef.relationship];
                  return (
                    <motion.div
                      key={`${crossRef.ref}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-theme-bg rounded-lg p-4 border border-theme-border hover:border-theme-accent/50 transition-all cursor-pointer group"
                      onClick={() => handleNavigate(crossRef.ref)}
                    >
                      {/* Relationship Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium text-white ${getRelationshipColor(
                            crossRef.relationship
                          )}`}
                        >
                          {relType?.icon} {relType?.label || crossRef.relationship}
                        </span>
                        <ExternalLink
                          size={16}
                          className="text-theme-text/40 group-hover:text-theme-accent transition-colors"
                        />
                      </div>

                      {/* Reference */}
                      <h4 className="text-base font-semibold text-theme-accent mb-2 group-hover:underline">
                        {crossRef.ref}
                      </h4>

                      {/* Text Preview */}
                      <p className="text-sm text-theme-text/80 italic leading-relaxed">
                        "{crossRef.text}..."
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Footer Info */}
            {references.length > 0 && (
              <div className="mt-6 p-3 bg-theme-bg/50 rounded-lg border border-theme-border">
                <p className="text-xs text-theme-text/60 text-center">
                  💡 Click any reference to navigate to that verse
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

