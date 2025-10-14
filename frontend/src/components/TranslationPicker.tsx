import { useNavigate } from 'react-router-dom';
import { useBibleStore } from '../store/bibleStore';
import { listTranslations } from '../lib/data';

interface TranslationPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TranslationPicker({ isOpen, onClose }: TranslationPickerProps) {
  const navigate = useNavigate();
  const { translationId, book, chapter, setTranslation } = useBibleStore();
  const translations = listTranslations();

  const handleTranslationChange = async (newTranslationId: string) => {
    await setTranslation(newTranslationId);
    navigate(`/${newTranslationId}/${book}/${chapter}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Choose Translation</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            {translations.map((translation) => (
              <button
                key={translation.id}
                onClick={() => handleTranslationChange(translation.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  translationId === translation.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                }`}
              >
                <div className="font-medium">{translation.label}</div>
                {translation.id === 'restored_kjv' && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    With restored Hebrew names
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Press <kbd className="bg-gray-100 dark:bg-gray-700 px-1 rounded">t</kbd> to open this menu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
