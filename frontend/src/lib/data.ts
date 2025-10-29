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
import { logger } from './logger';

export async function loadTranslation(id: string): Promise<BibleData> {
  try {
    // Try to load from IndexedDB first (offline-first)
    const cached = await get(`bible-${id}`);
    if (cached) {
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
        
        return data;
      } catch {
        // Silent fail, will try cache next
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
    } catch {
      // Silent fail
    }

    throw new Error(`No cached version of ${id} available and network is offline`);
  } catch (_error) {
    console.error(`Failed to load translation ${id}:`, _error);
    throw _error;
  }
}

export async function preloadTranslations(): Promise<void> {
  const loadPromises = listTranslations().map(async (translation) => {
    try {
      await loadTranslation(translation.id);
    } catch {
      // Silent preload failure
    }
  });

  await Promise.allSettled(loadPromises);
}

export async function clearCache(): Promise<void> {
  const keys = await get('bible-kjv') ? ['bible-kjv'] : [];
  const restoredKeys = await get('bible-restored_kjv') ? ['bible-restored_kjv'] : [];
  
  for (const key of [...keys, ...restoredKeys]) {
    await set(key, null);
  }
  
  logger.info('Bible cache cleared');
}

export function booksOrder(): string[] {
  return BOOKS_ORDER;
}

// Derive ordered list of books from a loaded Bible, preserving canonical order
// and appending any non-canonical (extra) books alphabetically at the end.
export function orderedBooksFrom(bible?: BibleData): string[] {
  if (!bible) return BOOKS_ORDER;
  const present = new Set(Object.keys(bible));
  const canonical = BOOKS_ORDER.filter((b) => present.has(b));
  const extras = Array.from(present).filter((b) => BOOKS_ORDER.indexOf(b) === -1);
  const uniqueExtras = Array.from(new Set(extras));
  uniqueExtras.sort((a, b) => a.localeCompare(b));
  return [...canonical, ...uniqueExtras];
}

// Progressive loading with progress callback
export async function loadFullBible(
  id: string = 'restored_kjv',
  onProgress?: (percent: number) => void
): Promise<BibleData> {
  const LOAD_TIMEOUT = 30000; // 30 second timeout
  
  try {
    // Check cache (IndexedDB)
    const cached = await get(`bible-${id}`);
    if (cached) {
      // Attempt to merge extras into cached data
      try {
        const extrasResponse = await fetch(`/translations/${id}.extras.json`, { cache: 'no-cache' });
        if (extrasResponse.ok) {
          const extras = await extrasResponse.json();
          if (extras && typeof extras === 'object') {
            const target = cached as Record<string, unknown>;
            for (const [bookName, chapters] of Object.entries(extras)) {
              target[bookName] = chapters as unknown;
            }
            await set(`bible-${id}`, cached);
          }
        }
      } catch {
        // ignore
      }
      onProgress?.(100);
      return cached;
    }

    // Fetch with progress tracking and timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), LOAD_TIMEOUT);
    
    let response;
    try {
      response = await fetch(`/translations/${id}.json`, { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to load translation: ${response.statusText}`);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('Loading timeout - please check your connection and try again');
      }
      throw fetchError;
    }

    const reader = response.body?.getReader();
    const contentLength = +(response.headers.get('Content-Length') ?? 0);
    
    if (!reader || !contentLength) {
      // Fallback to simple load
      const data = await response.json();
      await set(`bible-${id}`, data);
      onProgress?.(100);
      return data;
    }

    let receivedLength = 0;
    const chunks: Uint8Array[] = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      chunks.push(value);
      receivedLength += value.length;
      
      // Update progress
      const percent = Math.round((receivedLength / contentLength) * 100);
      onProgress?.(Math.min(percent, 95)); // Cap at 95% until parsing is done
    }
    
    // Combine chunks
    const chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }
    
    // Decode and parse
    const text = new TextDecoder('utf-8').decode(chunksAll);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Bible JSON:', parseError);
      throw new Error('Bible data is corrupted - please try clearing cache and reloading');
    }
    
    // Validate the data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid Bible data format');
    }
    
    if (Object.keys(data).length === 0) {
      throw new Error('Bible data is empty - please try reloading');
    }

    // Attempt to load optional extras file and merge if present
    try {
      const extrasResponse = await fetch(`/translations/${id}.extras.json`, { cache: 'no-cache' });
      if (extrasResponse.ok) {
        const extras = await extrasResponse.json();
        if (extras && typeof extras === 'object') {
          const target = data as Record<string, unknown>;
          for (const [bookName, chapters] of Object.entries(extras)) {
            target[bookName] = chapters as unknown;
          }
        }
      }
    } catch {
      // Ignore if no extras available
    }
    
    // Cache the data
    await set(`bible-${id}`, data);
    
    onProgress?.(100);
    return data;
    
  } catch (error) {
    console.error(`Failed to load full Bible ${id}:`, error);
    throw error;
  }
}

// Preload priority books (Genesis + Matthew)
export async function preloadPriorityBooks(_id: string): Promise<Partial<BibleData>> {
  void _id;
  try {
    const priorityBooks = ['Genesis', 'Matthew'];
    const result: Partial<BibleData> = {};
    
    for (const book of priorityBooks) {
      try {
        const response = await fetch(`/translations/${book}.json`);
        if (response.ok) {
          const bookData = await response.json();
          result[book] = bookData;
          logger.info(`Preloaded ${book}`);
        }
      } catch (error) {
        logger.warn(`Failed to preload ${book}:`, error);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Failed to preload priority books:', error);
    return {};
  }
}

// Get Bible statistics
export function getBibleStats(bible: BibleData): { books: number; verses: number } {
  const books = Object.keys(bible).length;
  const verses = Object.values(bible).reduce((total, book) => {
    return total + Object.values(book).reduce((bookTotal, chapter) => {
      return bookTotal + Object.keys(chapter).length;
    }, 0);
  }, 0);
  
  return { books, verses };
}


