import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Trash2, Edit, ArrowLeft, Search, Tag, X } from 'lucide-react';
import { useStudyStore, type Note } from '../store/studyStore';
import TopBar from '../components/TopBar';
import NoteEditor from '../components/NoteEditor';

export default function Notes() {
  const navigate = useNavigate();
  const { notes, removeNote, getAllTags } = useStudyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  const allTags = getAllTags();

  // Filter notes
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(n => n.tags?.includes(selectedTag));
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.verseRef.toLowerCase().includes(query) ||
        n.title?.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, selectedTag, searchQuery]);

  const handleVerseClick = (verseRef: string) => {
    // Parse verse reference like "Genesis 1:1"
    const parts = verseRef.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (parts) {
      const [, book, chapter] = parts;
      navigate(`/restored_kjv/${book}/${chapter}`);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-theme-bg pb-20">
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-theme-text/60 hover:text-theme-text transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-theme-text">Personal Notes</h1>
            <p className="text-theme-text/60 text-sm">{notes.length} notes</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-text/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-12 pr-4 py-3 bg-theme-surface border border-theme-border rounded-xl text-theme-text placeholder:text-theme-text/40 focus:outline-none focus:ring-2 focus:ring-theme-accent"
          />
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-theme-text/60" />
              <span className="text-sm text-theme-text/60">Filter by tag:</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <motion.button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 ${
                  selectedTag === null
                    ? 'bg-theme-accent text-white'
                    : 'bg-theme-surface text-theme-text border border-theme-border'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                All
              </motion.button>
              {allTags.map((tag) => (
                <motion.button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 ${
                    selectedTag === tag
                      ? 'bg-theme-accent text-white'
                      : 'bg-theme-surface text-theme-text border border-theme-border'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Notes List */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <StickyNote className="w-16 h-16 mx-auto text-theme-text/20 mb-4" />
            <p className="text-theme-text/60">
              {searchQuery || selectedTag
                ? 'No notes found'
                : 'No notes yet. Start adding notes to verses while reading!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotes.map((note) => {
              const isExpanded = expandedNoteId === note.id;
              
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-theme-surface border border-theme-border rounded-xl p-4 hover:border-theme-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleVerseClick(note.verseRef)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <StickyNote className="w-4 h-4 text-theme-accent fill-theme-accent/20" />
                        <h3 className="font-semibold text-theme-accent">
                          {note.verseRef}
                        </h3>
                      </div>
                      {note.title && (
                        <h4 className="font-medium text-theme-text mb-2">
                          {note.title}
                        </h4>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => setEditingNote(note)}
                        className="text-theme-text/40 hover:text-theme-accent transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit note"
                      >
                        <Edit className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => removeNote(note.id)}
                        className="text-theme-text/40 hover:text-red-500 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete note"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Note Content */}
                  <p className="text-theme-text/80 text-sm leading-relaxed whitespace-pre-wrap">
                    {isExpanded ? note.content : truncateText(note.content)}
                  </p>
                  
                  {note.content.length > 150 && (
                    <button
                      onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                      className="text-theme-accent text-sm mt-2 hover:underline"
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-theme-accent/10 text-theme-accent rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="text-theme-text/40 text-xs mt-3 flex items-center justify-between">
                    <span>Updated: {formatDate(note.updatedAt)}</span>
                    <span>{note.content.length} characters</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Note Editor Modal */}
      <AnimatePresence>
        {editingNote && (
          <NoteEditor
            verseRef={editingNote.verseRef}
            existingNote={editingNote}
            onClose={() => setEditingNote(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

