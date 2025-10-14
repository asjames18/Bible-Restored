import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBibleStore } from '../store/bibleStore';
import Fuse from 'fuse.js';

interface SearchResult {
  item: {
    book: string;
    chapter: string;
    verse: string;
    text: string;
  };
  score?: number;
}

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bible, translationId } = useBibleStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hebrewOnly, setHebrewOnly] = useState(false);

  // Handle pre-filled search from glossary
  useEffect(() => {
    if (location.state) {
      const { searchQuery, hebrewOnly: preHebrewOnly } = location.state as any;
      if (searchQuery) {
        setQuery(searchQuery);
        setHebrewOnly(preHebrewOnly || false);
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

  // Search when query changes
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      return;
    }

    let searchResults = fuse.search(query);
    
    // Filter for Hebrew names only if enabled
    if (hebrewOnly) {
      const hebrewNames = [
        'Yahuah', 'Elohiym', 'Yah', 'Yahusha', 'Mashiach', 'Ruach', 'Qodesh',
        'Shaddai', 'Elyon', 'Adonai'
      ];
      searchResults = searchResults.filter(result => 
        hebrewNames.some(name => 
          result.item.text.toLowerCase().includes(name.toLowerCase())
        )
      );
    }

    setResults(searchResults);
  }, [fuse, query, hebrewOnly]);

  const handleResultClick = (book: string, chapter: string, verse: string) => {
    navigate(`/${translationId}/${book}/${chapter}/${verse}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Search Bible</h1>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search verses..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hebrewOnly}
                  onChange={(e) => setHebrewOnly(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Hebrew names only</span>
              </label>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {results.map((result) => (
            <div
              key={`${result.item.book}-${result.item.chapter}-${result.item.verse}`}
              onClick={() => handleResultClick(result.item.book, result.item.chapter, result.item.verse)}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-blue-600 dark:text-blue-400">
                  {result.item.book} {result.item.chapter}:{result.item.verse}
                </div>
                {result.score && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round((1 - result.score) * 100)}% match
                  </div>
                )}
              </div>
              <div className="text-gray-900 dark:text-gray-100">
                {result.item.text}
              </div>
            </div>
          ))}
        </div>

        {query && results.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No results found for "{query}"
            </p>
          </div>
        )}

        {!query && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              Enter a search term to find verses
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Press <kbd className="bg-gray-100 dark:bg-gray-700 px-1 rounded">Esc</kbd> to go back
            </p>
          </div>
        )}
      </div>
    </div>
  );
}