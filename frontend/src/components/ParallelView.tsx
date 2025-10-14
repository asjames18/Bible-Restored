import { useState, useEffect } from 'react';
import { useBibleStore } from '../store/bibleStore';
import { loadHebrewLexicon } from '../lib/nameHighlighter';
import Verse from './Verse';
import LoadingSpinner from './LoadingSpinner';

interface ParallelViewProps {
  book: string;
  chapter: string;
  verse?: string;
}

export default function ParallelView({ book, chapter, verse }: ParallelViewProps) {
  const { } = useBibleStore();
  const [kjvData, setKjvData] = useState<any>(null);
  const [restoredData, setRestoredData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [highlightedVerse, setHighlightedVerse] = useState<string | null>(verse || null);

  useEffect(() => {
    const loadTranslations = async () => {
      setLoading(true);
      try {
        // Load KJV
        const kjvResponse = await fetch('/translations/kjv.json');
        const kjv = await kjvResponse.json();
        setKjvData(kjv);

        // Load Restored KJV
        const restoredResponse = await fetch('/translations/restored_kjv.json');
        const restored = await restoredResponse.json();
        setRestoredData(restored);

        // Load Hebrew lexicon for highlighting
        await loadHebrewLexicon();
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, []);

  useEffect(() => {
    if (verse) {
      setHighlightedVerse(verse);
    }
  }, [verse]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading translations..." />
      </div>
    );
  }

  if (!kjvData || !restoredData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          Failed to load translations. Please try again.
        </p>
      </div>
    );
  }

  const kjvChapter = kjvData[book]?.[chapter];
  const restoredChapter = restoredData[book]?.[chapter];

  if (!kjvChapter || !restoredChapter) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          Chapter not found in translations.
        </p>
      </div>
    );
  }

  const verses = Object.keys(kjvChapter).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center">
          {book} {chapter}
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
          Side-by-side comparison: KJV vs Restored Names
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KJV Column */}
        <div className="space-y-4">
          <div className="sticky top-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              King James Version
            </h2>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Original 1611 translation
            </p>
          </div>
          
          <div className="space-y-2">
            {verses.map((verseNum) => (
              <div
                key={verseNum}
                className={`p-3 rounded-lg transition-colors ${
                  highlightedVerse === verseNum
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setHighlightedVerse(verseNum)}
              >
                <div className="flex">
                  <span className="verse-number text-sm text-gray-500 dark:text-gray-400 mr-2">
                    {verseNum}
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {kjvChapter[verseNum]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restored Names Column */}
        <div className="space-y-4">
          <div className="sticky top-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-green-900 dark:text-green-100">
              Restored Names
            </h2>
            <p className="text-sm text-green-700 dark:text-green-300">
              Hebrew names and titles restored
            </p>
          </div>
          
          <div className="space-y-2">
            {verses.map((verseNum) => (
              <div
                key={verseNum}
                className={`p-3 rounded-lg transition-colors ${
                  highlightedVerse === verseNum
                    ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setHighlightedVerse(verseNum)}
              >
                <Verse
                  number={verseNum}
                  text={restoredChapter[verseNum]}
                  isHighlighted={highlightedVerse === verseNum}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => {
            const currentChapter = parseInt(chapter);
            if (currentChapter > 1) {
              window.location.href = `/parallel/${book}/${currentChapter - 1}`;
            }
          }}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2 rounded font-medium transition-colors"
        >
          ← Previous Chapter
        </button>
        <button
          onClick={() => {
            const currentChapter = parseInt(chapter);
            window.location.href = `/parallel/${book}/${currentChapter + 1}`;
          }}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2 rounded font-medium transition-colors"
        >
          Next Chapter →
        </button>
      </div>
    </div>
  );
}
