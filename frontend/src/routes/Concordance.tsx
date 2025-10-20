import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, BookOpen, TrendingUp } from 'lucide-react';
import TopBar from '../components/TopBar';
import { useBibleStore } from '../store/bibleStore';

interface SearchResult {
  book: string;
  chapter: string;
  verse: string;
  text: string;
  matches: number;
}

export default function Concordance() {
  const navigate = useNavigate();
  const { bibleData, translationId, setRef } = useBibleStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalOccurrences, setTotalOccurrences] = useState(0);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim() || !bibleData) return;

    setIsSearching(true);
    setSearchPerformed(true);
    const searchResults: SearchResult[] = [];
    let totalCount = 0;

    // Search through all books
    Object.entries(bibleData).forEach(([bookName, chapters]: [string, any]) => {
      if (bookName === 'metadata') return;

      Object.entries(chapters).forEach(([chapterNum, verses]: [string, any]) => {
        Object.entries(verses).forEach(([verseNum, verseText]: [string, any]) => {
          const text = String(verseText).toLowerCase();
          const search = searchTerm.toLowerCase();

          // Count occurrences in this verse
          const regex = new RegExp(`\\b${search}\\b`, 'gi');
          const matches = (text.match(regex) || []).length;

          if (matches > 0) {
            totalCount += matches;
            searchResults.push({
              book: bookName,
              chapter: chapterNum,
              verse: verseNum,
              text: String(verseText),
              matches,
            });
          }
        });
      });
    });

    setResults(searchResults);
    setTotalOccurrences(totalCount);
    setIsSearching(false);
  };

  const handleNavigateToVerse = (book: string, chapter: string, verse: string) => {
    setRef(book, chapter, verse);
    navigate(`/${translationId}/${book}/${chapter}/${verse}`);
  };

  const highlightText = (text: string, term: string) => {
    if (!term) return text;

    const regex = new RegExp(`(\\b${term}\\b)`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">
          {part}
        </mark>
      ) : (
        <span key={index}>{part}</span>
      )
    );
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
            <h1 className="text-2xl font-bold text-theme-text">Bible Concordance</h1>
            <p className="text-theme-text/60 text-sm">Find every occurrence of a word in Scripture</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-theme-surface rounded-xl p-6 border border-theme-border">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text/60" size={20} />
              <input
                type="text"
                placeholder="Enter a word to search (e.g., love, faith, hope)..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchTerm.trim() || isSearching}
              className="px-6 py-3 bg-theme-accent hover:bg-theme-accent/90 disabled:bg-theme-accent/50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Quick Search Suggestions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-theme-text/60">Quick searches:</span>
            {['love', 'faith', 'grace', 'peace', 'joy', 'hope'].map((word) => (
              <button
                key={word}
                onClick={() => {
                  setSearchTerm(word);
                  setTimeout(() => handleSearch(), 100);
                }}
                className="text-sm px-3 py-1 bg-theme-bg hover:bg-theme-accent/10 text-theme-accent rounded-full border border-theme-accent/30 transition-colors"
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        {searchPerformed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-theme-surface rounded-xl p-6 border border-theme-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-theme-text mb-1">
                  Results for "{searchTerm}"
                </h3>
                <p className="text-theme-text/60 text-sm">
                  Found <span className="font-bold text-theme-accent">{totalOccurrences}</span> occurrences
                  in <span className="font-bold text-theme-accent">{results.length}</span> verses
                </p>
              </div>
              <div className="w-16 h-16 bg-theme-accent/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-theme-accent" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Results List */}
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.slice(0, 100).map((result, index) => (
              <motion.div
                key={`${result.book}-${result.chapter}-${result.verse}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.5) }}
                className="bg-theme-surface rounded-lg p-4 border border-theme-border hover:border-theme-accent/50 transition-all cursor-pointer group"
                onClick={() => handleNavigateToVerse(result.book, result.chapter, result.verse)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-theme-accent flex-shrink-0 mt-0.5" />
                    <h4 className="font-semibold text-theme-accent group-hover:underline">
                      {result.book} {result.chapter}:{result.verse}
                    </h4>
                  </div>
                  {result.matches > 1 && (
                    <span className="text-xs px-2 py-1 bg-theme-accent/10 text-theme-accent rounded-full font-medium">
                      {result.matches}×
                    </span>
                  )}
                </div>
                <p className="text-sm text-theme-text/80 leading-relaxed">
                  {highlightText(result.text, searchTerm)}
                </p>
              </motion.div>
            ))}

            {results.length > 100 && (
              <div className="text-center p-4 bg-theme-surface rounded-lg border border-theme-border">
                <p className="text-sm text-theme-text/60">
                  Showing first 100 results. Total found: {results.length}
                </p>
              </div>
            )}
          </div>
        ) : searchPerformed && !isSearching ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="w-16 h-16 text-theme-text/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-theme-text mb-2">No results found</h3>
            <p className="text-theme-text/60">
              Try searching for a different word or check your spelling
            </p>
          </motion.div>
        ) : !searchPerformed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-theme-accent/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-theme-text mb-2">Search the Bible</h3>
            <p className="text-theme-text/60 mb-6">
              Enter a word above to find every occurrence in Scripture
            </p>
            <div className="max-w-md mx-auto space-y-2 text-sm text-theme-text/60">
              <p>💡 Tip: Use single words for best results</p>
              <p>📖 The concordance searches the entire Bible</p>
              <p>🔍 Results show the word highlighted in context</p>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

