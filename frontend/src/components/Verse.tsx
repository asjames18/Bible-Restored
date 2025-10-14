import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const [hebrewLexicon, setHebrewLexicon] = useState<any>(null);
  const verseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHebrewLexicon().then((lexicon) => {
      setHebrewLexicon(lexicon);
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
      if (nameLabel && hebrewLexicon) {
        setPopoverName(nameLabel);
        setShowPopover(true);
      }
    }
  };

  const getHebrewNameData = (nameLabel: string) => {
    if (!hebrewLexicon || !hebrewLexicon.names || !nameLabel) return null;
    return hebrewLexicon.names.find((name: any) => 
      name.label.toLowerCase() === nameLabel.toLowerCase()
    );
  };

  const handleCopyVerse = () => {
    const plainText = stripHighlighting(highlightedText);
    navigator.clipboard.writeText(`${number} ${plainText}`);
  };

  const hebrewNameData = popoverName ? getHebrewNameData(popoverName) : null;

  return (
    <>
      <motion.div 
        ref={verseRef}
        className={`mb-4 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
          isHighlighted 
            ? 'bg-theme-accent/10 border-l-4 border-theme-accent' 
            : 'hover:bg-theme-surface-hover'
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
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <span className="verse-number text-theme-accent font-medium">{number}</span>
            <span 
              className="text-theme-text leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyVerse();
            }}
            className="ml-2 text-theme-text/60 hover:text-theme-accent text-sm transition-colors"
            title="Copy verse"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            📋
          </motion.button>
        </div>
      </motion.div>

      {hebrewNameData && (
        <NamePopover
          name={hebrewNameData}
        >
          <div></div>
        </NamePopover>
      )}
    </>
  );
}


