import argparse
import json
import re
from pathlib import Path

try:
    import pdfplumber  # type: ignore
except Exception as exc:  # pragma: no cover
    raise SystemExit("pdfplumber is required. Install with: pip install -r backend/requirements.txt") from exc


DEFAULT_BOOKS_ORDER = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
    "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings",
    "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther",
    "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
    "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel",
    "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum",
    "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians",
    "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians",
    "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus",
    "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John",
    "3 John", "Jude", "Revelation",
]


def compile_patterns(
    chapter_header_pattern: str | None,
    verse_line_pattern: str | None,
):
    # Common defaults: "Genesis 1" or "GENESIS 1" headers; verses like "1 In the beginning..."
    chapter_pat = re.compile(chapter_header_pattern or r"^(?P<book>[A-Za-z0-9 .']+)\s+(?P<chapter>\d{1,3})\s*$")
    verse_pat = re.compile(verse_line_pattern or r"^(?P<verse>\d{1,3})\s+(?P<text>.+?)\s*$")
    return chapter_pat, verse_pat


def normalize_spaces(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def parse_pdf(
    pdf_path: Path,
    books_order: list[str],
    chapter_header_pattern: str | None,
    verse_line_pattern: str | None,
) -> dict:
    chapter_pat, verse_pat = compile_patterns(chapter_header_pattern, verse_line_pattern)

    bible: dict[str, dict[str, dict[str, str]]] = {}
    current_book: str | None = None
    current_chapter: str | None = None

    with pdfplumber.open(str(pdf_path)) as pdf:
        for page in pdf.pages:
            raw_text = page.extract_text(x_tolerance=1.5, y_tolerance=3.0) or ""
            for raw_line in raw_text.splitlines():
                line = normalize_spaces(raw_line)
                if not line:
                    continue

                # Detect chapter header
                m_ch = chapter_pat.match(line)
                if m_ch:
                    book = normalize_spaces(m_ch.group("book"))
                    chap = m_ch.group("chapter").lstrip("0") or "1"

                    # Heuristic: prefer canonical names if this matches one; otherwise accept as-is
                    if book.upper() in {b.upper() for b in books_order}:
                        # Map to canonical casing
                        for b in books_order:
                            if b.upper() == book.upper():
                                book = b
                                break

                    if book not in bible:
                        bible[book] = {}
                    if chap not in bible[book]:
                        bible[book][chap] = {}
                    current_book, current_chapter = book, chap
                    continue

                # Detect verse line
                m_vs = verse_pat.match(line)
                if m_vs and current_book and current_chapter:
                    verse_num = m_vs.group("verse").lstrip("0") or "1"
                    verse_text = normalize_spaces(m_vs.group("text"))
                    bible[current_book][current_chapter][verse_num] = verse_text
                    continue

                # Otherwise: append to previous verse if exists (line-wrap handling)
                if current_book and current_chapter:
                    chapter_obj = bible.get(current_book, {}).get(current_chapter, {})
                    if chapter_obj:
                        last_verse = sorted(chapter_obj.keys(), key=lambda v: int(v))[-1]
                        chapter_obj[last_verse] = normalize_spaces(
                            f"{chapter_obj[last_verse]} {line}"
                        )

    return bible


def write_output(output_path: Path, data: dict):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)


def filter_to_extras(full_data: dict, canonical_books: list[str]) -> dict:
    canon = {b.upper() for b in canonical_books}
    return {k: v for k, v in full_data.items() if k.upper() not in canon}


def main():
    parser = argparse.ArgumentParser(description="Convert a Bible PDF to app JSON format (book→chapter→verse)")
    parser.add_argument("pdf", type=Path, help="Input PDF path")
    parser.add_argument("output", type=Path, help="Output JSON path")
    parser.add_argument("--books-json", type=Path, default=None, help="Optional JSON file listing preferred book names/order")
    parser.add_argument("--chapter-header-pattern", type=str, default=None, help="Regex for chapter headers, with named groups 'book' and 'chapter'")
    parser.add_argument("--verse-line-pattern", type=str, default=None, help="Regex for verse lines, with named groups 'verse' and 'text'")
    parser.add_argument("--extras-only", action="store_true", help="Write only non-canonical (extra) books to output")

    args = parser.parse_args()

    if args.books_json and args.books_json.exists():
        with args.books_json.open("r", encoding="utf-8") as f:
            books_list = json.load(f)
            if not isinstance(books_list, list):
                raise SystemExit("--books-json must contain a JSON array of book names in order")
            books_order = books_list
    else:
        books_order = DEFAULT_BOOKS_ORDER

    data = parse_pdf(
        pdf_path=args.pdf,
        books_order=books_order,
        chapter_header_pattern=args.chapter_header_pattern,
        verse_line_pattern=args.verse_line_pattern,
    )

    if args.extras_only:
        data = filter_to_extras(data, DEFAULT_BOOKS_ORDER)

    write_output(args.output, data)
    print(f"Wrote {args.output} with {len(data)} books")


if __name__ == "__main__":
    main()




