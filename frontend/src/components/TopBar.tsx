import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBibleStore } from '../store/bibleStore';
import NavPanel from './NavPanel';
import TranslationPicker from './TranslationPicker';

export default function TopBar() {
  const navigate = useNavigate();
  const { book, chapter, nextChapter, prevChapter } = useBibleStore();
  const [showNav, setShowNav] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Keyboard shortcuts are handled in Reader component

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNav(true)}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 rounded text-sm"
              >
                📖 Navigate
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevChapter}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-2 py-1 rounded text-sm"
                >
                  ←
                </button>
                <button
                  onClick={nextChapter}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-2 py-1 rounded text-sm"
                >
                  →
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold">
                {book} {chapter}
              </h1>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate('/search')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                >
                  🔍 Search
                </button>
                <button
                  onClick={() => setShowTranslation(true)}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 rounded text-sm"
                >
                  🔄 Translation
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 rounded text-sm"
                >
                  ⚙️ Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NavPanel isOpen={showNav} onClose={() => setShowNav(false)} />
      <TranslationPicker isOpen={showTranslation} onClose={() => setShowTranslation(false)} />
    </>
  );
}
