export interface BibleData {
  [book: string]: {
    [chapter: string]: {
      [verse: string]: string;
    };
  };
}

export interface Translation {
  id: string;
  label: string;
}

export const BOOKS_ORDER = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings",
  "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther",
  "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel",
  "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum",
  "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians",
  "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians",
  "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus",
  "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John",
  "3 John", "Jude", "Revelation"
];

export function listTranslations(): Translation[] {
  return [
    { id: 'restored_kjv', label: 'KJV (Restored Names)' },
    { id: 'kjv', label: 'KJV' }
  ];
}

import { get, set } from 'idb-keyval';

export async function loadTranslation(id: string): Promise<BibleData> {
  try {
    // Try to load from IndexedDB first (offline-first)
    const cached = await get(`bible-${id}`);
    if (cached) {
      console.log(`Loaded ${id} from cache`);
      return cached;
    }

    // If not cached, try to fetch from network
    if (navigator.onLine) {
      try {
        const response = await fetch(`/translations/${id}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translation: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Cache the data for offline use
        await set(`bible-${id}`, data);
        console.log(`Cached ${id} for offline use`);
        
        return data;
      } catch (networkError) {
        console.warn(`Network fetch failed for ${id}, checking for any cached version:`, networkError);
      }
    }

    // If we're offline or network failed, try to load from service worker cache
    try {
      const response = await fetch(`/translations/${id}.json`, { 
        cache: 'force-cache' 
      });
      if (response.ok) {
        const data = await response.json();
        await set(`bible-${id}`, data);
        return data;
      }
    } catch (cacheError) {
      console.warn(`Cache fetch also failed for ${id}:`, cacheError);
    }

    throw new Error(`No cached version of ${id} available and network is offline`);
  } catch (error) {
    console.error(`Failed to load translation ${id}:`, error);
    throw error;
  }
}

export async function preloadTranslations(): Promise<void> {
  console.log('Preloading translations for offline use...');
  
  const loadPromises = listTranslations().map(async (translation) => {
    try {
      await loadTranslation(translation.id);
      console.log(`Preloaded ${translation.id}`);
    } catch (error) {
      console.warn(`Failed to preload ${translation.id}:`, error);
    }
  });

  await Promise.allSettled(loadPromises);
  console.log('Translation preloading complete');
}

export async function clearCache(): Promise<void> {
  const keys = await get('bible-kjv') ? ['bible-kjv'] : [];
  const restoredKeys = await get('bible-restored_kjv') ? ['bible-restored_kjv'] : [];
  
  for (const key of [...keys, ...restoredKeys]) {
    await set(key, null);
  }
  
  console.log('Bible cache cleared');
}

export function booksOrder(): string[] {
  return BOOKS_ORDER;
}


