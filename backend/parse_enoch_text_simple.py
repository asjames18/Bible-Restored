#!/usr/bin/env python3
"""
Parse a simple text format of the complete Book of Enoch into JSON.

Expected input format (flexible):
  CHAPTER 1
  1. Verse text here
  2. Next verse text
  
  CHAPTER 2
  1. Another verse
  ...

Also handles:
  - "Chapter 1" (any case)
  - "1" as verse number (with or without period)
  - "1:1" format
  - Multiple lines per verse (joins them)

Usage:
  python backend/parse_enoch_text_simple.py backend/build/enoch_complete.txt frontend/public/translations/restored_kjv.extras.json
"""

import io
import json
import os
import re
import sys
from collections import OrderedDict


def parse_simple_enoch_text(text_path: str) -> OrderedDict:
    """Parse simple text format into chapter/verse structure."""
    
    enoch_data = OrderedDict()
    current_chapter = None
    current_verse = None
    verse_buffer = []
    
    # Regex patterns
    chapter_re = re.compile(r'^\s*(?:CHAPTER|Chapter|chapter)\s+(\d{1,3})', re.IGNORECASE)
    verse_num_re = re.compile(r'^\s*(\d{1,3})[:.\s]\s*(.*)$')
    
    with io.open(text_path, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            line = line.rstrip()
            
            # Check for chapter header
            m_ch = chapter_re.match(line)
            if m_ch:
                # Save previous verse
                if current_chapter and current_verse and verse_buffer:
                    if current_chapter not in enoch_data:
                        enoch_data[current_chapter] = OrderedDict()
                    enoch_data[current_chapter][current_verse] = ' '.join(verse_buffer)
                    verse_buffer = []
                
                current_chapter = m_ch.group(1)
                current_verse = None
                continue
            
            if not current_chapter:
                continue
            
            # Check for verse number at start of line
            m_v = verse_num_re.match(line)
            if m_v:
                # Save previous verse
                if current_verse and verse_buffer:
                    if current_chapter not in enoch_data:
                        enoch_data[current_chapter] = OrderedDict()
                    enoch_data[current_chapter][current_verse] = ' '.join(verse_buffer)
                    verse_buffer = []
                
                current_verse = m_v.group(1)
                text = m_v.group(2).strip()
                if text:
                    verse_buffer.append(text)
            elif line.strip() and current_verse:
                # Continuation of current verse
                verse_buffer.append(line.strip())
    
    # Save last verse
    if current_chapter and current_verse and verse_buffer:
        if current_chapter not in enoch_data:
            enoch_data[current_chapter] = OrderedDict()
        enoch_data[current_chapter][current_verse] = ' '.join(verse_buffer)
    
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


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: python backend/parse_enoch_text_simple.py <input_txt> <output_json>")
        print()
        print("Example:")
        print("  python backend/parse_enoch_text_simple.py backend/build/enoch_complete.txt frontend/public/translations/restored_kjv.extras.json")
        return 2
    
    in_path = sys.argv[1]
    out_path = sys.argv[2]
    
    if not os.path.exists(in_path):
        print(f"Input file not found: {in_path}")
        print()
        print("Please download the complete Book of Enoch and save it as a text file.")
        print()
        print("Recommended sources:")
        print("  1. https://www.ccel.org/c/charles/otpseudepig/enoch.htm")
        print("  2. https://archive.sacred-texts.com/bib/bep/index.htm")
        print("  3. https://www.pseudepigrapha.com/pseudepigrapha/enoch1.htm")
        print()
        print("Save as: backend/build/enoch_complete.txt")
        return 2
    
    print(f"Parsing {in_path}...")
    enoch_chapters = parse_simple_enoch_text(in_path)
    
    # Count non-empty chapters
    non_empty = sum(1 for ch in enoch_chapters.values() if ch)
    total_verses = sum(len(verses) for verses in enoch_chapters.values())
    
    print(f"Extracted {non_empty} chapters with content")
    print(f"Total verses: {total_verses}")
    print(f"Padded to 108 chapters total")
    
    data = {"Book of Enoch": enoch_chapters}
    
    # Save to output
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with io.open(out_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Wrote {out_path}")
    print()
    print("Next steps:")
    print("  1. python backend/process_extras_preserve_structure.py")
    print("  2. Reload Bible data in the app")
    return 0


if __name__ == "__main__":
    sys.exit(main())

