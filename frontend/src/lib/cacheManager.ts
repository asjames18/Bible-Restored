/**
 * Advanced cache manager for Bible data with LRU eviction and prefetching
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private maxSize: number;
  private ttl: number; // Time to live in milliseconds
  private prefetchQueue: Set<string>;
  private isPrefetching: boolean;

  constructor(maxSize: number = 50, ttl: number = 30 * 60 * 1000) {
    // Default: 50 items, 30 minutes TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.prefetchQueue = new Set();
    this.isPrefetching = false;
  }

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access stats
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    
    return entry.data as T;
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T): void {
    // Evict if at max size
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now(),
    });
  }

  /**
   * Check if key exists in cache and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear specific entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.prefetchQueue.clear();
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    let totalAccesses = 0;
    let avgAge = 0;
    const now = Date.now();

    for (const entry of this.cache.values()) {
      totalAccesses += entry.accessCount;
      avgAge += now - entry.timestamp;
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      totalAccesses,
      avgAge: this.cache.size > 0 ? avgAge / this.cache.size : 0,
      hitRate: 0, // Would need to track misses to calculate
    };
  }

  /**
   * Add to prefetch queue
   */
  queuePrefetch(key: string): void {
    this.prefetchQueue.add(key);
  }

  /**
   * Process prefetch queue
   */
  async processPrefetchQueue(
    fetchFn: (key: string) => Promise<any>
  ): Promise<void> {
    if (this.isPrefetching || this.prefetchQueue.size === 0) {
      return;
    }

    this.isPrefetching = true;

    // Process up to 3 items at a time
    const batch = Array.from(this.prefetchQueue).slice(0, 3);
    
    for (const key of batch) {
      if (!this.has(key)) {
        try {
          const data = await fetchFn(key);
          this.set(key, data);
        } catch (error) {
          console.error(`Prefetch failed for ${key}:`, error);
        }
      }
      this.prefetchQueue.delete(key);
    }

    this.isPrefetching = false;

    // Continue if more items in queue
    if (this.prefetchQueue.size > 0) {
      setTimeout(() => this.processPrefetchQueue(fetchFn), 100);
    }
  }
}

// Singleton instance
export const bibleCache = new CacheManager(50, 30 * 60 * 1000);

/**
 * Generate cache key for Bible chapter
 */
export function getChapterCacheKey(
  translation: string,
  book: string,
  chapter: string
): string {
  return `${translation}:${book}:${chapter}`;
}

/**
 * Generate cache key for full Bible
 */
export function getBibleCacheKey(translation: string): string {
  return `bible:${translation}`;
}

/**
 * Prefetch adjacent chapters
 */
export function prefetchAdjacentChapters(
  translation: string,
  book: string,
  chapter: number,
  totalChapters: number
): void {
  // Prefetch previous chapter
  if (chapter > 1) {
    const prevKey = getChapterCacheKey(translation, book, String(chapter - 1));
    bibleCache.queuePrefetch(prevKey);
  }

  // Prefetch next chapter
  if (chapter < totalChapters) {
    const nextKey = getChapterCacheKey(translation, book, String(chapter + 1));
    bibleCache.queuePrefetch(nextKey);
  }
}

/**
 * Get cached Bible data with fallback to fetch
 */
export async function getCachedBibleData(
  translation: string
): Promise<any> {
  const cacheKey = getBibleCacheKey(translation);
  
  // Try cache first
  const cached = bibleCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch if not in cache
  try {
    const response = await fetch(`/translations/${translation}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${translation}`);
    }
    
    const data = await response.json();
    bibleCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error loading Bible data for ${translation}:`, error);
    throw error;
  }
}

/**
 * Clear expired entries from cache
 */
export function clearExpiredCache(): void {
  const now = Date.now();
  const ttl = 30 * 60 * 1000; // 30 minutes

  for (const [key, entry] of (bibleCache as any).cache.entries()) {
    if (now - entry.timestamp > ttl) {
      bibleCache.delete(key);
    }
  }
}

// Clear expired cache every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(clearExpiredCache, 5 * 60 * 1000);
}

