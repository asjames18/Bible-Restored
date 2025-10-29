#!/usr/bin/env python3
"""
Download and parse the complete Book of Enoch (108 chapters) from Sacred Texts Archive.
This uses the R.H. Charles translation which is public domain.

The text is spread across multiple HTML pages at archive.sacred-texts.com
"""

import io
import json
import os
import re
import sys
from collections import OrderedDict
from urllib.request import urlopen, Request
from html.parser import HTMLParser


class EnochHTMLParser(HTMLParser):
    """Parse HTML from sacred-texts.com to extract chapter/verse text."""
    
    def __init__(self):
        super().__init__()
        self.in_paragraph = False
        self.in_superscript = False
        self.current_text = []
        self.verses = []
        self.current_verse_num = None
        
    def handle_starttag(self, tag, attrs):
        if tag == 'p':
            self.in_paragraph = True
        elif tag in ('sup', 'small'):
            self.in_superscript = True
            
    def handle_endtag(self, tag):
        if tag == 'p':
            self.in_paragraph = False
            if self.current_text:
                text = ''.join(self.current_text).strip()
                if text and self.current_verse_num:
                    self.verses.append((self.current_verse_num, text))
                self.current_text = []
        elif tag in ('sup', 'small'):
            self.in_superscript = False
            
    def handle_data(self, data):
        if self.in_paragraph:
            stripped = data.strip()
            if stripped:
                # Check if this is a verse number
                if self.in_superscript or (len(stripped) <= 3 and stripped.isdigit()):
                    # Save previous verse if exists
                    if self.current_text and self.current_verse_num:
                        text = ''.join(self.current_text).strip()
                        if text:
                            self.verses.append((self.current_verse_num, text))
                        self.current_text = []
                    self.current_verse_num = stripped
                else:
                    self.current_text.append(data)


def download_chapter_from_url(url: str) -> list:
    """Download and parse verses from a single URL."""
    print(f"  Downloading {url}")
    try:
        req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urlopen(req, timeout=30) as response:
            html = response.read().decode('utf-8')
        
        parser = EnochHTMLParser()
        parser.feed(html)
        return parser.verses
    except Exception as e:
        print(f"  Warning: Failed to download {url}: {e}")
        return []


def build_chapter_urls() -> dict:
    """Build mapping of chapter numbers to sacred-texts URLs."""
    base_url = "https://archive.sacred-texts.com/bib/bep/"
    
    # The sacred-texts archive has Enoch split across multiple pages
    # This is a simplified mapping - you may need to adjust based on actual site structure
    urls = {}
    
    # Chapters 1-36 (Book of the Watchers) - typically in bep01.htm through bep02.htm
    # Chapters 37-71 (Parables) - bep03.htm
    # Chapters 72-82 (Astronomical Book) - bep04.htm
    # Chapters 83-90 (Dream Visions) - bep05.htm
    # Chapters 91-108 (Epistle) - bep06.htm
    
    # Note: This is a simplified structure. The actual parsing would need to handle
    # the specific HTML structure of sacred-texts.com
    
    return {
        "1-36": f"{base_url}bep02.htm",   # Watchers
        "37-71": f"{base_url}bep03.htm",  # Parables
        "72-82": f"{base_url}bep04.htm",  # Astronomical
        "83-90": f"{base_url}bep05.htm",  # Dream Visions
        "91-108": f"{base_url}bep06.htm", # Epistle
    }


def download_from_pseudepigrapha() -> str:
    """
    Download the complete text from pseudepigrapha.com which has a cleaner format.
    Returns the raw text.
    """
    url = "https://www.pseudepigrapha.com/pseudepigrapha/enoch1.htm"
    print(f"Downloading from {url}")
    
    try:
        req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urlopen(req, timeout=60) as response:
            html = response.read().decode('utf-8', errors='ignore')
        
        # Save raw HTML for manual inspection
        with open("backend/build/enoch_downloaded.html", "w", encoding="utf-8") as f:
            f.write(html)
        
        print("Saved raw HTML to backend/build/enoch_downloaded.html")
        print("\nPlease manually convert this HTML to clean text format and save as:")
        print("  backend/build/enoch_complete.txt")
        print("\nExpected format:")
        print("  Chapter N")
        print("  N:M Verse text here")
        print("  N:M+1 Next verse text")
        print("  ...")
        
        return html
    except Exception as e:
        print(f"Error downloading: {e}")
        return ""


def main():
    """
    Main function to guide user through downloading complete Enoch.
    
    Given the complexity of web scraping and varying HTML structures,
    this script provides guidance rather than fully automated download.
    """
    
    print("=" * 70)
    print("Complete Book of Enoch Download Helper")
    print("=" * 70)
    print()
    print("The Book of Enoch (108 chapters) is available from several sources:")
    print()
    print("1. Sacred Texts Archive (R.H. Charles translation)")
    print("   https://archive.sacred-texts.com/bib/bep/index.htm")
    print()
    print("2. Pseudepigrapha.com")
    print("   https://www.pseudepigrapha.com/pseudepigrapha/enoch1.htm")
    print()
    print("3. Internet Archive")
    print("   https://archive.org/details/bookofenoch00char")
    print()
    print("=" * 70)
    print()
    
    print("RECOMMENDED APPROACH:")
    print()
    print("1. Visit: https://www.ccel.org/c/charles/otpseudepig/enoch.htm")
    print("   (Christian Classics Ethereal Library - clean, structured)")
    print()
    print("2. Or visit: https://archive.sacred-texts.com/bib/bep/index.htm")
    print("   (Sacred Texts Archive)")
    print()
    print("3. Copy the text and save to: backend/build/enoch_complete.txt")
    print()
    print("4. Format should be:")
    print("   CHAPTER 1")
    print("   1. Verse text here")
    print("   2. Next verse text")
    print("   ...")
    print()
    print("5. Then run:")
    print("   python backend/parse_enoch_text_simple.py")
    print()
    print("=" * 70)
    print()
    
    choice = input("Download HTML from pseudepigrapha.com for manual conversion? (y/n): ")
    if choice.lower() == 'y':
        download_from_pseudepigrapha()
    else:
        print("\nNo problem! You can manually download from the sources listed above.")
        print("Once you have a clean text file, we can parse it into JSON.")


if __name__ == "__main__":
    main()

