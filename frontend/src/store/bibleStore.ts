import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type BibleData, loadTranslation, loadFullBible, preloadPriorityBooks, getBibleStats } from '../lib/data';

interface BibleState {
  translationId: string;
  bible: BibleData | null;
  book: string;
  chapter: string;
  verse?: string;
  isLoading: boolean;
  loadingProgress: number;
  error: string | null;
}

interface BibleActions {
  setTranslation: (id: string) => Promise<void>;
  setRef: (book: string, chapter: string, verse?: string) => void;
  loadCurrentBible: () => Promise<void>;
  nextChapter: () => void;
  prevChapter: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getBibleStats: () => { books: number; verses: number } | null;
}

export const useBibleStore = create<BibleState & BibleActions>()(
  persist(
    (set, get) => ({
      translationId: 'restored_kjv',
      bible: null,
      book: 'Genesis',
      chapter: '1',
      verse: undefined,
      isLoading: false,
      loadingProgress: 0,
      error: null,

      setTranslation: async (id: string) => {
        const { translationId, bible } = get();
        
        // If already loading this translation and Bible exists, don't reload
        if (translationId === id && bible) {
          console.log(`Translation ${id} already loaded`);
          return;
        }
        
        set({ translationId: id, isLoading: true, loadingProgress: 0, error: null });
        try {
          const bible = await loadFullBible(id, (progress) => {
            set({ loadingProgress: progress });
          });
          set({ bible, isLoading: false, loadingProgress: 100 });
        } catch (error) {
          console.error('Error loading translation:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load translation',
            isLoading: false,
            loadingProgress: 0
          });
        }
      },

      setRef: (book: string, chapter: string, verse?: string) => {
        set({ book, chapter, verse });
      },

      loadCurrentBible: async () => {
        const { translationId } = get();
        set({ isLoading: true, loadingProgress: 0, error: null });
        try {
          const bible = await loadFullBible(translationId, (progress) => {
            set({ loadingProgress: progress });
          });
          set({ bible, isLoading: false, loadingProgress: 100 });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load translation',
            isLoading: false,
            loadingProgress: 0
          });
        }
      },

      nextChapter: () => {
        const { book, chapter, bible } = get();
        if (!bible || !bible[book]) return;
        
        const chapters = Object.keys(bible[book]).sort((a, b) => parseInt(a) - parseInt(b));
        const currentIndex = chapters.indexOf(chapter);
        if (currentIndex < chapters.length - 1) {
          set({ chapter: chapters[currentIndex + 1], verse: undefined });
        }
      },

      prevChapter: () => {
        const { book, chapter, bible } = get();
        if (!bible || !bible[book]) return;
        
        const chapters = Object.keys(bible[book]).sort((a, b) => parseInt(a) - parseInt(b));
        const currentIndex = chapters.indexOf(chapter);
        if (currentIndex > 0) {
          set({ chapter: chapters[currentIndex - 1], verse: undefined });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      getBibleStats: () => {
        const { bible } = get();
        if (!bible) return null;
        return getBibleStats(bible);
      },
    }),
    {
      name: 'bible-storage',
      partialize: (state) => ({
        translationId: state.translationId,
        book: state.book,
        chapter: state.chapter,
        verse: state.verse,
      }),
    }
  )
);


