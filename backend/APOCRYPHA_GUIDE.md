# Adding the Complete Apocrypha/Deuterocanonical Books

This guide will help you add the Apocryphal/Deuterocanonical books to your Bible app.

## What is the Apocrypha?

The Apocrypha (also called Deuterocanonical books) are texts included in Catholic and Orthodox Bibles but not in most Protestant Bibles. The 1611 King James Bible originally included these books between the Old and New Testaments.

### Books to Add

**Major Apocryphal Books:**
1. **Tobit** (14 chapters)
2. **Judith** (16 chapters)
3. **Additions to Esther** (6 additions)
4. **Wisdom of Solomon** (19 chapters)
5. **Ecclesiasticus/Sirach** (51 chapters)
6. **Baruch** (6 chapters) - includes Letter of Jeremiah
7. **Additions to Daniel**:
   - Prayer of Azariah and Song of Three Young Men
   - Susanna
   - Bel and the Dragon
8. **1 Maccabees** (16 chapters)
9. **2 Maccabees** (15 chapters)

**Extended Apocrypha (in some traditions):**
10. **1 Esdras** (9 chapters)
11. **2 Esdras** (16 chapters)
12. **Prayer of Manasseh** (1 chapter)
13. **Psalm 151** (1 psalm)
14. **3 Maccabees** (7 chapters)
15. **4 Maccabees** (18 chapters)

**Total:** ~200+ chapters

---

## Best Sources for Download

### Option 1: King James Apocrypha (1611) - RECOMMENDED ✨

**Best for compatibility with your KJV-based app:**

1. **Visit:** https://www.1611bible.online/Apocrypha/
2. Each book is on a separate page with chapters
3. Copy each book individually
4. Save to: `backend/build/apocrypha/[BookName].txt`

**Format:** Clean chapter/verse structure
```
Tobit 1
1 This book...
2 Next verse...
```

### Option 2: Sacred Bible (Vulgate Edition)

1. **Visit:** https://sacredbible.org/vulgate1861/Apocrypha.htm
2. Complete Apocrypha in structured format
3. Save to: `backend/build/apocrypha_complete.txt`

### Option 3: Global Grey Ebooks

1. **Visit:** https://www.globalgreyebooks.com/online-ebooks/unknown_apocrypha_complete-text.html
2. Complete text in one page
3. Copy all and save to: `backend/build/apocrypha_complete.txt`

### Option 4: Project Gutenberg

1. **Visit:** https://www.gutenberg.org/files/124/124-0.txt
2. Plain text format
3. Download or copy to: `backend/build/apocrypha_complete.txt`

### Option 5: Internet Archive

1. **Visit:** https://archive.org/details/kingjamesbibleap00oxfo
2. 1611 KJV Apocrypha (Oxford Edition)
3. Download PDF or text

---

## Quick Start: One-File Approach

### Step 1: Download Complete Apocrypha

**EASIEST:** Use Project Gutenberg's plain text version:

```bash
# Download directly (if you have curl or wget)
curl https://www.gutenberg.org/files/124/124-0.txt -o backend/build/apocrypha_complete.txt

# Or manually:
# 1. Visit https://www.gutenberg.org/files/124/124-0.txt
# 2. Copy all text (Ctrl+A, Ctrl+C)
# 3. Save to: backend/build/apocrypha_complete.txt
```

### Step 2: Parse to JSON

We'll need to create a parser for the specific format. The format typically looks like:

```
TOBIT

CHAPTER 1

1 The book...
2 Next verse...

CHAPTER 2
...
```

I'll create a parser script for you:

```bash
python backend/parse_apocrypha.py backend/build/apocrypha_complete.txt frontend/public/translations/restored_kjv.apocrypha.json
```

### Step 3: Process with Sacred Names

```bash
python backend/process_extras_preserve_structure.py frontend/public/translations/restored_kjv.apocrypha.json
```

### Step 4: Merge into Main Extras

You can either:
- Keep as separate file: `restored_kjv.apocrypha.json` (loads automatically)
- Merge with Enoch: Combine into `restored_kjv.extras.json`

---

## Individual Book Approach

If you want to add books one at a time:

### Example: Adding Tobit

1. **Download Tobit text** from https://www.1611bible.online/Apocrypha/Tobit/
2. Save as `backend/build/apocrypha/Tobit.txt`
3. Parse it:
   ```bash
   python backend/parse_single_apocrypha_book.py backend/build/apocrypha/Tobit.txt Tobit
   ```
4. This adds Tobit to your extras JSON

Repeat for each book you want to add.

---

## Expected Format

After processing, your extras file should have structure like:

```json
{
  "Book of Enoch": { ... },
  "Tobit": {
    "1": { "1": "The book of...", "2": "..." },
    "2": { ... }
  },
  "Judith": {
    "1": { ... }
  },
  "Wisdom": {
    "1": { ... }
  },
  ...
}
```

---

## Integration Checklist

- [ ] Download Apocrypha text source
- [ ] Save to `backend/build/apocrypha_complete.txt`
- [ ] Parse to JSON structure
- [ ] Apply sacred names and modernization
- [ ] Verify JSON is valid
- [ ] Reload Bible data in app
- [ ] Test navigation to new books
- [ ] Verify search includes new books

---

## Book-by-Book Status Tracking

Once you add books, track them here:

- [ ] **Tobit** (14 chapters)
- [ ] **Judith** (16 chapters)
- [ ] **Additions to Esther** (6 sections)
- [ ] **Wisdom of Solomon** (19 chapters)
- [ ] **Ecclesiasticus/Sirach** (51 chapters)
- [ ] **Baruch** (6 chapters)
- [ ] **Letter of Jeremiah** (1 chapter)
- [ ] **Prayer of Azariah** (1 chapter)
- [ ] **Song of the Three Holy Children** (1 chapter)
- [ ] **Susanna** (1 chapter)
- [ ] **Bel and the Dragon** (1 chapter)
- [ ] **1 Maccabees** (16 chapters)
- [ ] **2 Maccabees** (15 chapters)
- [ ] **1 Esdras** (9 chapters)
- [ ] **2 Esdras** (16 chapters)
- [ ] **Prayer of Manasseh** (1 chapter)
- [ ] **Psalm 151** (1 psalm)
- [ ] **3 Maccabees** (7 chapters)
- [ ] **4 Maccabees** (18 chapters)

---

## Parser Scripts Needed

I'll create these parser scripts for you:

1. **`parse_apocrypha.py`** - Main parser for complete Apocrypha text
2. **`parse_single_apocrypha_book.py`** - Add individual books
3. **`merge_extras.py`** - Combine multiple extras files

Let me know which books you want to start with, and I'll help you parse them!

---

## Notes

- **File Naming:** Use standard book names (e.g., "Tobit", "1 Maccabees", "Wisdom of Solomon")
- **Chapter/Verse Structure:** Same as Bible - chapter → verse JSON
- **Sacred Names:** Automatically applied via `process_extras_preserve_structure.py`
- **Modernization:** Archaic language (thee, unto) → modern (you, to)
- **App Integration:** Books appear in navigation after canonical books, alphabetically

---

## Recommended Order to Add

Start with the most popular/important books:

1. **Wisdom of Solomon** (frequently quoted)
2. **Ecclesiasticus/Sirach** (wisdom literature)
3. **Tobit** (narrative, widely read)
4. **Judith** (narrative, widely read)
5. **1 Maccabees** (historical, important)
6. **2 Maccabees** (historical)
7. **Additions to Daniel** (Prayer of Azariah, Susanna, Bel and the Dragon)
8. **Baruch** (prophetic)
9. **Additions to Esther**
10. Remaining books

---

## Quick Command Summary

```bash
# 1. Download
curl https://www.gutenberg.org/files/124/124-0.txt -o backend/build/apocrypha_complete.txt

# 2. Parse (script to be created)
python backend/parse_apocrypha.py backend/build/apocrypha_complete.txt frontend/public/translations/restored_kjv.apocrypha.json

# 3. Process
python backend/process_extras_preserve_structure.py frontend/public/translations/restored_kjv.apocrypha.json

# 4. Reload in app
# Settings → Reload Bible Data
```

---

## Need Help?

Let me know:
1. Which books you want to add first
2. Which source you prefer (KJV 1611, Gutenberg, etc.)
3. If you want all books at once or one at a time

I'll create the appropriate parser scripts for your chosen format!

