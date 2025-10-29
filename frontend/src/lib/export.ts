/**
 * Export functionality for user data
 * Exports bookmarks, notes, highlights, reading plans, prayers, and memory verses
 */

import { 
  useStudyStore, 
  type Bookmark, 
  type Note, 
  type Highlight 
} from '../store/studyStore';
import { 
  useHistoryStore, 
  type HistoryEntry 
} from '../store/historyStore';
import { 
  useReadingPlanStore, 
  type ReadingPlan, 
  type Achievement 
} from '../store/readingPlanStore';
import { 
  usePrayerStore, 
  type Prayer 
} from '../store/prayerStore';
import { 
  useMemoryStore, 
  type MemoryVerse 
} from '../store/memoryStore';

export interface ExportedData {
  version: string;
  exportDate: string;
  bibleVersion: string;
  data: {
    bookmarks: Bookmark[];
    notes: Note[];
    highlights: Highlight[];
    history: HistoryEntry[];
    readingPlans: ReadingPlan[];
    achievements: Achievement[];
    prayers: Prayer[];
    memoryVerses: MemoryVerse[];
  };
}

/**
 * Export all user data to JSON
 */
export function exportUserData(): ExportedData {
  const studyStore = useStudyStore.getState();
  const historyStore = useHistoryStore.getState();
  const readingPlanStore = useReadingPlanStore.getState();
  const prayerStore = usePrayerStore.getState();
  const memoryStore = useMemoryStore.getState();

  const exportedData: ExportedData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    bibleVersion: 'restored_kjv',
    data: {
      bookmarks: studyStore.bookmarks,
      notes: studyStore.notes,
      highlights: studyStore.highlights,
      history: historyStore.history,
      readingPlans: readingPlanStore.plans,
      achievements: readingPlanStore.achievements,
      prayers: prayerStore.prayers,
      memoryVerses: memoryStore.verses,
    },
  };

  return exportedData;
}

/**
 * Download exported data as JSON file
 */
export function downloadExportedData(): void {
  const data = exportUserData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const timestamp = new Date().toISOString().split('T')[0];
  link.href = url;
  link.download = `bible-app-backup-${timestamp}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Import user data from JSON
 */
export function importUserData(data: ExportedData): {
  success: boolean;
  imported: string[];
  errors: string[];
} {
  const imported: string[] = [];
  const errors: string[] = [];

  try {
    // Import bookmarks
    if (data.data.bookmarks && Array.isArray(data.data.bookmarks)) {
      const studyStore = useStudyStore.getState();
      data.data.bookmarks.forEach((bookmark) => {
        try {
          if (!studyStore.isBookmarked(bookmark.verseRef)) {
            studyStore.addBookmark(
              bookmark.verseRef,
              bookmark.verseText,
              bookmark.folder
            );
            imported.push('Bookmark');
          }
        } catch (err) {
          errors.push(`Failed to import bookmark: ${bookmark.verseRef}`);
        }
      });
    }

    // Import notes
    if (data.data.notes && Array.isArray(data.data.notes)) {
      const studyStore = useStudyStore.getState();
      data.data.notes.forEach((note) => {
        try {
          const existingNote = studyStore.getNote(note.verseRef);
          if (!existingNote) {
            studyStore.addNote(
              note.verseRef,
              note.content,
              note.title,
              note.tags
            );
            imported.push('Note');
          }
        } catch (err) {
          errors.push(`Failed to import note: ${note.verseRef}`);
        }
      });
    }

    // Import highlights
    if (data.data.highlights && Array.isArray(data.data.highlights)) {
      const studyStore = useStudyStore.getState();
      data.data.highlights.forEach((highlight) => {
        try {
          studyStore.addHighlight(highlight.verseRef, highlight.color);
          imported.push('Highlight');
        } catch (err) {
          errors.push(`Failed to import highlight: ${highlight.verseRef}`);
        }
      });
    }

    // Import reading plans
    if (data.data.readingPlans && Array.isArray(data.data.readingPlans)) {
      const planStore = useReadingPlanStore.getState();
      data.data.readingPlans.forEach((plan) => {
        try {
          planStore.addPlan(plan);
          imported.push('Reading Plan');
        } catch (err) {
          errors.push(`Failed to import plan: ${plan.name}`);
        }
      });
    }

    // Import prayers
    if (data.data.prayers && Array.isArray(data.data.prayers)) {
      const prayerStore = usePrayerStore.getState();
      data.data.prayers.forEach((prayer) => {
        try {
          prayerStore.addPrayer({
            title: prayer.title,
            description: prayer.description,
            verseRef: prayer.verseRef,
            verseText: prayer.verseText,
            category: prayer.category,
            status: prayer.status,
            priority: prayer.priority,
            answeredAt: prayer.answeredAt,
            answerNote: prayer.answerNote,
            tags: prayer.tags,
            reminderEnabled: prayer.reminderEnabled,
            reminderFrequency: prayer.reminderFrequency,
          });
          imported.push('Prayer');
        } catch (err) {
          errors.push('Failed to import prayer');
        }
      });
    }

    // Import memory verses
    if (data.data.memoryVerses && Array.isArray(data.data.memoryVerses)) {
      const memoryStore = useMemoryStore.getState();
      data.data.memoryVerses.forEach((verse) => {
        try {
          memoryStore.addVerse(
            verse.verseRef,
            verse.verseText,
            verse.translation,
            verse.category,
            verse.tags
          );
          imported.push('Memory Verse');
        } catch (err) {
          errors.push(`Failed to import memory verse: ${verse.verseRef}`);
        }
      });
    }

    return {
      success: imported.length > 0,
      imported,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      imported: [],
      errors: [`Failed to parse import data: ${error}`],
    };
  }
}

/**
 * Parse uploaded JSON file
 */
export function parseImportFile(file: File): Promise<ExportedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text) as ExportedData;
        
        // Validate structure
        if (!data.version || !data.data) {
          throw new Error('Invalid file format');
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Get export file size in readable format
 */
export function getExportSize(): string {
  const data = exportUserData();
  const json = JSON.stringify(data);
  const bytes = new Blob([json]).size;
  
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Get summary of exportable data
 */
export function getExportSummary(): {
  bookmarks: number;
  notes: number;
  highlights: number;
  history: number;
  plans: number;
  prayers: number;
  memoryVerses: number;
} {
  const studyStore = useStudyStore.getState();
  const historyStore = useHistoryStore.getState();
  const readingPlanStore = useReadingPlanStore.getState();
  const prayerStore = usePrayerStore.getState();
  const memoryStore = useMemoryStore.getState();

  return {
    bookmarks: studyStore.bookmarks.length,
    notes: studyStore.notes.length,
    highlights: studyStore.highlights.length,
    history: historyStore.history.length,
    plans: readingPlanStore.plans.length,
    prayers: prayerStore.prayers.length,
    memoryVerses: memoryStore.verses.length,
  };
}

