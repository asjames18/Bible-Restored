#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fetch complete KJV Bible from a direct JSON source
Downloads the complete Bible and saves to data/kjv.json
"""

import json
import os
import sys
import requests
from typing import Dict, Any

# Fix Windows console encoding issues
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Direct download URL for complete KJV Bible JSON
KJV_JSON_URL = "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json"

# Book name mapping (API uses different names)
BOOK_NAME_MAP = {
    "1 Samuel": "1 Samuel",
    "2 Samuel": "2 Samuel",
    "1 Kings": "1 Kings",
    "2 Kings": "2 Kings",
    "1 Chronicles": "1 Chronicles",
    "2 Chronicles": "2 Chronicles",
    "Song of Solomon": "Song of Solomon",
    "1 Corinthians": "1 Corinthians",
    "2 Corinthians": "2 Corinthians",
    "1 Thessalonians": "1 Thessalonians",
    "2 Thessalonians": "2 Thessalonians",
    "1 Timothy": "1 Timothy",
    "2 Timothy": "2 Timothy",
    "1 Peter": "1 Peter",
    "2 Peter": "2 Peter",
    "1 John": "1 John",
    "2 John": "2 John",
    "3 John": "3 John",
}

def fetch_complete_bible() -> Dict[str, Dict[str, Dict[str, str]]]:
    """Fetch complete KJV Bible from direct JSON source"""
    print("KJV Bible Fetcher")
    print("=" * 50)
    print(f"Downloading from: {KJV_JSON_URL}")
    
    try:
        response = requests.get(KJV_JSON_URL, timeout=60)
        response.raise_for_status()
        
        print("✓ Download successful!")
        print("Processing Bible data...")
        
        # Parse the JSON (handle UTF-8 BOM)
        content = response.content.decode('utf-8-sig')
        source_data = json.loads(content)
        
        # Convert to our format: {book: {chapter: {verse: text}}}
        bible_data = {}
        total_verses = 0
        
        for book_data in source_data:
            book_name = book_data.get('name', '')
            chapters = book_data.get('chapters', [])
            
            if not book_name or not chapters:
                continue
            
            # Use mapped name if available
            book_name = BOOK_NAME_MAP.get(book_name, book_name)
            
            book_chapters = {}
            for chapter_idx, chapter_verses_list in enumerate(chapters, 1):
                chapter_num = str(chapter_idx)
                
                # Each chapter is a list of verse texts
                chapter_verses = {}
                for verse_idx, verse_text in enumerate(chapter_verses_list, 1):
                    verse_num = str(verse_idx)
                    
                    if verse_text and verse_text.strip():
                        chapter_verses[verse_num] = verse_text.strip()
                        total_verses += 1
                
                if chapter_verses:
                    book_chapters[chapter_num] = chapter_verses
            
            if book_chapters:
                bible_data[book_name] = book_chapters
                book_verses = sum(len(ch) for ch in book_chapters.values())
                print(f"  ✓ {book_name}: {len(book_chapters)} chapters, {book_verses} verses")
        
        print(f"\nDownload complete!")
        print(f"Books: {len(bible_data)}")
        print(f"Total verses: {total_verses}")
        
        return bible_data
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Error downloading Bible: {e}")
        raise
    except json.JSONDecodeError as e:
        print(f"✗ Error parsing JSON: {e}")
        raise

def save_bible_data(bible_data: Dict[str, Any], output_path: str) -> None:
    """Save Bible data to JSON file"""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(bible_data, f, indent=2, ensure_ascii=False)
    
    file_size = os.path.getsize(output_path) / (1024 * 1024)  # MB
    print(f"Saved to {output_path} ({file_size:.1f} MB)")

def verify_bible_data(bible_data: Dict[str, Any]) -> None:
    """Verify the downloaded Bible data"""
    print("\nVerifying Bible data...")
    
    # Check key books exist
    key_books = ["Genesis", "Psalms", "Matthew", "Revelation"]
    for book in key_books:
        if book in bible_data:
            chapters = len(bible_data[book])
            verses = sum(len(chapter) for chapter in bible_data[book].values())
            print(f"  ✓ {book}: {chapters} chapters, {verses} verses")
        else:
            print(f"  ✗ Missing: {book}")
    
    # Check specific verses for verification
    test_verses = [
        ("Genesis", "1", "1", "In the beginning"),
        ("Genesis", "2", "7", "God formed"),
        ("Psalms", "23", "1", "The LORD is my shepherd"),
        ("Matthew", "1", "1", "The book of the generation"),
        ("John", "3", "16", "For God so loved"),
        ("Revelation", "22", "21", "The grace of our Lord")
    ]
    
    print("\nVerifying key verses:")
    for book, chapter, verse, expected_text in test_verses:
        if book in bible_data and chapter in bible_data[book] and verse in bible_data[book][chapter]:
            verse_text = bible_data[book][chapter][verse]
            if expected_text.lower() in verse_text.lower():
                print(f"  ✓ {book} {chapter}:{verse} - Found")
            else:
                print(f"  ⚠ {book} {chapter}:{verse} - Text: {verse_text[:50]}...")
        else:
            print(f"  ✗ {book} {chapter}:{verse} - Missing")

def main():
    """Main function"""
    try:
        # Fetch complete Bible
        bible_data = fetch_complete_bible()
        
        if not bible_data:
            print("✗ No Bible data received!")
            return 1
        
        # Save to file
        output_path = "data/kjv.json"
        save_bible_data(bible_data, output_path)
        
        # Verify the data
        verify_bible_data(bible_data)
        
        print("\n✓ KJV Bible download completed successfully!")
        return 0
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(main())
