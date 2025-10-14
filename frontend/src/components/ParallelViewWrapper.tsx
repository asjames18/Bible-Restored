import { useParams } from 'react-router-dom';
import ParallelView from './ParallelView';

export default function ParallelViewWrapper() {
  const { book, chapter, verse } = useParams();
  
  if (!book || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Invalid book or chapter</p>
      </div>
    );
  }

  return <ParallelView book={book} chapter={chapter} verse={verse} />;
}
