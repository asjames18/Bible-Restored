import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryEntry {
  id: string;
  verseRef: string; // "Genesis 1:1" or "Genesis 1" (for chapter)
  book: string;
  chapter: string;
  verse?: string;
  timestamp: number;
  duration?: number; // Time spent in seconds
}

interface HistoryState {
  history: HistoryEntry[];
  maxHistorySize: number;
}

interface HistoryActions {
  addToHistory: (book: string, chapter: string, verse?: string) => void;
  getHistory: (limit?: number) => HistoryEntry[];
  clearHistory: () => void;
  removeHistoryEntry: (id: string) => void;
  getRecentBooks: (limit?: number) => string[];
  getReadingStreak: () => { currentStreak: number; longestStreak: number };
  getMostReadBooks: (limit?: number) => Array<{ book: string; count: number }>;
}

export const useHistoryStore = create<HistoryState & HistoryActions>()(
  persist(
    (set, get) => ({
      history: [],
      maxHistorySize: 100, // Keep last 100 entries

      addToHistory: (book: string, chapter: string, verse?: string) => {
        const verseRef = verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`;
        const now = Date.now();
        
        // Check if the last entry is the same location (avoid duplicates from same session)
        const { history } = get();
        const lastEntry = history[0];
        
        if (lastEntry && 
            lastEntry.book === book && 
            lastEntry.chapter === chapter && 
            lastEntry.verse === verse &&
            now - lastEntry.timestamp < 60000) { // Within 1 minute
          return; // Don't add duplicate
        }

        const entry: HistoryEntry = {
          id: `history-${now}-${Math.random()}`,
          verseRef,
          book,
          chapter,
          verse,
          timestamp: now,
        };

        set((state) => ({
          history: [entry, ...state.history].slice(0, state.maxHistorySize),
        }));
      },

      getHistory: (limit?: number) => {
        const { history } = get();
        return limit ? history.slice(0, limit) : history;
      },

      clearHistory: () => {
        set({ history: [] });
      },

      removeHistoryEntry: (id: string) => {
        set((state) => ({
          history: state.history.filter(h => h.id !== id),
        }));
      },

      getRecentBooks: (limit = 5) => {
        const { history } = get();
        const bookSet = new Set<string>();
        
        for (const entry of history) {
          bookSet.add(entry.book);
          if (bookSet.size >= limit) break;
        }
        
        return Array.from(bookSet);
      },

      getReadingStreak: () => {
        const { history } = get();
        if (history.length === 0) {
          return { currentStreak: 0, longestStreak: 0 };
        }

        // Group readings by day
        const dayMap = new Map<string, boolean>();
        history.forEach(entry => {
          const date = new Date(entry.timestamp);
          const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          dayMap.set(dayKey, true);
        });

        const today = new Date();
        const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

        let currentStreak = 0;
        let longestStreak = 0;
        let checkDate = new Date(today);

        // Calculate current streak
        while (true) {
          const checkKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
          if (dayMap.has(checkKey)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            // If today hasn't been read yet, don't break streak
            if (checkKey === todayKey) {
              checkDate.setDate(checkDate.getDate() - 1);
              continue;
            }
            break;
          }
        }

        // Calculate longest streak
        const sortedDays = Array.from(dayMap.keys()).sort();
        let tempStreak = 1;
        
        for (let i = 1; i < sortedDays.length; i++) {
          const prevDate = new Date(sortedDays[i - 1]);
          const currDate = new Date(sortedDays[i]);
          const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (dayDiff === 1) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 1;
          }
        }
        
        longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

        return { currentStreak, longestStreak };
      },

      getMostReadBooks: (limit = 5) => {
        const { history } = get();
        const bookCounts = new Map<string, number>();

        history.forEach(entry => {
          bookCounts.set(entry.book, (bookCounts.get(entry.book) || 0) + 1);
        });

        return Array.from(bookCounts.entries())
          .map(([book, count]) => ({ book, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, limit);
      },
    }),
    {
      name: 'history-storage',
    }
  )
);

