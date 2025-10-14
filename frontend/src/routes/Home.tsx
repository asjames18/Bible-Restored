import { Link } from 'react-router-dom';
import { useBibleStore } from '../store/bibleStore';
import TopBar from '../components/TopBar';

export default function Home() {
  const { translationId, book, chapter } = useBibleStore();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TopBar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-8">Bible Reader</h1>
          <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">
            Read the Bible with restored Hebrew names
          </p>
          
          <div className="space-y-4">
            <Link
              to={`/${translationId}/${book}/${chapter}`}
              className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Continue Reading
            </Link>
            
            <div className="flex justify-center space-x-4">
              <Link
                to="/search"
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg transition-colors"
              >
                Search
              </Link>
              <Link
                to="/parallel/Genesis/1"
                className="bg-green-200 hover:bg-green-300 dark:bg-green-700 dark:hover:bg-green-600 text-green-900 dark:text-green-100 px-4 py-2 rounded-lg transition-colors"
              >
                Parallel View
              </Link>
              <Link
                to="/settings"
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg transition-colors"
              >
                Settings
              </Link>
              <Link
                to="/glossary"
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg transition-colors"
              >
                Glossary
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


