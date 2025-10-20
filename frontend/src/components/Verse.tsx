import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Highlighter, StickyNote, Share2, Heart } from 'lucide-react';
import { highlightNames, loadHebrewLexicon, stripHighlighting, formatTranslatorNotes } from '../lib/nameHighlighter';
import { useStudyStore } from '../store/studyStore';
import { useBibleStore } from '../store/bibleStore';
import NamePopover from './NamePopover';
import HighlightMenu from './HighlightMenu';
import NoteEditor from './NoteEditor';
import ShareMenu from './ShareMenu';
import VerseImageGenerator from './VerseImageGenerator';

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
  const [showActions, setShowActions] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const verseRef = useRef<HTMLDivElement>(null);
  
  const { book, chapter } = useBibleStore();
  const {
    isBookmarked,
    addBookmark,
    removeBookmark,
    getHighlight,
    addHighlight,
    removeHighlight,
    getNote,
  } = useStudyStore();
  
  const fullVerseRef = `${book} ${chapter}:${number}`;
  const bookmarked = isBookmarked(fullVerseRef);
  const highlight = getHighlight(fullVerseRef);
  const note = getNote(fullVerseRef);

  useEffect(() => {
    loadHebrewLexicon().then((lexicon) => {
      setHebrewLexicon(lexicon);
      // Get settings from localStorage
      const savedSettings = localStorage.getItem('bible-settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      
      // First format translator notes
      let processedText = text;
      if (settings.showTranslatorNotes !== false) {
        processedText = formatTranslatorNotes(text);
      }
      
      // Then highlight Hebrew names
      const highlighted = highlightNames(processedText, {
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
    navigator.clipboard.writeText(`${fullVerseRef} ${plainText}`);
  };

  const handleBookmarkToggle = () => {
    const plainText = stripHighlighting(highlightedText);
    if (bookmarked) {
      const bookmark = useStudyStore.getState().bookmarks.find(b => b.verseRef === fullVerseRef);
      if (bookmark) removeBookmark(bookmark.id);
    } else {
      addBookmark(fullVerseRef, plainText);
    }
  };

  const handleLongPress = () => {
    setShowActions(true);
  };

  // Get highlight background color
  const getHighlightBg = () => {
    if (!highlight) return '';
    const colorMap = {
      yellow: 'bg-yellow-200/50 dark:bg-yellow-900/30',
      green: 'bg-green-200/50 dark:bg-green-900/30',
      blue: 'bg-blue-200/50 dark:bg-blue-900/30',
      pink: 'bg-pink-200/50 dark:bg-pink-900/30',
      orange: 'bg-orange-200/50 dark:bg-orange-900/30',
    };
    return colorMap[highlight.color];
  };

  const hebrewNameData = popoverName ? getHebrewNameData(popoverName) : null;

  return (
    <>
      <motion.div 
        ref={verseRef}
        className={`mb-4 p-4 rounded-lg cursor-pointer transition-all duration-200 relative ${
          highlight ? getHighlightBg() : ''
        } ${
          isHighlighted 
            ? 'border-l-4 border-theme-accent' 
            : ''
        } hover:bg-theme-surface-hover`}
        onClick={handleNameClick}
        onContextMenu={(e) => {
          e.preventDefault();
          handleLongPress();
        }}
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
        {/* Note Indicator */}
        {note && (
          <div className="absolute top-2 left-2">
            <StickyNote className="w-4 h-4 text-theme-accent fill-theme-accent/20" />
          </div>
        )}

        <div className="flex justify-between items-start">
          <div className="flex-1">
            <span className="verse-number text-theme-accent font-medium mr-2">{number}</span>
            <span 
              className="text-theme-text leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 ml-2">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkToggle();
              }}
              className={`text-sm transition-colors ${
                bookmarked 
                  ? 'text-theme-accent' 
                  : 'text-theme-text/60 hover:text-theme-accent'
              }`}
              title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-theme-accent' : ''}`} />
            </motion.button>
            
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowHighlightMenu(true);
              }}
              className={`text-sm transition-colors ${
                highlight 
                  ? 'text-theme-accent' 
                  : 'text-theme-text/60 hover:text-theme-accent'
              }`}
              title="Highlight verse"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Highlighter className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowNoteEditor(true);
              }}
              className={`text-sm transition-colors ${
                note 
                  ? 'text-theme-accent' 
                  : 'text-theme-text/60 hover:text-theme-accent'
              }`}
              title={note ? 'Edit note' : 'Add note'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <StickyNote className={`w-4 h-4 ${note ? 'fill-theme-accent/20' : ''}`} />
            </motion.button>
            
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowShareMenu(true);
              }}
              className="text-theme-text/60 hover:text-theme-accent text-sm transition-colors"
              title="Share verse"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to prayer list (will be implemented when form is added)
                alert('Add to prayer list feature coming soon!');
              }}
              className="text-theme-text/60 hover:text-theme-accent text-sm transition-colors"
              title="Add to prayer list"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {hebrewNameData && (
        <NamePopover
          name={hebrewNameData}
        >
          <div></div>
        </NamePopover>
      )}

      {/* Highlight Menu */}
      <HighlightMenu
        isOpen={showHighlightMenu}
        onClose={() => setShowHighlightMenu(false)}
        onSelectColor={(color) => addHighlight(fullVerseRef, color)}
        currentColor={highlight?.color}
        onRemove={() => removeHighlight(fullVerseRef)}
      />

      {/* Note Editor */}
      <AnimatePresence>
        {showNoteEditor && (
          <NoteEditor
            verseRef={fullVerseRef}
            existingNote={note}
            onClose={() => setShowNoteEditor(false)}
          />
        )}
      </AnimatePresence>

      {/* Share Menu */}
      <ShareMenu
        isOpen={showShareMenu}
        onClose={() => setShowShareMenu(false)}
        verseText={stripHighlighting(highlightedText)}
        verseRef={fullVerseRef}
        onGenerateImage={() => {
          setShowShareMenu(false);
          setShowImageGenerator(true);
        }}
      />

      {/* Verse Image Generator */}
      <VerseImageGenerator
        isOpen={showImageGenerator}
        onClose={() => setShowImageGenerator(false)}
        verseText={stripHighlighting(highlightedText)}
        verseRef={fullVerseRef}
      />
    </>
  );
}


