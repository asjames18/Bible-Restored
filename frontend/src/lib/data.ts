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

// Progressive loading with progress callback
export async function loadFullBible(
  id: string = 'restored_kjv',
  onProgress?: (percent: number) => void
): Promise<BibleData> {
  const LOAD_TIMEOUT = 30000; // 30 second timeout
  
  try {
    // Check cache first
    const cached = await get(`bible-${id}`);
    if (cached) {
      const bookCount = Object.keys(cached).length;
      console.log(`Loaded ${id} from cache (${bookCount} books)`);
      
      // If cached data is incomplete (less than 66 books), force reload
      if (bookCount < 66) {
        console.warn(`Cached data incomplete (${bookCount}/66 books), reloading...`);
        await set(`bible-${id}`, null); // Clear bad cache
      } else {
        onProgress?.(100);
        return cached;
      }
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
    console.log(`Parsing Bible data... size: ${text.length} chars`);
    
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
    
    const bookCount = Object.keys(data).length;
    console.log(`Parsed Bible data: ${bookCount} books`);
    
    if (bookCount === 0) {
      throw new Error('Bible data is empty - please try reloading');
    }
    
    if (bookCount < 66) {
      console.warn(`Bible data incomplete: only ${bookCount} books loaded`);
    }
    
    // Cache the data
    await set(`bible-${id}`, data);
    console.log(`Cached ${id} for offline use (${bookCount} books)`);
    
    onProgress?.(100);
    return data;
    
  } catch (error) {
    console.error(`Failed to load full Bible ${id}:`, error);
    throw error;
  }
}

// Preload priority books (Genesis + Matthew)
export async function preloadPriorityBooks(_id: string): Promise<Partial<BibleData>> {
  try {
    const priorityBooks = ['Genesis', 'Matthew'];
    const result: Partial<BibleData> = {};
    
    for (const book of priorityBooks) {
      try {
        const response = await fetch(`/translations/${book}.json`);
        if (response.ok) {
          const bookData = await response.json();
          result[book] = bookData;
          console.log(`Preloaded ${book}`);
        }
      } catch (error) {
        console.warn(`Failed to preload ${book}:`, error);
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


