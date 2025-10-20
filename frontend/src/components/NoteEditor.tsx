import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Tag } from 'lucide-react';
import { useStudyStore, type Note } from '../store/studyStore';

interface NoteEditorProps {
  verseRef: string;
  existingNote?: Note;
  onClose: () => void;
  onSave?: () => void;
}

export default function NoteEditor({ verseRef, existingNote, onClose, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(existingNote?.tags || []);
  
  const { addNote, updateNote } = useStudyStore();

  useEffect(() => {
    // Prevent body scroll when editor is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSave = () => {
    if (!content.trim()) return;

    if (existingNote) {
      updateNote(existingNote.id, {
        title: title.trim() || undefined,
        content: content.trim(),
        tags: tags.length > 0 ? tags : undefined,
      });
    } else {
      addNote(
        verseRef,
        content.trim(),
        title.trim() || undefined,
        tags.length > 0 ? tags : undefined
      );
    }

    onSave?.();
    onClose();
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50"
      />

      {/* Editor Modal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50"
      >
        <div className="bg-theme-surface rounded-2xl shadow-2xl border border-theme-border h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-theme-border">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-theme-text">
                {existingNote ? 'Edit Note' : 'Add Note'}
              </h3>
              <p className="text-sm text-theme-text/60 truncate">{verseRef}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-2 text-theme-text/60 hover:text-theme-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-theme-text/70 mb-2">
                Title (optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your note a title..."
                className="w-full px-4 py-2 bg-theme-bg border border-theme-border rounded-lg text-theme-text placeholder:text-theme-text/40 focus:outline-none focus:ring-2 focus:ring-theme-accent"
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-sm font-medium text-theme-text/70 mb-2">
                Note
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts, insights, or questions..."
                className="w-full h-48 px-4 py-3 bg-theme-bg border border-theme-border rounded-lg text-theme-text placeholder:text-theme-text/40 focus:outline-none focus:ring-2 focus:ring-theme-accent resize-none"
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <p className="text-xs text-theme-text/50 mt-1">
                {content.length} characters • Press Cmd/Ctrl+Enter to save
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-theme-text/70 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-2 bg-theme-bg border border-theme-border rounded-lg text-theme-text placeholder:text-theme-text/40 focus:outline-none focus:ring-2 focus:ring-theme-accent"
                />
                <motion.button
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="px-4 py-2 bg-theme-accent/10 text-theme-accent rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.95 }}
                >
                  Add
                </motion.button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-theme-accent/10 text-theme-accent rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-theme-accent/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-4 border-t border-theme-border">
            <motion.button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text rounded-lg font-medium transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleSave}
              disabled={!content.trim()}
              className="flex-1 py-3 px-4 bg-theme-accent hover:bg-theme-accent/90 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-4 h-4" />
              {existingNote ? 'Update Note' : 'Save Note'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

