#!/usr/bin/env python3
"""
Parse CCEL (Christian Classics Ethereal Library) format of Book of Enoch.

This format has:
- [Chapter N] headers
- Verses embedded in paragraphs with numbers like "1 text here 2 more text 3 even more"
- Numbers can be standalone or embedded in text flow

Usage:
  python backend/parse_enoch_ccel.py backend/build/enoch_complete.txt frontend/public/translations/restored_kjv.extras.json
"""

import io
import json
import os
import re
import sys
from collections import OrderedDict


def parse_ccel_enoch(text_path: str) -> OrderedDict:
    """Parse CCEL format Enoch text into chapter/verse structure."""
    
    enoch_data = OrderedDict()
    current_chapter = None
    
    # Regex patterns
    chapter_re = re.compile(r'^\[Chapter\s+(\d{1,3})\]', re.IGNORECASE)
    
    with io.open(text_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Split into chapter sections
    chapter_sections = re.split(r'\[Chapter\s+(\d{1,3})\]', content, flags=re.IGNORECASE)
    
    # Process each chapter
    for i in range(1, len(chapter_sections), 2):
        if i + 1 >= len(chapter_sections):
            break
            
        chapter_num = chapter_sections[i]
        chapter_text = chapter_sections[i + 1]
        
        # Extract verses from the chapter text
        verses = extract_verses(chapter_text)
        
        if verses:
            enoch_data[chapter_num] = verses
    
    # Pad to 108 chapters
    for i in range(1, 109):
        chapter_key = str(i)
        if chapter_key not in enoch_data:
            enoch_data[chapter_key] = OrderedDict()
    
    # Sort chapters numerically
    sorted_data = OrderedDict()
    for i in range(1, 109):
        sorted_data[str(i)] = enoch_data.get(str(i), OrderedDict())
    
    return sorted_data


def extract_verses(text: str) -> OrderedDict:
    """
    Extract verses from chapter text.
    
    Verses are numbered (1, 2, 3, etc.) and may be:
    - At start of line
    - Embedded in text flow
    - Separated by spaces or appear inline
    """
    
    verses = OrderedDict()
    
    # Clean up the text
    text = text.strip()
    
    # Replace multiple spaces/newlines with single space for easier processing
    text = re.sub(r'\s+', ' ', text)
    
    # Pattern to split on verse numbers
    # Matches: " 1 ", " 2 ", etc. (number surrounded by spaces)
    # But not numbers that are clearly part of words or measurements
    parts = re.split(r'\s+(\d{1,3})\s+', text)
    
    if len(parts) <= 1:
        # No verse numbers found, treat entire text as verse 1
        clean_text = clean_verse_text(text)
        if clean_text:
            verses['1'] = clean_text
        return verses
    
    # First part (before first verse number) is usually intro/header - skip it
    # Process verse numbers and their text
    current_verse = None
    for i in range(1, len(parts), 2):
        if i >= len(parts):
            break
        
        verse_num = parts[i]
        verse_text = parts[i + 1] if i + 1 < len(parts) else ''
        
        # Only accept verse numbers 1-999
        try:
            num = int(verse_num)
            if 1 <= num <= 999:
                clean_text = clean_verse_text(verse_text)
                if clean_text:
                    verses[verse_num] = clean_text
        except ValueError:
            continue
    
    return verses


def clean_verse_text(text: str) -> str:
    """Clean up verse text - remove extra whitespace, etc."""
    # Remove leading/trailing whitespace
    text = text.strip()
    
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    
    # Remove common artifacts
    text = re.sub(r'\[.*?\]', '', text)  # Remove bracketed notes
    text = text.replace('  ', ' ')  # Double spaces
    
    return text.strip()


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: python backend/parse_enoch_ccel.py <input_txt> <output_json>")
        print()
        print("Example:")
        print("  python backend/parse_enoch_ccel.py backend/build/enoch_complete.txt frontend/public/translations/restored_kjv.extras.json")
        return 2
    
    in_path = sys.argv[1]
    out_path = sys.argv[2]
    
    if not os.path.exists(in_path):
        print(f"Input file not found: {in_path}")
        return 2
    
    print(f"Parsing {in_path}...")
    enoch_chapters = parse_ccel_enoch(in_path)
    
    # Count non-empty chapters
    non_empty = sum(1 for ch in enoch_chapters.values() if ch)
    total_verses = sum(len(verses) for verses in enoch_chapters.values())
    
    print(f"Extracted {non_empty} chapters with content")
    print(f"Total verses: {total_verses}")
    print(f"Padded to 108 chapters total")
    
    # Show sample
    if '1' in enoch_chapters and enoch_chapters['1']:
        first_verse = list(enoch_chapters['1'].values())[0]
        print(f"\nSample (Chapter 1, Verse 1):")
        print(f"  {first_verse[:100]}...")
    
    data = {"Book of Enoch": enoch_chapters}
    
    # Save to output
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with io.open(out_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\nWrote {out_path}")
    print()
    print("Next steps:")
    print("  1. python backend/process_extras_preserve_structure.py")
    print("  2. Reload Bible data in the app")
    return 0


if __name__ == "__main__":
    sys.exit(main())

