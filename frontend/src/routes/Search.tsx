import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBibleStore } from '../store/bibleStore';
import Fuse from 'fuse.js';
import { Search as SearchIcon, X, Filter, BookOpen, Star, Flame } from 'lucide-react';

interface SearchResult {
  item: {
    book: string;
    chapter: string;
    verse: string;
    text: string;
  };
  score?: number;
}

type Category = 'all' | 'old-testament' | 'new-testament' | 'names';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bible, translationId } = useBibleStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [category, setCategory] = useState<Category>('all');
  const [isSearching, setIsSearching] = useState(false);

  // Handle pre-filled search from glossary
  useEffect(() => {
    if (location.state) {
      const { searchQuery, category: preCategory } = location.state as any;
      if (searchQuery) {
        setQuery(searchQuery);
        setCategory(preCategory || 'all');
      }
    }
  }, [location.state]);

  // Create search index
  const fuse = useMemo(() => {
    if (!bible) return null;

    const verses: Array<{
      book: string;
      chapter: string;
      verse: string;
      text: string;
    }> = [];

    Object.entries(bible).forEach(([book, chapters]) => {
      Object.entries(chapters).forEach(([chapter, versesInChapter]) => {
        Object.entries(versesInChapter).forEach(([verse, text]) => {
          verses.push({ book, chapter, verse, text });
        });
      });
    });

    return new Fuse(verses, {
      keys: ['text'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [bible]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchQuery: string, searchCategory: Category) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (!fuse || !searchQuery.trim()) {
            setResults([]);
            setIsSearching(false);
            return;
          }

          setIsSearching(true);
          let searchResults = fuse.search(searchQuery);
          
          // Apply category filters
          if (searchCategory === 'old-testament') {
            const oldTestamentBooks = [
              'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
              'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
              '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther',
              'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
              'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
              'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
              'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
            ];
            searchResults = searchResults.filter(result => 
              oldTestamentBooks.includes(result.item.book)
            );
          } else if (searchCategory === 'new-testament') {
            const newTestamentBooks = [
              'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians',
              '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians',
              '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
              'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
              '1 John', '2 John', '3 John', 'Jude', 'Revelation'
            ];
            searchResults = searchResults.filter(result => 
              newTestamentBooks.includes(result.item.book)
            );
          } else if (searchCategory === 'names') {
            const hebrewNames = [
              'Yahuah', 'Elohiym', 'Yah', 'Yahusha', 'Mashiach', 'Ruach', 'Qodesh',
              'Shaddai', 'Elyon', 'Adonai', 'El', 'Yahweh', 'YHWH'
            ];
            searchResults = searchResults.filter(result => 
              hebrewNames.some(name => 
                result.item.text.toLowerCase().includes(name.toLowerCase())
              )
            );
          }

          setResults(searchResults);
          setIsSearching(false);
        }, 300);
      };
    })(),
    [fuse]
  );

  // Search when query or category changes
  useEffect(() => {
    debouncedSearch(query, category);
  }, [query, category, debouncedSearch]);

  const handleResultClick = (book: string, chapter: string, verse: string) => {
    navigate(`/${translationId}/${book}/${chapter}/${verse}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      navigate(-1);
    }
  };

  const categories = [
    { id: 'all', label: 'All', icon: BookOpen },
    { id: 'old-testament', label: 'Old Testament', icon: Star },
    { id: 'new-testament', label: 'New Testament', icon: Flame },
    { id: 'names', label: 'Names', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-6 text-theme-text">Search Scripture</h1>
          
          <div className="space-y-6">
            {/* Search Input */}
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-text/60" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search verses, names, or topics..."
                className="w-full pl-12 pr-12 py-4 border border-theme-border rounded-xl bg-theme-surface text-theme-text focus:ring-2 focus:ring-theme-accent focus:border-theme-accent transition-all duration-200 text-lg"
                autoFocus
              />
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-theme-text/60 hover:text-theme-accent transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setCategory(cat.id as Category)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    category === cat.id
                      ? 'bg-theme-accent text-white shadow-lg'
                      : 'bg-theme-surface hover:bg-theme-surface-hover text-theme-text border border-theme-border'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <cat.icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Search Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isSearching && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-theme-accent border-t-transparent rounded-full"
                  />
                )}
                <span className="text-sm text-theme-text/60">
                  {isSearching ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {results.map((result, index) => (
                <motion.div
                  key={`${result.item.book}-${result.item.chapter}-${result.item.verse}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleResultClick(result.item.book, result.item.chapter, result.item.verse)}
                  className="p-6 bg-theme-surface hover:bg-theme-surface-hover rounded-xl cursor-pointer transition-all duration-200 border border-theme-border hover:border-theme-accent/50 hover:shadow-lg group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-theme-accent rounded-full"></div>
                      <div className="font-semibold text-theme-accent text-lg">
                        {result.item.book} {result.item.chapter}:{result.item.verse}
                      </div>
                    </div>
                    {result.score && (
                      <div className="text-xs text-theme-text/60 bg-theme-accent/10 px-2 py-1 rounded">
                        {Math.round((1 - result.score) * 100)}% match
                      </div>
                    )}
                  </div>
                  <div className="text-theme-text leading-relaxed group-hover:text-theme-accent transition-colors">
                    {result.item.text}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {query && !isSearching && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-theme-text mb-2">No results found</h3>
            <p className="text-theme-text/60 mb-4">
              Try different keywords or check your spelling
            </p>
            <div className="text-sm text-theme-text/40">
              Tip: Search for Hebrew names like "Yahuah", "Elohiym", or "Yahusha"
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-semibold text-theme-text mb-2">Search Scripture</h3>
            <p className="text-theme-text/60 mb-4">
              Enter a search term to find verses, names, or topics
            </p>
            <div className="text-sm text-theme-text/40">
              Press <kbd className="bg-theme-surface px-2 py-1 rounded border border-theme-border">Esc</kbd> to go back
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}