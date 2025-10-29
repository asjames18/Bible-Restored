#!/usr/bin/env python3
"""
Convert a plain-text Book of Enoch into app JSON (book → chapter → verse).

Expected plain text shape:
  Chapter 1
  1 Text of verse one
  2 Text of verse two
  ...
  Chapter 2
  1 Text ...

Usage:
  python backend/enoch_from_text.py backend/build/enoch.txt frontend/public/translations/restored_kjv.extras.json

Notes:
 - Only writes a single book named "Book of Enoch" with detected chapters/verses.
 - Non-matching lines are appended to the previous verse.
"""

import io
import json
import os
import re
import sys
from typing import Dict


def parse_enoch_text(lines: list[str]) -> Dict[str, Dict[str, Dict[str, str]]]:
    book: Dict[str, Dict[str, str]] = {}
    current_chapter: str | None = None
    current_verse: str | None = None
    verse_text_buffer: list[str] = []

    # Match "## Chapter N"
    chapter_re = re.compile(r"^\s*##\s+Chapter\s+(\d{1,3})\b", re.IGNORECASE)
    # Match "> N" (verse number in blockquote)
    verse_num_re = re.compile(r"^\s*>\s*(\d{1,3})\s*$")
    # Match "> Text" (verse text in blockquote)
    verse_text_re = re.compile(r"^\s*>\s+(.+)$")

    for raw in lines:
        line = raw.rstrip()
        
        # Check for chapter header
        m_ch = chapter_re.match(line)
        if m_ch:
            # Save any buffered verse before starting new chapter
            if current_chapter and current_verse and verse_text_buffer:
                book[current_chapter][current_verse] = ' '.join(verse_text_buffer)
                verse_text_buffer = []
            
            current_chapter = m_ch.group(1).lstrip("0") or "1"
            book.setdefault(current_chapter, {})
            current_verse = None
            continue

        # Skip lines before we've found a chapter
        if not current_chapter:
            continue
        
        # Check for verse number ("> N")
        m_vnum = verse_num_re.match(line)
        if m_vnum:
            # Save previous verse if exists
            if current_verse and verse_text_buffer:
                book[current_chapter][current_verse] = ' '.join(verse_text_buffer)
                verse_text_buffer = []
            
            current_verse = m_vnum.group(1).lstrip("0") or "1"
            continue
        
        # Check for verse text ("> Text")
        m_vtext = verse_text_re.match(line)
        if m_vtext and current_verse:
            verse_text_buffer.append(m_vtext.group(1))
            continue
    
    # Save the last verse
    if current_chapter and current_verse and verse_text_buffer:
        book[current_chapter][current_verse] = ' '.join(verse_text_buffer)
    
    return {"Book of Enoch": book}


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: python backend/enoch_from_text.py <input_txt> <output_extras_json>")
        return 2

    in_path = sys.argv[1]
    out_path = sys.argv[2]

    if not os.path.exists(in_path):
        print(f"Input not found: {in_path}")
        return 2

    with io.open(in_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    data = parse_enoch_text(lines)

    # Ensure output directory exists
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with io.open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)

    print(f"Wrote extras JSON with {len(data['Book of Enoch'])} chapters: {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())


