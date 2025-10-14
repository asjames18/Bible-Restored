import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type BibleData, loadTranslation } from '../lib/data';

interface BibleState {
  translationId: string;
  bible: BibleData | null;
  book: string;
  chapter: string;
  verse?: string;
  isLoading: boolean;
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
      error: null,

      setTranslation: async (id: string) => {
        set({ translationId: id, isLoading: true, error: null });
        try {
          const bible = await loadTranslation(id);
          set({ bible, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load translation',
            isLoading: false 
          });
        }
      },

      setRef: (book: string, chapter: string, verse?: string) => {
        set({ book, chapter, verse });
      },

      loadCurrentBible: async () => {
        const { translationId } = get();
        set({ isLoading: true, error: null });
        try {
          const bible = await loadTranslation(translationId);
          set({ bible, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load translation',
            isLoading: false 
          });
        }
      },

      nextChapter: () => {
        const { book, chapter, bible } = get();
        if (!bible || !bible[book]) return;
        
        const chapters = Object.keys(bible[book]).sort((a, b) => parseInt(a) - parseInt(b));
        const currentIndex = chapters.indexOf(chapter);
        if (currentIndex < chapters.length - 1) {
          set({ chapter: chapters[currentIndex + 1] });
        }
      },

      prevChapter: () => {
        const { book, chapter, bible } = get();
        if (!bible || !bible[book]) return;
        
        const chapters = Object.keys(bible[book]).sort((a, b) => parseInt(a) - parseInt(b));
        const currentIndex = chapters.indexOf(chapter);
        if (currentIndex > 0) {
          set({ chapter: chapters[currentIndex - 1] });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
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


