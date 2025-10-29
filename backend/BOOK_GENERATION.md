# Generating Downloadable Bible Books (PDF/DOCX)

This guide explains how to generate PDF or Word (DOCX) versions of the Restored Names Bible for local download and reading.

## Prerequisites

Install the required Python packages:

```bash
# For PDF generation
pip install reportlab

# For Word/DOCX generation
pip install python-docx

# Install both
pip install reportlab python-docx
```

## Usage

### Generate PDF (Default)

```bash
cd backend
python generate_pdf.py
```

This creates `build/restored_kjv_bible.pdf` with:
- Title page
- Table of contents
- All 66 books with chapters and verses
- Professional formatting

### Generate Word/DOCX

```bash
python generate_pdf.py --format docx
```

This creates `build/restored_kjv_bible.docx` (editable in Microsoft Word, Google Docs, LibreOffice, etc.)

### Generate Both Formats

```bash
python generate_pdf.py --format both
```

Creates both PDF and DOCX versions.

### Generate Modernized Language Version

```bash
# Modernize archaic language (thee/thou → you/your, etc.)
python generate_pdf.py --modernize

# Generate both original AND modernized versions
python generate_pdf.py --all-versions

# Modernized version in both PDF and DOCX

```

**What gets modernized?**
- `thee, thou, thy, thine` → `you, your`
- `art, hast, doth, hath, saith` → `are, have, does, has, says`
- `shalt, wilt` → `shall, will`
- `spake, shew` → `spoke, show`
- `unto, betwixt` → `to, between`
- And many more archaic terms!

### Advanced Options

```bash
# Custom output location
python generate_pdf.py --output ~/Desktop/my_bible.pdf

# Skip table of contents
python generate_pdf.py --no-toc

# Use different input file
python generate_pdf.py --input data/kjv.json --format pdf

# Generate all versions at once (original + modernized in PDF + DOCX = 4 files)
python generate_pdf.py --all-versions --format both
```

This last command creates:
- `build/restored_kjv_bible.pdf` (original with Hebrew names)
- `build/restored_kjv_bible.docx` (original with Hebrew names)
- `build/restored_kjv_bible_modernized.pdf` (Hebrew names + modern English)
- `build/restored_kjv_bible_modernized.docx` (Hebrew names + modern English)

## Features

### PDF Features - Professional Book Design
- **Elegant title page** with decorative lines and Hebrew characters
- **Professional typography** - Times New Roman serif for body text
- **Running headers** - Book name (left) and Chapter number (right) with subtle underline
- **Page numbers** - Centered in footer (starts after title page)
- **Hebrew names in bold** - Yahuah, Elohiym, Yahusha, Mashiach stand out
- **Optimized readability** - 18pt line height, justified text, comfortable margins
- **Refined verse numbers** - Small, subtle superscript in gray
- **Chapter headings** - Bold, centered, with generous spacing
- **Book titles** - Large, elegant, prominently displayed
- **Table of contents** - Old/New Testament organized with chapter counts
- **Optimized for printing** - Letter size (8.5" x 11"), 1" top margin
- **Professional spacing** - Proper whitespace between elements

### DOCX Features
- Fully editable in Word/LibreOffice
- **Hebrew names in bold with dark blue color** for emphasis
- **Headers with book name** on each section (changes per book)
- **Page numbers** in footer (automatically updating)
- Proper heading styles (Book = Heading 1, Chapter = Heading 2)
- Verse numbers in superscript
- Can be converted to other formats (EPUB, etc.)
- Easy to customize formatting

## Output Details

### File Sizes (Approximate)
- **PDF**: ~15-20 MB (full Bible with all 31,102 verses)
- **DOCX**: ~8-12 MB (compressed format)

### Content
- 66 books (39 Old Testament + 27 New Testament)
- 1,189 chapters
- 31,102 verses
- Restored Hebrew names: Yahuah, Elohiym, Yahusha, Mashiach, etc.
- KJV translator notes preserved in curly braces `{...}`

## Use Cases

1. **Offline Reading**: Read on e-readers, tablets, or print
2. **Study**: Annotate and highlight in Word
3. **Printing**: Professional formatting for bound copies
4. **Distribution**: Share with others who prefer physical formats
5. **Archival**: Permanent backup in universal formats

## Customization

You can modify `generate_pdf.py` to:
- Change fonts, sizes, colors
- Add book introductions or summaries
- Include cross-references
- Add footnotes or study notes
- Change page size (A4, A5, etc.)
- Add headers/footers with book names

## Troubleshooting

### "reportlab not installed"
```bash
pip install reportlab
```

### "python-docx not installed"
```bash
pip install python-docx
```

### Large file size
The PDF is large because it contains the entire Bible. To reduce:
- Generate individual books
- Reduce font size
- Remove table of contents

### Memory issues
For very large Bibles, the script may use significant RAM. Close other applications or generate in sections.

## Examples

### Generate just Genesis through Revelation (full Bible)
```bash
python generate_pdf.py --format both
```

### Create a pocket-sized PDF (smaller fonts)
Modify the script to use `fontSize=9` for verses and smaller margins.

### Export individual books
Modify the JSON input to contain only specific books.

## License

The restored KJV text is in the public domain. The scripts are provided as-is for personal and ministry use.


## PDF → JSON (for frontend integration)

Use `pdf_to_bible_json.py` to convert a Bible (or extra books) PDF into the JSON shape used by the app: `{ "Book": { "1": { "1": "Verse text" } } }`.

Install deps:

```bash
pip install -r backend/requirements.txt
```

Basic usage:

```bash
python backend/pdf_to_bible_json.py backend/build/restored_kjv_bible.pdf frontend/public/translations/restored_kjv.json
```

If you are producing only extra books (Apocrypha, Pseudepigrapha, etc.), write an extras file that auto-merges in the app:

```bash
python backend/pdf_to_bible_json.py backend/build/restored_kjv_bible_apocrypha.pdf frontend/public/translations/restored_kjv.extras.json --extras-only
```

Tuning patterns (if your PDF layout differs):

- Chapter header regex (named groups `book`, `chapter`):
  - Default: `^(?P<book>[A-Za-z0-9 .']+)\s+(?P<chapter>\d{1,3})\s*$`
- Verse line regex (named groups `verse`, `text`):
  - Default: `^(?P<verse>\d{1,3})\s+(?P<text>.+?)\s*$`

Example with custom patterns and custom book list order:

```bash
python backend/pdf_to_bible_json.py \
  path/to/pdf.pdf \
  frontend/public/translations/custom.json \
  --books-json backend/config/custom_books.json \
  --chapter-header-pattern "^(?P<book>[A-Z][A-Z ]+)\s+(?P<chapter>\d+)$" \
  --verse-line-pattern "^(?P<verse>\d+)\s+(?P<text>.+)$"
```

After generating JSON:

- For a full translation file: add an entry in `frontend/src/lib/data.ts:listTranslations()`.
- For extras: no code change needed; the app will merge `/translations/{id}.extras.json` automatically on load.

---

## Book of Enoch Integration (Complete Example)

The Book of Enoch (1 Enoch) has been successfully integrated into the app with the standard 108-chapter structure. Here's the complete pipeline used:

### 1. Source Material

- **Input:** `backend/build/Book_of_Enoch.md` (Markdown format with blockquote-style verses)
- **Structure:** Divided into 5 books (Watchers, Parables, Luminaries, Dream Visions, Epistle)
- **Challenge:** Each section restarts chapter numbering at 1

### 2. Parse and Map to Standard Structure

```bash
python backend/parse_enoch_md.py backend/build/Book_of_Enoch.md frontend/public/translations/restored_kjv.extras.json
```

This script:
- Detects section headers ("> Book 1: The Watchers", etc.)
- Maps section chapters to global chapter numbers (1-36, 37-71, 72-82, 83-90, 91-108)
- Parses blockquote-formatted verses ("> N" for verse number, "> Text" for content)
- Pads to 108 chapters total (empty chapters become placeholders)

**Output:** 25 chapters with content, padded to 108 total

### 3. Apply Sacred Names and Modernization

```bash
python backend/process_extras_preserve_structure.py
```

This script:
- Applies sacred name restoration (God → Elohiym, Lord → Yahuah, etc.)
- Modernizes archaic terms (thee → you, unto → to, hath → has, etc.)
- Preserves all 108 chapters including empty ones

**Result:** `frontend/public/translations/restored_kjv.extras.json` with:
- 108 chapters (standard 1 Enoch mapping)
- 995 verses with sacred names and modern English
- Auto-merges into the app on load

### 4. Verification

```bash
# Check chapter count and sample content
python -c "import json; data = json.load(open('frontend/public/translations/restored_kjv.extras.json', 'r', encoding='utf-8')); print('Total chapters:', len(data['Book of Enoch'])); print('Sample:', data['Book of Enoch']['1']['2'][:100])"
```

### 5. App Integration

The Book of Enoch is now accessible in the app:
- **Navigation:** Select "Book of Enoch" from the book list (appears after canonical books)
- **Reader:** `/restored_kjv/Book of Enoch/1` displays Chapter 1
- **Quick Jump:** Type "Enoch 1:1" or "Enoch 37" to jump directly
- **Search:** Full-text search includes Enoch verses

### Chapter Content Summary

Current coverage (25/108 chapters):
- **Chapters 1-7:** Book 1 (Watchers) - Complete in source
- **Chapters 37-39:** Book 2 (Parables) - Partial
- **Chapters 72-75:** Book 3 (Luminaries) - Partial
- **Chapters 83-87:** Book 4 (Dream Visions) - Partial
- **Chapters 91-96:** Book 5 (Epistle) - Partial

Empty chapters serve as placeholders for future content additions.

### Adding More Content

To add or update Enoch content:

1. Edit `backend/build/Book_of_Enoch.md` (add chapters in blockquote format)
2. Re-run the parser: `python backend/parse_enoch_md.py ...`
3. Re-run the processor: `python backend/process_extras_preserve_structure.py`
4. Reload Bible data in the app (Settings → Reload Bible Data)

### Adding Other Apocryphal/Pseudepigraphal Books

Follow the same pattern for other extra-biblical books:

1. **Obtain source material** (PDF, markdown, plain text)
2. **Parse to JSON** using appropriate parser (pdf_to_bible_json.py, parse_enoch_md.py, or custom)
3. **Add to extras.json** (or create separate extras file per book)
4. **Process** with sacred names and modernization
5. **Verify** in the app

Examples of books that can be added:
- Book of Jubilees
- Testament of the Twelve Patriarchs
- Psalms of Solomon
- 1-4 Maccabees
- Wisdom of Solomon
- Ecclesiasticus (Sirach)
- Tobit, Judith, Baruch
- Additions to Daniel (Bel and the Dragon, Prayer of Azariah, Susanna)
- Gospel of Thomas, Gospel of Philip (if desired)
