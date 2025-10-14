import { useState, useEffect, useRef } from 'react';
import { highlightNames, loadHebrewLexicon, stripHighlighting } from '../lib/nameHighlighter';
import NamePopover from './NamePopover';

interface VerseProps {
  number: string;
  text: string;
  isHighlighted?: boolean;
}

export default function Verse({ number, text, isHighlighted }: VerseProps) {
  const [highlightedText, setHighlightedText] = useState(text);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverName, setPopoverName] = useState('');
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const verseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHebrewLexicon().then(() => {
      // Get settings from localStorage
      const savedSettings = localStorage.getItem('bible-settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      
      const highlighted = highlightNames(text, {
        showHebrewBadge: settings.showHebrewBadges || false,
        showTranslitBadge: settings.showTranslitBadges || false,
        enablePopovers: settings.enableNamePopovers !== false
      });
      setHighlightedText(highlighted);
    });
  }, [text]);

  const handleNameClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('name-token')) {
      const nameLabel = target.getAttribute('data-name-label');
      if (nameLabel) {
        const rect = target.getBoundingClientRect();
        setPopoverPosition({
          x: rect.left,
          y: rect.bottom + 5
        });
        setPopoverName(nameLabel);
        setShowPopover(true);
      }
    }
  };

  const handleCopyVerse = () => {
    const plainText = stripHighlighting(highlightedText);
    navigator.clipboard.writeText(`${number} ${plainText}`);
  };

  return (
    <>
      <div 
        ref={verseRef}
        className={`mb-4 p-3 rounded-lg cursor-pointer ${
          isHighlighted 
            ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
        onClick={handleNameClick}
        role="button"
        tabIndex={0}
        aria-label={`Verse ${number}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleNameClick(e as any);
          }
        }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <span className="verse-number">{number}</span>
            <span 
              className="text-gray-900 dark:text-gray-100"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyVerse();
            }}
            className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-sm"
            title="Copy verse"
          >
            📋
          </button>
        </div>
      </div>

      <NamePopover
        nameLabel={popoverName}
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        position={popoverPosition}
      />
    </>
  );
}


