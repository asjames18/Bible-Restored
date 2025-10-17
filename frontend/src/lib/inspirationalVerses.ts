/**
 * Curated list of inspirational Bible verses
 * These verses are selected for their uplifting, encouraging, and faith-building messages
 */

export interface InspirationalVerse {
  book: string;
  chapter: string;
  verse: string;
  theme?: string;
}

export const INSPIRATIONAL_VERSES: InspirationalVerse[] = [
  // Trust & Faith
  { book: "Proverbs", chapter: "3", verse: "5", theme: "Trust" },
  { book: "Proverbs", chapter: "3", verse: "6", theme: "Trust" },
  { book: "Hebrews", chapter: "11", verse: "1", theme: "Faith" },
  { book: "Matthew", chapter: "17", verse: "20", theme: "Faith" },
  { book: "Mark", chapter: "11", verse: "23", theme: "Faith" },
  
  // Strength & Courage
  { book: "Joshua", chapter: "1", verse: "9", theme: "Courage" },
  { book: "Philippians", chapter: "4", verse: "13", theme: "Strength" },
  { book: "Isaiah", chapter: "40", verse: "31", theme: "Strength" },
  { book: "Psalms", chapter: "46", verse: "1", theme: "Strength" },
  { book: "2 Timothy", chapter: "1", verse: "7", theme: "Courage" },
  
  // Love & Grace
  { book: "John", chapter: "3", verse: "16", theme: "Love" },
  { book: "Romans", chapter: "8", verse: "38", theme: "Love" },
  { book: "Romans", chapter: "8", verse: "39", theme: "Love" },
  { book: "1 Corinthians", chapter: "13", verse: "4", theme: "Love" },
  { book: "1 Corinthians", chapter: "13", verse: "13", theme: "Love" },
  { book: "1 John", chapter: "4", verse: "19", theme: "Love" },
  { book: "Ephesians", chapter: "2", verse: "8", theme: "Grace" },
  
  // Peace & Comfort
  { book: "John", chapter: "14", verse: "27", theme: "Peace" },
  { book: "Philippians", chapter: "4", verse: "6", theme: "Peace" },
  { book: "Philippians", chapter: "4", verse: "7", theme: "Peace" },
  { book: "Psalms", chapter: "23", verse: "4", theme: "Comfort" },
  { book: "Matthew", chapter: "11", verse: "28", theme: "Comfort" },
  { book: "2 Corinthians", chapter: "1", verse: "3", theme: "Comfort" },
  { book: "Romans", chapter: "15", verse: "13", theme: "Peace" },
  
  // Hope & Joy
  { book: "Jeremiah", chapter: "29", verse: "11", theme: "Hope" },
  { book: "Romans", chapter: "8", verse: "28", theme: "Hope" },
  { book: "Romans", chapter: "15", verse: "13", theme: "Hope" },
  { book: "Psalms", chapter: "16", verse: "11", theme: "Joy" },
  { book: "Nehemiah", chapter: "8", verse: "10", theme: "Joy" },
  { book: "James", chapter: "1", verse: "2", theme: "Joy" },
  
  // Guidance & Wisdom
  { book: "Psalms", chapter: "119", verse: "105", theme: "Guidance" },
  { book: "James", chapter: "1", verse: "5", theme: "Wisdom" },
  { book: "Proverbs", chapter: "2", verse: "6", theme: "Wisdom" },
  { book: "Proverbs", chapter: "16", verse: "3", theme: "Guidance" },
  { book: "Isaiah", chapter: "30", verse: "21", theme: "Guidance" },
  
  // Forgiveness & Mercy
  { book: "1 John", chapter: "1", verse: "9", theme: "Forgiveness" },
  { book: "Psalms", chapter: "103", verse: "12", theme: "Forgiveness" },
  { book: "Ephesians", chapter: "1", verse: "7", theme: "Forgiveness" },
  { book: "Micah", chapter: "7", verse: "18", theme: "Mercy" },
  
  // Protection & Safety
  { book: "Psalms", chapter: "91", verse: "1", theme: "Protection" },
  { book: "Psalms", chapter: "91", verse: "2", theme: "Protection" },
  { book: "Psalms", chapter: "91", verse: "11", theme: "Protection" },
  { book: "Psalms", chapter: "121", verse: "7", theme: "Protection" },
  { book: "Psalms", chapter: "121", verse: "8", theme: "Protection" },
  
  // Victory & Success
  { book: "Romans", chapter: "8", verse: "37", theme: "Victory" },
  { book: "1 Corinthians", chapter: "15", verse: "57", theme: "Victory" },
  { book: "Psalms", chapter: "118", verse: "6", theme: "Victory" },
  { book: "Joshua", chapter: "1", verse: "8", theme: "Success" },
  
  // New Life & Transformation
  { book: "2 Corinthians", chapter: "5", verse: "17", theme: "Transformation" },
  { book: "Romans", chapter: "12", verse: "2", theme: "Transformation" },
  { book: "Ephesians", chapter: "4", verse: "22", theme: "Transformation" },
  { book: "Ephesians", chapter: "4", verse: "23", theme: "Transformation" },
  
  // Praise & Worship
  { book: "Psalms", chapter: "100", verse: "4", theme: "Praise" },
  { book: "Psalms", chapter: "150", verse: "6", theme: "Praise" },
  { book: "Psalms", chapter: "34", verse: "1", theme: "Praise" },
  
  // Promise & Faithfulness
  { book: "Deuteronomy", chapter: "31", verse: "6", theme: "Promise" },
  { book: "Hebrews", chapter: "13", verse: "5", theme: "Promise" },
  { book: "Lamentations", chapter: "3", verse: "22", theme: "Faithfulness" },
  { book: "Lamentations", chapter: "3", verse: "23", theme: "Faithfulness" },
  { book: "2 Timothy", chapter: "2", verse: "13", theme: "Faithfulness" },
  
  // Prayer & Communication
  { book: "Matthew", chapter: "7", verse: "7", theme: "Prayer" },
  { book: "Matthew", chapter: "21", verse: "22", theme: "Prayer" },
  { book: "1 Thessalonians", chapter: "5", verse: "17", theme: "Prayer" },
  { book: "Psalms", chapter: "145", verse: "18", theme: "Prayer" },
  
  // Perseverance & Endurance
  { book: "Galatians", chapter: "6", verse: "9", theme: "Perseverance" },
  { book: "James", chapter: "1", verse: "12", theme: "Perseverance" },
  { book: "Hebrews", chapter: "12", verse: "1", theme: "Endurance" },
  { book: "1 Corinthians", chapter: "16", verse: "13", theme: "Perseverance" },
  
  // Light & Truth
  { book: "John", chapter: "8", verse: "12", theme: "Light" },
  { book: "John", chapter: "14", verse: "6", theme: "Truth" },
  { book: "Psalms", chapter: "27", verse: "1", theme: "Light" },
  { book: "Matthew", chapter: "5", verse: "14", theme: "Light" },
  
  // Blessing & Favor
  { book: "Numbers", chapter: "6", verse: "24", theme: "Blessing" },
  { book: "Numbers", chapter: "6", verse: "25", theme: "Blessing" },
  { book: "Numbers", chapter: "6", verse: "26", theme: "Blessing" },
  { book: "Psalms", chapter: "5", verse: "12", theme: "Favor" },
  
  // Goodness & Provision
  { book: "Psalms", chapter: "23", verse: "1", theme: "Provision" },
  { book: "Psalms", chapter: "34", verse: "8", theme: "Goodness" },
  { book: "Matthew", chapter: "6", verse: "33", theme: "Provision" },
  { book: "Philippians", chapter: "4", verse: "19", theme: "Provision" },
];

/**
 * Get a verse of the day based on the current date
 * Uses a deterministic algorithm so the same verse appears each day
 */
export function getVerseOfTheDay(date: Date = new Date()): InspirationalVerse {
  // Create a seed from the date (YYYYMMDD format)
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  
  // Use seed to select a verse (deterministic but appears random)
  const index = seed % INSPIRATIONAL_VERSES.length;
  
  return INSPIRATIONAL_VERSES[index];
}

/**
 * Get a random inspirational verse (for manual refresh)
 */
export function getRandomInspirationalVerse(): InspirationalVerse {
  const index = Math.floor(Math.random() * INSPIRATIONAL_VERSES.length);
  return INSPIRATIONAL_VERSES[index];
}

/**
 * Get verses by theme
 */
export function getVersesByTheme(theme: string): InspirationalVerse[] {
  return INSPIRATIONAL_VERSES.filter(v => v.theme === theme);
}

/**
 * Get all available themes
 */
export function getAvailableThemes(): string[] {
  const themes = new Set(
    INSPIRATIONAL_VERSES
      .map(v => v.theme)
      .filter((theme): theme is string => theme !== undefined)
  );
  return Array.from(themes).sort();
}

