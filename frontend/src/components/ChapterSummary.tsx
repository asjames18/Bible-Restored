import { motion } from 'framer-motion';
import { BookText, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import chapterSummariesData from '../data/chapterSummaries.json';

interface ChapterSummaryProps {
  book: string;
  chapter: string;
}

interface ChapterSummaryData {
  summary: string;
  themes: string[];
  keyVerses: number[];
}

export default function ChapterSummary({ book, chapter }: ChapterSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Type the imported JSON data
  const summaries = chapterSummariesData as Record<string, Record<string, ChapterSummaryData>>;
  
  // Get summary for this chapter
  const chapterData = summaries[book]?.[chapter];
  
  if (!chapterData) {
    return null; // No summary available for this chapter
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-theme-accent/5 to-theme-accent/10 rounded-xl p-4 mb-6 border border-theme-accent/20"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-3 text-left"
      >
        <BookText className="w-5 h-5 text-theme-accent mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-theme-text">Chapter Summary</h3>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-theme-text/60" />
              ) : (
                <ChevronDown className="w-4 h-4 text-theme-text/60" />
              )}
            </motion.div>
          </div>
          <p className={`text-sm text-theme-text/80 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
            {chapterData.summary}
          </p>
        </div>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pl-8 space-y-3"
        >
          {/* Key Themes */}
          {chapterData.themes && chapterData.themes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-theme-text/70 mb-2 flex items-center gap-1">
                <Star className="w-3 h-3" />
                Key Themes
              </h4>
              <div className="flex flex-wrap gap-2">
                {chapterData.themes.map((theme) => (
                  <span
                    key={theme}
                    className="text-xs px-2 py-1 bg-theme-accent/10 text-theme-accent rounded-full"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Verses */}
          {chapterData.keyVerses && chapterData.keyVerses.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-theme-text/70 mb-2">
                Key Verses
              </h4>
              <p className="text-sm text-theme-text/80">
                {chapterData.keyVerses.map((v, i) => (
                  <span key={v}>
                    <span className="font-medium text-theme-accent">v{v}</span>
                    {i < chapterData.keyVerses.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

