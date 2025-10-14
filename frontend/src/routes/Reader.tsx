import { useParams, useNavigate } from 'react-router-dom';
import { useBibleStore } from '../store/bibleStore';
import { useEffect } from 'react';
import TopBar from '../components/TopBar';
import Verse from '../components/Verse';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Reader() {
  const { translation, book, chapter, verse } = useParams();
  const navigate = useNavigate();
  const { 
    bible, 
    isLoading, 
    error, 
    setTranslation, 
    setRef, 
    nextChapter, 
    prevChapter 
  } = useBibleStore();

  useEffect(() => {
    if (translation && book && chapter) {
      setTranslation(translation);
      setRef(book, chapter, verse);
    }
  }, [translation, book, chapter, verse, setTranslation, setRef]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === '[') {
      prevChapter();
    } else if (e.key === ']') {
      nextChapter();
    } else if (e.key === '/') {
      navigate('/search');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Bible..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!bible || !bible[book!] || !bible[book!][chapter!]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chapter not found</p>
      </div>
    );
  }

  const verses = bible[book!][chapter!];
  const verseNumbers = Object.keys(verses).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TopBar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="prose prose-lg max-w-none dark:prose-invert">
          {verseNumbers.map((verseNum) => (
            <Verse
              key={verseNum}
              number={verseNum}
              text={verses[verseNum]}
              isHighlighted={verse === verseNum}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={prevChapter}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2 rounded"
          >
            ← Previous Chapter
          </button>
          <button
            onClick={nextChapter}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2 rounded"
          >
            Next Chapter →
          </button>
        </div>
      </div>
    </div>
  );
}


