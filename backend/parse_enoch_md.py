#!/usr/bin/env python3
"""
Parse the complete Book of Enoch markdown file and map it to standard 1 Enoch structure.

Standard 1 Enoch chapter mapping:
- Chapters 1-36: Book 1 (Watchers)
- Chapters 37-71: Book 2 (Parables) 
- Chapters 72-82: Book 3 (Luminaries/Astronomical Book)
- Chapters 83-90: Book 4 (Dream Visions)
- Chapters 91-108: Book 5 (Epistle of Enoch)

The markdown file has sections like "Book 1: The Watchers" with chapters restarting at 1 for each section.
We need to renumber chapters sequentially according to the standard mapping.
"""

import io
import json
import os
import re
import sys
from collections import OrderedDict
from typing import Dict, List


# Standard chapter ranges for each book section
SECTION_RANGES = {
    "Book 1": (1, 36),      # Watchers: 36 chapters
    "Book 2": (37, 71),     # Parables: 35 chapters
    "Book 3": (72, 82),     # Luminaries: 11 chapters
    "Book 4": (83, 90),     # Dream Visions: 8 chapters
    "Book 5": (91, 108),    # Epistle: 18 chapters
}


def parse_enoch_markdown(md_path: str) -> Dict[str, Dict[str, str]]:
    """Parse the Enoch markdown and map to standard 1 Enoch chapter numbering."""
    
    book: Dict[str, Dict[str, str]] = {}
    current_section = None
    current_chapter_in_section = None
    current_verse = None
    verse_text_buffer: List[str] = []
    
    # Track the starting chapter for the current section
    section_start_chapter = 1
    
    # Regex patterns
    section_re = re.compile(r"^\s*>\s*Book\s+(\d+)[:\-]", re.IGNORECASE)
    chapter_re = re.compile(r"^\s*##\s+Chapter\s+(\d+)", re.IGNORECASE)
    verse_num_re = re.compile(r"^\s*>\s*(\d+)\s*$")
    verse_text_re = re.compile(r"^\s*>\s+(.+)$")
    
    with io.open(md_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip()
            
            # Check for section header (e.g., "> Book 1: The Watchers")
            m_section = section_re.match(line)
            if m_section:
                # Save any buffered verse
                if current_section and current_chapter_in_section and current_verse and verse_text_buffer:
                    global_chapter = str(section_start_chapter + int(current_chapter_in_section) - 1)
                    if global_chapter not in book:
                        book[global_chapter] = OrderedDict()
                    book[global_chapter][current_verse] = ' '.join(verse_text_buffer)
                    verse_text_buffer = []
                
                section_num = m_section.group(1)
                current_section = f"Book {section_num}"
                
                # Set the starting chapter for this section
                if current_section in SECTION_RANGES:
                    section_start_chapter = SECTION_RANGES[current_section][0]
                else:
                    print(f"Warning: Unknown section {current_section}, continuing with current numbering")
                
                current_chapter_in_section = None
                current_verse = None
                continue
            
            # Check for chapter header (e.g., "## Chapter 1")
            m_chapter = chapter_re.match(line)
            if m_chapter:
                # Save any buffered verse
                if current_section and current_chapter_in_section and current_verse and verse_text_buffer:
                    global_chapter = str(section_start_chapter + int(current_chapter_in_section) - 1)
                    if global_chapter not in book:
                        book[global_chapter] = OrderedDict()
                    book[global_chapter][current_verse] = ' '.join(verse_text_buffer)
                    verse_text_buffer = []
                
                current_chapter_in_section = m_chapter.group(1)
                current_verse = None
                continue
            
            # Skip if we haven't found a section and chapter yet
            if not current_section or not current_chapter_in_section:
                continue
            
            # Check for verse number ("> N")
            m_vnum = verse_num_re.match(line)
            if m_vnum:
                # Save previous verse if exists
                if current_verse and verse_text_buffer:
                    global_chapter = str(section_start_chapter + int(current_chapter_in_section) - 1)
                    if global_chapter not in book:
                        book[global_chapter] = OrderedDict()
                    book[global_chapter][current_verse] = ' '.join(verse_text_buffer)
                    verse_text_buffer = []
                
                current_verse = m_vnum.group(1).lstrip("0") or "1"
                continue
            
            # Check for verse text ("> Text")
            m_vtext = verse_text_re.match(line)
            if m_vtext and current_verse:
                verse_text_buffer.append(m_vtext.group(1))
                continue
    
    # Save the last verse
    if current_section and current_chapter_in_section and current_verse and verse_text_buffer:
        global_chapter = str(section_start_chapter + int(current_chapter_in_section) - 1)
        if global_chapter not in book:
            book[global_chapter] = OrderedDict()
        book[global_chapter][current_verse] = ' '.join(verse_text_buffer)
    
    # Pad to 108 chapters with empty chapters if needed
    for i in range(1, 109):
        chapter_key = str(i)
        if chapter_key not in book:
            book[chapter_key] = OrderedDict()
    
    # Sort chapters numerically
    sorted_book = OrderedDict()
    for i in range(1, 109):
        sorted_book[str(i)] = book[str(i)]
    
    return sorted_book


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: python backend/parse_enoch_md.py <input_md> <output_extras_json>")
        return 2
    
    in_path = sys.argv[1]
    out_path = sys.argv[2]
    
    if not os.path.exists(in_path):
        print(f"Input not found: {in_path}")
        return 2
    
    print(f"Parsing {in_path}...")
    enoch_chapters = parse_enoch_markdown(in_path)
    
    # Count non-empty chapters
    non_empty = sum(1 for ch in enoch_chapters.values() if ch)
    print(f"Extracted {non_empty} chapters with content (padded to 108 total)")
    
    data = {"Book of Enoch": enoch_chapters}
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with io.open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Wrote {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

