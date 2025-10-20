import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Prayer {
  id: string;
  title: string;
  description: string;
  verseRef?: string; // e.g., "John 3:16"
  verseText?: string; // The actual verse text
  category: 'personal' | 'family' | 'health' | 'guidance' | 'thanksgiving' | 'other';
  status: 'active' | 'answered' | 'archived';
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  updatedAt: number;
  answeredAt?: number;
  answerNote?: string;
  tags: string[];
  reminderEnabled: boolean;
  reminderFrequency?: 'daily' | 'weekly' | 'monthly';
}

interface PrayerState {
  prayers: Prayer[];
}

interface PrayerActions {
  // CRUD operations
  addPrayer: (prayer: Omit<Prayer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePrayer: (id: string, updates: Partial<Prayer>) => void;
  deletePrayer: (id: string) => void;
  
  // Status management
  markAsAnswered: (id: string, answerNote?: string) => void;
  archivePrayer: (id: string) => void;
  unarchivePrayer: (id: string) => void;
  
  // Filtering and search
  getPrayersByStatus: (status: Prayer['status']) => Prayer[];
  getPrayersByCategory: (category: Prayer['category']) => Prayer[];
  getPrayersByPriority: (priority: Prayer['priority']) => Prayer[];
  getPrayersByTag: (tag: string) => Prayer[];
  searchPrayers: (query: string) => Prayer[];
  getPrayersForVerse: (verseRef: string) => Prayer[];
  
  // Statistics
  getPrayerStats: () => {
    total: number;
    active: number;
    answered: number;
    archived: number;
    byCategory: Record<Prayer['category'], number>;
    byPriority: Record<Prayer['priority'], number>;
  };
}

export const usePrayerStore = create<PrayerState & PrayerActions>()(
  persist(
    (set, get) => ({
      prayers: [],

      // CRUD operations
      addPrayer: (prayer) => {
        const newPrayer: Prayer = {
          ...prayer,
          id: uuidv4(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          prayers: [newPrayer, ...state.prayers],
        }));
      },

      updatePrayer: (id, updates) => {
        set((state) => ({
          prayers: state.prayers.map((prayer) =>
            prayer.id === id
              ? { ...prayer, ...updates, updatedAt: Date.now() }
              : prayer
          ),
        }));
      },

      deletePrayer: (id) => {
        set((state) => ({
          prayers: state.prayers.filter((prayer) => prayer.id !== id),
        }));
      },

      // Status management
      markAsAnswered: (id, answerNote) => {
        set((state) => ({
          prayers: state.prayers.map((prayer) =>
            prayer.id === id
              ? {
                  ...prayer,
                  status: 'answered' as const,
                  answeredAt: Date.now(),
                  answerNote,
                  updatedAt: Date.now(),
                }
              : prayer
          ),
        }));
      },

      archivePrayer: (id) => {
        set((state) => ({
          prayers: state.prayers.map((prayer) =>
            prayer.id === id
              ? { ...prayer, status: 'archived' as const, updatedAt: Date.now() }
              : prayer
          ),
        }));
      },

      unarchivePrayer: (id) => {
        set((state) => ({
          prayers: state.prayers.map((prayer) =>
            prayer.id === id
              ? { ...prayer, status: 'active' as const, updatedAt: Date.now() }
              : prayer
          ),
        }));
      },

      // Filtering and search
      getPrayersByStatus: (status) => {
        return get().prayers.filter((prayer) => prayer.status === status);
      },

      getPrayersByCategory: (category) => {
        return get().prayers.filter((prayer) => prayer.category === category);
      },

      getPrayersByPriority: (priority) => {
        return get().prayers.filter((prayer) => prayer.priority === priority);
      },

      getPrayersByTag: (tag) => {
        return get().prayers.filter((prayer) => prayer.tags.includes(tag));
      },

      searchPrayers: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().prayers.filter(
          (prayer) =>
            prayer.title.toLowerCase().includes(lowerQuery) ||
            prayer.description.toLowerCase().includes(lowerQuery) ||
            (prayer.verseRef && prayer.verseRef.toLowerCase().includes(lowerQuery)) ||
            (prayer.verseText && prayer.verseText.toLowerCase().includes(lowerQuery)) ||
            prayer.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },

      getPrayersForVerse: (verseRef) => {
        return get().prayers.filter((prayer) => prayer.verseRef === verseRef);
      },

      // Statistics
      getPrayerStats: () => {
        const prayers = get().prayers;
        const stats = {
          total: prayers.length,
          active: 0,
          answered: 0,
          archived: 0,
          byCategory: {
            personal: 0,
            family: 0,
            health: 0,
            guidance: 0,
            thanksgiving: 0,
            other: 0,
          } as Record<Prayer['category'], number>,
          byPriority: {
            low: 0,
            medium: 0,
            high: 0,
          } as Record<Prayer['priority'], number>,
        };

        prayers.forEach((prayer) => {
          // Count by status
          if (prayer.status === 'active') stats.active++;
          else if (prayer.status === 'answered') stats.answered++;
          else if (prayer.status === 'archived') stats.archived++;

          // Count by category
          stats.byCategory[prayer.category]++;

          // Count by priority
          stats.byPriority[prayer.priority]++;
        });

        return stats;
      },
    }),
    {
      name: 'prayer-storage',
    }
  )
);

