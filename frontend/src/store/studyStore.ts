import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'orange';

export interface Highlight {
  id: string;
  verseRef: string; // "Genesis 1:1"
  color: HighlightColor;
  createdAt: number;
}

export interface Note {
  id: string;
  verseRef: string; // "Genesis 1:1"
  title?: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

export interface Bookmark {
  id: string;
  verseRef: string; // "Genesis 1:1"
  verseText?: string; // Optional for display
  createdAt: number;
  folder?: string;
}

interface StudyState {
  bookmarks: Bookmark[];
  highlights: Highlight[];
  notes: Note[];
}

interface StudyActions {
  // Bookmarks
  addBookmark: (verseRef: string, verseText?: string, folder?: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (verseRef: string) => boolean;
  getBookmarksByFolder: (folder?: string) => Bookmark[];
  
  // Highlights
  addHighlight: (verseRef: string, color: HighlightColor) => void;
  removeHighlight: (verseRef: string) => void;
  updateHighlightColor: (verseRef: string, color: HighlightColor) => void;
  getHighlight: (verseRef: string) => Highlight | undefined;
  
  // Notes
  addNote: (verseRef: string, content: string, title?: string, tags?: string[]) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;
  getNote: (verseRef: string) => Note | undefined;
  getNotesByTag: (tag: string) => Note[];
  searchNotes: (query: string) => Note[];
  getAllTags: () => string[];
}

export const useStudyStore = create<StudyState & StudyActions>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      highlights: [],
      notes: [],

      // Bookmark actions
      addBookmark: (verseRef: string, verseText?: string, folder?: string) => {
        const existing = get().bookmarks.find(b => b.verseRef === verseRef);
        if (existing) return; // Already bookmarked
        
        const bookmark: Bookmark = {
          id: `bookmark-${Date.now()}-${Math.random()}`,
          verseRef,
          verseText,
          folder,
          createdAt: Date.now(),
        };
        
        set((state) => ({
          bookmarks: [...state.bookmarks, bookmark],
        }));
      },

      removeBookmark: (id: string) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter(b => b.id !== id),
        }));
      },

      isBookmarked: (verseRef: string) => {
        return get().bookmarks.some(b => b.verseRef === verseRef);
      },

      getBookmarksByFolder: (folder?: string) => {
        const { bookmarks } = get();
        if (folder === undefined) {
          return bookmarks.filter(b => !b.folder);
        }
        return bookmarks.filter(b => b.folder === folder);
      },

      // Highlight actions
      addHighlight: (verseRef: string, color: HighlightColor) => {
        const existing = get().highlights.find(h => h.verseRef === verseRef);
        if (existing) {
          // Update color if already highlighted
          set((state) => ({
            highlights: state.highlights.map(h =>
              h.verseRef === verseRef ? { ...h, color } : h
            ),
          }));
          return;
        }

        const highlight: Highlight = {
          id: `highlight-${Date.now()}-${Math.random()}`,
          verseRef,
          color,
          createdAt: Date.now(),
        };

        set((state) => ({
          highlights: [...state.highlights, highlight],
        }));
      },

      removeHighlight: (verseRef: string) => {
        set((state) => ({
          highlights: state.highlights.filter(h => h.verseRef !== verseRef),
        }));
      },

      updateHighlightColor: (verseRef: string, color: HighlightColor) => {
        set((state) => ({
          highlights: state.highlights.map(h =>
            h.verseRef === verseRef ? { ...h, color } : h
          ),
        }));
      },

      getHighlight: (verseRef: string) => {
        return get().highlights.find(h => h.verseRef === verseRef);
      },

      // Note actions
      addNote: (verseRef: string, content: string, title?: string, tags?: string[]) => {
        const note: Note = {
          id: `note-${Date.now()}-${Math.random()}`,
          verseRef,
          title,
          content,
          tags: tags || [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          notes: [...state.notes, note],
        }));
      },

      updateNote: (id: string, updates: Partial<Note>) => {
        set((state) => ({
          notes: state.notes.map(n =>
            n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
          ),
        }));
      },

      removeNote: (id: string) => {
        set((state) => ({
          notes: state.notes.filter(n => n.id !== id),
        }));
      },

      getNote: (verseRef: string) => {
        return get().notes.find(n => n.verseRef === verseRef);
      },

      getNotesByTag: (tag: string) => {
        return get().notes.filter(n => n.tags?.includes(tag));
      },

      searchNotes: (query: string) => {
        const { notes } = get();
        const lowerQuery = query.toLowerCase();
        return notes.filter(n =>
          n.content.toLowerCase().includes(lowerQuery) ||
          n.title?.toLowerCase().includes(lowerQuery) ||
          n.verseRef.toLowerCase().includes(lowerQuery)
        );
      },

      getAllTags: () => {
        const { notes } = get();
        const tagSet = new Set<string>();
        notes.forEach(note => {
          note.tags?.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet).sort();
      },
    }),
    {
      name: 'study-storage',
    }
  )
);

