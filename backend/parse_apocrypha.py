#!/usr/bin/env python3
"""
Parse Apocrypha/Deuterocanonical books from various text formats into JSON.

Supports common formats:
- Project Gutenberg plain text
- KJV 1611 format
- Sacred-texts.com format

Usage:
  python backend/parse_apocrypha.py backend/build/apocrypha_complete.txt frontend/public/translations/restored_kjv.apocrypha.json
"""

import io
import json
import os
import re
import sys
from collections import OrderedDict


# Mapping of common book name variations to standard names
BOOK_NAME_MAP = {
    "TOBIT": "Tobit",
    "JUDITH": "Judith",
    "THE WISDOM OF SOLOMON": "Wisdom of Solomon",
    "WISDOM": "Wisdom of Solomon",
    "ECCLESIASTICUS": "Sirach",
    "SIRACH": "Sirach",
    "BARUCH": "Baruch",
    "THE FIRST BOOK OF THE MACCABEES": "1 Maccabees",
    "1 MACCABEES": "1 Maccabees",
    "I MACCABEES": "1 Maccabees",
    "THE SECOND BOOK OF THE MACCABEES": "2 Maccabees",
    "2 MACCABEES": "2 Maccabees",
    "II MACCABEES": "2 Maccabees",
    "1 ESDRAS": "1 Esdras",
    "2 ESDRAS": "2 Esdras",
    "PRAYER OF MANASSEH": "Prayer of Manasseh",
    "SUSANNA": "Susanna",
    "BEL AND THE DRAGON": "Bel and the Dragon",
    "SONG OF THE THREE HOLY CHILDREN": "Song of the Three Holy Children",
    "PRAYER OF AZARIAH": "Prayer of Azariah",
}


def normalize_book_name(name: str) -> str:
    """Normalize book name to standard format."""
    name_upper = name.strip().upper()
    return BOOK_NAME_MAP.get(name_upper, name.strip().title())


def parse_apocrypha_text(text_path: str) -> dict:
    """
    Parse Apocrypha text file into book/chapter/verse structure.
    
    Handles multiple format variations.
    """
    
    apocrypha_data = OrderedDict()
    current_book = None
    current_chapter = None
    
    # Regex patterns
    # Book headers (various formats)
    book_res = [
        re.compile(r'^\s*(?:THE\s+)?(?:BOOK\s+OF\s+)?([A-Z][A-Z\s]+?)(?:\s+OF\s+[A-Z\s]+)?$'),
        re.compile(r'^\s*([1-4]\s+[A-Z][A-Z\s]+)$'),  # "1 MACCABEES"
    ]
    
    # Chapter headers
    chapter_res = [
        re.compile(r'^\s*CHAPTER\s+(\d{1,3})', re.IGNORECASE),
        re.compile(r'^([A-Za-z\s]+)\s+(\d{1,3})$'),  # "Tobit 1"
    ]
    
    # Verse patterns
    verse_re = re.compile(r'^\s*(\d{1,3})[:.\s]\s*(.+)$')
    
    with io.open(text_path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    for i, raw_line in enumerate(lines):
        line = raw_line.strip()
        
        if not line or len(line) < 3:
            continue
        
        # Try to match book header
        if line.isupper() and len(line.split()) <= 8:
            for book_re in book_res:
                m = book_re.match(line)
                if m:
                    book_name = normalize_book_name(m.group(1))
                    # Verify it's a real book name (not just any uppercase line)
                    if any(known in book_name.upper() for known in [
                        "TOBIT", "JUDITH", "WISDOM", "SIRACH", "ECCLESIASTICUS",
                        "BARUCH", "MACCABEES", "ESDRAS", "MANASSEH", "SUSANNA",
                        "BEL", "DRAGON", "AZARIAH"
                    ]):
                        current_book = book_name
                        current_chapter = None
                        if current_book not in apocrypha_data:
                            apocrypha_data[current_book] = OrderedDict()
                        print(f"Found book: {current_book}")
                        break
        
        if not current_book:
            continue
        
        # Try to match chapter header
        for chapter_re in chapter_res:
            m = chapter_re.match(line)
            if m:
                if len(m.groups()) == 2:
                    # Format: "Tobit 1"
                    book_name = normalize_book_name(m.group(1))
                    chapter_num = m.group(2)
                    if book_name == current_book or current_book in book_name:
                        current_chapter = chapter_num
                        if current_chapter not in apocrypha_data[current_book]:
                            apocrypha_data[current_book][current_chapter] = OrderedDict()
                        break
                else:
                    # Format: "CHAPTER 1"
                    current_chapter = m.group(1)
                    if current_chapter not in apocrypha_data[current_book]:
                        apocrypha_data[current_book][current_chapter] = OrderedDict()
                    break
        
        if not current_chapter:
            continue
        
        # Try to match verse
        m_v = verse_re.match(line)
        if m_v:
            verse_num = m_v.group(1)
            verse_text = m_v.group(2).strip()
            
            # Clean up verse text
            verse_text = re.sub(r'\s+', ' ', verse_text)
            
            if verse_text:
                apocrypha_data[current_book][current_chapter][verse_num] = verse_text
    
    return apocrypha_data


def clean_and_validate(data: dict) -> dict:
    """Remove empty books/chapters and validate structure."""
    cleaned = OrderedDict()
    
    for book_name, chapters in data.items():
        if not chapters:
            continue
        
        cleaned_chapters = OrderedDict()
        for chapter_num, verses in chapters.items():
            if verses:
                cleaned_chapters[chapter_num] = verses
        
        if cleaned_chapters:
            cleaned[book_name] = cleaned_chapters
    
    return cleaned


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: python backend/parse_apocrypha.py <input_txt> <output_json>")
        print()
        print("Example:")
        print("  python backend/parse_apocrypha.py backend/build/apocrypha_complete.txt frontend/public/translations/restored_kjv.apocrypha.json")
        print()
        print("Download sources:")
        print("  - Project Gutenberg: https://www.gutenberg.org/files/124/124-0.txt")
        print("  - KJV 1611: https://www.1611bible.online/Apocrypha/")
        print("  - Global Grey: https://www.globalgreyebooks.com/apocrypha-ebook.html")
        return 2
    
    in_path = sys.argv[1]
    out_path = sys.argv[2]
    
    if not os.path.exists(in_path):
        print(f"Input file not found: {in_path}")
        print()
        print("Please download the Apocrypha text file first.")
        print("See backend/APOCRYPHA_GUIDE.md for instructions.")
        return 2
    
    print(f"Parsing {in_path}...")
    apocrypha_data = parse_apocrypha_text(in_path)
    
    print("\nCleaning and validating...")
    apocrypha_data = clean_and_validate(apocrypha_data)
    
    # Statistics
    total_books = len(apocrypha_data)
    total_chapters = sum(len(chapters) for chapters in apocrypha_data.values())
    total_verses = sum(
        len(verses) 
        for book in apocrypha_data.values() 
        for verses in book.values()
    )
    
    print(f"\n✅ Extracted:")
    print(f"   - {total_books} books")
    print(f"   - {total_chapters} chapters")
    print(f"   - {total_verses} verses")
    print()
    print("Books found:")
    for book_name, chapters in apocrypha_data.items():
        chapter_count = len(chapters)
        verse_count = sum(len(v) for v in chapters.values())
        print(f"   - {book_name}: {chapter_count} chapters, {verse_count} verses")
    
    # Save to output
    os.makedirs(os.path.dirname(out_path) or '.', exist_ok=True)
    with io.open(out_path, 'w', encoding='utf-8') as f:
        json.dump(apocrypha_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Wrote {out_path}")
    print()
    print("Next steps:")
    print(f"  1. python backend/process_extras_preserve_structure.py {out_path}")
    print("  2. Reload Bible data in the app")
    print()
    print("To merge with Book of Enoch:")
    print("  - Manually combine with restored_kjv.extras.json")
    print("  - Or keep as separate file (app auto-loads *.extras.json)")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())

