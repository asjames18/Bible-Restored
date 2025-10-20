import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, Clock } from 'lucide-react';
import { useBibleStore } from '../store/bibleStore';
import { useHistoryStore } from '../store/historyStore';

interface QuickJumpProps {
  isOpen: boolean;
  onClose: () => void;
}

const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah',
  'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
  'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

const BOOK_ABBREVIATIONS: Record<string, string> = {
  'gen': 'Genesis', 'ge': 'Genesis', 'gn': 'Genesis',
  'ex': 'Exodus', 'exo': 'Exodus', 'exod': 'Exodus',
  'lev': 'Leviticus', 'le': 'Leviticus', 'lv': 'Leviticus',
  'num': 'Numbers', 'nu': 'Numbers', 'nm': 'Numbers', 'nb': 'Numbers',
  'deut': 'Deuteronomy', 'de': 'Deuteronomy', 'dt': 'Deuteronomy',
  'josh': 'Joshua', 'jos': 'Joshua', 'jsh': 'Joshua',
  'judg': 'Judges', 'jdg': 'Judges', 'jg': 'Judges', 'jdgs': 'Judges',
  'ru': 'Ruth', 'rth': 'Ruth', 'rut': 'Ruth',
  '1sam': '1 Samuel', '1sm': '1 Samuel', '1sa': '1 Samuel', '1s': '1 Samuel',
  '2sam': '2 Samuel', '2sm': '2 Samuel', '2sa': '2 Samuel', '2s': '2 Samuel',
  '1ki': '1 Kings', '1kgs': '1 Kings',
  '2ki': '2 Kings', '2kgs': '2 Kings',
  '1chr': '1 Chronicles', '1ch': '1 Chronicles',
  '2chr': '2 Chronicles', '2ch': '2 Chronicles',
  'ezr': 'Ezra', 'ez': 'Ezra',
  'neh': 'Nehemiah', 'ne': 'Nehemiah',
  'est': 'Esther', 'es': 'Esther',
  'ps': 'Psalms', 'psa': 'Psalms', 'psm': 'Psalms', 'pss': 'Psalms',
  'prov': 'Proverbs', 'pro': 'Proverbs', 'prv': 'Proverbs', 'pr': 'Proverbs',
  'eccl': 'Ecclesiastes', 'ecc': 'Ecclesiastes', 'ec': 'Ecclesiastes', 'qoh': 'Ecclesiastes',
  'song': 'Song of Solomon', 'sos': 'Song of Solomon', 'so': 'Song of Solomon', 'ss': 'Song of Solomon',
  'isa': 'Isaiah', 'is': 'Isaiah',
  'jer': 'Jeremiah', 'je': 'Jeremiah', 'jr': 'Jeremiah',
  'lam': 'Lamentations', 'la': 'Lamentations',
  'ezek': 'Ezekiel', 'eze': 'Ezekiel', 'ezk': 'Ezekiel',
  'dan': 'Daniel', 'da': 'Daniel', 'dn': 'Daniel',
  'hos': 'Hosea', 'ho': 'Hosea',
  'joe': 'Joel', 'jl': 'Joel',
  'am': 'Amos',
  'ob': 'Obadiah', 'oba': 'Obadiah', 'obd': 'Obadiah',
  'jon': 'Jonah', 'jnh': 'Jonah',
  'mic': 'Micah', 'mi': 'Micah',
  'nah': 'Nahum', 'na': 'Nahum',
  'hab': 'Habakkuk', 'hb': 'Habakkuk',
  'zeph': 'Zephaniah', 'zep': 'Zephaniah', 'zp': 'Zephaniah',
  'hag': 'Haggai', 'hg': 'Haggai',
  'zech': 'Zechariah', 'zec': 'Zechariah', 'zc': 'Zechariah',
  'mal': 'Malachi', 'ml': 'Malachi',
  'matt': 'Matthew', 'mat': 'Matthew', 'mt': 'Matthew',
  'mar': 'Mark', 'mrk': 'Mark', 'mr': 'Mark', 'mk': 'Mark',
  'luk': 'Luke', 'lk': 'Luke',
  'jn': 'John', 'jhn': 'John',
  'act': 'Acts', 'ac': 'Acts',
  'rom': 'Romans', 'ro': 'Romans', 'rm': 'Romans',
  '1cor': '1 Corinthians', '1co': '1 Corinthians',
  '2cor': '2 Corinthians', '2co': '2 Corinthians',
  'gal': 'Galatians', 'ga': 'Galatians',
  'eph': 'Ephesians', 'ephes': 'Ephesians',
  'phil': 'Philippians', 'php': 'Philippians', 'pp': 'Philippians',
  'col': 'Colossians',
  '1thess': '1 Thessalonians', '1th': '1 Thessalonians',
  '2thess': '2 Thessalonians', '2th': '2 Thessalonians',
  '1tim': '1 Timothy', '1ti': '1 Timothy',
  '2tim': '2 Timothy', '2ti': '2 Timothy',
  'tit': 'Titus', 'ti': 'Titus',
  'philem': 'Philemon', 'phm': 'Philemon', 'pm': 'Philemon',
  'heb': 'Hebrews',
  'jas': 'James', 'jam': 'James', 'jm': 'James',
  '1pet': '1 Peter', '1pe': '1 Peter', '1pt': '1 Peter', '1p': '1 Peter',
  '2pet': '2 Peter', '2pe': '2 Peter', '2pt': '2 Peter', '2p': '2 Peter',
  '1jn': '1 John', '1jo': '1 John',
  '2jn': '2 John', '2jo': '2 John',
  '3jn': '3 John', '3jo': '3 John',
  'jud': 'Jude', 'jd': 'Jude',
  'rev': 'Revelation', 're': 'Revelation', 'rv': 'Revelation',
};

export default function QuickJump({ isOpen, onClose }: QuickJumpProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { translationId } = useBibleStore();
  const { getHistory } = useHistoryStore();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const parseVerseReference = (text: string): { book: string; chapter: string; verse?: string } | null => {
    text = text.trim().toLowerCase();
    
    // Try full book names first
    for (const book of BIBLE_BOOKS) {
      const bookLower = book.toLowerCase();
      if (text.startsWith(bookLower)) {
        const rest = text.slice(bookLower.length).trim();
        const match = rest.match(/^(\d+):?(\d+)?$/);
        if (match) {
          return {
            book,
            chapter: match[1],
            verse: match[2] || undefined,
          };
        }
      }
    }

    // Try abbreviations
    for (const [abbr, fullName] of Object.entries(BOOK_ABBREVIATIONS)) {
      if (text.startsWith(abbr)) {
        const rest = text.slice(abbr.length).trim();
        const match = rest.match(/^(\d+):?(\d+)?$/);
        if (match) {
          return {
            book: fullName,
            chapter: match[1],
            verse: match[2] || undefined,
          };
        }
      }
    }

    return null;
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const lowerInput = value.toLowerCase();
    const bookSuggestions = BIBLE_BOOKS.filter(book =>
      book.toLowerCase().startsWith(lowerInput)
    ).slice(0, 5);

    setSuggestions(bookSuggestions);
  };

  const handleNavigate = () => {
    const parsed = parseVerseReference(input);
    if (parsed) {
      const path = parsed.verse
        ? `/${translationId}/${parsed.book}/${parsed.chapter}/${parsed.verse}`
        : `/${translationId}/${parsed.book}/${parsed.chapter}`;
      navigate(path);
      onClose();
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNavigate();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSuggestionClick = (book: string) => {
    setInput(book + ' ');
    inputRef.current?.focus();
    setSuggestions([]);
  };

  const recentHistory = getHistory(5);

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
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Quick Jump Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl"
          >
            <div className="bg-theme-surface rounded-2xl shadow-2xl border border-theme-border overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-theme-border">
                <Search className="w-5 h-5 text-theme-text/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Type verse reference (e.g., "John 3:16" or "Gen 1")'
                  className="flex-1 bg-transparent text-theme-text placeholder:text-theme-text/40 focus:outline-none text-lg"
                />
                <button
                  onClick={onClose}
                  className="text-theme-text/60 hover:text-theme-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Suggestions or History */}
              <div className="max-h-[400px] overflow-y-auto">
                {suggestions.length > 0 ? (
                  <div className="p-2">
                    <p className="text-xs text-theme-text/60 px-3 py-2">Book Suggestions</p>
                    {suggestions.map((book) => (
                      <motion.button
                        key={book}
                        onClick={() => handleSuggestionClick(book)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-theme-surface-hover rounded-lg text-left transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <BookOpen className="w-4 h-4 text-theme-accent" />
                        <span className="text-theme-text">{book}</span>
                      </motion.button>
                    ))}
                  </div>
                ) : !input && recentHistory.length > 0 ? (
                  <div className="p-2">
                    <p className="text-xs text-theme-text/60 px-3 py-2">Recent Readings</p>
                    {recentHistory.map((entry) => (
                      <motion.button
                        key={entry.id}
                        onClick={() => {
                          setInput(entry.verseRef);
                          handleNavigate();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-theme-surface-hover rounded-lg text-left transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <Clock className="w-4 h-4 text-theme-text/60" />
                        <div>
                          <p className="text-theme-text">{entry.verseRef}</p>
                          <p className="text-xs text-theme-text/60">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-theme-text/60">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      Type a verse reference like:
                    </p>
                    <p className="text-xs mt-2 space-y-1">
                      <span className="block">John 3:16</span>
                      <span className="block">Genesis 1</span>
                      <span className="block">Ps 23:1</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Hint */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-theme-border bg-theme-bg/50 text-xs text-theme-text/60">
                <span>Press Enter to navigate</span>
                <span>ESC to close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

