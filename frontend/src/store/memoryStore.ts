import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface MemoryVerse {
  id: string;
  verseRef: string; // e.g., "John 3:16"
  verseText: string;
  translation: string;
  category?: string;
  tags: string[];
  createdAt: number;
  lastReviewed?: number;
  nextReview: number;
  reviewCount: number;
  easeFactor: number; // SM-2 algorithm: 1.3 to 2.5
  interval: number; // Days until next review
  mastered: boolean;
}

interface MemoryState {
  verses: MemoryVerse[];
  dailyGoal: number;
  reviewedToday: number;
  lastReviewDate: string;
}

interface MemoryActions {
  // Verse management
  addVerse: (verseRef: string, verseText: string, translation: string, category?: string, tags?: string[]) => void;
  removeVerse: (id: string) => void;
  
  // Review system
  reviewVerse: (id: string, quality: number) => void; // quality: 0-5
  getVersesDueToday: () => MemoryVerse[];
  getVersesToReview: () => MemoryVerse[];
  markAsMastered: (id: string) => void;
  
  // Statistics
  getStats: () => {
    total: number;
    mastered: number;
    dueToday: number;
    reviewedToday: number;
    streak: number;
  };
  
  // Settings
  setDailyGoal: (goal: number) => void;
  resetDailyProgress: () => void;
}

// Spaced Repetition Algorithm (SM-2)
function calculateNextReview(verse: MemoryVerse, quality: number): Partial<MemoryVerse> {
  // quality: 0-5
  // 0-2: forgot, 3: hard, 4: good, 5: easy
  
  let newEaseFactor = verse.easeFactor;
  let newInterval = verse.interval;
  
  if (quality >= 3) {
    // Correct answer
    if (verse.reviewCount === 0) {
      newInterval = 1;
    } else if (verse.reviewCount === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(verse.interval * verse.easeFactor);
    }
    
    // Adjust ease factor
    newEaseFactor = verse.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newEaseFactor = Math.max(1.3, newEaseFactor); // Minimum ease factor
  } else {
    // Incorrect answer - reset interval but keep progress
    newInterval = 1;
    newEaseFactor = Math.max(1.3, verse.easeFactor - 0.2);
  }
  
  const now = Date.now();
  const nextReview = now + (newInterval * 24 * 60 * 60 * 1000);
  
  return {
    lastReviewed: now,
    nextReview,
    reviewCount: verse.reviewCount + 1,
    easeFactor: newEaseFactor,
    interval: newInterval,
    mastered: newInterval >= 30 && quality >= 4, // Mastered if interval is 30+ days
  };
}

export const useMemoryStore = create<MemoryState & MemoryActions>()(
  persist(
    (set, get) => ({
      verses: [],
      dailyGoal: 10,
      reviewedToday: 0,
      lastReviewDate: new Date().toDateString(),

      addVerse: (verseRef, verseText, translation, category, tags = []) => {
        const newVerse: MemoryVerse = {
          id: uuidv4(),
          verseRef,
          verseText,
          translation,
          category,
          tags,
          createdAt: Date.now(),
          nextReview: Date.now(), // Due immediately
          reviewCount: 0,
          easeFactor: 2.5, // Starting ease factor
          interval: 0,
          mastered: false,
        };
        
        set((state) => ({
          verses: [newVerse, ...state.verses],
        }));
      },

      removeVerse: (id) => {
        set((state) => ({
          verses: state.verses.filter((v) => v.id !== id),
        }));
      },

      reviewVerse: (id, quality) => {
        const state = get();
        
        // Check if we need to reset daily progress
        const today = new Date().toDateString();
        if (state.lastReviewDate !== today) {
          set({ reviewedToday: 0, lastReviewDate: today });
        }
        
        set((state) => ({
          verses: state.verses.map((verse) => {
            if (verse.id === id) {
              return {
                ...verse,
                ...calculateNextReview(verse, quality),
              };
            }
            return verse;
          }),
          reviewedToday: state.reviewedToday + 1,
        }));
      },

      getVersesDueToday: () => {
        const now = Date.now();
        return get().verses.filter((v) => v.nextReview <= now && !v.mastered);
      },

      getVersesToReview: () => {
        const now = Date.now();
        return get().verses
          .filter((v) => v.nextReview <= now && !v.mastered)
          .sort((a, b) => a.nextReview - b.nextReview);
      },

      markAsMastered: (id) => {
        set((state) => ({
          verses: state.verses.map((v) =>
            v.id === id ? { ...v, mastered: true } : v
          ),
        }));
      },

      getStats: () => {
        const state = get();
        const verses = state.verses;
        const now = Date.now();
        
        // Check if we need to reset daily progress
        const today = new Date().toDateString();
        const reviewedToday = state.lastReviewDate === today ? state.reviewedToday : 0;
        
        // Calculate streak (consecutive days with reviews)
        let streak = 0;
        const msPerDay = 24 * 60 * 60 * 1000;
        const reviewDates = new Set(
          verses
            .filter((v) => v.lastReviewed)
            .map((v) => new Date(v.lastReviewed!).toDateString())
        );
        
        let currentDate = new Date();
        while (reviewDates.has(currentDate.toDateString())) {
          streak++;
          currentDate = new Date(currentDate.getTime() - msPerDay);
        }
        
        return {
          total: verses.length,
          mastered: verses.filter((v) => v.mastered).length,
          dueToday: verses.filter((v) => v.nextReview <= now && !v.mastered).length,
          reviewedToday,
          streak,
        };
      },

      setDailyGoal: (goal) => {
        set({ dailyGoal: goal });
      },

      resetDailyProgress: () => {
        set({ reviewedToday: 0, lastReviewDate: new Date().toDateString() });
      },
    }),
    {
      name: 'memory-storage',
    }
  )
);

