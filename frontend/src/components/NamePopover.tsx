import { useState, useRef, useEffect } from 'react';
import { getHebrewName, type HebrewName } from '../lib/nameHighlighter';

interface NamePopoverProps {
  nameLabel: string;
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

export default function NamePopover({ nameLabel, isOpen, onClose, position }: NamePopoverProps) {
  const [name, setName] = useState<HebrewName | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hebrewName = getHebrewName(nameLabel);
    setName(hebrewName || null);
  }, [nameLabel]);

  useEffect(() => {
    if (isOpen && popoverRef.current) {
      const rect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Adjust position if popover would go off screen
      let adjustedX = position.x;
      let adjustedY = position.y;
      
      if (position.x + rect.width > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }
      
      if (position.y + rect.height > viewportHeight) {
        adjustedY = position.y - rect.height - 10;
      }
      
      popoverRef.current.style.left = `${Math.max(10, adjustedX)}px`;
      popoverRef.current.style.top = `${Math.max(10, adjustedY)}px`;
    }
  }, [isOpen, position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !name) {
    return null;
  }

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {name.label}
            </h3>
            <div className="text-2xl text-blue-600 dark:text-blue-400 mt-1">
              {name.hebrew}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 ml-2"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Transliteration:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{name.transliteration}</span>
          </div>
          
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Meaning:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{name.meaning}</span>
          </div>
          
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100 capitalize">{name.category}</span>
          </div>
        </div>

        <div className="text-sm">
          <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Context:</div>
          <div className="text-gray-900 dark:text-gray-100">{name.context}</div>
        </div>

        {name.references.length > 0 && (
          <div className="text-sm">
            <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">References:</div>
            <div className="text-gray-900 dark:text-gray-100">
              {name.references.slice(0, 3).join(', ')}
              {name.references.length > 3 && ` +${name.references.length - 3} more`}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Click outside to close • Press Esc to close
          </div>
        </div>
      </div>
    </div>
  );
}
