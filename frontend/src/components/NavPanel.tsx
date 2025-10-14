import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBibleStore } from '../store/bibleStore';
import { booksOrder } from '../lib/data';

interface NavPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavPanel({ isOpen, onClose }: NavPanelProps) {
  const navigate = useNavigate();
  const { translationId, book, chapter, bible } = useBibleStore();
  const [selectedBook, setSelectedBook] = useState(book);
  const [selectedChapter, setSelectedChapter] = useState(chapter);

  const books = booksOrder();
  const chapters = bible && bible[selectedBook] 
    ? Object.keys(bible[selectedBook]).sort((a, b) => parseInt(a) - parseInt(b))
    : [];

  const handleBookChange = (newBook: string) => {
    setSelectedBook(newBook);
    if (bible && bible[newBook]) {
      const firstChapter = Object.keys(bible[newBook]).sort((a, b) => parseInt(a) - parseInt(b))[0];
      setSelectedChapter(firstChapter);
    }
  };

  const handleChapterChange = (newChapter: string) => {
    setSelectedChapter(newChapter);
  };

  const handleGo = () => {
    navigate(`/${translationId}/${selectedBook}/${selectedChapter}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Navigate</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Book</label>
              <select
                value={selectedBook}
                onChange={(e) => handleBookChange(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {books.map((bookName) => (
                  <option key={bookName} value={bookName}>
                    {bookName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Chapter</label>
              <select
                value={selectedChapter}
                onChange={(e) => handleChapterChange(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {chapters.map((chapterNum) => (
                  <option key={chapterNum} value={chapterNum}>
                    Chapter {chapterNum}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGo}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              Go to Chapter
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Keyboard shortcuts:
            </p>
            <ul className="text-xs text-gray-500 dark:text-gray-500 mt-2 space-y-1">
              <li><kbd className="bg-gray-100 dark:bg-gray-700 px-1 rounded">[</kbd> Previous chapter</li>
              <li><kbd className="bg-gray-100 dark:bg-gray-700 px-1 rounded">]</kbd> Next chapter</li>
              <li><kbd className="bg-gray-100 dark:bg-gray-700 px-1 rounded">/</kbd> Search</li>
              <li><kbd className="bg-gray-100 dark:bg-gray-700 px-1 rounded">t</kbd> Translation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
