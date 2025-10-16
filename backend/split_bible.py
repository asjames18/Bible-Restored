#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Split Bible JSON into per-book files
Reads restored_kjv.json and creates individual book files
"""

import json
import os
import sys
from typing import Dict, Any

# Fix Windows console encoding issues
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def split_bible_json(input_file: str, output_dir: str) -> None:
    """Split Bible JSON into per-book files"""
    
    # Read the full Bible JSON
    print(f"Reading Bible data from {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        bible_data = json.load(f)
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Also copy the full file to the output directory
    full_output_path = os.path.join(output_dir, 'restored_kjv.json')
    print(f"Copying full Bible to {full_output_path}...")
    with open(full_output_path, 'w', encoding='utf-8') as f:
        json.dump(bible_data, f, indent=2, ensure_ascii=False)
    
    # Split into individual books
    print(f"Splitting into per-book files in {output_dir}...")
    books_processed = 0
    total_verses = 0
    
    for book_name, book_data in bible_data.items():
        # Create book file
        book_file = os.path.join(output_dir, f"{book_name}.json")
        
        with open(book_file, 'w', encoding='utf-8') as f:
            json.dump(book_data, f, indent=2, ensure_ascii=False)
        
        # Count verses in this book
        book_verses = sum(len(chapter) for chapter in book_data.values())
        total_verses += book_verses
        
        print(f"  ✓ {book_name}: {len(book_data)} chapters, {book_verses} verses")
        books_processed += 1
    
    # Summary
    file_size = os.path.getsize(full_output_path) / (1024 * 1024)  # MB
    print(f"\nSplit complete!")
    print(f"Books processed: {books_processed}")
    print(f"Total verses: {total_verses}")
    print(f"Full file size: {file_size:.1f} MB")
    print(f"Output directory: {output_dir}")

def main():
    """Main function"""
    if len(sys.argv) != 3:
        print("Usage: python split_bible.py <input.json> <output_dir>")
        print("Example: python split_bible.py build/restored_kjv.json ../frontend/public/translations/")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_dir = sys.argv[2]
    
    if not os.path.exists(input_file):
        print(f"Error: Input file {input_file} not found!")
        sys.exit(1)
    
    try:
        split_bible_json(input_file, output_dir)
        print("\n✓ Bible splitting completed successfully!")
        return 0
    except Exception as e:
        print(f"\n✗ Error: {e}")
        return 1

if __name__ == "__main__":
    exit(main())
